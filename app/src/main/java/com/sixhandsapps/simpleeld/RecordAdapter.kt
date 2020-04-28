package com.sixhandsapps.simpleeld

import android.annotation.SuppressLint
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.text.HtmlCompat
import androidx.recyclerview.widget.RecyclerView
import com.sixhandsapps.simpleeld.model.Record
import kotlinx.android.synthetic.main.record_list_item.view.*
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

class RecordAdapter(private val records: List<Record>, private val onLongClickListener: (Record) -> Unit) : RecyclerView.Adapter<RecordViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = RecordViewHolder(
        LayoutInflater.from(parent.context).inflate(R.layout.record_list_item, parent, false)
    )

    override fun getItemCount() = records.size

    private val dateFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: RecordViewHolder, position: Int) {
        val record = records[position]
        with(holder) {
            locationTextView.text = record.location
            record.remark.let {
                if (it.isNullOrEmpty()) {
                    remarkTextView.text = "—"
                } else {
                    remarkTextView.text = it
                }
            }
            statusTextView.text = "${getStatusText(record.type)}  ${dateFormat.format(Date().apply {
                time = record.startTime
            })}"
            statusTextView.background.setTint(getStatusColor(record.type))
            val elapsedTime = record.endTime - record.startTime
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
            itemView.setOnLongClickListener {
                onLongClickListener(record)
                true
            }
        }
    }

    private fun getStatusText(type: Int) = when (type) {
        0 -> "OFF"
        1 -> "DR"
        2 -> "ON"
        3 -> "SB"
        else -> ""
    }

    private fun getStatusColor(type: Int) = when (type) {
        0 -> Color.parseColor("#E63C22")
        1 -> Color.parseColor("#80B302")
        2 -> Color.parseColor("#D79100")
        3 -> Color.parseColor("#5B5C5E")
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