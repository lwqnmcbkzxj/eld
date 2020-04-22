package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class Vehicle(
    @SerializedName("vehicle_id") val id: Int,
    @SerializedName("vehicle_sn") val serialNumber: String,
    @SerializedName("vehicle_issue_year") val year: Int,
    @SerializedName("vehicle_status") val status: String,
    @SerializedName("vehicle_make_name") val manufacturer: String,
    @SerializedName("vehicle_model_name") val model: String,
    @SerializedName("is_reserved") val isReserved: Int
)