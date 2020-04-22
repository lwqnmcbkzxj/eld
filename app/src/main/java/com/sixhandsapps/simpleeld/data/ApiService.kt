package com.sixhandsapps.simpleeld.data

import com.google.gson.JsonObject
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.LogIn
import com.sixhandsapps.simpleeld.model.Vehicle
import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    @FormUrlEncoded
    @POST("auth/login")
    fun logIn(
        @Field("user_login") login: String,
        @Field("user_password") password: String
    ): Call<ApiResponse<LogIn>>

    @GET("vehicle/get/{company_id}")
    fun getVehicles(
        @Header("token") token: String,
        @Path("company_id") companyId: Int
    ): Call<ApiResponse<List<Vehicle>>>
}