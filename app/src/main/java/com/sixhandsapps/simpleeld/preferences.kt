package com.sixhandsapps.simpleeld

import android.content.Context
import androidx.preference.PreferenceManager

fun Context.getPreferences() = PreferenceManager.getDefaultSharedPreferences(this)

const val PREFERENCES_TOKEN = "token"