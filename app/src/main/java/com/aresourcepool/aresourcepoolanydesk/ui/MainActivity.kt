package com.aresourcepool.aresourcepoolanydesk.ui

import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import com.aresourcepool.aresourcepoolanydesk.repository.MainRepository
import com.aresourcepool.aresourcepoolanydesk.service.WebrtcServiceRepository
import com.aresourcepool.aresourcepoolanydesk.databinding.ActivityMainBinding
import com.aresourcepool.aresourcepoolanydesk.service.WebrtcService
import com.aresourcepool.aresourcepoolanydesk.service.InputEventService
import com.aresourcepool.aresourcepoolanydesk.service.InputEventReceiver
import com.aresourcepool.aresourcepoolanydesk.socket.SocketClient
import com.aresourcepool.aresourcepoolanydesk.utils.DataModel
import com.aresourcepool.aresourcepoolanydesk.utils.DataModelType
import dagger.hilt.android.AndroidEntryPoint
import org.webrtc.MediaStream
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : AppCompatActivity(), MainRepository.Listener, SocketClient.Listener {

    private var username: String? = null
    lateinit var views: ActivityMainBinding

    @Inject
    lateinit var webrtcServiceRepository: WebrtcServiceRepository
    
    @Inject
    lateinit var inputEventReceiver: InputEventReceiver
    
    @Inject
    lateinit var socketClient: SocketClient
    
    private val capturePermissionRequestCode = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        views = ActivityMainBinding.inflate(layoutInflater)
        setContentView(views.root)
        init()
    }

    private fun init() {
        username = intent.getStringExtra("username")
        if (username.isNullOrEmpty()) {
            finish()
        }
        WebrtcService.surfaceView = views.surfaceView
        WebrtcService.listener = this
        webrtcServiceRepository.startIntent(username!!)
        
        // Set up input event handling
        inputEventReceiver.setCurrentActivity(this)
        socketClient.listener = this
        
        // Set the global socket client reference for the service
        InputEventService.globalSocketClient = socketClient
        
        views.requestBtn.setOnClickListener {
            startScreenCapture()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode != capturePermissionRequestCode) return
        WebrtcService.screenPermissionIntent = data
        webrtcServiceRepository.requestConnection(
            views.targetEt.text.toString()
        )
    }

    private fun startScreenCapture() {
        val mediaProjectionManager = application.getSystemService(
            Context.MEDIA_PROJECTION_SERVICE
        ) as MediaProjectionManager

        startActivityForResult(
            mediaProjectionManager.createScreenCaptureIntent(),
            capturePermissionRequestCode
        )
    }

    override fun onConnectionRequestReceived(target: String) {
        runOnUiThread {
            views.apply {
                notificationTitle.text = "$target is requesting for connection"
                notificationLayout.isVisible = true
                notificationAcceptBtn.setOnClickListener {
                    webrtcServiceRepository.acceptCAll(target)
                    notificationLayout.isVisible = false
                }
                notificationDeclineBtn.setOnClickListener {
                    notificationLayout.isVisible = false
                }
            }
        }
    }

    override fun onConnectionConnected() {
        runOnUiThread {
            views.apply {
                requestLayout.isVisible = false
                disconnectBtn.isVisible = true
                disconnectBtn.setOnClickListener {
                    webrtcServiceRepository.endCallIntent()
                    stopInputCapture()
                    restartUi()
                }
            }
            // Start input capture when connection is established
            startInputCapture()
        }
    }

    override fun onCallEndReceived() {
        runOnUiThread {
            stopInputCapture()
            restartUi()
        }
    }

    override fun onRemoteStreamAdded(stream: MediaStream) {
        runOnUiThread {
            views.surfaceView.isVisible = true
            stream.videoTracks[0].addSink(views.surfaceView)
        }
    }

    private fun restartUi() {
        views.apply {
            disconnectBtn.isVisible = false
            requestLayout.isVisible = true
            notificationLayout.isVisible = false
            surfaceView.isVisible = false
        }
    }
    
    private fun startInputCapture() {
        val intent = Intent(this, InputEventService::class.java).apply {
            action = InputEventService.ACTION_START_INPUT_CAPTURE
        }
        startService(intent)
    }
    
    private fun stopInputCapture() {
        val intent = Intent(this, InputEventService::class.java).apply {
            action = InputEventService.ACTION_STOP_INPUT_CAPTURE
        }
        startService(intent)
    }
    
    // SocketClient.Listener implementation
    override fun onNewMessageReceived(model: DataModel) {
        when (model.type) {
            DataModelType.TouchEvent, DataModelType.KeyEvent, DataModelType.MouseEvent -> {
                // Handle incoming input events from web client
                inputEventReceiver.handleIncomingInputEvent(model)
            }
            else -> {
                // Handle other message types (existing functionality)
                // This would be handled by the existing WebRTC service
            }
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        stopInputCapture()
        socketClient.listener = null
    }
}

