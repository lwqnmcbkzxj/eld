package com.sixhandsapps.simpleeld.activity

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Toast
import androidx.activity.viewModels
import androidx.core.content.edit
import androidx.core.view.updateLayoutParams
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.RecyclerView
import com.sixhandsapps.simpleeld.PREFERENCES_VEHICLE_ID
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.getPreferences
import com.sixhandsapps.simpleeld.model.Vehicle
import com.sixhandsapps.simpleeld.viewmodel.ConfirmVehicleViewModel
import kotlinx.android.synthetic.main.activity_confirm_vehicle.*
import kotlinx.android.synthetic.main.confirm_vehicle_dialog.view.*
import kotlinx.android.synthetic.main.vehicle_list_item.view.*
import kotlin.math.roundToInt

class ConfirmVehicleActivity : BaseActivity() {

    private val viewModel by viewModels<ConfirmVehicleViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_confirm_vehicle)

        recyclerView.updateLayoutParams {
            width = (resources.displayMetrics.widthPixels * 0.7f).roundToInt()
        }

        viewModel.vehicles.observe(this, Observer {
            when {
                it.status == 0 -> {
                    recyclerView.adapter = VehicleAdapter(it.result!!)
                }
                it.status != null -> {
                    Toast.makeText(this, it.resultString, Toast.LENGTH_LONG).show()
                }
                else -> {
                    Toast.makeText(this, it.throwable!!.message, Toast.LENGTH_LONG).show()
                }
            }
        })
    }

    private inner class VehicleAdapter(val vehicles: List<Vehicle>) :
        RecyclerView.Adapter<VehicleViewHolder>() {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = VehicleViewHolder(
            layoutInflater.inflate(R.layout.vehicle_list_item, parent, false)
        )

        override fun getItemCount() = vehicles.size

        override fun onBindViewHolder(holder: VehicleViewHolder, position: Int) {
            val vehicle = vehicles[position]
            with(holder) {
                manufacturerTextView.text = vehicle.manufacturer
                infoTextView.text = "${vehicle.model} (${vehicle.year})"
                serialNumberTextView.text = vehicle.serialNumber
                idTextView.text = String.format("%03d", vehicle.id)

                if (position == itemCount - 1) {
                    divider.visibility = View.GONE
                } else {
                    divider.visibility = View.VISIBLE
                }
                itemView.setOnClickListener {
                    val dialog = Dialog(this@ConfirmVehicleActivity)
                    val view = View.inflate(
                        this@ConfirmVehicleActivity,
                        R.layout.confirm_vehicle_dialog,
                        null
                    ).apply {
                        manufacturerTextView.text = vehicle.manufacturer
                        infoTextView.text = "${vehicle.model} (${vehicle.year})"
                        serialNumberTextView.text = vehicle.serialNumber
                        idTextView.text = String.format("%03d", vehicle.id)
                        cancelButton.setOnClickListener {
                            dialog.dismiss()
                        }
                        confirmButton.setOnClickListener {
                            getPreferences().edit(true) {
                                putInt(PREFERENCES_VEHICLE_ID, vehicle.id)
                            }
                            startActivity(
                                Intent(
                                    this@ConfirmVehicleActivity,
                                    MainActivity::class.java
                                )
                            )
                            finish()
                        }
                    }
                    dialog.setContentView(view)
                    dialog.show()
                    dialog.window!!.setLayout(
                        (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                        WindowManager.LayoutParams.WRAP_CONTENT
                    )
                }
            }
        }
    }

    private class VehicleViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        val manufacturerTextView = itemView.manufacturerTextView
        val infoTextView = itemView.infoTextView
        val serialNumberTextView = itemView.serialNumberTextView
        val idTextView = itemView.idTextView
        val divider = itemView.divider
    }
}