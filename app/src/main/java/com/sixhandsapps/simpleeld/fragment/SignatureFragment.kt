package com.sixhandsapps.simpleeld.fragment

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.activity.MainActivity
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.Signature
import com.sixhandsapps.simpleeld.viewmodel.SignatureViewModel
import com.sixhandsapps.simpleeld.widget.SignatureView
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_signature.*
import kotlin.math.roundToInt

class SignatureFragment : Fragment(),
    SignatureView.Callback {

    private val activity by lazy {
        requireActivity() as MainActivity
    }

    private val viewModel by lazy {
        ViewModelProvider(this, SignatureViewModel.Factory(requireActivity().application)).get(
            SignatureViewModel::class.java
        )
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
        var signatureId = -1
        signatureView.callback = this
        clearButton.setOnClickListener {
            signatureView.clear()
            clearButton.isEnabled = false
            submitButton.isEnabled = false
            submittedTextView.visibility = View.GONE
            submitButton.visibility = View.VISIBLE
            signatureView.setOnTouchListener { v, event -> v.onTouchEvent(event) }
            if (signatureId != -1) {
                viewModel.deleteSignature(signatureId)
            }
        }
        submitButton.setOnClickListener {
            submitButton.visibility = View.GONE
            submittedTextView.visibility = View.VISIBLE
            signatureView.setOnTouchListener { _, _ -> true }
            signatureView.textView.visibility = View.INVISIBLE
            AsyncTask.execute {
                viewModel.setSignature(signatureView.toFile())
                signatureView.post {
                    signatureView.textView.visibility = View.VISIBLE
                }
            }
        }

        viewModel.signatureUploaded.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = {
                signatureId = it["signature_id"] ?: -1
                Toast.makeText(context, "Success!", Toast.LENGTH_SHORT).show()
            })
        })
        viewModel.signatureDeleted.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = {
                signatureId = -1
                Toast.makeText(context, "Signature deleted!", Toast.LENGTH_SHORT).show()
            })
        })
        viewModel.signature.observe(viewLifecycleOwner, Observer {
            signatureView.setBitmap(BitmapFactory.decodeByteArray(it, 0, it.size, BitmapFactory.Options().apply {
                inMutable = true
            }))
            submitButton.visibility = View.GONE
            submittedTextView.visibility = View.VISIBLE
            endDrawing()
        })
        viewModel.signatures.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, {
                signatureId = it.firstOrNull()?.id ?: -1
            })
        })
    }

    override fun startDrawing() {
        scrollView.requestDisallowInterceptTouchEvent(true)
        activity.viewPager.isUserInputEnabled = false
    }

    override fun endDrawing() {
        clearButton.isEnabled = true
        submitButton.isEnabled = true
        scrollView.requestDisallowInterceptTouchEvent(false)
        activity.viewPager.isUserInputEnabled = true
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