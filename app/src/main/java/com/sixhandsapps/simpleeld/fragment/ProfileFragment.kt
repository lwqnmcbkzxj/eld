package com.sixhandsapps.simpleeld.fragment

import android.annotation.SuppressLint
import android.app.Dialog
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.Window
import androidx.annotation.DrawableRes
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import com.google.android.material.chip.Chip
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.activity.LogInActivity
import com.sixhandsapps.simpleeld.getPreferences
import com.sixhandsapps.simpleeld.handleResponse
import com.sixhandsapps.simpleeld.viewmodel.ProfileViewModel
import kotlinx.android.synthetic.main.fragment_profile.*
import kotlinx.android.synthetic.main.profile_item_create_dialog.view.*
import kotlinx.android.synthetic.main.profile_item_edit_dialog.view.*

class ProfileFragment : Fragment() {

    private val viewModel by viewModels<ProfileViewModel>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_profile, container, false)
    }

    @SuppressLint("SetTextI18n")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val values = listOf(80, 40)
        pieChartView.values = values
        totalDistanceTextView.text = "${values.sum()} mi"
        vehicleTextView.compoundDrawablesRelative[0].colorFilter = PorterDuffColorFilter(
            ContextCompat.getColor(requireContext(), R.color.colorPrimary),
            PorterDuff.Mode.SRC_ATOP
        )

        addTrailer.setOnClickListener {
            showCreateDialog("New trailer", R.drawable.ic_trailer) {

            }
        }
        addShipDoc.setOnClickListener {
            showCreateDialog("New shipping document", R.drawable.ic_shipdoc) {

            }
        }

        viewModel.company.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = {
                companyName.text = it.longName
                companyMainOfficeAddress.text = it.mainOfficeAddress
                companyHomeTerminalAddress.text = it.homeTerminalAddress
            }, onError = {
                if (it == -1) {
                    requireActivity().let { activity ->
                        getPreferences().edit().clear().apply()
                        viewModel.removeAllObservers(viewLifecycleOwner)
                        startActivity(Intent(activity, LogInActivity::class.java))
                        activity.finish()
                    }
                }
            })
        })
        viewModel.user.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = {
                remarkEditText.setText(it.remark)
            }, onError = {
                requireActivity().let { activity ->
                    getPreferences().edit().clear().apply()
                    viewModel.removeAllObservers(viewLifecycleOwner)
                    startActivity(Intent(activity, LogInActivity::class.java))
                    activity.finish()
                }
            })
        })
        viewModel.userVehicles.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, onSuccess = {
                it.forEach {
                    vehicles.addView(
                        (layoutInflater.inflate(
                            R.layout.profile_item,
                            vehicles,
                            false
                        ) as Chip).apply {
                            val id = String.format("%03d", it.id)
                            text = id
                            setOnLongClickListener {
                                showEditDialog("Edit vehicle", id, R.drawable.ic_vehicle, {

                                }, "Delete vehicle", "Would you like to delete the vehicle?") {

                                }
                                true
                            }
                        }, 0
                    )
                }
            }, onError = {
                requireActivity().let { activity ->
                    getPreferences().edit().clear().apply()
                    viewModel.removeAllObservers(viewLifecycleOwner)
                    startActivity(Intent(activity, LogInActivity::class.java))
                    activity.finish()
                }
            })
        })
        viewModel.trailers.observe(viewLifecycleOwner, Observer { response ->
            handleResponse(response, {
                it.forEach {
                    trailers.addView(
                        (layoutInflater.inflate(
                            R.layout.profile_item,
                            trailers,
                            false
                        ) as Chip).apply {
                            val id = it.trailerExternalId.toString()
                            text = id
                            setOnLongClickListener {
                                showEditDialog("Edit trailer", id, R.drawable.ic_trailer, {

                                }, "Delete trailer", "Would you like to delete the trailer?") {

                                }
                                true
                            }
                        }, 0
                    )
                }
            }, onError = {
                requireActivity().let { activity ->
                    getPreferences().edit().clear().apply()
                    viewModel.removeAllObservers(viewLifecycleOwner)
                    startActivity(Intent(activity, LogInActivity::class.java))
                    activity.finish()
                }
            })
        })
    }

    private fun showCreateDialog(title: String, @DrawableRes res: Int, callback: (String) -> Unit) {
        val dialog =
            Dialog(requireContext()).apply { requestWindowFeature(Window.FEATURE_NO_TITLE) }
        dialog.setContentView(
            View.inflate(
                requireContext(),
                R.layout.profile_item_create_dialog,
                null
            ).apply {
                createDialogTitle.text = title
                createDialogInputLayout.setStartIconDrawable(res)
                createDialogInputLayout.setStartIconTintList(
                    ColorStateList.valueOf(
                        Color.parseColor(
                            "#93969A"
                        )
                    )
                )
                createDialogCancelButton.setOnClickListener {
                    dialog.dismiss()
                }
                createDialogSaveButton.setOnClickListener {
                    callback(createDialogEditText.text!!.toString())
                }
            })
        dialog.show()
    }

    private fun showEditDialog(
        title: String,
        id: String,
        @DrawableRes res: Int,
        callback: (String) -> Unit,
        deleteTitle: String,
        deleteMessage: String,
        deleteCallback: () -> Unit
    ) {
        val dialog = Dialog(requireContext()).apply {
            requestWindowFeature(Window.FEATURE_NO_TITLE)
        }
        dialog.setContentView(
            View.inflate(
                requireContext(),
                R.layout.profile_item_edit_dialog,
                null
            ).apply {
                editDialogTitle.text = title
                editDialogEditText.setText(id)
                editDialogInputLayout.setStartIconDrawable(res)
                editDialogInputLayout.setStartIconTintList(
                    ColorStateList.valueOf(
                        Color.parseColor("#93969A")
                    )
                )
                editDialogCancelButton.setOnClickListener {
                    dialog.dismiss()
                }
                editDialogSaveButton.setOnClickListener {
                    callback(editDialogEditText.text!!.toString())
                }
                editDialogDeleteButton.setOnClickListener {
                    editLayout.visibility = View.GONE
                    deleteLayout.visibility = View.VISIBLE
                }

                deleteDialogTitle.text = deleteTitle
                deleteDialogMessage.text = deleteMessage
                deleteDialogItem.text = id
                deleteDialogItem.setCompoundDrawablesRelativeWithIntrinsicBounds(res, 0, 0, 0)
                deleteDialogItem.compoundDrawablesRelative[0].colorFilter = PorterDuffColorFilter(
                    ContextCompat.getColor(requireContext(), R.color.colorPrimary),
                    PorterDuff.Mode.SRC_ATOP
                )
                deleteDialogNegativeButton.setOnClickListener {
                    deleteLayout.visibility = View.GONE
                    editLayout.visibility = View.VISIBLE
                }
                deleteDialogPositiveButton.setOnClickListener {
                    deleteCallback()
                }
            })
        dialog.show()
    }

}