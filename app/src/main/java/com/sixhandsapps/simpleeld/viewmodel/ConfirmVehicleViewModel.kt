package com.sixhandsapps.simpleeld.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.sixhandsapps.simpleeld.PREFERENCES_COMPANY_ID
import com.sixhandsapps.simpleeld.PREFERENCES_TOKEN
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.getPreferences

class ConfirmVehicleViewModel(application: Application) : AndroidViewModel(application) {

    val vehicles = DataRepository.getVehicles(
        application.getPreferences().getString(PREFERENCES_TOKEN, null)!!,
        application.getPreferences().getInt(PREFERENCES_COMPANY_ID, -1)
    )
}