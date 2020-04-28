package com.sixhandsapps.simpleeld.fragment

import android.annotation.SuppressLint
import android.app.Dialog
import android.graphics.Color
import android.os.Bundle
import android.util.TypedValue
import android.view.*
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.RecordAdapter
import com.sixhandsapps.simpleeld.activity.RecordsActivity
import com.sixhandsapps.simpleeld.model.Record
import kotlinx.android.synthetic.main.change_status_off_duty_dialog.view.*
import kotlinx.android.synthetic.main.change_status_on_duty_dialog.*
import kotlinx.android.synthetic.main.change_status_on_duty_dialog.view.*
import kotlinx.android.synthetic.main.change_status_on_duty_dialog.view.onDutyCancelButton
import kotlinx.android.synthetic.main.change_status_sleeper_dialog.view.*
import kotlinx.android.synthetic.main.fragment_logs.*
import kotlinx.android.synthetic.main.timeline.*
import java.util.*
import java.util.concurrent.TimeUnit
import kotlin.math.roundToInt


class LogsFragment : Fragment() {

    var status = Status.OFF_DUTY

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_logs, container, false)
    }

    private val records = listOf(
        Record(
            2,
            0,
            "dasdsada",
            "dsadasdsa",
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 1)
                set(Calendar.MINUTE, 0)
            }.timeInMillis,
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 1)
                set(Calendar.MINUTE, 15)
            }.timeInMillis
        ), Record(
            2,
            1,
            "dasdsada",
            "dsadasdsa",
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 1)
                set(Calendar.MINUTE, 15)
            }.timeInMillis,
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 3)
                set(Calendar.MINUTE, 0)
            }.timeInMillis
        ), Record(
            2,
            2,
            "dasdsada",
            "dsadasdsa",
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 3)
                set(Calendar.MINUTE, 0)
            }.timeInMillis,
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 7)
                set(Calendar.MINUTE, 0)
            }.timeInMillis
        ), Record(
            2,
            3,
            "dasdsada",
            "dsadasdsa",
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 7)
                set(Calendar.MINUTE, 0)
            }.timeInMillis,
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 9)
                set(Calendar.MINUTE, 0)
            }.timeInMillis
        ), Record(
            2,
            0,
            "dasdsada",
            "dsadasdsa",
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 9)
                set(Calendar.MINUTE, 0)
            }.timeInMillis,
            Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 12)
                set(Calendar.MINUTE, 0)
            }.timeInMillis
        )
    )

    @SuppressLint("SetTextI18n")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        recordsButton.setOnClickListener {
            startActivity(RecordsActivity.newIntent(requireContext(), records))
        }
        recordRecyclerView.adapter = RecordAdapter(records.take(4)) {
            val dialog = Dialog(requireContext())
            dialog.setContentView(R.layout.update_duty_status_dialog)
            dialog.show()
            dialog.window!!.setLayout(
                (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                WindowManager.LayoutParams.WRAP_CONTENT
            )
        }

        val breakValue = TimeUnit.MINUTES.toMillis(60)
        val drivingValue = TimeUnit.MINUTES.toMillis(45)
        val shiftValue = TimeUnit.MINUTES.toMillis(30)
        val cycleValue = TimeUnit.SECONDS.toMillis(590)

        breakPieChart.max = TimeUnit.HOURS.toMillis(1)
        drivingPieChart.max = TimeUnit.HOURS.toMillis(1)
        shiftPieChart.max = TimeUnit.HOURS.toMillis(1)
        cyclePieChart.max = TimeUnit.HOURS.toMillis(1)

        breakPieChart.value = breakValue
        drivingPieChart.value = drivingValue
        shiftPieChart.value = shiftValue
        cyclePieChart.value = cycleValue

        val offDutyFullTime =
            records.filter { it.type == 0 }.sumBy { (it.endTime - it.startTime).toInt() }.toLong()
        offDutyTime.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(offDutyFullTime)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(offDutyFullTime) % 60)}"
        val sleeperFullTime =
            records.filter { it.type == 1 }.sumBy { (it.endTime - it.startTime).toInt() }.toLong()
        sleeperTime.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(sleeperFullTime)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(sleeperFullTime) % 60)}"
        val drivingFullTime =
            records.filter { it.type == 2 }.sumBy { (it.endTime - it.startTime).toInt() }.toLong()
        drivingTime.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(drivingFullTime)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(drivingFullTime) % 60)}"
        val onDutyFullTime =
            records.filter { it.type == 3 }.sumBy { (it.endTime - it.startTime).toInt() }.toLong()
        onDutyTime.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(onDutyFullTime)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(onDutyFullTime) % 60)}"
        timeline.records = records

        breakTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toMinutes(breakValue)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toSeconds(breakValue) % 60)}"
        drivingTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toMinutes(drivingValue)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toSeconds(drivingValue) % 60)}"
        shiftTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toMinutes(shiftValue)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toSeconds(shiftValue) % 60)}"
        cycleTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toMinutes(cycleValue)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toSeconds(cycleValue) % 60)}"

        statusOffDuty.setOnClickListener(this::onStatusSelected)
        statusSleeper.setOnClickListener(this::onStatusSelected)
        statusOnDuty.setOnClickListener(this::onStatusSelected)
        statusOnDuty.compoundDrawablesRelative[0].setTint(
            ContextCompat.getColor(
                requireContext(),
                R.color.colorPrimary
            )
        )
    }

    private fun onStatusSelected(view: View) {
        when (view.id) {
            R.id.statusOffDuty -> {
                if (status != Status.OFF_DUTY) {
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
                            it.offDutyPositiveButton.setOnClickListener {
                                selectStatus(view as TextView)
                                status = Status.OFF_DUTY
                                dialog.dismiss()
                            }
                        }
                    dialog.show()
                    dialog.window!!.setLayout(
                        (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                        WindowManager.LayoutParams.WRAP_CONTENT
                    )
                }
            }
            R.id.statusSleeper -> {
                if (status != Status.SLEEPER) {
                    val dialog = Dialog(requireContext()).apply {
                        requestWindowFeature(Window.FEATURE_NO_TITLE)
                    }
                    View.inflate(requireContext(), R.layout.change_status_sleeper_dialog, null)
                        .let {
                            dialog.setContentView(it)
                            it.sleeperCancelButton.setOnClickListener {
                                dialog.dismiss()
                            }
                            it.sleeperPositiveButton.setOnClickListener {
                                selectStatus(view as TextView)
                                status = Status.SLEEPER
                                dialog.dismiss()
                            }
                        }
                    dialog.show()
                    dialog.window!!.setLayout(
                        (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                        WindowManager.LayoutParams.WRAP_CONTENT
                    )
                }
            }
            R.id.statusOnDuty -> {
                if (status != Status.ON_DUTY) {
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
                            it.onDutyPositiveButton.setOnClickListener {
                                selectStatus(view as TextView)
                                status = Status.ON_DUTY
                                dialog.dismiss()
                            }
                        }
                    dialog.show()
                    dialog.window!!.setLayout(
                        (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                        WindowManager.LayoutParams.WRAP_CONTENT
                    )
                }
            }
        }
    }

    private fun selectStatus(textView: TextView) {
        getStatusView(status).apply {
            val outValue = TypedValue()
            context.theme.resolveAttribute(android.R.attr.selectableItemBackground, outValue, true)
            setBackgroundResource(outValue.resourceId)
            setTextColor(textView.textColors)
            compoundDrawablesRelative[0].setTint(
                ContextCompat.getColor(
                    context,
                    R.color.colorPrimary
                )
            )
        }
        textView.apply {
            setBackgroundResource(R.drawable.selected_status_background)
            setTextColor(Color.WHITE)
            compoundDrawablesRelative[0].setTint(Color.WHITE)
        }
    }

    private fun getStatusView(status: Status) = when (status) {
        Status.OFF_DUTY -> statusOffDuty
        Status.SLEEPER -> statusSleeper
        Status.ON_DUTY -> statusOnDuty
    }

    enum class Status {
        OFF_DUTY, SLEEPER, ON_DUTY
    }
}