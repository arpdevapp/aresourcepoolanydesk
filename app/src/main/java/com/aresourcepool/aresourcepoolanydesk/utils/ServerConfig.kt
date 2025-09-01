package com.aresourcepool.aresourcepoolanydesk.utils

import android.content.Context
import android.util.Log

/**
 * Server configuration manager for cross-platform app access
 * Supports both local development and production servers
 */
object ServerConfig {
    

    
    // Server configurations
    private const val CURRENT_SERVER = "ws://192.168.1.7:3000" // Your current IP
    private const val PRODUCTION_SERVER = "wss://aresourcepool-server.onrender.com" // For future deployment
    
    // Platform identifiers
    const val PLATFORM_ANDROID = "android"
    
    /**
     * Get the current server URL
     */
    fun getServerUrl(context: Context): String {
        return CURRENT_SERVER // Always use current IP
    }
    
    /**
     * Get the current server type
     */
    fun getServerType(context: Context): String {
        return "current"
    }
    
    /**
     * Get the app platform identifier
     */
    fun getAppPlatform(): String = PLATFORM_ANDROID
    
    /**
     * Get server display name for UI
     */
    fun getServerDisplayName(context: Context): String {
        return "Current Server (192.168.1.7:3000)"
    }
    
    /**
     * Get server status information
     */
    fun getServerInfo(context: Context): Map<String, String> {
        return mapOf(
            "url" to getServerUrl(context),
            "type" to getServerType(context),
            "platform" to getAppPlatform(),
            "display_name" to getServerDisplayName(context)
        )
    }
    

}
