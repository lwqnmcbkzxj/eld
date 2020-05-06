package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class Trailer(
    @SerializedName("session_trailer_id") val sessionTrailerId: Int,
    @SerializedName("session_id") val sessionId: Int,
    @SerializedName("trailer_id") val trailerId: Int,
    @SerializedName("trailer_external_id") val trailerExternalId: String,
    @SerializedName("new_external_trailer_id") val newTrailerExternalId: String,
    @SerializedName("session_trailer_status") val sessionTrailerStatus: String
)