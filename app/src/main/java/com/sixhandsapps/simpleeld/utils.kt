package com.sixhandsapps.simpleeld

import android.content.Context
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.sixhandsapps.simpleeld.model.ApiResponse

fun <V> Context.handleResponse(
    response: ApiResponse<V>,
    onSuccess: (V) -> Unit,
    onError: ((Int?) -> Unit)? = null
) = when {
    response.status == 0 -> {
        onSuccess(response.result!!)
    }
    response.status != null -> {
        Toast.makeText(this, response.resultString, Toast.LENGTH_LONG).show()
        onError?.let { it(response.status) }
    }
    else -> {
        Toast.makeText(this, response.throwable!!.message, Toast.LENGTH_LONG).show()
        onError?.let { it(null) }
    }
}

fun <V> Fragment.handleResponse(response: ApiResponse<V>, onSuccess: (V) -> Unit, onError: ((Int?) -> Unit)? = null) =
    context?.handleResponse(response, onSuccess, onError)