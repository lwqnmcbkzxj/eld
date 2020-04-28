package com.sixhandsapps.simpleeld.activity

import android.app.Dialog
import android.os.Bundle
import android.view.WindowManager
import androidx.core.text.HtmlCompat
import androidx.core.view.children
import androidx.core.view.updateLayoutParams
import com.sixhandsapps.simpleeld.R
import kotlinx.android.synthetic.main.activity_inspection_module.*
import kotlin.math.roundToInt

class InspectionModuleActivity: BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_inspection_module)

        reviewTextView.text = HtmlCompat.fromHtml( "Review logs for previous 7 days <font color=#1A66E6>+ today</font>", HtmlCompat.FROM_HTML_MODE_COMPACT)
        sendingTextView.text = HtmlCompat.fromHtml( "Sending logs for previous 7 days <font color=#1A66E6>+ today</font>", HtmlCompat.FROM_HTML_MODE_COMPACT)

        backButton.setOnClickListener {
            finish()
        }
        contentLayout.children.forEach {
            it.updateLayoutParams {
                width = (resources.displayMetrics.widthPixels * 0.7f).roundToInt()
            }
        }
        sendLogsButton.setOnClickListener {
            val dialog = Dialog(this)
            dialog.setContentView(R.layout.send_logs_dialog)
            dialog.show()
        }
        sendOutputFileButton.setOnClickListener {
            val dialog = Dialog(this)
            dialog.setContentView(R.layout.send_eld_output_file_dialog)
            dialog.show()
            dialog.window!!.setLayout(
                (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                WindowManager.LayoutParams.WRAP_CONTENT
            )
        }
    }

}