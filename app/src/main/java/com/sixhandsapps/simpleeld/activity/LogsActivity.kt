package com.sixhandsapps.simpleeld.activity

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.model.Log
import kotlinx.android.synthetic.main.activity_logs.*
import kotlinx.android.synthetic.main.log_list_item.view.*

class LogsActivity : BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_logs)

        recyclerView.adapter = LogAdapter(List(10) {
            if (it == 5) {
                Log("", "", false)
            } else {
                Log("", "", true)
            }
        })
    }

    class LogAdapter(val logs: List<Log>) : RecyclerView.Adapter<LogViewHolder>() {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = LogViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.log_list_item, parent, false)
        )

        override fun getItemCount() = logs.size

        override fun onBindViewHolder(holder: LogViewHolder, position: Int) {
            val log = logs[position]
            with(holder) {
//                date.text = log.date
//                time.text = log.time

                if (log.completed) {
                    statusImage.setImageResource(R.drawable.ic_done_with_bg)
                    attentionImage.visibility = View.GONE
                    statusText.text = "Inspection completed"
                } else {
                    statusImage.setImageResource(R.drawable.ic_none)
                    attentionImage.visibility = View.VISIBLE
                    statusText.text = "No inspections"
                }
                if (position == itemCount - 1) {
                    divider.visibility = View.GONE
                } else {
                    divider.visibility = View.VISIBLE
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