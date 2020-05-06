package com.sixhandsapps.simpleeld.viewmodel

import android.app.Application
import androidx.lifecycle.*
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.getDate
import com.sixhandsapps.simpleeld.getToken
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.Signature
import java.io.File

class SignatureViewModel(application: Application) : AndroidViewModel(application) {

    private val token = getToken()
    val date = getDate()

    val signature = DataRepository.getSignature(token, date)
    val signatures = MediatorLiveData<ApiResponse<List<Signature>>>()

    private val addSignature = MutableLiveData<File>()
    val signatureUploaded: LiveData<ApiResponse<Map<String, Int>>>

    private val deleteSignature = MutableLiveData<Int>()
    val signatureDeleted: LiveData<ApiResponse<Map<String, Int>>>

    init {
        signatureUploaded = Transformations.switchMap(addSignature) {
            DataRepository.addSignature(token, it, date)
        }
        signatureDeleted = Transformations.switchMap(deleteSignature) {
            DataRepository.deleteSignature(token, it)
        }
        signatures.addSource(DataRepository.getSignatures(token, date), signatures::setValue)
    }

    fun deleteSignature(id: Int) {
        deleteSignature.value = id
    }

    fun setSignature(file: File) {
        addSignature.postValue(file)
    }

    class Factory(val application: Application) : ViewModelProvider.AndroidViewModelFactory(application) {
        override fun <T : ViewModel?> create(modelClass: Class<T>): T {
            return SignatureViewModel(application) as T
        }
    }
}