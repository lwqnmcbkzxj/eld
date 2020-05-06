package com.sixhandsapps.simpleeld.activity

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.edit
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.RecyclerView
import com.sixhandsapps.simpleeld.*
import com.sixhandsapps.simpleeld.model.Log
import com.sixhandsapps.simpleeld.model.Record
import com.sixhandsapps.simpleeld.viewmodel.DaysViewModel
import kotlinx.android.synthetic.main.activity_logs.*
import kotlinx.android.synthetic.main.log_list_item.*
import kotlinx.android.synthetic.main.log_list_item.view.*
import kotlinx.android.synthetic.main.timeline.*
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

class LogsActivity : BaseActivity() {

    @SuppressLint("SimpleDateFormat")
    val dateFormat = SimpleDateFormat("yyyy-MM-dd")

    @SuppressLint("SimpleDateFormat")
    val dateFormat1 = SimpleDateFormat("MMM dd, EEEE", Locale.US)

    val viewModel by lazy {
        ViewModelProvider(this, DaysViewModel.Factory(application)).get(
            DaysViewModel::class.java
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_logs)

        today.setOnClickListener {
            getPreferences().edit(true) {
                putString(PREFERENCES_SELECTED_DATE, dateFormat.format(Date()))
            }
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }
        viewModel.logs.observe(this, Observer {
            handleResponse(it, {
                val last = it.last()
                dateTextView.text = dateFormat1.format(dateFormat.parse(last.day)!!)
                timeTextView.text = String.format(
                    "%02d:%02d",
                    TimeUnit.SECONDS.toHours(last.onDutySeconds),
                    TimeUnit.SECONDS.toMinutes(last.onDutySeconds) % 60
                )
                if (last.hasInspection == 1) {
                    statusImage.setImageResource(R.drawable.ic_done_with_bg)
                    statusText.text = "Inspection completed"
                } else {
                    statusImage.setImageResource(R.drawable.ic_none)
                    statusText.text = "No inspections"
                }
                if (last.hasSignature == 1) {
                    attentionImage.visibility = View.GONE
                } else {
                    attentionImage.visibility = View.VISIBLE
                }
                recyclerView.adapter = LogAdapter(it.subList(0, 14).reversed())
            })
        })
        viewModel.records.observe(this, Observer {
            handleResponse(it, {
                val records = filterRecords(it)
                val offDutyFullTime = getElapsedTime(records, "OFF_DUTY")
                offDutyTimeTextView.text = "${String.format(
                    "%02d",
                    TimeUnit.MILLISECONDS.toHours(offDutyFullTime)
                )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(offDutyFullTime) % 60)}"
                val sleeperFullTime = getElapsedTime(records, "SLEEPER")
                sleeperTime.text = "${String.format(
                    "%02d",
                    TimeUnit.MILLISECONDS.toHours(sleeperFullTime)
                )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(sleeperFullTime) % 60)}"
                val drivingFullTime = getElapsedTime(records, "DRIVING")
                drivingTimeView.text = "${String.format(
                    "%02d",
                    TimeUnit.MILLISECONDS.toHours(drivingFullTime)
                )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(drivingFullTime) % 60)}"
                val onDutyFullTime = getElapsedTime(records, "ON_DUTY")
                onDutyTime.text = "${String.format(
                    "%02d",
                    TimeUnit.MILLISECONDS.toHours(onDutyFullTime)
                )}:${String.format("%02d", TimeUnit.MILLISECONDS.toMinutes(onDutyFullTime) % 60)}"
                timeline.records = records
            }) {
                getPreferences().edit().clear().apply()
                startActivity(Intent(this, LogInActivity::class.java))
                finish()
            }
        })
    }

    fun filterRecords(records: List<Record>): List<Record> {
        return records.map {
            it.apply {
                if (type == "BREAK") {
                    type = "OFF_DUTY"
                }
            }
        }.apply {
            firstOrNull()?.let {
                val recordCalendar = Calendar.getInstance().apply {
                    time = serverDateFormat.parse(it.startTime)!!
                }
                val calendar = Calendar.getInstance()
                if (recordCalendar.get(Calendar.DAY_OF_YEAR) < calendar.get(Calendar.DAY_OF_YEAR)) {
                    it.startTime = serverDateFormat.format(recordCalendar.apply {
                        set(Calendar.SECOND, 0)
                        set(Calendar.MINUTE, 0)
                        set(Calendar.HOUR_OF_DAY, 24)
                    }.time)
                }
            }
        }.reversed()
    }

    private fun getElapsedTime(records: List<Record>, type: String): Long {
        var elapsedTime = 0L
        records.forEachIndexed { index, it ->
            if (it.type == type) {
                val startTime = serverDateFormat.parse(
                    it.startTime
                )!!.time

                elapsedTime += if (Calendar.getInstance().apply { timeInMillis = startTime }
                        .get(Calendar.DAY_OF_YEAR) == Calendar.getInstance()
                        .get(Calendar.DAY_OF_YEAR) && index == 0
                ) {
                    System.currentTimeMillis() - TimeZone.getDefault().rawOffset - startTime
                } else if (index == 0) {
                    Calendar.getInstance().apply {
                        timeInMillis = startTime
                        set(Calendar.HOUR_OF_DAY, getActualMaximum(Calendar.HOUR_OF_DAY) - 1)
                        set(Calendar.MINUTE, getActualMaximum(Calendar.MINUTE))
                        set(Calendar.SECOND, getActualMaximum(Calendar.SECOND))
                    }.timeInMillis - startTime
                } else {
                    (serverDateFormat.parse(
                        records[index - 1].startTime
                    )!!.time) - startTime
                }
            }
        }
        return elapsedTime
    }

    inner class LogAdapter(val logs: List<Log>) : RecyclerView.Adapter<LogViewHolder>() {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = LogViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.log_list_item, parent, false)
        )

        override fun getItemCount() = logs.size

        override fun onBindViewHolder(holder: LogViewHolder, position: Int) {
            val log = logs[position]
            with(holder) {
                date.text = dateFormat1.format(dateFormat.parse(log.day)!!)
                time.text = String.format(
                    "%02d:%02d",
                    TimeUnit.SECONDS.toHours(log.onDutySeconds),
                    TimeUnit.SECONDS.toMinutes(log.onDutySeconds) % 60
                )
//                println(log.day + " " + log.hasSignature)
                if (log.hasInspection == 1) {
                    statusImage.setImageResource(R.drawable.ic_done_with_bg)
                    statusText.text = "Inspection completed"
                } else {
                    statusImage.setImageResource(R.drawable.ic_none)
                    statusText.text = "No inspections"
                }
                if (log.hasSignature == 1) {
                    attentionImage.visibility = View.GONE
                } else {
                    attentionImage.visibility = View.VISIBLE
                }
                if (position == itemCount - 1) {
                    divider.visibility = View.GONE
                } else {
                    divider.visibility = View.VISIBLE
                }
                itemView.setOnClickListener {
                    getPreferences().edit(true) {
                        putString(PREFERENCES_SELECTED_DATE, log.day)
                        putBoolean(PREFERENCES_HAS_SIGNATURE, log.hasSignature == 1)
                    }
                    startActivity(Intent(this@LogsActivity, MainActivity::class.java))
                    finish()
                }
            }
        }
    }

    class LogViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        val date = itemView.dateTextView
        val time = itemView.timeTextView
        val statusImage = itemView.statusImage
        val statusText = itemView.statusText
        val attentionImage = itemView.attentionImage
        val divider = itemView.divider
    }
}