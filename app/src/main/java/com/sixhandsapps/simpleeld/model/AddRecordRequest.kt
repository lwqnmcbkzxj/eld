package com.sixhandsapps.simpleeld.model

class AddRecordRequest(
    val type: Int,
    val location: String,
    val remark: String,
    val startTime: Long,
    val endTime: Long
)