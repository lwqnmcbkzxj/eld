package com.sixhandsapps.simpleeld

import com.iosix.eldblelib.EldBleError
import java.lang.Exception

class EldException(val edlBleError: EldBleError): Exception(edlBleError.description) {
}