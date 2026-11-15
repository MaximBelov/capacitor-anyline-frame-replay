package io.github.maximbelov.anylineframereplay

import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

// The JavaScript reaches the plugin by the name in @CapacitorPlugin and each method by its name; a rename on either side
// fails only at run time on a phone, so both are pinned here.
class AnylineFrameReplayPluginTest {
    @Test
    fun isRegisteredUnderTheNameTheJavaScriptUses() {
        val annotation = AnylineFrameReplayPlugin::class.java.getAnnotation(CapacitorPlugin::class.java)
        assertNotNull(annotation)
        assertEquals("AnylineFrameReplay", annotation!!.name)
    }

    @Test
    fun exposesExactlyTheMethodsOfTheApi() {
        val methods = AnylineFrameReplayPlugin::class.java.declaredMethods
            .filter { it.isAnnotationPresent(PluginMethod::class.java) }
            .map { it.name }
            .sorted()
        assertEquals(listOf("clear", "set"), methods)
        methods.forEach { AnylineFrameReplayPlugin::class.java.getMethod(it, PluginCall::class.java) }
    }
}
