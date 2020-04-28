package com.sixhandsapps.simpleeld.activity

import android.content.Intent
import android.os.Bundle
import com.sixhandsapps.simpleeld.PREFERENCES_VEHICLE_ID
import com.sixhandsapps.simpleeld.getPreferences

class SplashActivity: BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val token = getPreferences().getInt(PREFERENCES_VEHICLE_ID, -1)
        if (token == -1) {
            startActivity(Intent(this, LogInActivity::class.java))
            finish()
        } else {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }
    }

}