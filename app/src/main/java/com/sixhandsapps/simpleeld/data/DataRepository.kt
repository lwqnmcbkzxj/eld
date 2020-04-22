package com.sixhandsapps.simpleeld.data

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.reflect.TypeToken
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.LogIn
import com.sixhandsapps.simpleeld.model.Vehicle
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object DataRepository {

    private val gson = Gson()
    private val apiService = Retrofit.Builder()
        .baseUrl("http://api.eld.sixhands.co/")
        .addConverterFactory(GsonConverterFactory.create(gson))
        .build()
        .create(ApiService::class.java)

    fun logIn(login: String, password: String): LiveData<ApiResponse<LogIn>> {
        val liveData = MutableLiveData<ApiResponse<LogIn>>()

        apiService.logIn(login, password).enqueue(object : Callback<ApiResponse<LogIn>> {

            override fun onFailure(call: Call<ApiResponse<LogIn>>, t: Throwable) {
                liveData.value = ApiResponse(throwable = t)
            }

            override fun onResponse(
                call: Call<ApiResponse<LogIn>>,
                response: Response<ApiResponse<LogIn>>
            ) {
                if (response.isSuccessful) {
                    liveData.value = response.body()!!
                } else {
                    val jsonObject = gson.fromJson(response.errorBody()!!.string(), JsonObject::class.java)
                    liveData.value = ApiResponse(
                        status = jsonObject.get("status").asInt,
                        resultString = jsonObject.get("result").asString
                    )
                }
            }
        })

        return liveData
    }

    fun getVehicles(token: String, companyId: Int): LiveData<ApiResponse<List<Vehicle>>>  {
        val liveData = MutableLiveData<ApiResponse<List<Vehicle>>>()

        apiService.getVehicles(token, companyId).enqueue(object : Callback<ApiResponse<List<Vehicle>>> {

            override fun onFailure(call: Call<ApiResponse<List<Vehicle>>>, t: Throwable) {
                liveData.value = ApiResponse(throwable = t)
            }

            override fun onResponse(
                call: Call<ApiResponse<List<Vehicle>>>,
                response: Response<ApiResponse<List<Vehicle>>>
            ) {
                if (response.isSuccessful) {
                    liveData.value = response.body()!!
                } else {
                    val jsonObject = gson.fromJson(response.errorBody()!!.string(), JsonObject::class.java)
                    liveData.value = ApiResponse(
                        status = jsonObject.get("status").asInt,
                        resultString = jsonObject.get("result").asString
                    )
                }
            }
        })

        return liveData
    }

}