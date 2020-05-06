package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class LogIn(
    val login: String,
    val token: String,
    @SerializedName("role_id") val roleId: Int,
    @SerializedName("company_id") val companyId: Int,
    @SerializedName("session_id") val sessionId: Int?
)