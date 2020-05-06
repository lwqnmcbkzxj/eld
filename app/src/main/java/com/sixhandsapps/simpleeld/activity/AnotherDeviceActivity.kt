package com.sixhandsapps.simpleeld.activity

import android.content.Intent
import android.os.Bundle
import com.sixhandsapps.simpleeld.R
import kotlinx.android.synthetic.main.activity_another_device.*

class AnotherDeviceActivity: BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_another_device)

        returnButton.setOnClickListener {
            finish()
        }
        continueButton.setOnClickListener {
            startActivity(Intent(this, ConfirmVehicleActivity::class.java))
            finishAffinity()
        }
    }

}