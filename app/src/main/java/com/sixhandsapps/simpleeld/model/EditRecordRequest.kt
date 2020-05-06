package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class EditRecordRequest(
    @SerializedName("record_id") val recordId: Int,
    val location: String,
    val remark: String
)