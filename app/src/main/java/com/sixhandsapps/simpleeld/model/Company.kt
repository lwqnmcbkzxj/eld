package com.sixhandsapps.simpleeld.model

import com.google.gson.annotations.SerializedName

class Company(
    @SerializedName("company_id") val id: Int,
    @SerializedName("company_short_name") val shortName: String,
    @SerializedName("company_long_name") val longName: String,
    @SerializedName("company_home_terminal_address") val homeTerminalAddress: String,
    @SerializedName("company_main_office_address") val mainOfficeAddress: String
)