package com.sixhandsapps.simpleeld.widget

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.LayoutInflater
import android.view.View
import android.widget.FrameLayout
import android.widget.TextView
import com.sixhandsapps.simpleeld.R


class TotalDistancePieChart : View {

    var values: List<Int>? = null
        set(value) {
            field = value
            invalidate()
        }

    private val paint = Paint().apply {
        color = Color.BLACK
        style = Paint.Style.STROKE
        strokeWidth = 16f
//        rotation = -90f
        isAntiAlias = true
    }

    private val colors = arrayOf(Color.parseColor("#D79100"), Color.parseColor("#E63C22"))

    constructor(context: Context?) : super(context)
    constructor(context: Context?, attrs: AttributeSet?) : super(context, attrs)
    constructor(context: Context?, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context,
        attrs,
        defStyleAttr
    )

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        values?.let { values ->
            val strokeWidth = paint.strokeWidth
            val sum = values.sum().toFloat()
            var startAngle = -90f
            values.sortedDescending().forEachIndexed { index, value ->
                paint.color = colors[index % 2]
                val sweepAngle = value / sum * 360f
                canvas.drawArc(
                    strokeWidth,
                    strokeWidth,
                    width - strokeWidth,
                    height - strokeWidth,
                    startAngle,
                    sweepAngle - 2,
                    false,
                    paint
                )
                startAngle += sweepAngle
            }
        }
    }
}