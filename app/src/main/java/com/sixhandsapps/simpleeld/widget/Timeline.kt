package com.sixhandsapps.simpleeld.widget

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View
import androidx.core.content.ContextCompat
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.model.Record
import com.sixhandsapps.simpleeld.serverDateFormat
import java.util.*
import kotlin.math.roundToInt

class Timeline : View {

    var records: List<Record>? = null
        set(value) {
            field = value
            invalidate()
        }

    constructor(context: Context?) : super(context)
    constructor(context: Context?, attrs: AttributeSet?) : super(context, attrs)
    constructor(context: Context?, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context,
        attrs,
        defStyleAttr
    )

    private val paint = Paint()
    private val paintRounded = Paint().apply {
        color = ContextCompat.getColor(context, R.color.colorPrimary)
        style = Paint.Style.STROKE
        strokeJoin = Paint.Join.ROUND
        strokeCap = Paint.Cap.ROUND
        strokeWidth = 8f
        pathEffect = CornerPathEffect(2f)
        isAntiAlias = true
    }

    var offset = -1f

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        (measuredWidth / 25f / 2f).roundToInt().let {
            offset = it.toFloat()
//            updateLayoutParams<LinearLayout.LayoutParams> {
//                marginStart = it
//                marginEnd = it
//            }
        }
    }

    val path = Path()

    override fun onDraw(canvas: Canvas) {
        drawBackground(canvas)
        val width = width - offset * 2
        val colWidth = (width - 4) / 24f + 1f
        records?.sortedBy { it.startTime }?.let {
            path.reset()
            it.forEachIndexed { index, record ->
                val y = getRecordY(record.type!!)

                if (y != null) {
                    val startDate = Calendar.getInstance().apply {
                        timeInMillis = serverDateFormat.parse(
                            record.startTime
                        )!!.time
                    }
                    val start = offset + startDate.get(Calendar.HOUR_OF_DAY) / 24f * width + startDate.get(
                            Calendar.MINUTE
                        ) / 60f * colWidth
                    val endDate = if (index == it.size - 1 && startDate.get(Calendar.DAY_OF_YEAR) == Calendar.getInstance().get(Calendar.DAY_OF_YEAR)) Calendar.getInstance().apply {
                        timeInMillis = System.currentTimeMillis() - TimeZone.getDefault().rawOffset
                    } else if (index < it.size - 1) Calendar.getInstance().apply {
                        timeInMillis = serverDateFormat.parse(
                            it[index + 1].startTime
                        )!!.time
                    } else {
                        startDate.apply {
                            set(Calendar.HOUR_OF_DAY, getActualMaximum(Calendar.HOUR_OF_DAY))
                            set(Calendar.MINUTE, getActualMaximum(Calendar.MINUTE))
                            set(Calendar.SECOND, getActualMaximum(Calendar.SECOND))
                        }
                    }
                    val end = offset + endDate.get(
                            Calendar.HOUR_OF_DAY
                        ) / 24f * width + endDate.get(Calendar.MINUTE) / 60f * colWidth + 1f
                    if (path.isEmpty) {
                        path.moveTo(start, y)
                    }

                    path.lineTo(end, y)

                    if (index < it.size - 1) {
                        getRecordY(it[index + 1].type!!)?.let {
                            path.lineTo(end, it)
                        }
                    }
                }
            }
            canvas.drawPath(path, paintRounded)
        }
    }

    private fun getRecordY(recordType: String) = when (recordType) {
        "OFF_DUTY", "OFF_DUTY_PC" -> height / 8f
        "SLEEPER" -> height / 8f * 3
        "DRIVING" -> height / 8f * 5
        "ON_DUTY", "ON_DUTY_YM" -> height / 8f * 7
        else -> null
    }

    private fun drawBackground(canvas: Canvas) {
        val width = width - offset
        val colWidth = (width - offset - 4) / 24f
        var y = 0f
        var x: Float
        val lineHeight = height / 4

        for (i in 1..4) {
            if (i % 2 == 0) {
                paint.color = Color.parseColor("#F8F7F8")
                canvas.drawRect(offset, y, width, y + lineHeight, paint)
            }

            x = offset + colWidth / 4f
            paint.color = Color.parseColor("#D3D2D5")
            for (j in 0 until 48) {
                canvas.drawRect(
                    x,
                    y + lineHeight * 0.2f,
                    x + 2,
                    y + lineHeight - lineHeight * 0.2f,
                    paint
                )
                x += colWidth / 2
            }
            y += lineHeight
        }

        x = offset
        paint.color = Color.parseColor("#D3D2D5")
        for (i in 0 until 25) {
            canvas.drawRect(x, 0f, x + 4, height.toFloat(), paint)
            x += colWidth
        }
        x = offset + (colWidth + 2f) / 2
        for (i in 0 until 24) {
            canvas.drawRect(x, 0f, x + 2, height.toFloat(), paint)
            x += colWidth
        }
    }
}