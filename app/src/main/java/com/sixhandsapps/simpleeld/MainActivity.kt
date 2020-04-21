package com.sixhandsapps.simpleeld

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.FragmentPagerAdapter
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        viewPager.offscreenPageLimit = 4
        viewPager.adapter = object :
            FragmentPagerAdapter(supportFragmentManager, BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT) {

            override fun getItem(position: Int) = when (position) {
                1 -> SignatureFragment()
                2 -> SignatureFragment()
                3 -> SignatureFragment()
                else -> SignatureFragment()
            }

            override fun getCount() = 4

            override fun getPageTitle(position: Int) = when (position) {
                1 -> "Logs"
                2 -> "Profile"
                3 -> "Dvir"
                else -> "Signature"
            }
        }
        tabLayout.setupWithViewPager(viewPager)
    }

}