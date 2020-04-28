package com.sixhandsapps.simpleeld.fragment

import android.app.Dialog
import android.graphics.Color
import android.os.Bundle
import android.view.*
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.model.Dvir
import kotlinx.android.synthetic.main.create_dvir_dialog.view.*
import kotlinx.android.synthetic.main.dvir_list_item.view.*
import kotlinx.android.synthetic.main.fragment_dvir.*
import kotlin.math.roundToInt

class DvirFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_dvir, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        recyclerView.updateLayoutParams {
            width = (resources.displayMetrics.widthPixels * 0.7f).roundToInt()
        }
        createDvirButton.setOnClickListener {
            val context = requireContext()
            val dialog = Dialog(context).apply {
                requestWindowFeature(Window.FEATURE_NO_TITLE)
            }
            View.inflate(context, R.layout.create_dvir_dialog, null).let {
                dialog.setContentView(it)
                it.cancelButton.setOnClickListener {
                    dialog.dismiss()
                }
                it.signatureButton.setOnClickListener { _ ->
                    it.createDvirLayout.visibility = View.GONE
                    it.signatureLayout.visibility = View.VISIBLE
                }
                it.backButton.setOnClickListener { _ ->
                    it.signatureLayout.visibility = View.GONE
                    it.createDvirLayout.visibility = View.VISIBLE
                }
                it.viewTreeObserver.addOnGlobalLayoutListener(object :
                    ViewTreeObserver.OnGlobalLayoutListener {

                    override fun onGlobalLayout() {
                        it.updateLayoutParams {
                            width = it.width
                            height = it.height
                        }
                        it.viewTreeObserver.removeOnGlobalLayoutListener(this)
                    }
                })
            }

            dialog.show()
            dialog.window!!.setLayout(
                (resources.displayMetrics.widthPixels * 0.7f).roundToInt(),
                WindowManager.LayoutParams.WRAP_CONTENT
            )
        }
        recyclerView.adapter = DvirAdapter(
            listOf(
                Dvir(11, true, true, "", ""), Dvir(20, true, false, "", "")
            )
        )
    }

    class DvirAdapter(val dvirs: List<Dvir>) : RecyclerView.Adapter<DvirViewHolder>() {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = DvirViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.dvir_list_item, parent, false)
        )

        override fun getItemCount() = dvirs.size

        override fun onBindViewHolder(holder: DvirViewHolder, position: Int) {
            val dvir = dvirs[position]

            with(holder) {
                vehicleId.text = String.format("%03d", dvir.vehicleId)
                deleteButton.setOnClickListener {

                }
                if (dvir.hasDriverSignature) {
                    dsStatus.setImageResource(R.drawable.ic_done_with_bg)
                } else {
                    dsStatus.setImageResource(R.drawable.ic_none)
                }
                if (dvir.hasMechanicSignature) {
                    msStatus.setImageResource(R.drawable.ic_done_with_bg)
                } else {
                    msStatus.setImageResource(R.drawable.ic_none)
                }
                if (dvir.hasMechanicSignature && dvir.hasDriverSignature) {
                    status.text = "NO DEFECTS FOUND"
                    status.background.setTint(Color.parseColor("#E63C22"))
                } else {
                    status.text = "DEFECTS FOUND"
                    status.background.setTint(Color.parseColor("#80B302"))
                }
            }
        }
    }

    class DvirViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        val vehicleId = itemView.vehicleId
        val deleteButton = itemView.deleteButton
        val dsStatus = itemView.dsStatus
        val msStatus = itemView.msStatus
        val status = itemView.statusTextView
        val time = itemView.timeTextView
        val location = itemView.locationTextView

    }
}