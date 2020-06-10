package com.sixhandsapps.simpleeld

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build

class PermissionUtils {
    companion object {
        @JvmStatic
        fun verifyPermissions(grantResults: IntArray): Boolean {
            if (grantResults.isEmpty()) {
                return false
            }

            for (result in grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    return false
                }
            }

            return true
        }

        @JvmStatic
        fun hasPermissions(context: Context, permissions: Array<String>): Boolean {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                for (permission in permissions) {
                    if (context.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                        return false
                    }
                }
            }

            return true
        }
    }
}