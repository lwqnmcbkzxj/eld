package com.sixhandsapps.simpleeld.activity

import android.annotation.SuppressLint
import android.app.Dialog
import android.content.Intent
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.PopupMenu
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.google.android.material.tabs.TabLayoutMediator
import com.sixhandsapps.simpleeld.PREFERENCES_HAS_SIGNATURE
import com.sixhandsapps.simpleeld.PREFERENCES_SELECTED_DATE
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.fragment.DvirFragment
import com.sixhandsapps.simpleeld.fragment.LogsFragment
import com.sixhandsapps.simpleeld.fragment.ProfileFragment
import com.sixhandsapps.simpleeld.fragment.SignatureFragment
import com.sixhandsapps.simpleeld.getPreferences
import com.sixhandsapps.simpleeld.model.Log
import com.sixhandsapps.simpleeld.viewmodel.MainViewModel
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.unsigned_records_dialog.view.*
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : BaseActivity(), PopupMenu.OnMenuItemClickListener {

//    private val viewModel by viewModels<MainViewModel>()


    private val viewModel by lazy {
        ViewModelProvider(this, MainViewModel.Factory(application)).get(MainViewModel::class.java)
    }

    val dateFormat = SimpleDateFormat("MMM dd", Locale.US)

    class SignedAdapter(val logs: List<Log>) : RecyclerView.Adapter<SignedAdapter.ViewHolder>() {
        class ViewHolder(val textView: TextView) : RecyclerView.ViewHolder(textView)

        @SuppressLint("SimpleDateFormat")
        val signedDateFormat = SimpleDateFormat("dd/MM/yyyy")

        @SuppressLint("SimpleDateFormat")
        val dateFormat1 = SimpleDateFormat("yyyy-MM-dd")
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = ViewHolder(LayoutInflater.from(parent.context)
                .inflate(R.layout.unsinged_list_item, parent, false) as TextView
        )

        override fun getItemCount() = logs.size

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            holder.textView.text = signedDateFormat.format(dateFormat1.parse(logs[position].day)!!)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        viewModel.logs.observe(this, Observer { response ->
            handleResponse(response, { logs ->
                if (logs.any { it.hasSignature == 0 }) {
                    signatureAttention.visibility = View.VISIBLE
                } else {
                    signatureAttention.visibility = View.GONE
                }
                signatureAttention.setOnClickListener {
                    val dialog = Dialog(this)
                    val view = View.inflate(this, R.layout.unsigned_records_dialog, null).apply {
                        recyclerView.adapter = SignedAdapter(logs.filter { it.hasSignature == 0 })
                        signedAllButton.setOnClickListener {
                            startActivity(Intent(this@MainActivity, LogsActivity::class.java))
                        }
                        cancelButton.setOnClickListener {
                            dialog.dismiss()
                        }
                    }
                    dialog.setContentView(view)
                    dialog.show()
                }
            })
        })

        getPreferences().getString(PREFERENCES_SELECTED_DATE, null)?.let {
            dateTextView.text = dateFormat.format(SimpleDateFormat("yyyy-MM-dd").parse(it))
        }
        logs.setOnClickListener {
            startActivity(Intent(this, LogsActivity::class.java))
        }
        viewPager.adapter = object :
            FragmentStateAdapter(this) {

            override fun getItemCount() = 4

            override fun createFragment(position: Int) = when (position) {
                0 -> LogsFragment()
                1 -> ProfileFragment()
                2 -> DvirFragment()
                3 -> SignatureFragment()
                else -> null
            }!!
        }

        val tabTitles = arrayOf("Logs", "Profile", "Dvir", "Signature")
        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.text = tabTitles[position]
        }.attach()

        menuButton.setOnClickListener {
            val popupMenu = PopupMenu(this, it)
            popupMenu.inflate(R.menu.popup)
            popupMenu.setOnMenuItemClickListener(this)
            popupMenu.show()
        }

        viewModel.logOut.observe(this, Observer { response ->
            handleResponse(response, onSuccess = {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
                getPreferences().edit().clear().apply()
                startActivity(Intent(this, LogInActivity::class.java))
                finish()
            }, onError = {
                getPreferences().edit().clear().apply()
                startActivity(Intent(this, LogInActivity::class.java))
                finish()
            })
        })
    }

    override fun onMenuItemClick(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.nav_settings -> {
                return true
            }
            R.id.nav_inspection_module -> {
                startActivity(Intent(this, InspectionModuleActivity::class.java))
                return true
            }
            R.id.nav_hos_basic_rules -> {
                return true
            }
            R.id.nav_night_theme -> {
                return true
            }
            R.id.nav_log_out -> {
                try {
                    viewModel.logOut()
                } catch (e: Exception) {
                    Toast.makeText(this, e.message, Toast.LENGTH_LONG).show()
                    getPreferences().edit().clear().apply()
                    startActivity(Intent(this, LogInActivity::class.java))
                    finish()
                }
                return true
            }
        }
        return false
    }
}