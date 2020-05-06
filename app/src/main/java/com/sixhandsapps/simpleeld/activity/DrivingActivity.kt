package com.sixhandsapps.simpleeld.activity

import android.os.Bundle
import android.os.Handler
import android.view.View
import android.widget.TextView
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.Status
import com.sixhandsapps.simpleeld.fragment.*
import kotlinx.android.synthetic.main.activity_driving.*
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit
import kotlin.concurrent.schedule

class DrivingActivity : BaseActivity() {

    lateinit var timerTask: TimerTask

    override fun onDestroy() {
        super.onDestroy()
        timerTask.cancel()
    }

    val handler = Handler()

    private val dateFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_driving)

        timerTask = Timer().schedule(0, 1000) {
            handler.post {
                timeTextView.text = dateFormat.format(Date())
                if ((status == Status.ON_DUTY || status == Status.DRIVING || status == Status.ON_DUTY_YARD_PARKING) && cycleTime > 0) {
                    cyclePieChart.value = cycleTime.also {
                        updateTimerTextView(cycleTextView, it)
                    }
                }
                if (status != null) {
                    if (breakTime >= 0) {
                        breakPieChart.value =
                            breakTime.also {
                                updateTimerTextView(breakTextView, it)
                            }
                    }
                    if (shiftTime >= 0) {
                        shiftPieChart.value =
                            shiftTime.also {
                                updateTimerTextView(shiftTextView, it)
                            }
                    }
                }
                if (drivingTime >= 0) {
                    drivingPieChart.value =
                        drivingTime.also {
                            updateTimerTextView(drivingTextView, it)
                        }
                } else {
                    finish()
                }
                TimeUnit.MILLISECONDS.toMinutes(drivingTime).let {
                    if (it < 60) {
                        attention.visibility = View.VISIBLE
                        drivingTimeTextView.text = "You have $it min\nfor driving"
                    } else {
                        attention.visibility = View.INVISIBLE
                    }
                }
            }
        }
        breakPieChart.max = breakMaxTime
        breakPieChart.value = breakTime
        updateTimerTextView(breakTextView, breakTime)

        drivingPieChart.max = drivingMaxTime
        drivingPieChart.value = drivingTime
        updateTimerTextView(drivingTextView, drivingTime)

        shiftPieChart.max = shiftMaxTime
        shiftPieChart.value = shiftTime
        updateTimerTextView(shiftTextView, shiftTime)

        cyclePieChart.max = cycleMaxTime
        cyclePieChart.value = cycleTime
        updateTimerTextView(cycleTextView, cycleTime)

        cancelButton.setOnClickListener {
            status = null
            finish()
        }
    }

    private fun updateTimerTextView(textView: TextView, value: Long) {
        textView.text = "${String.format(
            "%02d",
            TimeUnit.MILLISECONDS.toHours(value)
        )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(value) % 60)}"
    }
}

