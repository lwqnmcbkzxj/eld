package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class Log(
    val day: String,
    @SerializedName("has_inspection") val hasInspection: Int,
    @SerializedName("has_signature") val hasSignature: Int,
    @SerializedName("on_duty_seconds") val onDutySeconds: Long
)