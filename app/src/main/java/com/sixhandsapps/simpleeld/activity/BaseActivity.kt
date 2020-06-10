package com.sixhandsapps.simpleeld.activity

import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.ActivityInfo
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sixhandsapps.simpleeld.model.ApiResponse

abstract class BaseActivity : AppCompatActivity() {

    @SuppressLint("SourceLockedOrientationActivity")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
       // requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
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
            Toast.makeText(this, response.resultString, Toast.LENGTH_SHORT).show()
            onError?.let { it(response.status) }
        }
        else -> {
            Toast.makeText(this, response.throwable?.message ?: response.resultString, Toast.LENGTH_SHORT).show()
            onError?.let { it(null) }
        }
    }
}