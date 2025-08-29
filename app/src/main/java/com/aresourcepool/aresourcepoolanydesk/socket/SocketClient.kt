package com.aresourcepool.aresourcepoolanydesk.socket

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.util.Log
import com.aresourcepool.aresourcepoolanydesk.utils.DataModel
import com.aresourcepool.aresourcepoolanydesk.utils.DataModelType
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.java_websocket.client.WebSocketClient
import org.java_websocket.handshake.ServerHandshake
import java.net.URI
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.Exception

@Singleton
class SocketClient @Inject constructor(
    private val gson:Gson,
    private val context: Context
){
    private var username:String?=null
    private var isConnected = false
    companion object {
        private var webSocket:WebSocketClient?=null
    }

    var listener:Listener?=null
    
    fun init(username:String){
        Log.d("SocketClient", "=== SocketClient.init() called ===")
        Log.d("SocketClient", "Username: $username")
        Log.d("SocketClient", "Context: $context")
        
        this.username = username
        Log.d("SocketClient", "Initializing WebSocket connection to ws://192.168.1.7:3000 for user: $username")
        
        // Test network connectivity
        Log.d("SocketClient", "Testing network connectivity...")
        val networkAvailable = isNetworkAvailable()
        Log.d("SocketClient", "Network available: $networkAvailable")

        // Check network connectivity first
        Log.d("SocketClient", "Checking network connectivity...")
        if (!isNetworkAvailable()) {
            Log.e("SocketClient", "Network not available, cannot connect to WebSocket")
            return
        }
        Log.d("SocketClient", "Network is available")

        // Close existing connection if any
        Log.d("SocketClient", "Closing existing connection if any...")
        webSocket?.close()
        
        Log.d("SocketClient", "Creating new WebSocket client...")
        webSocket= object : WebSocketClient(URI("ws://192.168.1.7:3000")){
            init {
                this.connectionLostTimeout = 10 // 10 seconds timeout
            }
            override fun onOpen(handshakedata: ServerHandshake?) {
                Log.d("SocketClient", "WebSocket connection opened successfully")
                isConnected = true
                
                // Send sign-in message after connection is established
                try {
                    val signInMessage = DataModel(
                        type = DataModelType.SignIn,
                        username = username,
                        null,
                        null
                    )
                    Log.d("SocketClient", "Sending sign-in message: ${gson.toJson(signInMessage)}")
                    sendMessageToSocket(signInMessage)
                } catch (e: Exception) {
                    Log.e("SocketClient", "Error sending sign-in message: ${e.message}", e)
                }
            }

            override fun onMessage(message: String?) {
                val model = try {
                    gson.fromJson(message.toString(),DataModel::class.java)
                }catch (e:Exception){
                    null
                }
                Log.d("TAG", "onMessage: $model")
                model?.let {
                    listener?.onNewMessageReceived(it)
                }
            }

            override fun onClose(code: Int, reason: String?, remote: Boolean) {
                Log.d("SocketClient", "WebSocket connection closed. Code: $code, Reason: $reason, Remote: $remote")
                isConnected = false
                
                // Only attempt reconnect if username is still set
                username?.let { currentUsername ->
                    CoroutineScope(Dispatchers.IO).launch {
                        delay(5000)
                        Log.d("SocketClient", "Attempting to reconnect...")
                        init(currentUsername)
                    }
                }
            }

            override fun onError(ex: Exception?) {
                Log.e("SocketClient", "WebSocket error: ${ex?.message}", ex)
                isConnected = false
            }

        }
        Log.d("SocketClient", "Attempting to connect to WebSocket...")
        try {
            webSocket?.connect()
            Log.d("SocketClient", "WebSocket connect() called successfully")
        } catch (e: Exception) {
            Log.e("SocketClient", "Error calling WebSocket connect(): ${e.message}", e)
        }
    }


    fun sendMessageToSocket(message:Any?){
        if (!isConnected) {
            Log.w("SocketClient", "Cannot send message: WebSocket not connected")
            return
        }
        
        try {
            val jsonMessage = gson.toJson(message)
            Log.d("SocketClient", "Sending message: $jsonMessage")
            webSocket?.send(jsonMessage)
        }catch (e:Exception){
            Log.e("SocketClient", "Error sending message: ${e.message}", e)
        }
    }

    fun onDestroy(){
        Log.d("SocketClient", "Destroying SocketClient")
        isConnected = false
        webSocket?.close()
    }
    
    fun isConnected(): Boolean {
        return isConnected
    }
    
    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val activeNetwork = connectivityManager.getNetworkCapabilities(network) ?: return false
        
        return activeNetwork.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
               activeNetwork.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
    }
    
    // Test method to verify WebSocket connection
    fun testConnection() {
        Log.d("SocketClient", "Testing WebSocket connection...")
        Log.d("SocketClient", "Current network status: ${if (isNetworkAvailable()) "Available" else "Not Available"}")
        Log.d("SocketClient", "WebSocket object: $webSocket")
        Log.d("SocketClient", "Connection status: $isConnected")
        
        // Test direct connection
        Log.d("SocketClient", "Attempting direct connection test...")
        try {
            val testWebSocket = object : WebSocketClient(URI("ws://192.168.1.7:3000")) {
                override fun onOpen(handshakedata: ServerHandshake?) {
                    Log.d("SocketClient", "✅ Direct connection test successful!")
                    this.close()
                }
                
                override fun onMessage(message: String?) {}
                override fun onClose(code: Int, reason: String?, remote: Boolean) {}
                override fun onError(ex: Exception?) {
                    Log.e("SocketClient", "❌ Direct connection test failed: ${ex?.message}")
                }
            }
            testWebSocket.connect()
        } catch (e: Exception) {
            Log.e("SocketClient", "❌ Error in direct connection test: ${e.message}")
        }
    }

    interface Listener {
        fun onNewMessageReceived(model:DataModel)
    }
}