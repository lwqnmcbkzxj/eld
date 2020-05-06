package com.sixhandsapps.simpleeld.activity

import android.app.Dialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import androidx.core.view.updateLayoutParams
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.RecordAdapter
import com.sixhandsapps.simpleeld.model.EditRecordRequest
import com.sixhandsapps.simpleeld.model.Record
import com.sixhandsapps.simpleeld.viewmodel.LogsViewModel
import kotlinx.android.synthetic.main.activity_records.*
import kotlinx.android.synthetic.main.update_duty_status_dialog.view.*
import kotlin.math.roundToInt

val editMap = HashMap<Int, String>()

class RecordsActivity : BaseActivity() {

    companion object {

        private const val EXTRA_RECORDS = "records"

        fun newIntent(packageContext: Context, records: List<Record>) =
            Intent(packageContext, RecordsActivity::class.java)
                .putParcelableArrayListExtra(EXTRA_RECORDS, ArrayList(records))
    }

    val viewModel by lazy {
        ViewModelProvider(this, LogsViewModel.Factory(application)).get(
            LogsViewModel::class.java
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_records)

        backButton.setOnClickListener {
            finish()
        }
        recyclerView.updateLayoutParams {
            width = (resources.displayMetrics.widthPixels * 0.7f).roundToInt()
        }
        val records: ArrayList<Record> =
            intent.getParcelableArrayListExtra(EXTRA_RECORDS)!!
        recyclerView.adapter = RecordAdapter(
            records
        ) { record, startTime, endTime ->
            val dialog = Dialog(this)
            View.inflate(this, R.layout.update_duty_status_dialog, null).let {
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
                            record.location!!,
                            it.remarkEditText.text!!.toString()
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
        viewModel.recordEdited.observe(this, Observer { response ->
            handleResponse(response, { record ->
                records.find { it.id == record.id }?.let {
                    it.remark = record.remark
                    editMap[it.id] = it.remark!!
                    recyclerView.adapter!!.notifyDataSetChanged()
                }
            })
        })
    }
}