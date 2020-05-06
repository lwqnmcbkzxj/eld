package com.sixhandsapps.simpleeld

import android.annotation.SuppressLint
import android.graphics.Color
import android.view.*
import androidx.core.text.HtmlCompat
import androidx.recyclerview.widget.RecyclerView
import com.sixhandsapps.simpleeld.model.Record
import kotlinx.android.synthetic.main.record_list_item.view.*
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

class RecordAdapter(
    private val records: List<Record>,
    private val count: Int = records.size,
    private val onDoubleTap: (Record, String, String) -> Unit
) : RecyclerView.Adapter<RecordViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = RecordViewHolder(
        LayoutInflater.from(parent.context).inflate(R.layout.record_list_item, parent, false)
    )

    override fun getItemCount() = records.take(count).size

    private val dateFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: RecordViewHolder, position: Int) {
        val record = records.take(count)[position]
        with(holder) {
            val gestureDetector = GestureDetector(
                itemView.context,
                object : GestureDetector.SimpleOnGestureListener() {
                    override fun onDoubleTap(e: MotionEvent?): Boolean {
                        onDoubleTap(
                            record,
                            dateFormat.format(serverDateFormat.parse(record.startTime)!!),
                            if (position > 0) {
                                dateFormat.format(
                                    serverDateFormat.parse(
                                        records[position - 1].startTime
                                    )!!
                                )
                            } else {
                                dateFormat.format(Date())
                            }
                        )
                        return super.onDoubleTap(e)
                    }
                })
            locationTextView.text = record.location
            record.remark.let {
                if (it.isNullOrEmpty()) {
                    remarkTextView.text = "—"
                } else {
                    remarkTextView.text = it
                }
            }
            statusTextView.text =
                "${getStatusText(record.type!!)}  ${dateFormat.format(Date().apply {
                    time = serverDateFormat.parse(
                        record.startTime
                    )!!.time
                })}"
            statusTextView.background.setTint(getStatusColor(record.type!!))
            val startCalendar =
                Calendar.getInstance().apply { time = serverDateFormat.parse(record.startTime)!! }
                    .get(Calendar.DAY_OF_YEAR)
            val elapsedTime = if (startCalendar == Calendar.getInstance()
                    .get(Calendar.DAY_OF_YEAR) && position == 0
            ) {
                System.currentTimeMillis() - TimeZone.getDefault().rawOffset - serverDateFormat.parse(record.startTime)!!.time
            } else if (position == 0) {
                Calendar.getInstance().apply {
                    time = serverDateFormat.parse(record.startTime)!!
                    set(Calendar.HOUR_OF_DAY, getActualMaximum(Calendar.HOUR_OF_DAY))
                    set(Calendar.MINUTE, getActualMaximum(Calendar.MINUTE))
                    set(Calendar.SECOND, getActualMaximum(Calendar.SECOND))
                }.timeInMillis - serverDateFormat.parse(record.startTime)!!.time
            } else {
                (serverDateFormat.parse(
                    records[position - 1].startTime
                )!!.time) - serverDateFormat.parse(record.startTime)!!.time
            }
            val hours = TimeUnit.MILLISECONDS.toHours(elapsedTime)
            val minutes = TimeUnit.MILLISECONDS.toMinutes(elapsedTime) % 60
            val seconds = TimeUnit.MILLISECONDS.toSeconds(elapsedTime) % 60
            timeTextView.text = HtmlCompat.fromHtml(
                "${hours}h <font color=#93969A>${minutes}m ${seconds}s</font>",
                HtmlCompat.FROM_HTML_MODE_COMPACT
            )
            if (position == itemCount - 1) {
                divider.visibility = View.GONE
            } else {
                divider.visibility = View.VISIBLE
            }
            itemView.setOnTouchListener { _, event ->
                gestureDetector.onTouchEvent(event)
            }
        }
    }

    private fun getStatusText(type: String) = when (type) {
        "OFF_DUTY" -> "OFF"
        "DRIVING" -> "DR"
        "ON_DUTY" -> "ON"
        "SLEEPER" -> "SB"
        "ON_DUTY_YM" -> "ON(YM)"
        "OFF_DUTY_PC" -> "OFF(PC)"
        else -> ""
    }

    private fun getStatusColor(type: String) = when (type) {
        "OFF_DUTY", "OFF_DUTY_PC" -> Color.parseColor("#E63C22")
        "DRIVING" -> Color.parseColor("#80B302")
        "ON_DUTY", "ON_DUTY_YM" -> Color.parseColor("#D79100")
        "SLEEPER" -> Color.parseColor("#5B5C5E")
        else -> null
    }!!
}

class RecordViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    val locationTextView = itemView.locationTextView
    val remarkTextView = itemView.remarkTextView
    val statusTextView = itemView.statusTextView
    val timeTextView = itemView.timeTextView
    val divider = itemView.divider
}