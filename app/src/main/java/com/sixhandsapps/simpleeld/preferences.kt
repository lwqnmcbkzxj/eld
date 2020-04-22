package com.sixhandsapps.simpleeld

import android.content.Context
import androidx.preference.PreferenceManager

fun Context.getPreferences() = PreferenceManager.getDefaultSharedPreferences(this)!!

const val PREFERENCES_TOKEN = "token"
const val PREFERENCES_COMPANY_ID = "company_id"
const val PREFERENCES_VEHICLE_ID = "vehicle_id"