package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class Dvir(
    @SerializedName("dvir_id") val id: Int,
    @SerializedName("session_id") val sessionId: Int?,
    @SerializedName("vehicle_id") val vehicleId: Int,
    @SerializedName("has_driver_signature") val hasDriverSignature: Int,
    @SerializedName("has_mechanics_signature") val hasMechanicSignature: Int,
    @SerializedName("dvir_deffects_status") val defectsStatus: String,
    @SerializedName("dvir_created_dt") val date: String,
    @SerializedName("dvir_location") val location: String,
    @SerializedName("dvir_description") val description: String
)