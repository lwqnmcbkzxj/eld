package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class User(
    @SerializedName("user_id") val id: Int,
    @SerializedName("user_remark") val remark: String
)