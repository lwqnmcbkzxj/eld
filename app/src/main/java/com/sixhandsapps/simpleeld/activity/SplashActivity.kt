package com.sixhandsapps.simpleeld.activity

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.preference.PreferenceManager
import com.sixhandsapps.simpleeld.PREFERENCES_TOKEN
import com.sixhandsapps.simpleeld.getPreferences

class SplashActivity: BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val token = getPreferences().getString(PREFERENCES_TOKEN, null)
        if (token == null) {
            startActivity(Intent(this, LogInActivity::class.java))
            finish()
        } else {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }
    }

}