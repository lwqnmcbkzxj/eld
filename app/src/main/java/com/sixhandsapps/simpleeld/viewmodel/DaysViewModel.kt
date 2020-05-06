package com.sixhandsapps.simpleeld.viewmodel

import android.annotation.SuppressLint
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.getDate
import com.sixhandsapps.simpleeld.getToken
import java.text.SimpleDateFormat
import java.util.*

class DaysViewModel(application: Application) : AndroidViewModel(application) {

    @SuppressLint("SimpleDateFormat")
    val dateFormat = SimpleDateFormat("yyyy-MM-dd")
    val date = dateFormat.format(Date())

    val logs = DataRepository.getLogs(getToken(), date)
    val records = DataRepository.getRecords(getToken(), date)

    class Factory(val application: Application) :
        ViewModelProvider.AndroidViewModelFactory(application) {
        override fun <T : ViewModel?> create(modelClass: Class<T>): T {
            return DaysViewModel(application) as T
        }
    }

}