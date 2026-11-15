package io.github.maximbelov.anylineframereplay

import io.anyline2.di.camera.CustomCameraInterfaceProvider
import io.anyline2.sdk.extension.test.getFrameReplayCutoutSlideshowConfigFromJsonObject
import org.json.JSONObject

/** What the plugin switches: the SDK's camera in an app, a fake in the tests. */
interface FrameReplayCamera {
    /** Replays [config] in every scan view created after the call. Throws when the SDK refuses the config. */
    fun replay(config: JSONObject)

    /** Brings the device camera back for the scan views created after the call. */
    fun restore()
}

/**
 * The SDK's own entry points. Both set a static of the SDK, so they reach the scan views of whichever wrapper creates
 * them, io-anyline-cordova included. A relative image path is read from the APK's assets under the SDK's asset path
 * prefix, the folder the wrapper initialised the SDK with.
 */
object AnylineFrameReplayCamera : FrameReplayCamera {
    override fun replay(config: JSONObject) {
        val parsed = getFrameReplayCutoutSlideshowConfigFromJsonObject(config)
            ?: throw IllegalArgumentException("Invalid frame replay config")
        CustomCameraInterfaceProvider.Factory.setFrameReplayCutoutSlideshowCustomCameraInstance(parsed)
    }

    override fun restore() {
        CustomCameraInterfaceProvider.Factory.setInstance(null)
    }
}
