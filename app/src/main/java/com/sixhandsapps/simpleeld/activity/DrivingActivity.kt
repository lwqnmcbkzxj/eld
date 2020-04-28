package com.sixhandsapps.simpleeld.activity

import android.os.Bundle
import com.sixhandsapps.simpleeld.R
import kotlinx.android.synthetic.main.activity_driving.*
import java.util.concurrent.TimeUnit

class DrivingActivity: BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_driving)

        val breakValue = TimeUnit.MINUTES.toMillis(60)
        val drivingValue = TimeUnit.MINUTES.toMillis(45)
        val shiftValue = TimeUnit.MINUTES.toMillis(30)
        val cycleValue = TimeUnit.SECONDS.toMillis(590)

        breakPieChart.max = TimeUnit.HOURS.toMillis(1)
        drivingPieChart.max = TimeUnit.HOURS.toMillis(1)
        shiftPieChart.max = TimeUnit.HOURS.toMillis(1)
        cyclePieChart.max = TimeUnit.HOURS.toMillis(1)

        breakPieChart.value = breakValue
        drivingPieChart.value = drivingValue
        shiftPieChart.value = shiftValue
        cyclePieChart.value = cycleValue

        breakTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toMinutes(breakValue)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toSeconds(breakValue) % 60)}"
        drivingTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toMinutes(drivingValue)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toSeconds(drivingValue) % 60)}"
        shiftTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toMinutes(shiftValue)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toSeconds(shiftValue) % 60)}"
        cycleTextView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toMinutes(cycleValue)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toSeconds(cycleValue) % 60)}"
    }

}