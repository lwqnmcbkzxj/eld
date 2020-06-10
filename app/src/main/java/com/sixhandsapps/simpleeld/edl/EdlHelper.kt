package com.sixhandsapps.simpleeld.edl

import android.content.Context
import androidx.lifecycle.MutableLiveData
import com.iosix.eldblelib.*
import com.sixhandsapps.simpleeld.EldException
import com.sixhandsapps.simpleeld.Event
import java.lang.Exception
import java.util.*

class EdlHelper(appContext: Context, apiKey: String) {
    val scanResultLiveData = MutableLiveData<Event<Boolean>>()

    private val eldManager: EldManager = EldManager.GetEldManager(appContext, apiKey)

    private val bleConnectionStateChangeCallback = object : EldBleConnectionStateChangeCallback() {
        override fun onConnectionStateChange(newState: Int) {
            // TODO: как-то обрабатывать
            // BluetoothProfile.STATE_DISCONNECTED, BluetoothProfile.STATE_CONNECTED
        }
    }

    private val bleDataCallback = object : EldBleDataCallback() {
        override fun OnDataRecord(dataRec: EldBroadcast?, recordType: EldBroadcastTypes?) {
            recordType?.let {
                dataRec?.let {
                    when (recordType) {
                        EldBroadcastTypes.ELD_DATA_RECORD -> handleDataRecord(dataRec as EldDataRecord)
                    }
                }
            }
        }
    }

    private val bleScanCallbackList = object : EldBleScanCallback() {
        override fun onScanResult(device: String?) {
            device?.let {
                handleEdlScanResult(device)
            } ?: run {
                onNoEdlFound()
            }
        }

        override fun onScanResult(scanList: ArrayList<EldScanObject>?) {
            scanList?.let {
                if (scanList.isNotEmpty()) {
                    handleEdlScanResult(scanList[0].deviceId)
                } else {
                    onNoEdlFound()
                }
            } ?: run {
                onNoEdlFound()
            }
        }
    }

    private fun handleEdlScanResult(device: String) {
         eldManager.ConnectToELd(
            bleDataCallback,
            EnumSet.of(
                EldBroadcastTypes.ELD_BUFFER_RECORD,
                EldBroadcastTypes.ELD_CACHED_RECORD,
                EldBroadcastTypes.ELD_FUEL_RECORD,
                EldBroadcastTypes.ELD_DATA_RECORD,
                EldBroadcastTypes.ELD_DRIVER_BEHAVIOR_RECORD,
                EldBroadcastTypes.ELD_ENGINE_PARAMETERS_RECORD
            ),
            bleConnectionStateChangeCallback,
            device
        )

        scanResultLiveData.postValue(Event.success(true))
    }

    private fun handleDataRecord(dataRecord: EldDataRecord) {
        val lat = dataRecord.lattitude
        val lon = dataRecord.longitude
        val odometer = dataRecord.odometer
        val engineHours = dataRecord.engineHours
        val speed = dataRecord.speed
        val engineState = dataRecord.engineState

        // TODO: обрабатывать данные
    }

    private fun onNoEdlFound() {
        scanResultLiveData.postValue(Event.success(false))
    }

    fun scanForElds() {
        try {
            val error = eldManager.ScanForEld(bleScanCallbackList)

            when (error) {
                EldBleError.SUCCESS -> {
                }
                EldBleError.ELD_CONNECTED -> scanResultLiveData.postValue(Event.success(true))
                else -> scanResultLiveData.postValue(Event.error(EldException(error)))
            }
        } catch (e : Exception) {
            scanResultLiveData.postValue(Event.error(e))
        }
    }
}