package com.sixhandsapps.simpleeld.data

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.google.gson.GsonBuilder
import com.google.gson.JsonElement
import com.google.gson.JsonNull
import com.sixhandsapps.simpleeld.model.*
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File

object DataRepository {

    private val gson = GsonBuilder().setLenient().create()
    private val apiService = Retrofit.Builder()
        .baseUrl("http://api.eld.sixhands.co/")
        .addConverterFactory(GsonConverterFactory.create(gson))
        .build()
        .create(ApiService::class.java)

    private fun <T : ApiResponse<V>, V> createCallback(liveData: MutableLiveData<ApiResponse<V>>) =
        object : Callback<T> {

            override fun onFailure(call: Call<T>, t: Throwable) {
                liveData.value = ApiResponse(throwable = t)
            }

            override fun onResponse(
                call: Call<T>,
                response: Response<T>
            ) {
//                val buffer = Buffer()
//                call.request().body()?.writeTo(buffer)
//                println(buffer)
                try {
                    liveData.value = response.toApiResponse()
                } catch (e: Exception) {
                    liveData.value = ApiResponse(throwable = e)
                }
            }
        }

    private fun <T : ApiResponse<V>, V> Response<T>.toApiResponse(): ApiResponse<V> =
        if (isSuccessful) {
            body() as T
        } else {
            val jsonElement = try {
                gson.fromJson(errorBody()!!.string(), JsonElement::class.java)
            } catch (_: Exception) {
                JsonNull.INSTANCE
            }
            if (jsonElement.isJsonObject) {
                val jsonObject = jsonElement.asJsonObject
                ApiResponse(
                    status = jsonObject.get("status").asInt,
                    resultString = jsonObject.get("result").asString
                )
            } else {
                ApiResponse(
                    resultString = code().toString()
                )
            }
        }

    fun logIn(login: String, password: String): LiveData<ApiResponse<LogIn>> {
        val liveData = MutableLiveData<ApiResponse<LogIn>>()
        apiService.logIn(login, password).enqueue(createCallback(liveData))
        return liveData
    }

    fun logOut(token: String): LiveData<ApiResponse<String>> {
        val liveData = MutableLiveData<ApiResponse<String>>()
        apiService.logOut(token).enqueue(createCallback(liveData))
        return liveData
    }

    fun getVehicles(token: String): LiveData<ApiResponse<List<Vehicle>>> {
        val liveData = MutableLiveData<ApiResponse<List<Vehicle>>>()
        apiService.getVehicles(token).enqueue(createCallback(liveData))
        return liveData
    }

