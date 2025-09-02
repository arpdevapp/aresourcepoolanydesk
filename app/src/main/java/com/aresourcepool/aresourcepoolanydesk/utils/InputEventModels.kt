package com.aresourcepool.aresourcepoolanydesk.utils

/**
 * Data models for input events (touch, mouse, keyboard)
 */

data class TouchEventData(
    val action: Int, // MotionEvent.ACTION_DOWN, ACTION_UP, ACTION_MOVE, etc.
    val x: Float,
    val y: Float,
    val pressure: Float = 1.0f,
    val size: Float = 1.0f,
    val pointerId: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)

data class KeyEventData(
    val action: Int, // KeyEvent.ACTION_DOWN, ACTION_UP
    val keyCode: Int,
    val metaState: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)

data class MouseEventData(
    val action: Int, // Mouse action (click, move, scroll)
    val x: Float,
    val y: Float,
    val button: Int = 0, // Left, right, middle button
    val scrollDelta: Float = 0f,
    val timestamp: Long = System.currentTimeMillis()
)

// Constants for input actions
object InputActions {
    // Touch actions
    const val TOUCH_DOWN = 0
    const val TOUCH_UP = 1
    const val TOUCH_MOVE = 2
    const val TOUCH_CANCEL = 3
    
    // Key actions
    const val KEY_DOWN = 0
    const val KEY_UP = 1
    
    // Mouse actions
    const val MOUSE_DOWN = 0
    const val MOUSE_UP = 1
    const val MOUSE_MOVE = 2
    const val MOUSE_SCROLL = 3
    const val MOUSE_CLICK = 4
    
    // Mouse buttons
    const val MOUSE_LEFT = 1
    const val MOUSE_RIGHT = 2
    const val MOUSE_MIDDLE = 4
}

