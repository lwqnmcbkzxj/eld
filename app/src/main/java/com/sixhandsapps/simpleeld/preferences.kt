package com.sixhandsapps.simpleeld

import android.content.Context
import androidx.fragment.app.Fragment
import androidx.lifecycle.AndroidViewModel
import androidx.preference.PreferenceManager

const val PREFERENCES_TOKEN = "token"
const val PREFERENCES_SELECTED_DATE = "date"
const val PREFERENCES_COMPANY_ID = "company_id"
const val PREFERENCES_VEHICLE_ID = "vehicle_id"
const val PREFERENCES_HAS_SIGNATURE = "has_signature"

fun Context.getPreferences() = PreferenceManager.getDefaultSharedPreferences(this)!!
fun Fragment.getPreferences() = requireContext().getPreferences()

fun AndroidViewModel.getToken() = PreferenceManager.getDefaultSharedPreferences(getApplication())
    .getString(PREFERENCES_TOKEN, null)!!

fun AndroidViewModel.getCompanyId() =
    PreferenceManager.getDefaultSharedPreferences(getApplication())
        .getInt(PREFERENCES_COMPANY_ID, -1)

fun AndroidViewModel.getDate() =
    PreferenceManager.getDefaultSharedPreferences(getApplication())
        .getString(PREFERENCES_SELECTED_DATE, null)!!