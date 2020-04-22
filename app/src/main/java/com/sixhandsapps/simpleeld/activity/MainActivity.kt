package com.sixhandsapps.simpleeld.activity

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.widget.PopupMenu
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.edit
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.google.android.material.tabs.TabLayoutMediator
import com.sixhandsapps.simpleeld.PREFERENCES_TOKEN
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.fragment.DvirFragment
import com.sixhandsapps.simpleeld.fragment.LogsFragment
import com.sixhandsapps.simpleeld.fragment.ProfileFragment
import com.sixhandsapps.simpleeld.fragment.SignatureFragment
import com.sixhandsapps.simpleeld.getPreferences
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : BaseActivity(), PopupMenu.OnMenuItemClickListener {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

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
    }

    override fun onMenuItemClick(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.nav_settings -> {
                return true
            }
            R.id.nav_inspection_module -> {
                return true
            }
            R.id.nav_hos_basic_rules -> {
                return true
            }
            R.id.nav_night_theme -> {
                return true
            }
            R.id.nav_log_out -> {
                getPreferences().edit(true) {
                    remove(PREFERENCES_TOKEN)
                }
                startActivity(Intent(this, LogInActivity::class.java))
                finish()
                return true
            }
        }
        return false
    }
}