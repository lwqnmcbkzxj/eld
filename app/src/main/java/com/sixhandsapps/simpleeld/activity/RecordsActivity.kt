package com.sixhandsapps.simpleeld.activity

import android.app.Dialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.WindowManager
import androidx.core.view.updateLayoutParams
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.RecordAdapter
import com.sixhandsapps.simpleeld.model.Record
import kotlinx.android.synthetic.main.activity_records.*
import kotlin.math.roundToInt

class RecordsActivity : BaseActivity() {

    companion object {

        private const val EXTRA_RECORDS = "records"

        fun newIntent(packageContext: Context, records: List<Record>) =
            Intent(packageContext, RecordsActivity::class.java)
                .putParcelableArrayListExtra(EXTRA_RECORDS, ArrayList(records))
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
        recyclerView.adapter = RecordAdapter(intent.getParcelableArrayListExtra(EXTRA_RECORDS)!!) {
            val dialog = Dialog(this)
            dialog.setContentView(R.layout.update_duty_status_dialog)
            dialog.show()
            dialog.window!!.setLayout(
                (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                WindowManager.LayoutParams.WRAP_CONTENT
            )
        }
    }

}