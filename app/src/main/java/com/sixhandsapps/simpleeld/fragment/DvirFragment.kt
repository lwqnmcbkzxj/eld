package com.sixhandsapps.simpleeld.fragment

import android.annotation.SuppressLint
import android.app.Dialog
import android.graphics.*
import android.os.AsyncTask
import android.os.Bundle
import android.view.*
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.RecyclerView
import com.sixhandsapps.simpleeld.*
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.Dvir
import com.sixhandsapps.simpleeld.model.DvirRequest
import com.sixhandsapps.simpleeld.viewmodel.DvirViewModel
import com.sixhandsapps.simpleeld.widget.SignatureView
import kotlinx.android.synthetic.main.create_dvir_dialog.view.*
import kotlinx.android.synthetic.main.create_dvir_dialog.view.descriptionEditText
import kotlinx.android.synthetic.main.dvir_list_item.view.*
import kotlinx.android.synthetic.main.fragment_dvir.*
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList
import kotlin.math.roundToInt

class DvirFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_dvir, container, false)
    }

    private val dateFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())
    @SuppressLint("SimpleDateFormat")
    val dateFormat1 = SimpleDateFormat("yyyy-MM-dd")

    private val viewModel by lazy {
        ViewModelProvider(this, DvirViewModel.Factory(requireActivity().application)).get(
            DvirViewModel::class.java
        )
    }

    private var dvirAdapter: DvirAdapter? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        recyclerView.updateLayoutParams {
            width = (resources.displayMetrics.widthPixels * 0.7f).roundToInt()
        }
        viewModel.dvirAdded.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = { dvir ->
                dvirAdapter?.let {
                    it.dvirs = ArrayList(it.dvirs).apply {
                        add(dvir)
                    }
                    it.notifyDataSetChanged()
                    Toast.makeText(context, "Dvir added!", Toast.LENGTH_SHORT).show()
                }
            })
        })
        viewModel.dvirDeleted.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = { id ->
                dvirAdapter?.let {
                    it.dvirs = ArrayList(it.dvirs).apply {
                        removeAll { it.id == id }
                    }
                    it.notifyDataSetChanged()
                    Toast.makeText(context, "Dvir deleted!", Toast.LENGTH_SHORT).show()
                }
            })
        })
        createDvirButton.setOnClickListener {
            val context = requireContext()
            val dialog = Dialog(context).apply {
                requestWindowFeature(Window.FEATURE_NO_TITLE)
            }
            View.inflate(context, R.layout.create_dvir_dialog, null).let {
                dialog.setContentView(it)

                it.hasDefects.setOnCheckedChangeListener { _, isChecked ->
                    if (isChecked) {
                        it.optional.visibility = View.VISIBLE
                    } else {
                        it.optional.visibility = View.INVISIBLE
                    }
                }

                it.vehicleEditText.setText(
                    String.format(
                        "%03d",
                        getPreferences().getInt(PREFERENCES_VEHICLE_ID, -1)
                    )
                )

                it.timeEditText.setText(dateFormat.format(Date()))
                it.cancelButton.setOnClickListener {
                    dialog.dismiss()
                }
                it.saveButton.setOnClickListener { _ ->
                    it.signatureView.textView.visibility = View.INVISIBLE
                    AsyncTask.execute {
                        viewModel.addDvir(
                            DvirRequest(
                                getPreferences().getInt(
                                    PREFERENCES_VEHICLE_ID,
                                    -1
                                ),
                                it.locationEditText.text.toString(),
                                if (it.hasDefects.isChecked) 1 else 0,
                                getPreferences().getString(PREFERENCES_SELECTED_DATE, null)!!,
                                it.descriptionEditText.text.toString(),
                                it.signatureView.toFile()
                            )
                        )
                        it.post {
                            it.signatureView.textView.visibility = View.VISIBLE
                        }
                    }
                    dialog.dismiss()
                }
                it.signatureButton.setOnClickListener { _ ->
                    if (!it.hasDefects.isChecked || it.descriptionEditText.text!!.isNotEmpty()) {
                        it.createDvirLayout.visibility = View.GONE
                        it.signatureLayout.visibility = View.VISIBLE
                    } else {
                        Toast.makeText(context, "Description is empty!", Toast.LENGTH_SHORT).show()
                    }
                }
                it.backButton.setOnClickListener { _ ->
                    it.signatureLayout.visibility = View.GONE
                    it.createDvirLayout.visibility = View.VISIBLE
                }
                it.viewTreeObserver.addOnGlobalLayoutListener(object :
                    ViewTreeObserver.OnGlobalLayoutListener {

                    override fun onGlobalLayout() {
                        it.updateLayoutParams {
                            width = it.width
                            height = it.height
                        }
                        it.viewTreeObserver.removeOnGlobalLayoutListener(this)
                    }
                })
                it.clearButton.setOnClickListener { _ ->
                    it.signatureView.clear()
                    it.clearButton.isEnabled = false
                    it.saveButton.isEnabled = false
                }
                it.signatureView.callback = object : SignatureView.Callback {
                    override fun startDrawing() {
                        it.scrollView.requestDisallowInterceptTouchEvent(true)
                    }

                    override fun endDrawing() {
                        it.scrollView.requestDisallowInterceptTouchEvent(false)
                        it.clearButton.isEnabled = true
                        it.saveButton.isEnabled = true
                    }
                }
            }

            dialog.show()
            dialog.window!!.setLayout(
                (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                WindowManager.LayoutParams.WRAP_CONTENT
            )
        }
        viewModel.dvirs.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = {
                if (Calendar.getInstance().apply {
                        time = dateFormat1.parse(getPreferences().getString(PREFERENCES_SELECTED_DATE, null)!!)!!
                    }.get(Calendar.DAY_OF_MONTH) == Calendar.getInstance().get(Calendar.DAY_OF_MONTH)) {
                    dvirAdapter = DvirAdapter(it.filter { it.vehicleId == getPreferences().getInt(
                        PREFERENCES_VEHICLE_ID, -1) })
                } else {
                    dvirAdapter = DvirAdapter(it)
                }

                recyclerView.adapter = dvirAdapter
            })
        })
    }

    inner class DvirAdapter(var dvirs: List<Dvir>) : RecyclerView.Adapter<DvirViewHolder>() {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = DvirViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.dvir_list_item, parent, false)
                .apply {
                    vehicleId.compoundDrawablesRelative[0].colorFilter = PorterDuffColorFilter(
                        ContextCompat.getColor(requireContext(), R.color.colorPrimary),
                        PorterDuff.Mode.SRC_ATOP
                    )
                    descTextView.compoundDrawablesRelative[0].colorFilter = PorterDuffColorFilter(
                        ContextCompat.getColor(requireContext(), R.color.colorPrimary),
                        PorterDuff.Mode.SRC_ATOP
                    )
                }
        )

        override fun getItemCount() = dvirs.size

        override fun onBindViewHolder(holder: DvirViewHolder, position: Int) {
            val dvir = dvirs[position]

            with(holder) {
                vehicleId.text = String.format("%03d", dvir.vehicleId)
                if (dvir.description.isNotEmpty()) {
                    desc.text = dvir.description
                    desc.visibility = View.VISIBLE
                } else {
                    desc.visibility = View.GONE
                }
                deleteButton.setOnClickListener {
                    viewModel.deleteDvir(dvir.id)
                }
                if (dvir.hasDriverSignature == 1) {
                    dsStatus.setImageResource(R.drawable.ic_done_with_bg)
                } else {
                    dsStatus.setImageResource(R.drawable.ic_none)
                }
                if (dvir.hasMechanicSignature == 1) {
                    msStatus.setImageResource(R.drawable.ic_done_with_bg)
                } else {
                    msStatus.setImageResource(R.drawable.ic_none)
                }
                if (dvir.defectsStatus == "NO_DEFECTS") {
                    status.text = "NO DEFECTS FOUND"
                    status.background.setTint(Color.parseColor("#80B302"))
                } else {
                    status.text = "DEFECTS FOUND"
                    status.background.setTint(Color.parseColor("#E63C22"))
                }
                dvir.date.let {
                    time.text = dateFormat.format(serverDateFormat.parse(it)!!)
                }
                location.text = dvir.location
            }
        }
    }

    class DvirViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        val vehicleId = itemView.vehicleId
        val deleteButton = itemView.deleteButton
        val dsStatus = itemView.dsStatus
        val msStatus = itemView.msStatus
        val status = itemView.statusTextView
        val time = itemView.timeTextView
        val location = itemView.locationTextView
        val desc = itemView.descTextView

    }

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
            Toast.makeText(context, response.throwable?.message ?: response.resultString, Toast.LENGTH_SHORT).show()
            onError?.let { it(null) }
        }
    }
}