    fun chooseVehicle(token: String, vehicleId: Int): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.chooseVehicle(token, vehicleId).enqueue(createCallback(liveData))
        return liveData
    }

    fun getUserVehicles(token: String): LiveData<ApiResponse<List<Vehicle>>> {
        val liveData = MutableLiveData<ApiResponse<List<Vehicle>>>()
        apiService.getUserVehicles(token).enqueue(createCallback(liveData))
        return liveData
    }

    fun getTrailers(token: String, date: String): LiveData<ApiResponse<List<Trailer>>> {
        val liveData = MutableLiveData<ApiResponse<List<Trailer>>>()
        apiService.getTrailers(token, date).enqueue(createCallback(liveData))
        return liveData
    }

    fun addTrailer(
        token: String,
        trailerName: String,
        date: String
    ): LiveData<ApiResponse<Trailer>> {
        val liveData = MutableLiveData<ApiResponse<Trailer>>()
        apiService.addTrailer(token, trailerName, date).enqueue(createCallback(liveData))
        return liveData
    }

    fun editTrailer(
        token: String,
        sessionTrailerId: Int,
        trailerName: String
    ): LiveData<ApiResponse<Trailer>> {
        val liveData = MutableLiveData<ApiResponse<Trailer>>()
        apiService.editTrailer(token, sessionTrailerId, trailerName)
            .enqueue(createCallback(liveData))
        return liveData
    }

    fun deleteShipDocument(
        token: String,
        id: Int
    ): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.deleteSDocument(token, id).enqueue(createCallback(liveData))
        return liveData
    }

    fun getShipDocuments(
        token: String,
        date: String
    ): LiveData<ApiResponse<List<ShippingDocument>>> {
        val liveData = MutableLiveData<ApiResponse<List<ShippingDocument>>>()
        apiService.getSDocuments(token, date).enqueue(createCallback(liveData))
        return liveData
    }

    fun addShipDocument(
        token: String,
        name: String,
        date: String
    ): LiveData<ApiResponse<ShippingDocument>> {
        val liveData = MutableLiveData<ApiResponse<ShippingDocument>>()
        apiService.addSDocument(token, name, date).enqueue(createCallback(liveData))
        return liveData
    }

    fun getRecords(
        token: String,
        date: String
    ): LiveData<ApiResponse<List<Record>>> {
        val liveData = MutableLiveData<ApiResponse<List<Record>>>()
        apiService.getRecords(token, date).enqueue(createCallback(liveData))
//        liveData.value = ApiResponse(
//            0,
//            listOf(
//                Record(0, "OFF_DUTY", 0, "", "", "2020-05-02T12:12:15.000Z", ""),
//                Record(0, "ON_DUTY", 0, "", "", "2020-05-02T15:12:15.000Z", "")
//            ),
//            null,
//            null
//        )
        return liveData
    }

    fun addRecord(
        token: String, recordRequest: AddRecordRequest
    ): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.addRecord(
            token,
            recordRequest.type,
            recordRequest.location,
            recordRequest.remark,
            recordRequest.startTime,
            recordRequest.endTime
        )
            .enqueue(createCallback(liveData))
        return liveData
    }

    fun editRecord(
        token: String,
        recordRequest: EditRecordRequest
    ): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.editRecord(
            token,
            recordRequest.recordId,
            recordRequest.location,
            recordRequest.remark
        ).enqueue(createCallback(liveData))
        return liveData
    }

    fun deleteTrailer(
        token: String,
        sessionTrailerId: Int
    ): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.deleteTrailer(token, sessionTrailerId).enqueue(createCallback(liveData))
        return liveData
    }

    fun getCompany(token: String, id: Int): LiveData<ApiResponse<Company>> {
        val liveData = MutableLiveData<ApiResponse<Company>>()
        apiService.getCompany(token, id).enqueue(createCallback(liveData))
        return liveData
    }

    fun getUser(token: String): LiveData<ApiResponse<User>> {
        val liveData = MutableLiveData<ApiResponse<User>>()
        apiService.getUser(token).enqueue(createCallback(liveData))
        return liveData
    }

    fun addDvir(token: String, dvirRequest: DvirRequest): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.addDvir(
            token,
            dvirRequest.vehicleId,
            RequestBody.create(null, dvirRequest.location),
            dvirRequest.hasDefects,
            RequestBody.create(null, dvirRequest.date),
            RequestBody.create(null, dvirRequest.description),
            MultipartBody.Part.createFormData(
                "signature",
                "signature.jpg",
                RequestBody.create(MediaType.parse("image/*"), dvirRequest.signature)
            )
        ).enqueue(createCallback(liveData))
        return liveData
    }

    fun deleteDvir(
        token: String,
        id: Int
    ): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.deleteDvir(token, id).enqueue(createCallback(liveData))
        return liveData
    }

    fun getDvirs(token: String, date: String): LiveData<ApiResponse<List<Dvir>>> {
        val liveData = MutableLiveData<ApiResponse<List<Dvir>>>()
        apiService.getDvirs(token, date).enqueue(createCallback(liveData))
        return liveData
    }

    fun addSignature(
        token: String,
        signature: File,
        date: String
    ): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.addSignature(
            token,
            RequestBody.create(null, date),
            MultipartBody.Part.createFormData(
                "signature",
                "signature.jpg",
                RequestBody.create(MediaType.parse("multipart/form-data"), signature)
            )
        ).enqueue(createCallback(liveData))
        return liveData
    }

    fun getSignature(token: String, date: String): LiveData<ByteArray> {
        val liveData = MutableLiveData<ByteArray>()
        apiService.getSignature(token, date).enqueue(object : Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {

            }

            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    liveData.value = response.body()!!.bytes()
                }
            }
        })
        return liveData
    }

    fun getSignatures(token: String, date: String): LiveData<ApiResponse<List<Signature>>> {
        val liveData = MutableLiveData<ApiResponse<List<Signature>>>()
        apiService.getSignatures(token, date).enqueue(createCallback(liveData))
        return liveData
    }

    fun deleteSignature(token: String, id: Int): LiveData<ApiResponse<Map<String, Int>>> {
        val liveData = MutableLiveData<ApiResponse<Map<String, Int>>>()
        apiService.deleteSignature(token, id).enqueue(createCallback(liveData))
        return liveData
    }

    fun getLogs(token: String, date: String): LiveData<ApiResponse<List<Log>>> {
        val liveData = MutableLiveData<ApiResponse<List<Log>>>()
        apiService.getLogs(
            token,
            date
        ).enqueue(createCallback(liveData))
        return liveData
    }
}