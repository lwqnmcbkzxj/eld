package com.sixhandsapps.simpleeld.viewmodel

import android.app.Application
import androidx.lifecycle.*
import com.sixhandsapps.simpleeld.data.DataRepository
import com.sixhandsapps.simpleeld.getDate
import com.sixhandsapps.simpleeld.getToken
import com.sixhandsapps.simpleeld.model.AddRecordRequest
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.EditRecordRequest
import com.sixhandsapps.simpleeld.model.Record
import com.sixhandsapps.simpleeld.serverDateFormat
import java.util.*

class LogsViewModel(application: Application) : AndroidViewModel(application) {

    val records = DataRepository.getRecords(getToken(), getDate())

    private val addRecordRequest = MutableLiveData<AddRecordRequest>()
    val recordAdded: LiveData<ApiResponse<Record>>

    private val editRecordRequest = MutableLiveData<EditRecordRequest>()
    val recordEdited: LiveData<ApiResponse<Record>>

    init {
        recordAdded = Transformations.switchMap(addRecordRequest) { req ->
            Transformations.map(DataRepository.addRecord(getToken(), req)) {
                ApiResponse(
                    it.status, it.result?.get("record_id")?.let { id ->
                        Record(
                            id,
                            when (req.type) {
                                1 -> "OFF_DUTY"
                                2 -> "DRIVING"
                                3 -> "ON_DUTY"
                                4 -> "SLEEPER"
                                5 -> "ON_DUTY_YM"
                                6 -> "OFF_DUTY_PC"
                                else -> ""
                            },
                            0,
                            req.location,
                            req.remark,
                            serverDateFormat.format(Date(req.startTime - TimeZone.getDefault().rawOffset)),
                            serverDateFormat.format(Date(req.endTime - TimeZone.getDefault().rawOffset))
                        )
                    }, it.resultString, it.throwable
                )
            }
        }
        recordEdited = Transformations.switchMap(editRecordRequest) { req ->
            Transformations.map(DataRepository.editRecord(getToken(), req)) {
                ApiResponse(
                    it.status, it.result?.get("record_id")?.let { id ->
                        Record(
                            id,
                            null,
                            0,
                            req.location,
                            req.remark,
                            "",
                            ""
                        )
                    }, it.resultString, it.throwable
                )
            }
        }
    }

    fun addRecord(record: AddRecordRequest) {
        addRecordRequest.value = record
    }

    fun editRecord(record: EditRecordRequest) {
        editRecordRequest.value = record
    }

    class Factory(val application: Application) :
        ViewModelProvider.AndroidViewModelFactory(application) {
        override fun <T : ViewModel?> create(modelClass: Class<T>): T {
            return LogsViewModel(application) as T
        }
    }
}