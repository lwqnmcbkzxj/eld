package com.sixhandsapps.simpleeld.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.core.content.edit
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.Observer
import com.google.android.material.textfield.TextInputLayout
import com.sixhandsapps.simpleeld.*
import com.sixhandsapps.simpleeld.viewmodel.LogInViewModel
import kotlinx.android.synthetic.main.activity_log_in.*
import java.lang.Exception

class LogInActivity : BaseActivity() {

    private val viewModel by viewModels<LogInViewModel>()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_log_in)

        passwordEditText.addTextChangedListener {
            if (it!!.isNotEmpty()) {
                if (passwordLayout.endIconMode != TextInputLayout.END_ICON_PASSWORD_TOGGLE) {
                    passwordLayout.endIconMode = TextInputLayout.END_ICON_PASSWORD_TOGGLE
                }
            } else {
                if (passwordLayout.endIconMode != TextInputLayout.END_ICON_NONE) {
                    passwordLayout.endIconMode = TextInputLayout.END_ICON_NONE
                }
            }
        }
        logInButton.setOnClickListener {
            val login = loginEditText.text!!.toString()
            val password = passwordEditText.text!!.toString()
            if (login.isEmpty()) {
                loginEditText.error = "Enter username"
            }
            if (password.isEmpty()) {
                passwordEditText.error = "Enter password"
            }
            if (login.isNotEmpty() && password.isNotEmpty()) {
                try {
                    viewModel.logIn(login, password)
                } catch (e: Exception) {
                    Toast.makeText(this, e.message, Toast.LENGTH_LONG).show()
                }
            }
        }

        try {
            viewModel.logInResponse.observe(this, Observer {
                handleResponse(it, onSuccess = {
                    getPreferences().edit(true) {
                        putString(PREFERENCES_TOKEN, it.token)
                        putInt(PREFERENCES_COMPANY_ID, it.companyId)
                    }
                    if (it.sessionId == null) {
                        startActivity(Intent(this, ConfirmVehicleActivity::class.java))
                    } else {
                        startActivity(Intent(this, AnotherDeviceActivity::class.java))
                    }
                })
            })
        } catch (e: Exception) {
            Toast.makeText(this, e.message, Toast.LENGTH_LONG).show()
        }
    }
}
