package com.sixhandsapps.simpleeld.widget

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View
import androidx.core.content.ContextCompat
import com.sixhandsapps.simpleeld.R

class TimeScorePieChart : View {

    var value: Long? = null
        set(value) {
            field = value
            invalidate()
        }

    var max: Long? = null
        set(value) {
            this.value = value
            field = value
        }

    private val paint = Paint().apply {
        color = Color.BLACK
        style = Paint.Style.STROKE
        strokeWidth = 20f
//        rotation = 135f
        isAntiAlias = true
    }

    constructor(context: Context?) : super(context)
    constructor(context: Context?, attrs: AttributeSet?) : super(context, attrs)
    constructor(context: Context?, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context,
        attrs,
        defStyleAttr
    )

    private val color1 = Color.parseColor("#F8F7F8")
    private val color2 = ContextCompat.getColor(context, R.color.colorPrimary)

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (max != null && value != null) {
            val strokeWidth = paint.strokeWidth
            paint.color = color1
            canvas.drawArc(
                strokeWidth,
                strokeWidth,
                width - strokeWidth,
                height - strokeWidth,
                135f,
                270f,
                false,
                paint
            )
            paint.color = color2
            canvas.drawArc(
                strokeWidth,
                strokeWidth,
                width - strokeWidth,
                height - strokeWidth,
                135f,
                value!! / max!!.toFloat() * 270,
                false,
                paint
            )
        }
    }

}