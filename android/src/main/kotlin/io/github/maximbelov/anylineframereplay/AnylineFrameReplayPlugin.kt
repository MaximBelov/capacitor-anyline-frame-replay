package io.github.maximbelov.anylineframereplay

import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * The Anyline SDK's Frame Replay: every scan view created after `set` reads its frames from images instead of the
 * camera, until `clear`. The switch is made on the main thread, where the scan view that reads it is created.
 */
@CapacitorPlugin(name = "AnylineFrameReplay")
class AnylineFrameReplayPlugin : Plugin() {
    internal var camera: FrameReplayCamera = AnylineFrameReplayCamera

    @PluginMethod
    fun set(call: PluginCall) {
        val options = call.data
        FrameReplayConfig.problem(options)?.let {
            call.reject(it, FrameReplayErrorCode.INVALID_CONFIG)
            return
        }
        bridge.executeOnMainThread {
            try {
                camera.replay(options)
                call.resolve()
            } catch (e: Exception) {
                call.reject(e.message ?: e.toString(), FrameReplayErrorCode.INVALID_CONFIG, e)
            }
        }
    }

    @PluginMethod
    fun clear(call: PluginCall) {
        bridge.executeOnMainThread {
            camera.restore()
            call.resolve()
        }
    }
}
