package com.sixhandsapps.simpleeld.activity

import android.content.Intent
import android.os.Bundle
import androidx.preference.PreferenceManager
import com.sixhandsapps.simpleeld.PREFERENCES_SELECTED_DATE
import com.sixhandsapps.simpleeld.PREFERENCES_TOKEN
import com.sixhandsapps.simpleeld.PREFERENCES_VEHICLE_ID
import com.sixhandsapps.simpleeld.getPreferences

class SplashActivity: BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val preferences = PreferenceManager.getDefaultSharedPreferences(this)!!
        val token = preferences.getString("token", null)
        val vehicleId = preferences.getInt("vehicle_id", -1)
        val date = preferences.getString("date", null)
        when {
            token == null -> {
                startActivity(Intent(this, LogInActivity::class.java))
                finish()
            }
            vehicleId == -1 -> {
                startActivity(Intent(this, ConfirmVehicleActivity::class.java))
                finish()
            }
            date == null -> {
                startActivity(Intent(this, LogsActivity::class.java))
                finish()
            }
            else -> {
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            }
        }
    }

}