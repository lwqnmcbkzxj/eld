package com.sixhandsapps.simpleeld.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.Fragment
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.widget.SignatureView
import com.sixhandsapps.simpleeld.activity.MainActivity
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_signature.*
import kotlin.math.roundToInt

class SignatureFragment: Fragment(),
    SignatureView.Callback {

    private val activity by lazy {
        requireActivity() as MainActivity
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_signature, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        cardView.updateLayoutParams {
            val cardViewWidth = (resources.displayMetrics.widthPixels * 0.7f).roundToInt()
            width = cardViewWidth
        }

        signatureView.callback = this
        clearButton.setOnClickListener {
            signatureView.clear()
            clearButton.isEnabled = false
            submitButton.isEnabled = false
        }
        submitButton.setOnClickListener {
            submitButton.visibility = View.GONE
            submittedTextView.visibility = View.VISIBLE
        }
    }

    override fun startDrawing() {
        activity.viewPager.isUserInputEnabled = false
    }

    override fun endDrawing() {
        clearButton.isEnabled = true
        submitButton.isEnabled = true
        activity.viewPager.isUserInputEnabled = true
    }
}