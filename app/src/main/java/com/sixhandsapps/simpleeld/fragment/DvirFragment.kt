package com.sixhandsapps.simpleeld.fragment

import android.app.Dialog
import android.os.Bundle
import android.view.*
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.Fragment
import com.sixhandsapps.simpleeld.R
import kotlinx.android.synthetic.main.create_dvir_dialog.view.*
import kotlinx.android.synthetic.main.fragment_dvir.*
import kotlin.math.roundToInt

class DvirFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_dvir, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        createDvirButton.setOnClickListener {
            val context = requireContext()
            val dialog = Dialog(context)
            View.inflate(context, R.layout.create_dvir_dialog, null).let {
                dialog.setContentView(it)
                it.cancelButton.setOnClickListener {
                    dialog.dismiss()
                }
                it.signatureButton.setOnClickListener { _ ->
                    it.createDvirLayout.visibility = View.GONE
                    it.signatureLayout.visibility = View.VISIBLE
                }
                it.backButton.setOnClickListener { _ ->
                    it.signatureLayout.visibility = View.GONE
                    it.createDvirLayout.visibility = View.VISIBLE
                }
                it.viewTreeObserver.addOnGlobalLayoutListener(object : ViewTreeObserver.OnGlobalLayoutListener {

                    override fun onGlobalLayout() {
                        it.updateLayoutParams {
                            width = it.width
                            height = it.height
                        }
                        it.viewTreeObserver.removeOnGlobalLayoutListener(this)
                    }
                })
            }

            dialog.show()
            dialog.window!!.setLayout(
                (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                WindowManager.LayoutParams.WRAP_CONTENT
            )
        }
    }
}