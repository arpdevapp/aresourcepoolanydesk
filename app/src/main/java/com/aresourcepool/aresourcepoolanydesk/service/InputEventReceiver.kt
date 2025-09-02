package com.aresourcepool.aresourcepoolanydesk.service

import android.app.Activity
import android.content.Context
import android.util.Log
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import com.aresourcepool.aresourcepoolanydesk.utils.*


class InputEventReceiver(
    private val context: Context
) {
    
    companion object {
        private const val TAG = "InputEventReceiver"
    }
    
    private var currentActivity: Activity? = null
    
    fun setCurrentActivity(activity: Activity) {
        currentActivity = activity
    }
    
    fun handleIncomingInputEvent(dataModel: DataModel) {
        try {
            when (dataModel.type) {
                DataModelType.TouchEvent -> {
                    val touchData = dataModel.data as? TouchEventData
                    touchData?.let { handleTouchEvent(it) }
                }
                DataModelType.KeyEvent -> {
                    val keyData = dataModel.data as? KeyEventData
                    keyData?.let { handleKeyEvent(it) }
                }
                DataModelType.MouseEvent -> {
                    val mouseData = dataModel.data as? MouseEventData
                    mouseData?.let { handleMouseEvent(it) }
                }
                else -> {
                    Log.w(TAG, "Unknown input event type: ${dataModel.type}")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error handling incoming input event: ${e.message}", e)
        }
    }
    
    private fun handleTouchEvent(touchData: TouchEventData) {
        currentActivity?.let { activity ->
            val rootView = activity.window.decorView.rootView
            
            // Create a MotionEvent from the received data
            val motionEvent = MotionEvent.obtain(
                touchData.timestamp,
                touchData.timestamp,
                touchData.action,
                touchData.x,
                touchData.y,
                touchData.pressure,
                touchData.size,
                0, // metaState
                1.0f, // xPrecision
                1.0f, // yPrecision
                touchData.pointerId,
                0 // edgeFlags
            )
            
            // Dispatch the touch event to the root view
            rootView.dispatchTouchEvent(motionEvent)
            motionEvent.recycle()
            
            Log.d(TAG, "Touch event dispatched: action=${touchData.action}, x=${touchData.x}, y=${touchData.y}")
        }
    }
    
    private fun handleKeyEvent(keyData: KeyEventData) {
        currentActivity?.let { activity ->
            val keyEvent = KeyEvent(
                keyData.action,
                keyData.keyCode
            )
            
            // Dispatch the key event to the current activity
            activity.dispatchKeyEvent(keyEvent)
            
            Log.d(TAG, "Key event dispatched: keyCode=${keyData.keyCode}, action=${keyData.action}")
        }
    }
    
    private fun handleMouseEvent(mouseData: MouseEventData) {
        currentActivity?.let { activity ->
            val rootView = activity.window.decorView.rootView
            
            when (mouseData.action) {
                InputActions.MOUSE_DOWN, InputActions.MOUSE_UP, InputActions.MOUSE_MOVE -> {
                    // Convert mouse events to touch events for Android
                    val touchAction = when (mouseData.action) {
                        InputActions.MOUSE_DOWN -> MotionEvent.ACTION_DOWN
                        InputActions.MOUSE_UP -> MotionEvent.ACTION_UP
                        InputActions.MOUSE_MOVE -> MotionEvent.ACTION_MOVE
                        else -> MotionEvent.ACTION_MOVE
                    }
                    
                    val motionEvent = MotionEvent.obtain(
                        mouseData.timestamp,
                        mouseData.timestamp,
                        touchAction,
                        mouseData.x,
                        mouseData.y,
                        1.0f, // pressure
                        1.0f, // size
                        0, // metaState
                        1.0f, // xPrecision
                        1.0f, // yPrecision
                        0, // deviceId
                        0 // edgeFlags
                    )
                    
                    rootView.dispatchTouchEvent(motionEvent)
                    motionEvent.recycle()
                }
                InputActions.MOUSE_SCROLL -> {
                    // Handle scroll events (this would need custom implementation)
                    Log.d(TAG, "Mouse scroll event: delta=${mouseData.scrollDelta}")
                }
            }
            
            Log.d(TAG, "Mouse event dispatched: action=${mouseData.action}, x=${mouseData.x}, y=${mouseData.y}")
        }
    }
    
    fun simulateKeyPress(keyCode: Int) {
        val keyEvent = KeyEvent(KeyEvent.ACTION_DOWN, keyCode)
        currentActivity?.dispatchKeyEvent(keyEvent)
        
        // Also send the key up event
        val keyUpEvent = KeyEvent(KeyEvent.ACTION_UP, keyCode)
        currentActivity?.dispatchKeyEvent(keyUpEvent)
        
        Log.d(TAG, "Simulated key press: $keyCode")
    }
    
    fun simulateTouch(x: Float, y: Float, action: Int) {
        currentActivity?.let { activity ->
            val rootView = activity.window.decorView.rootView
            
            val motionEvent = MotionEvent.obtain(
                System.currentTimeMillis(),
                System.currentTimeMillis(),
                action,
                x,
                y,
                1.0f, // pressure
                1.0f, // size
                0, // metaState
                1.0f, // xPrecision
                1.0f, // yPrecision
                0, // deviceId
                0 // edgeFlags
            )
            
            rootView.dispatchTouchEvent(motionEvent)
            motionEvent.recycle()
            
            Log.d(TAG, "Simulated touch: action=$action, x=$x, y=$y")
        }
    }
}
