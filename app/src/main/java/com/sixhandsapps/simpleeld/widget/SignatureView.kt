package com.sixhandsapps.simpleeld.widget

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.Gravity
import android.view.MotionEvent
import android.widget.FrameLayout
import android.widget.TextView
import kotlin.math.roundToInt

class SignatureView : FrameLayout {

    var callback: Callback? = null
    private lateinit var bitmap: Bitmap
    private lateinit var canvas: Canvas

    private val bitmapPaint = Paint(Paint.DITHER_FLAG)
    private val path = Path()
    private val paint = Paint().apply {
        isAntiAlias = true
        isDither = true
        color = Color.BLACK
        style = Paint.Style.STROKE
        strokeJoin = Paint.Join.ROUND
        strokeCap = Paint.Cap.ROUND
        strokeWidth = 12f
    }

    var lastX = -1f
    var lastY = -1f

    constructor(context: Context) : super(context)
    constructor(context: Context, attrs: AttributeSet?) : super(context, attrs)
    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context,
        attrs,
        defStyleAttr
    )

    init {
        addView(TextView(context).apply {
            text = "Sing here"
            setTextColor(Color.parseColor("#93969A"))
            textSize = 16f
            isAllCaps = true
        }, LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER_HORIZONTAL
            topMargin = (16 * resources.displayMetrics.density).roundToInt()
        })
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
        canvas = Canvas(bitmap)
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent): Boolean {
        val x = event.x
        val y = event.y
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                callback?.startDrawing()
                path.reset()
                path.moveTo(x, y)
                lastX = x
                lastY = y
                invalidate()
            }
            MotionEvent.ACTION_MOVE -> {
                path.quadTo(lastX, lastY, (x + lastX) / 2, (y + lastY) / 2)
                lastX = x
                lastY = y
                invalidate()
            }
            MotionEvent.ACTION_UP -> {
                callback?.endDrawing()
                path.lineTo(lastX, lastY)
                canvas.drawPath(path, paint)
                path.reset()
                invalidate()
            }
        }
        return true
    }

    override fun onDraw(canvas: Canvas) {
        canvas.drawBitmap(bitmap, 0f, 0f, bitmapPaint)
        canvas.drawPath(path, paint)
    }

    fun clear() {
        bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        canvas = Canvas(bitmap)
        invalidate()
    }

    interface Callback {

        fun startDrawing()

        fun endDrawing()
    }
}