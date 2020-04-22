package com.sixhandsapps.simpleeld.activity

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.google.android.material.tabs.TabLayoutMediator
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.fragment.SignatureFragment
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        viewPager.adapter = object :
            FragmentStateAdapter(this) {
            override fun getItemCount() = 4

            override fun createFragment(position: Int) = when (position) {
                1 -> SignatureFragment()
                2 -> SignatureFragment()
                3 -> SignatureFragment()
                else -> SignatureFragment()
            }
        }

        val tabTitles = arrayOf("Logs", "Profile", "Dvir", "Signature")
        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.text = tabTitles[position]
        }.attach()
    }

}