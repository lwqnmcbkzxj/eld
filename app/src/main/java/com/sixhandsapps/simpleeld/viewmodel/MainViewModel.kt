package com.sixhandsapps.simpleeld.viewmodel

import android.annotation.SuppressLint
import android.app.Application
import androidx.lifecycle.*
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.getDate
import com.sixhandsapps.simpleeld.getToken
import com.sixhandsapps.simpleeld.model.ApiResponse
import java.text.SimpleDateFormat
import java.util.*

public class MainViewModel : AndroidViewModel {

    public constructor(application: Application) : super(application)

    private val logOutToken = MutableLiveData<String>()
    val logOut: LiveData<ApiResponse<String>>

    @SuppressLint("SimpleDateFormat")
    val dateFormat = SimpleDateFormat("yyyy-MM-dd")

    val logs = DataRepository.getLogs(getToken(), dateFormat.format(Date()))

    init {
        logOut = Transformations.switchMap(logOutToken) {
            DataRepository.logOut(it)
        }
    }

    fun logOut() {
        logOutToken.value = getToken()
    }

    class Factory(val application: Application) : ViewModelProvider.AndroidViewModelFactory(application) {
        override fun <T : ViewModel?> create(modelClass: Class<T>): T {
            return MainViewModel(application) as T
        }
    }
}