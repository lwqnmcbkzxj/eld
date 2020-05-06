package com.sixhandsapps.simpleeld.viewmodel

import android.app.Application
import androidx.lifecycle.*
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.getDate
import com.sixhandsapps.simpleeld.getToken
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.Dvir
import com.sixhandsapps.simpleeld.model.DvirRequest
import com.sixhandsapps.simpleeld.serverDateFormat
import java.util.*

class DvirViewModel(application: Application) : AndroidViewModel(application) {

    val token = getToken()
    val dvirs = DataRepository.getDvirs(token, getDate())

    private val dvirRequest = MutableLiveData<DvirRequest>()
    val dvirAdded: LiveData<ApiResponse<Dvir>>

    private val deleteDvirId = MutableLiveData<Int>()
    val dvirDeleted: LiveData<ApiResponse<Int>>

    init {
        dvirAdded = Transformations.switchMap(dvirRequest) { req ->
            Transformations.map(DataRepository.addDvir(token, req)) {
                ApiResponse(
                    it.status,
                    it.result?.get("dvir_id")?.let { id ->
                        Dvir(
                            id,
                            null,
                            req.vehicleId,
                            1,
                            0,
                            if (req.hasDefects == 1) "HAS_DEFECTS" else "NO_DEFECTS",
                            serverDateFormat.format(
                                Date()
                            ),
                            req.location,
                            req.description
                        )
                    },
                    it.resultString,
                    it.throwable
                )
            }
        }
        dvirDeleted = Transformations.switchMap(deleteDvirId) { id ->
            Transformations.map(DataRepository.deleteDvir(token, id)) {
                ApiResponse(it.status, id, it.resultString, it.throwable)
            }
        }
    }

    fun addDvir(dvirRequest: DvirRequest) {
        this.dvirRequest.postValue(dvirRequest)
    }

    fun deleteDvir(id: Int) {
        this.deleteDvirId.value = id
    }

    class Factory(val application: Application) :
        ViewModelProvider.AndroidViewModelFactory(application) {
        override fun <T : ViewModel?> create(modelClass: Class<T>): T {
            return DvirViewModel(application) as T
        }
    }
}