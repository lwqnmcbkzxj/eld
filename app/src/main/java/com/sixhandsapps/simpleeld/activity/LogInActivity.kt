package com.sixhandsapps.simpleeld.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.edit
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.Observer
import com.google.android.material.textfield.TextInputLayout
import com.sixhandsapps.simpleeld.PREFERENCES_TOKEN
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.getPreferences
import com.sixhandsapps.simpleeld.viewmodel.LogInViewModel
import kotlinx.android.synthetic.main.activity_log_in.*

class LogInActivity : AppCompatActivity() {

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
                viewModel.logIn(login, password)
            }
        }

        viewModel.logInResponse.observe(this, Observer {
            if (it.status == 0) {
                getPreferences().edit(true) {
                    putString(PREFERENCES_TOKEN, it.result!!.token)
                }
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            } else {
                Toast.makeText(this, it.resultString, Toast.LENGTH_LONG).show()
            }
        })
    }
}
