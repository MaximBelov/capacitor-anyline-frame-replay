package io.github.maximbelov.anylineframereplay

import org.json.JSONObject

/** The error codes a call rejects with. The TypeScript API declares the same strings. */
object FrameReplayErrorCode {
    const val INVALID_CONFIG = "INVALID_CONFIG"
}

/** Reads the options of a `set` call, which are the SDK's FrameReplayCutoutSlideshowConfig itself. */
object FrameReplayConfig {
    /**
     * Why [options] cannot be a Frame Replay config, or null when it can. The SDK checks the rest; this catches the call
     * that would otherwise replay nothing: no `cutoutImageConfigs`, or an empty one.
     */
    fun problem(options: JSONObject): String? {
        val configs = options.optJSONArray("cutoutImageConfigs")
        return if (configs == null || configs.length() == 0) {
            "Invalid frame replay config: cutoutImageConfigs must be a non-empty array"
        } else {
            null
        }
    }
}
