package com.sixhandsapps.simpleeld.data

import com.sixhandsapps.simpleeld.model.*
import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    @FormUrlEncoded
    @POST("auth/login")
    fun logIn(
        @Field("user_login") login: String,
        @Field("user_password") password: String
    ): Call<ApiResponse<LogIn>>

    @GET("vehicle/get")
    fun getVehicles(
        @Header("token") token: String
    ): Call<ApiResponse<List<Vehicle>>>

    @FormUrlEncoded
    @POST("vehicle/choose")
    fun chooseVehicle(
        @Header("token") token: String,
        @Field("vehicle_id") vehicleId: Int
    ): Call<ApiResponse<Map<String, Int>>>

    @GET("user/today-vehicles")
    fun getUserVehicles(
        @Header("token") token: String
    ): Call<ApiResponse<List<Vehicle>>>

    @GET("trailer/get")
    fun getTrailers(
        @Header("token") token: String
    ): Call<ApiResponse<List<Trailer>>>

    @GET("company/info/{id}")
    fun getCompany(
        @Header("token") token: String,
        @Path("id") id: Int
    ): Call<ApiResponse<Company>>

    @GET("user/info")
    fun getUser(
        @Header("token") token: String
    ): Call<ApiResponse<User>>
}