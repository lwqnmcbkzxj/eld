package com.sixhandsapps.simpleeld

import android.annotation.SuppressLint
import android.content.Context
import android.util.AttributeSet
import android.view.MotionEvent

class ViewPager : androidx.viewpager.widget.ViewPager {

    var isPagingEnabled = true

    constructor(context: Context) : super(context)
    constructor(context: Context, attrs: AttributeSet?) : super(context, attrs)

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(ev: MotionEvent?) = isPagingEnabled && super.onTouchEvent(ev)

    override fun onInterceptTouchEvent(ev: MotionEvent?) =
        isPagingEnabled && super.onInterceptTouchEvent(ev)
}