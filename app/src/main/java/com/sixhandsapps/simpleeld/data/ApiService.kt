package com.sixhandsapps.simpleeld.data

import com.sixhandsapps.simpleeld.model.*
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    @FormUrlEncoded
    @POST("auth/login")
    fun logIn(
        @Field("user_login") login: String,
        @Field("user_password") password: String
    ): Call<ApiResponse<LogIn>>

    @POST("auth/logout")
    fun logOut(
        @Header("token") token: String
    ): Call<ApiResponse<String>>

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

    @GET("trailer/get/{date}")
    fun getTrailers(
        @Header("token") token: String, @Path("date") date: String
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

    @FormUrlEncoded
    @POST("trailer/add")
    fun addTrailer(
        @Header("token") token: String,
        @Field("trailer_name") trailerName: String,
        @Field("date") date: String
    ): Call<ApiResponse<Trailer>>

    @FormUrlEncoded
    @PATCH("trailer/edit")
    fun editTrailer(
        @Header("token") token: String,
        @Field("session_trailer_id") sessionTrailerId: Int,
        @Field("new_name") trailerName: String
    ): Call<ApiResponse<Trailer>>

    @FormUrlEncoded
    @HTTP(method = "DELETE", path = "trailer/delete", hasBody = true)
    fun deleteTrailer(
        @Header("token") token: String,
        @Field("session_trailer_id") sessionTrailerId: Int
    ): Call<ApiResponse<Map<String, Int>>>

    @GET("sdocument/get/{date}")
    fun getSDocuments(
        @Header("token") token: String, @Path("date") date: String
    ): Call<ApiResponse<List<ShippingDocument>>>

    @FormUrlEncoded
    @POST("sdocument/add")
    fun addSDocument(
        @Header("token") token: String,
        @Field("shipping_document_name") name: String,
        @Field("date") date: String
    ): Call<ApiResponse<ShippingDocument>>

    @FormUrlEncoded
    @HTTP(method = "DELETE", path = "sdocument/delete", hasBody = true)
    fun deleteSDocument(
        @Header("token") token: String,
        @Field("session_shipping_document_id") id: Int
    ): Call<ApiResponse<Map<String, Int>>>

    @Multipart
    @POST("dvir/add")
    fun addDvir(
        @Header("token") token: String,
        @Part("vehicle_id") vehicleId: Int,
        @Part("location") location: RequestBody,
        @Part("has_defects") hasDefects: Int,
        @Part("date") date: RequestBody,
        @Part("description") description: RequestBody,
        @Part signature: MultipartBody.Part
    ): Call<ApiResponse<Map<String, Int>>>

    @FormUrlEncoded
    @HTTP(method = "DELETE", path = "dvir/delete", hasBody = true)
    fun deleteDvir(
        @Header("token") token: String,
        @Field("dvir_id") id: Int
    ): Call<ApiResponse<Map<String, Int>>>

    @GET("dvir/get/{date}")
    fun getDvirs(@Header("token") token: String, @Path("date") date: String): Call<ApiResponse<List<Dvir>>>

    @Multipart
    @POST("user/upload-signature")
    fun addSignature(
        @Header("token") token: String,
        @Part("date") date: RequestBody,
        @Part signature: MultipartBody.Part
    ): Call<ApiResponse<Map<String, Int>>>

    @GET("user/get-signature/{date}")
    fun getSignature(
        @Header("token") token: String,
        @Path("date") date: String
    ): Call<ResponseBody>

    @GET("signature/get/{date}")
    fun getSignatures(
        @Header("token") token: String,
        @Path("date") date: String
    ): Call<ApiResponse<List<Signature>>>

    @FormUrlEncoded
    @HTTP(method = "DELETE", path = "signature/delete", hasBody = true)
    fun deleteSignature(
        @Header("token") token: String,
        @Field("signature_id") id: Int
    ): Call<ApiResponse<Map<String, Int>>>

    @FormUrlEncoded
    @POST("record/add")
    fun addRecord(
        @Header("token") token: String,
        @Field("type") type: Int,
        @Field("location") location: String,
        @Field("remark") remark: String,
        @Field("start_time") startTime: Long,
        @Field("end_time") endTime: Long
    ): Call<ApiResponse<Map<String, Int>>>

    @GET("record/get/{date}")
    fun getRecords(
        @Header("token") token: String,
        @Path("date") date: String
    ): Call<ApiResponse<List<Record>>>

    @FormUrlEncoded
    @PATCH("record/edit")
    fun editRecord(
        @Header("token") token: String,
        @Field("record_id") recordId: Int,
        @Field("location") location: String,
        @Field("remark") remark: String
    ): Call<ApiResponse<Map<String, Int>>>

    @GET("logs/get/{date}/15")
    fun getLogs(
        @Header("token") token: String,
        @Path("date") date: String
    ): Call<ApiResponse<List<Log>>>
}