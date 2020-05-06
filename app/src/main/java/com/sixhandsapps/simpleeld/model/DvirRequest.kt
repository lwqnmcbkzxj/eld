package com.sixhandsapps.simpleeld.model

import java.io.File

class DvirRequest(
    val vehicleId: Int,
    val location: String,
    val hasDefects: Int,
    val date: String,
    val description: String,
    val signature: File
)