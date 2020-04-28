package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

data class Trailer(
    @SerializedName("session_trailer_id") val sessionTrailerId: Int,
    @SerializedName("session_id") val sessionId: Int,
    @SerializedName("trailer_id") val trailerId: Int,
    @SerializedName("trailer_external_id") val trailerExternalId: Int,
    @SerializedName("session_trailer_status") val sessionTrailerStatus: Int
)