package com.sixhandsapps.simpleeld.data

import com.google.gson.JsonObject
import com.sixhandsapps.simpleeld.model.ApiResponse
import com.sixhandsapps.simpleeld.model.LogIn
import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface ApiService {

    @FormUrlEncoded
    @POST("auth/login")
    fun logIn(
        @Field("user_login") login: String,
        @Field("user_password") password: String
    ): Call<ApiResponse<LogIn>>
}