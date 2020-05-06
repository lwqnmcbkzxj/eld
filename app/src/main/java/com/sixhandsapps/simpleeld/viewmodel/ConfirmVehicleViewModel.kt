package com.sixhandsapps.simpleeld.viewmodel

import android.app.Application
import androidx.lifecycle.*
import com.sixhandsapps.simpleeld.*
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.model.ApiResponse

public class ConfirmVehicleViewModel : AndroidViewModel {

    public constructor(application: Application) : super(application)

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

    class Factory(val application: Application) : ViewModelProvider.AndroidViewModelFactory(application) {
        override fun <T : ViewModel?> create(modelClass: Class<T>): T {
            return ConfirmVehicleViewModel(application) as T
        }
    }
}