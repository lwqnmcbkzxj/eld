package com.sixhandsapps.simpleeld.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import com.sixhandsapps.simpleeld.*
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.model.ApiResponse

class ConfirmVehicleViewModel(application: Application) : AndroidViewModel(application) {

    private val token = getToken()

    val vehicles = DataRepository.getVehicles(
        token
    )

    private val vehicleId = MutableLiveData<Int>()
    val chooseVehicleResponse: LiveData<ApiResponse<Map<String, Int>>>

    init {
        chooseVehicleResponse = Transformations.switchMap(vehicleId) {
            DataRepository.chooseVehicle(token, it)
        }
    }

    fun chooseVehicle(id: Int) {
        vehicleId.value = id
    }
}