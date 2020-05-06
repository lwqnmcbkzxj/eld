package com.sixhandsapps.simpleeld.viewmodel

import android.app.Application
import androidx.lifecycle.*
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.getCompanyId
import com.sixhandsapps.simpleeld.getDate
import com.sixhandsapps.simpleeld.getToken
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.ShippingDocument
import com.sixhandsapps.simpleeld.model.Trailer

class ProfileViewModel constructor(application: Application) :
    AndroidViewModel(application) {

    private val token = getToken()

    val userVehicles = DataRepository.getUserVehicles(token)
    val trailers = DataRepository.getTrailers(token, getDate())
    val shipDocuments = DataRepository.getShipDocuments(token, getDate())
    val company = DataRepository.getCompany(token, getCompanyId())
    val user = DataRepository.getUser(token)

    private val addTrailerName = MutableLiveData<String>()
    val trailerAdded: LiveData<ApiResponse<Trailer>>

    private val editTrailerData = MutableLiveData<Pair<Int, String>>()
    val trailerEdited: LiveData<ApiResponse<Trailer>>

    private val deleteTrailerId = MutableLiveData<Int>()
    val trailerDeleted: LiveData<ApiResponse<Int>>

    private val addShipDocName = MutableLiveData<String>()
    val shipDocAdded: LiveData<ApiResponse<ShippingDocument>>

    private val deleteShipDocId = MutableLiveData<Int>()
    val shipDocDeleted: LiveData<ApiResponse<Int>>

    init {
        trailerAdded = Transformations.switchMap(addTrailerName) {
            DataRepository.addTrailer(token, it, getDate())
        }
        trailerEdited = Transformations.switchMap(editTrailerData) {
            DataRepository.editTrailer(token, it.first, it.second)
        }
        trailerDeleted = Transformations.switchMap(deleteTrailerId) { trailerId ->
            Transformations.map(DataRepository.deleteTrailer(token, trailerId)) {
                ApiResponse(it.status, trailerId, it.resultString, it.throwable)
            }
        }
        shipDocAdded = Transformations.switchMap(addShipDocName) {
            DataRepository.addShipDocument(token, it, getDate())
        }
        shipDocDeleted = Transformations.switchMap(deleteShipDocId) { shipDocId ->
            Transformations.map(DataRepository.deleteShipDocument(token, shipDocId)) {
                ApiResponse(it.status, shipDocId, it.resultString, it.throwable)
            }
        }
    }

    fun removeAllObservers(lifecycleOwner: LifecycleOwner) {
        userVehicles.removeObservers(lifecycleOwner)
        trailers.removeObservers(lifecycleOwner)
        company.removeObservers(lifecycleOwner)
        user.removeObservers(lifecycleOwner)
    }

    fun addTrailer(name: String) {
        addTrailerName.value = name
    }

    fun editTrailer(sessionTrailerId: Int, name: String) {
        editTrailerData.value = Pair(sessionTrailerId, name)
    }

    fun deleteTrailer(sessionTrailerId: Int) {
        deleteTrailerId.value = sessionTrailerId
    }

    fun addShipDoc(name: String) {
        addShipDocName.value = name
    }

    fun deleteShipDoc(id: Int) {
        deleteShipDocId.value = id
    }

    class Factory(val application: Application) : ViewModelProvider.AndroidViewModelFactory(application) {
        override fun <T : ViewModel?> create(modelClass: Class<T>): T {
            return ProfileViewModel(application) as T
        }
    }
}