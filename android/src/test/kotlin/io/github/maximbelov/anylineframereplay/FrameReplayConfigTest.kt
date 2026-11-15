package io.github.maximbelov.anylineframereplay

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Test

class FrameReplayConfigTest {
    @Test
    fun acceptsAConfigWithACutout() {
        val options = JSONObject(
            """{"backgroundColor":"000000","cutoutImageConfigs":[{"pluginId":"barcode","imageInfo":[{"imagePath":"fixtures/code128.png"}]}]}""",
        )
        assertNull(FrameReplayConfig.problem(options))
    }

    @Test
    fun refusesAConfigWithoutCutouts() {
        assertNotNull(FrameReplayConfig.problem(JSONObject()))
        assertNotNull(FrameReplayConfig.problem(JSONObject("""{"cutoutImageConfigs":[]}""")))
        assertNotNull(FrameReplayConfig.problem(JSONObject("""{"cutoutImageConfigs":"barcode"}""")))
    }

    @Test
    fun theErrorCodeIsTheOneTheApiDeclares() {
        assertEquals("INVALID_CONFIG", FrameReplayErrorCode.INVALID_CONFIG)
    }
}
