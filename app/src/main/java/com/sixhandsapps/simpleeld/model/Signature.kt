package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class Signature(
    @SerializedName("signature_id") val id: Int,
    @SerializedName("signature_dt") val date: String? = null,
    @SerializedName("signature_type") val type: String? = null,
    @SerializedName("session_id") val sessionId: String? = null
)