package com.sixhandsapps.simpleeld.fragment

import android.annotation.SuppressLint
import android.app.Dialog
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.util.TypedValue
import android.view.*
import android.widget.CompoundButton
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.core.view.children
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.RecyclerView
import com.sixhandsapps.simpleeld.*
import com.sixhandsapps.simpleeld.activity.DrivingActivity
import com.sixhandsapps.simpleeld.activity.RecordsActivity
import com.sixhandsapps.simpleeld.activity.editMap
import com.sixhandsapps.simpleeld.model.AddRecordRequest
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.EditRecordRequest
import com.sixhandsapps.simpleeld.model.Record
import com.sixhandsapps.simpleeld.viewmodel.LogsViewModel
import kotlinx.android.synthetic.main.change_status_off_duty_dialog.view.*
import kotlinx.android.synthetic.main.change_status_off_duty_dialog.view.remarkOptional
import kotlinx.android.synthetic.main.change_status_on_duty_dialog.view.*
import kotlinx.android.synthetic.main.change_status_on_duty_dialog.view.remarkEditText
import kotlinx.android.synthetic.main.change_status_sleeper_dialog.view.*
import kotlinx.android.synthetic.main.fragment_logs.*
import kotlinx.android.synthetic.main.timeline.*
import kotlinx.android.synthetic.main.update_duty_status_dialog.view.*
import kotlinx.android.synthetic.main.update_duty_status_dialog.view.locationEditText
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit
import kotlin.concurrent.schedule
import kotlin.math.max
import kotlin.math.roundToInt

var breakMaxTime = TimeUnit.HOURS.toMillis(8)

var drivingMaxTime = TimeUnit.HOURS.toMillis(11)
var shiftMaxTime = TimeUnit.HOURS.toMillis(14)
var cycleMaxTime = TimeUnit.HOURS.toMillis(70)

var offDutyTime = 0L
var shortTimeout = TimeUnit.MINUTES.toMillis(30)
var longTimeout = TimeUnit.HOURS.toMillis(10)

var breakTime = breakMaxTime
var drivingTime = drivingMaxTime
var shiftTime = shiftMaxTime
var cycleTime = cycleMaxTime

var status: Status? = null

class LogsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_logs, container, false)
    }

    private val dateFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())

    var timerTask: TimerTask? = null

    val handler = Handler()

    override fun onResume() {
        super.onResume()
        editMap.entries.forEach { entry ->
            records.find { entry.key == it.id }?.remark = entry.value
        }
        editMap.clear()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        timerTask?.cancel()
    }

    val viewModel by lazy {
        ViewModelProvider(this, LogsViewModel.Factory(requireActivity().application)).get(
            LogsViewModel::class.java
        )
    }

    var records = listOf<Record>()

    fun filterRecords(records: List<Record>): List<Record> {
        return records.map {
            it.apply {
                if (type == "BREAK") {
                    type = "OFF_DUTY"
                }
            }
        }.apply {
            firstOrNull()?.let {
                val recordCalendar = Calendar.getInstance().apply {
                    time = serverDateFormat.parse(it.startTime)!!
                }
                val calendar = Calendar.getInstance().apply {
                    time = dateFormat1.parse(getPreferences().getString(PREFERENCES_SELECTED_DATE, null)!!)!!
                }
                if (recordCalendar.get(Calendar.DAY_OF_YEAR) < calendar.get(Calendar.DAY_OF_YEAR)) {
                    it.startTime = serverDateFormat.format(recordCalendar.apply {
                        set(Calendar.SECOND, 0)
                        set(Calendar.MINUTE, 0)
                        set(Calendar.HOUR_OF_DAY, 24)
                    }.time)
                }
            }
        }.reversed()
    }

    val violationAdapter = ViolationAdapter()

    @SuppressLint("SimpleDateFormat")
    val dateFormat1 = SimpleDateFormat("yyyy-MM-dd")

    @SuppressLint("SimpleDateFormat")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        offDutyTime = 0L
        shortTimeout = TimeUnit.MINUTES.toMillis(30)
        longTimeout = TimeUnit.HOURS.toMillis(10)
        breakTime = breakMaxTime
        drivingTime = drivingMaxTime
        shiftTime = shiftMaxTime
        cycleTime = cycleMaxTime
        violationRecyclerView.adapter = violationAdapter
        getPreferences().getString(PREFERENCES_SELECTED_DATE, null)!!.let {
            if (Calendar.getInstance().apply {
                    time = SimpleDateFormat("yyyy-MM-dd").parse(it)!!
                }.get(Calendar.DAY_OF_YEAR) == Calendar.getInstance().get(Calendar.DAY_OF_YEAR)) {
                timerTask = Timer().schedule(0, 1000) {
                    handler.post {
                        time?.text = dateFormat.format(Date())
                        if (records.isNotEmpty() && status != null) {
                            records.last().apply {
                                endTime = serverDateFormat.format(Date())
                            }
                            setupRecords()
                            val second = TimeUnit.SECONDS.toMillis(1)
                            if (status == Status.ON_DUTY || status == Status.DRIVING || status == Status.ON_DUTY_YARD_PARKING) {
                                if (cycleTime > 0) {
                                    cycleTime -= second
                                    cyclePieChart.value = cycleTime.also {
                                        updateTimerTextView(cycleTextView, it)
                                    }
                                } else {
                                    violationAdapter.addViolation("Violation: 70 - Hour Rule Violations")
                                }
                            }
                            if (breakTime > 0 && shortTimeout > 0L) {
                                breakTime -= second
                                breakPieChart.value = breakTime.also {
                                    updateTimerTextView(breakTextView, it)
                                }
                            } else if (status != Status.OFF_DUTY || status != Status.OFF_DUTY_PC || status != Status.SLEEPER) {
                                violationAdapter.addViolation("Violation: 30 - Minutes Rule Violations")
                            }
                            if (shiftTime > 0 && longTimeout > 0L) {
                                shiftTime -= second
                                shiftPieChart.value = shiftTime.also {
                                    updateTimerTextView(shiftTextView, it)
                                }
                            } else if (status != Status.OFF_DUTY || status != Status.OFF_DUTY_PC || status != Status.SLEEPER) {
                                violationAdapter.addViolation("Violation: 14 - Hour Rule Violations")
                            }
                            if (status == Status.DRIVING) {
                                if (drivingTime > 0) {
                                    drivingTime -= second
                                    drivingPieChart.value = drivingTime.also {
                                        updateTimerTextView(drivingTextView, it)
                                    }
                                } else {
                                    violationAdapter.addViolation("Violation: 11 - Hour Rule Violations")
                                }
                            }
                            if (Calendar.getInstance().get(Calendar.HOUR_OF_DAY) == 0) {
                                violationAdapter.clear()
                            }

                            if (status == Status.OFF_DUTY || status == Status.OFF_DUTY_PC || status == Status.SLEEPER) {
                                if (shortTimeout > 0) {
                                    shortTimeout -= second
                                } else {
                                    breakTime = breakMaxTime
                                    breakPieChart.value = breakTime.also {
                                        updateTimerTextView(breakTextView, it)
                                    }
                                }
                                offDutyTime += second
                                if (longTimeout > 0) {
                                    longTimeout -= second
                                } else {
                                    breakTime = breakMaxTime
                                    breakPieChart.value = breakTime.also {
                                        updateTimerTextView(breakTextView, it)
                                    }
                                    shiftTime = shiftMaxTime
                                    shiftPieChart.value = shiftTime.also {
                                        updateTimerTextView(shiftTextView, it)
                                    }
                                    drivingTime = drivingMaxTime
                                    drivingPieChart.value = drivingTime.also {
                                        updateTimerTextView(drivingTextView, it)
                                    }
                                    longTimeout = TimeUnit.HOURS.toMillis(10)
                                }
                                if (TimeUnit.MILLISECONDS.toMinutes(offDutyTime) % TimeUnit.HOURS.toMinutes(
                                        34
                                    ) == 0L
                                ) {
                                    breakTime = breakMaxTime
                                    breakPieChart.value = breakTime.also {
                                        updateTimerTextView(breakTextView, it)
                                    }
                                    shiftTime = shiftMaxTime
                                    shiftPieChart.value = shiftTime.also {
                                        updateTimerTextView(shiftTextView, it)
                                    }
                                    drivingTime = drivingMaxTime
                                    drivingPieChart.value = drivingTime.also {
                                        updateTimerTextView(drivingTextView, it)
                                    }
                                    cycleTime = cycleMaxTime
                                    cyclePieChart.value = cycleTime.also {
                                        updateTimerTextView(cycleTextView, it)
                                    }
                                    offDutyTime = 0L
                                }
                            } else {
                                shortTimeout = TimeUnit.MINUTES.toMillis(30)
                                longTimeout = TimeUnit.HOURS.toMillis(10)
                            }
                        }
                    }
                }

                breakPieChart.max = TimeUnit.HOURS.toMillis(8)
                breakTextView.text = "08:00"
                drivingPieChart.max = TimeUnit.HOURS.toMillis(11)
                drivingTextView.text = "11:00"
                shiftPieChart.max = TimeUnit.HOURS.toMillis(14)
                shiftTextView.text = "14:00"
                cyclePieChart.max = TimeUnit.HOURS.toMillis(70)
                cycleTextView.text = "70:00"

                statusOffDuty.setOnClickListener(this::onStatusSelected)
                statusSleeper.setOnClickListener(this::onStatusSelected)
                statusOnDuty.setOnClickListener(this::onStatusSelected)
                statusOnDuty.compoundDrawablesRelative[0].setTint(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.colorPrimary
                    )
                )
                statusOffDuty.compoundDrawablesRelative[0].setTint(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.colorPrimary
                    )
                )

                viewModel.recordAdded.observe(viewLifecycleOwner, Observer { response ->
                    handleResponse(response, onSuccess = {
                        if (it.type == "DRIVING") {
                            startActivityForResult(Intent(context, DrivingActivity::class.java), 0)
                        }
                        this.records = records.toMutableList().apply {
                            add(0, it)
                        }
                        setupRecords()
                    })
                })
                viewModel.recordEdited.observe(viewLifecycleOwner, Observer { response ->
                    handleResponse(response, onSuccess = { record ->
                        records.find { it.id == record.id }?.let {
                            it.location = record.location
                            it.remark = record.remark
                        }
                    })
                })

                drivingButton.setOnClickListener {
                    selectStatus(null)
                    status = Status.DRIVING
                    viewModel.addRecord(
                        AddRecordRequest(
                            2,
                            "test",
                            "",
                            System.currentTimeMillis(),
                            System.currentTimeMillis()
                        )
                    )
                }
            } else {
                timeScore.visibility = View.GONE
                statusTab.visibility = View.GONE
            }
        }
        viewModel.records.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = { records ->
                if (records.isNotEmpty()) {
                    this.records = filterRecords(records)
                    if (this.records.isEmpty()) {
                        return@handleResponse
                    }
                    setupRecords()
                    view.viewTreeObserver.addOnGlobalLayoutListener(object :
                        ViewTreeObserver.OnGlobalLayoutListener {
                        override fun onGlobalLayout() {
                            val height = max(timeScore.height, recordsCardView.height)
                            timeScore.updateLayoutParams {
                                this.height = height
                            }
                            recordsCardView.updateLayoutParams {
                                this.height = height
                            }
                            view.viewTreeObserver.removeOnGlobalLayoutListener(this)
                        }
                    })
                    when (this.records.first().type) {
                        "OFF_DUTY" -> {
                            selectStatus(statusOffDuty)
                            status = Status.OFF_DUTY
                        }
                        "OFF_DUTY_PC" -> {
                            selectStatus(statusOffDuty)
                            status = Status.OFF_DUTY_PC
                        }
                        "ON_DUTY" -> {
                            selectStatus(statusOnDuty)
                            status = Status.ON_DUTY
                        }
                        "ON_DUTY_YM" -> {
                            selectStatus(statusOnDuty)
                            status = Status.ON_DUTY_YARD_PARKING
                        }
                        "SLEEPER" -> {
                            selectStatus(statusSleeper)
                            status = Status.SLEEPER
                        }
                        "DRIVING" -> {
                            selectStatus(null)
                            status = Status.DRIVING
                        }
                    }
                }
            })
        })
        recordsButton.setOnClickListener {
            if (!records.isNullOrEmpty()) {
                startActivity(RecordsActivity.newIntent(requireContext(), records))
            }
        }
    }

    private fun getElapsedTime(records: List<Record>, type: String): Long {
        var elapsedTime = 0L
        records.forEachIndexed { index, it ->
            if (it.type == type) {
                val startTime = serverDateFormat.parse(
                    it.startTime
                )!!.time

                elapsedTime += if (Calendar.getInstance().apply { timeInMillis = startTime }
                        .get(Calendar.DAY_OF_YEAR) == Calendar.getInstance()
                        .get(Calendar.DAY_OF_YEAR) && index == 0
                ) {
                    System.currentTimeMillis() - TimeZone.getDefault().rawOffset - startTime
                } else if (index == 0) {
                    Calendar.getInstance().apply {
                        timeInMillis = startTime
                        set(Calendar.HOUR_OF_DAY, getActualMaximum(Calendar.HOUR_OF_DAY))
                        set(Calendar.MINUTE, getActualMaximum(Calendar.MINUTE))
                        set(Calendar.SECOND, getActualMaximum(Calendar.SECOND))
                    }.timeInMillis - startTime
                } else {
                    (serverDateFormat.parse(
                        records[index - 1].startTime
                    )!!.time) - startTime
                }
            }
        }
        return elapsedTime
    }

    private fun updateTimerTextView(textView: TextView, value: Long) {
        textView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(value)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(value) % 60)}"
    }

    @SuppressLint("SetTextI18n")
    fun setupRecords() {
        recordRecyclerView.swapAdapter(RecordAdapter(
            records, 5
        ) { record, startTime, endTime ->
            val dialog = Dialog(requireContext())
            View.inflate(requireContext(), R.layout.update_duty_status_dialog, null).let {
                dialog.setContentView(it)
                it.startTime.text = startTime
                it.endTimeTextView.text = endTime
                it.locationEditText.setText(record.location)
                it.remarkEditText.setText(record.remark)
                it.cancelButton.setOnClickListener {
                    dialog.dismiss()
                }
                it.positiveButton.setOnClickListener { _ ->
                    viewModel.editRecord(
                        EditRecordRequest(
                            record.id,
                            "Test",
                            it.remarkEditText.text!!.toString()
                        )
                    )
                    dialog.dismiss()
                }
            }
            dialog.show()
            dialog.window!!.setLayout(
                (requireContext().resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                WindowManager.LayoutParams.WRAP_CONTENT
            )
        }, false)
        val offDutyFullTime = getElapsedTime(records, "OFF_DUTY")
        offDutyTimeTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(offDutyFullTime)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(offDutyFullTime) % 60)}"
        val sleeperFullTime = getElapsedTime(records, "SLEEPER")
        sleeperTime.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(sleeperFullTime)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(sleeperFullTime) % 60)}"
        val drivingFullTime = getElapsedTime(records, "DRIVING")
        drivingTimeView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(drivingFullTime)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(drivingFullTime) % 60)}"
        val onDutyFullTime = getElapsedTime(records, "ON_DUTY") + getElapsedTime(records, "ON_DUTY_YM")
        onDutyTime.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(onDutyFullTime)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(onDutyFullTime) % 60)}"
        timeline.records = records
    }

    private fun onStatusSelected(view: View) {
        when (view.id) {
            R.id.statusOffDuty -> {
                val dialog = Dialog(requireContext()).apply {
                    requestWindowFeature(Window.FEATURE_NO_TITLE)
                }
                View.inflate(requireContext(), R.layout.change_status_off_duty_dialog, null)
                    .let {
                        it.titleOffDuty.compoundDrawablesRelative[0].setTint(
                            ContextCompat.getColor(
                                requireContext(),
                                R.color.colorPrimary
                            )
                        )
                        dialog.setContentView(it)
                        it.offDutyCancelButton.setOnClickListener {
                            dialog.dismiss()
                        }
                        it.offDutyPositiveButton.setOnClickListener { _ ->
                            if (!it.personalConveyance.isChecked || it.remarkEditText.text!!.isNotEmpty()) {
                                selectStatus(view as TextView)
                                status = Status.OFF_DUTY
                                viewModel.addRecord(
                                    AddRecordRequest(
                                        if (it.personalConveyance.isChecked) 6 else 1,
                                        "test",
                                        it.remarkEditText.text.toString(),
                                        System.currentTimeMillis(),
                                        System.currentTimeMillis()
                                    )
                                )
                                dialog.dismiss()
                            } else {
                                Toast.makeText(context, "Remark is empty!", Toast.LENGTH_SHORT)
                                    .show()
                            }
                        }
                        it.personalConveyance.setOnCheckedChangeListener { _, isChecked ->
                            if (isChecked) {
                                it.remarkOptional.visibility = View.INVISIBLE
                            } else {
                                it.remarkOptional.visibility = View.VISIBLE
                            }
                        }
                    }
                dialog.show()
                dialog.window!!.setLayout(
                    (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                    WindowManager.LayoutParams.WRAP_CONTENT
                )
            }
            R.id.statusSleeper -> {
                val dialog = Dialog(requireContext()).apply {
                    requestWindowFeature(Window.FEATURE_NO_TITLE)
                }
                View.inflate(requireContext(), R.layout.change_status_sleeper_dialog, null)
                    .let {
                        dialog.setContentView(it)
                        it.sleeperCancelButton.setOnClickListener {
                            dialog.dismiss()
                        }
                        it.sleeperPositiveButton.setOnClickListener { _ ->
                            selectStatus(view as TextView)
                            status = Status.SLEEPER
                            viewModel.addRecord(
                                AddRecordRequest(
                                    4,
                                    "test",
                                    it.remarkEditText.text.toString(),
                                    System.currentTimeMillis(),
                                    System.currentTimeMillis()
                                )
                            )
                            dialog.dismiss()
                        }
                    }
                dialog.show()
                dialog.window!!.setLayout(
                    (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                    WindowManager.LayoutParams.WRAP_CONTENT
                )
            }
            R.id.statusOnDuty -> {
                val dialog = Dialog(requireContext()).apply {
                    requestWindowFeature(Window.FEATURE_NO_TITLE)
                }
                View.inflate(requireContext(), R.layout.change_status_on_duty_dialog, null)
                    .let {
                        it.titleOnDuty.compoundDrawablesRelative[0].setTint(
                            ContextCompat.getColor(
                                requireContext(),
                                R.color.colorPrimary
                            )
                        )
                        dialog.setContentView(it)
                        it.onDutyCancelButton.setOnClickListener {
                            dialog.dismiss()
                        }
                        it.onDutyPositiveButton.setOnClickListener { _ ->
                            if (!it.yardMove.isChecked || it.remarkEditText.text!!.isNotEmpty()) {
                                selectStatus(view as TextView)
                                status = Status.ON_DUTY
                                viewModel.addRecord(
                                    AddRecordRequest(
                                        if (it.yardMove.isChecked) 5 else 3,
                                        "test",
                                        it.remarkEditText.text.toString(),
                                        System.currentTimeMillis(),
                                        System.currentTimeMillis()
                                    )
                                )
                                dialog.dismiss()
                            } else {
                                Toast.makeText(context, "Remark is empty!", Toast.LENGTH_SHORT)
                                    .show()
                            }
                        }
                        it.yardMove.setOnCheckedChangeListener { _, isChecked ->
                            if (isChecked) {
                                it.remarkOptional.visibility = View.INVISIBLE
                            } else {
                                it.remarkOptional.visibility = View.VISIBLE
                            }
                        }
                        setupCheckBoxLayout(
                            it.checkBoxLayout,
                            it.remarkEditText,
                            it.customEditText
                        )
                    }
                dialog.show()
                dialog.window!!.setLayout(
                    (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                    WindowManager.LayoutParams.WRAP_CONTENT
                )
            }
        }
    }

    @SuppressLint("SetTextI18n")
    private fun setupCheckBoxLayout(
        viewGroup: ViewGroup,
        editText: EditText,
        customEditText: EditText
    ) {
        viewGroup.children.forEach {
            if (it is ViewGroup) {
                setupCheckBoxLayout(it, editText, customEditText)
            } else if (it is CompoundButton) {
                it.setOnCheckedChangeListener { buttonView, isChecked ->
                    if (it.id == R.id.customCheckBox) {
                        if (isChecked) {
                            val text = customEditText.text.toString().replace(";", "")
                            if (!editText.text.contains(text)) {
                                editText.setText("${editText.text}$text; ")
                                customEditText.isEnabled = false
                            } else {
                                Toast.makeText(context, "Value is exist!", Toast.LENGTH_SHORT)
                                    .show()
                                it.isChecked = false
                            }
                        } else {
                            editText.setText(editText.text.split("; ".toRegex()).filter { s ->
                                s != customEditText.text.toString().replace(";", "")
                            }.joinToString("; "))
                            customEditText.isEnabled = true
                        }
                    } else {
                        if (isChecked) {
                            editText.setText("${editText.text}${it.text}; ")
                        } else {
                            editText.setText(editText.text.split("; ".toRegex()).filter { s ->
                                s != it.text
                            }.joinToString("; "))
                        }
                    }
                }
            }
        }
    }

    private fun selectStatus(textView: TextView?) {
        getStatusView(status)?.apply {
            val outValue = TypedValue()
            requireContext().theme.resolveAttribute(
                android.R.attr.selectableItemBackground,
                outValue,
                true
            )
            setBackgroundResource(outValue.resourceId)
            setTextColor(Color.BLACK)
            compoundDrawablesRelative[0].setTint(
                ContextCompat.getColor(
                    context,
                    R.color.colorPrimary
                )
            )
        }
        textView?.apply {
            setBackgroundResource(R.drawable.selected_status_background)
            setTextColor(Color.WHITE)
            compoundDrawablesRelative[0].setTint(Color.WHITE)
        }
    }

    private fun getStatusView(status: Status?) = when (status) {
        Status.OFF_DUTY, Status.OFF_DUTY_PC -> statusOffDuty
        Status.SLEEPER -> statusSleeper
        Status.ON_DUTY, Status.ON_DUTY_YARD_PARKING -> statusOnDuty
        else -> null
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        status = Status.OFF_DUTY
        viewModel.addRecord(
            AddRecordRequest(
                1,
                "test",
                "",
                System.currentTimeMillis(),
                System.currentTimeMillis()
            )
        )
    }

    class ViolationAdapter() :
        RecyclerView.Adapter<ViolationViewHolder>() {

        private val violations = mutableListOf<String>()

        fun addViolation(violation: String) {
            if (!violations.contains(violation)) {
                violations.add(violation)
                notifyDataSetChanged()
            }
        }

        fun clear() {
            violations.clear()
            notifyDataSetChanged()
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = ViolationViewHolder(
            (LayoutInflater.from(parent.context)
                .inflate(R.layout.violation_list_item, parent, false) as TextView)
        )

        override fun getItemCount() = violations.size

        override fun onBindViewHolder(holder: ViolationViewHolder, position: Int) {
            val violation = violations[position]
            holder.textView.text = violation
        }

    }

    class ViolationViewHolder(val textView: TextView) : RecyclerView.ViewHolder(textView)

    fun <V> handleResponse(
        response: ApiResponse<V>,
        onSuccess: (V) -> Unit,
        onError: ((Int?) -> Unit)? = null
    ) = when {
        response.status == 0 -> {
            onSuccess(response.result!!)
        }
        response.status != null -> {
            Toast.makeText(context, response.resultString, Toast.LENGTH_SHORT).show()
            onError?.let { it(response.status) }
        }
        else -> {
            Toast.makeText(
                context,
                response.throwable?.message ?: response.resultString,
                Toast.LENGTH_SHORT
            ).show()
            onError?.let { it(null) }
        }
    }
}