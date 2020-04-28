package com.sixhandsapps.simpleeld.data

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonElement
import com.sixhandsapps.simpleeld.model.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

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
                liveData.value = response.toApiResponse()
            }
        }

    private fun <T : ApiResponse<V>, V> Response<T>.toApiResponse(): ApiResponse<V> =
        if (isSuccessful) {
            body() as T
        } else {
            val jsonElement = gson.fromJson(errorBody()!!.string(), JsonElement::class.java)
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

    fun getTrailers(token: String): LiveData<ApiResponse<List<Trailer>>> {
        val liveData = MutableLiveData<ApiResponse<List<Trailer>>>()
        apiService.getTrailers(token).enqueue(createCallback(liveData))
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
}