package com.sixhandsapps.simpleeld.widget

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View
import android.widget.LinearLayout
import androidx.core.content.ContextCompat
import androidx.core.view.marginEnd
import androidx.core.view.marginStart
import androidx.core.view.updateLayoutParams
import com.sixhandsapps.simpleeld.R
import com.sixhandsapps.simpleeld.model.Record
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
                val startDate = Calendar.getInstance().apply { timeInMillis = record.startTime }
                val start = offset + startDate.get(Calendar.HOUR_OF_DAY)  / 24f * width + startDate.get(Calendar.MINUTE) / 60f * colWidth
                val endDate = Calendar.getInstance().apply { timeInMillis = record.endTime }
                val end = offset + endDate.get(Calendar.HOUR_OF_DAY) / 24f * width + endDate.get(Calendar.MINUTE) / 60f * colWidth + 1f

                val y = getRecordY(record.type)

                if (path.isEmpty) {
                    path.moveTo(start, y)
                }

                path.lineTo(end, y)

                if (index < it.size - 1) {
                    path.lineTo(end, getRecordY(it[index + 1].type))
                }
            }
            canvas.drawPath(path, paintRounded)
        }
    }

    private fun getRecordY(recordType: Int) = when (recordType) {
        0 -> height / 8f
        1 -> height / 8f * 3
        2 -> height / 8f * 5
        3 -> height / 8f * 7
        else -> null
    }!!

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