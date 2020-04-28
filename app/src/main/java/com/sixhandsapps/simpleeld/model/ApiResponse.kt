package com.sixhandsapps.simpleeld.model

data class ApiResponse<T>(
    val status: Int? = null,
    val result: T? = null,
    val resultString: String? = null,
    val throwable: Throwable? = null
)