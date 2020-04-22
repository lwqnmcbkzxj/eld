package com.sixhandsapps.simpleeld.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.LogIn

class LogInViewModel: ViewModel() {

    private val logIn = MutableLiveData<Pair<String, String>>()
    val logInResponse: LiveData<ApiResponse<LogIn>>

    init {
        logInResponse = Transformations.switchMap(logIn) {
            DataRepository.logIn(it.first, it.second)
        }
    }

    fun logIn(login: String, password: String) {
        logIn.value = Pair(login, password)
    }
}