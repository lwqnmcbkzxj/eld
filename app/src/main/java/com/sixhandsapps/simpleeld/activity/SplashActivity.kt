package com.sixhandsapps.simpleeld.activity

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.lifecycle.Observer
import androidx.preference.PreferenceManager
import com.iosix.eldblelib.EldBleError
import com.sixhandsapps.simpleeld.Consts
import com.sixhandsapps.simpleeld.EldException
import com.sixhandsapps.simpleeld.PermissionUtils
import com.sixhandsapps.simpleeld.SimpleELDApp
import com.sixhandsapps.sixhandssocialnetwork.enums.Status


class SplashActivity: BaseActivity() {
    private val edlHelper = SimpleELDApp.appComponent.getEdlHelper()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        edlHelper.scanResultLiveData.observe(this, Observer {
            when (it.status) {
                Status.LOADING -> onEdlScanningInProgress()
                Status.SUCCESS -> onEdlScanningSuccess(it.data!!)
                Status.ERROR -> onEdlScanningError(it.error)
            }
        })

        val permissions = arrayOf(Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )

        if (PermissionUtils.hasPermissions(this, permissions)) {
            edlHelper.scanForElds()
        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                requestPermissions(permissions, Consts.RC_REQUEST_PERMISSIONS)
            }
        }
    }

    private fun launchApp() {
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

    private fun onEdlScanningInProgress() {
        // TODO: что-то показывать во время сканирования
    }

    private fun onEdlScanningSuccess(success: Boolean) {
        if (success) {
            launchApp()
        } else {
            // TODO: не найдено ниодного Edl устройства
        }
    }

    private fun onEdlScanningError(error: Throwable?) {
        (error as? EldException)?.let {
            if (error.edlBleError == EldBleError.BLUETOOTH_NOT_ENABLED) {
                val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
                startActivityForResult(enableBtIntent, Consts.RC_ENABLE_BT)
            }

            // TODO: обрабатывать как-то другие ошибки
        }

        error?.printStackTrace()
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        if (requestCode == Consts.RC_REQUEST_PERMISSIONS) {
            val granted = PermissionUtils.verifyPermissions(grantResults)

            if (granted) {
                edlHelper.scanForElds()
            } else {
                // TODO
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        when (requestCode) {
            Consts.RC_ENABLE_BT -> {
                if (resultCode == RESULT_OK) {
                    // Bluetooth включен
                    edlHelper.scanForElds()
                } else {
                    // Bluetooth не включен
                    // TODO
                }
            }
        }
    }

}