package com.aresourcepool.aresourcepoolanydesk.service

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.util.Log
import android.view.*
import android.widget.FrameLayout
import com.aresourcepool.aresourcepoolanydesk.socket.SocketClient
import com.aresourcepool.aresourcepoolanydesk.utils.*


class InputEventService : Service() {
    
    private var socketClient: SocketClient? = null
    
    private var windowManager: WindowManager? = null
    private var overlayView: View? = null
    private var isServiceRunning = false
    
    companion object {
        private const val TAG = "InputEventService"
        const val ACTION_START_INPUT_CAPTURE = "start_input_capture"
        const val ACTION_STOP_INPUT_CAPTURE = "stop_input_capture"
        
        // Static reference to socket client - will be set by MainActivity
        var globalSocketClient: SocketClient? = null
    }
    
    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "InputEventService created")
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        socketClient = globalSocketClient
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START_INPUT_CAPTURE -> {
                startInputCapture()
            }
            ACTION_STOP_INPUT_CAPTURE -> {
                stopInputCapture()
            }
        }
        return START_STICKY
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
    
    private fun startInputCapture() {
        if (isServiceRunning) {
            Log.d(TAG, "Input capture already running")
            return
        }
        
        try {
            createOverlayView()
            isServiceRunning = true
            Log.d(TAG, "Input capture started successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start input capture: ${e.message}", e)
        }
    }
    
    private fun stopInputCapture() {
        if (!isServiceRunning) {
            Log.d(TAG, "Input capture not running")
            return
        }
        
        try {
            removeOverlayView()
            isServiceRunning = false
            Log.d(TAG, "Input capture stopped successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to stop input capture: ${e.message}", e)
        }
    }
    
    private fun createOverlayView() {
        try {
            val layoutParams = WindowManager.LayoutParams().apply {
                type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                } else {
                    @Suppress("DEPRECATION")
                    WindowManager.LayoutParams.TYPE_PHONE
                }
                flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                        WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                        WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH
                format = PixelFormat.TRANSLUCENT
                width = WindowManager.LayoutParams.MATCH_PARENT
                height = WindowManager.LayoutParams.MATCH_PARENT
            }
            
            overlayView = createTransparentOverlay()
            windowManager?.addView(overlayView, layoutParams)
            Log.d(TAG, "Overlay view created successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to create overlay view: ${e.message}", e)
            // Continue without overlay - input events will still work for incoming events
        }
    }
    
    private fun createTransparentOverlay(): View {
        val overlay = FrameLayout(this)
        overlay.setBackgroundColor(android.graphics.Color.TRANSPARENT)
        
        // Set up touch listener
        overlay.setOnTouchListener { _, event ->
            handleTouchEvent(event)
            false // Don't consume the event, let it pass through
        }
        
        return overlay
    }
    
    private fun removeOverlayView() {
        try {
            overlayView?.let { view ->
                windowManager?.removeView(view)
                overlayView = null
                Log.d(TAG, "Overlay view removed successfully")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to remove overlay view: ${e.message}", e)
        }
    }
    
    private fun handleTouchEvent(event: MotionEvent) {
        try {
            val touchData = TouchEventData(
                action = event.action,
                x = event.x,
                y = event.y,
                pressure = event.pressure,
                size = event.size,
                pointerId = event.getPointerId(0),
                timestamp = event.eventTime
            )
            
            val dataModel = DataModel(
                type = DataModelType.TouchEvent,
                username = "android_device", // This should be the actual device username
                target = "web_client", // Target the web client
                data = touchData
            )
            
            socketClient?.sendMessageToSocket(dataModel)
            Log.d(TAG, "Touch event sent: action=${event.action}, x=${event.x}, y=${event.y}")
            
        } catch (e: Exception) {
            Log.e(TAG, "Error handling touch event: ${e.message}", e)
        }
    }
    
    fun sendKeyEvent(keyCode: Int, action: Int) {
        try {
            val keyData = KeyEventData(
                action = action,
                keyCode = keyCode,
                timestamp = System.currentTimeMillis()
            )
            
            val dataModel = DataModel(
                type = DataModelType.KeyEvent,
                username = "android_device",
                target = "web_client",
                data = keyData
            )
            
            socketClient?.sendMessageToSocket(dataModel)
            Log.d(TAG, "Key event sent: keyCode=$keyCode, action=$action")
            
        } catch (e: Exception) {
            Log.e(TAG, "Error sending key event: ${e.message}", e)
        }
    }
    
    fun sendMouseEvent(action: Int, x: Float, y: Float, button: Int = 0, scrollDelta: Float = 0f) {
        try {
            val mouseData = MouseEventData(
                action = action,
                x = x,
                y = y,
                button = button,
                scrollDelta = scrollDelta,
                timestamp = System.currentTimeMillis()
            )
            
            val dataModel = DataModel(
                type = DataModelType.MouseEvent,
                username = "android_device",
                target = "web_client",
                data = mouseData
            )
            
            socketClient?.sendMessageToSocket(dataModel)
            Log.d(TAG, "Mouse event sent: action=$action, x=$x, y=$y")
            
        } catch (e: Exception) {
            Log.e(TAG, "Error sending mouse event: ${e.message}", e)
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        stopInputCapture()
        Log.d(TAG, "InputEventService destroyed")
    }
}
