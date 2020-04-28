package com.sixhandsapps.simpleeld.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ViewTreeLifecycleOwner
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.getCompanyId
import com.sixhandsapps.simpleeld.getToken

class ProfileViewModel(application: Application) : AndroidViewModel(application) {

    private val token = getToken()

    val userVehicles = DataRepository.getUserVehicles(token)
    val trailers = DataRepository.getTrailers(token)
    val company = DataRepository.getCompany(token, getCompanyId())
    val user = DataRepository.getUser(token)

    fun removeAllObservers(lifecycleOwner: LifecycleOwner) {
        userVehicles.removeObservers(lifecycleOwner)
        trailers.removeObservers(lifecycleOwner)
        company.removeObservers(lifecycleOwner)
        user.removeObservers(lifecycleOwner)
    }

}