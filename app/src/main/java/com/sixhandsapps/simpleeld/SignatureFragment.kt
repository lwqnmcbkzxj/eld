package com.sixhandsapps.simpleeld

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_signature.*

class SignatureFragment: Fragment(), SignatureView.Callback {

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
        activity.viewPager.isPagingEnabled = false
    }

    override fun endDrawing() {
        clearButton.isEnabled = true
        submitButton.isEnabled = true
        activity.viewPager.isPagingEnabled = true
    }
}