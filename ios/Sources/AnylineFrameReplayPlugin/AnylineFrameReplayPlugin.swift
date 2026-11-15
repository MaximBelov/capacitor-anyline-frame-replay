import Foundation
import UIKit
import Capacitor
import Anyline.FrameReplay
#if canImport(AnylineFrameReplayCore)
import AnylineFrameReplayCore
#endif

/// The Anyline SDK's Frame Replay: every scan view created after `set` reads its frames from images instead of the
/// camera, until `clear`.
///
/// Both calls set a static of the SDK, so they reach the scan views of whichever wrapper creates them, io-anyline-cordova
/// included. The SDK asks for them on the main thread, so every call hops there.
@objc(AnylineFrameReplayPlugin)
public class AnylineFrameReplayPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AnylineFrameReplayPlugin"
    public let jsName = "AnylineFrameReplay"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clear", returnType: CAPPluginReturnPromise)
    ]

    @objc func set(_ call: CAPPluginCall) {
        let options = (call.options as? [String: Any]) ?? [:]
        if let problem = FrameReplayConfig.problem(in: options) {
            call.reject(problem, FrameReplayErrorCode.invalidConfig)
            return
        }
        let json: String
        do {
            json = try FrameReplayConfig.json(from: options)
        } catch {
            call.reject("Invalid frame replay config: \(error.localizedDescription)", FrameReplayErrorCode.invalidConfig)
            return
        }
        let resolver = ImagePathResolver(bundleURL: Bundle.main.bundleURL)
        DispatchQueue.main.async {
            let config: ALFrameReplayCutoutSlideshowConfig
            do {
                config = try ALFrameReplayCutoutSlideshowConfig.fromJSON(json, encoding: String.Encoding.utf8.rawValue)
            } catch {
                call.reject(error.localizedDescription, FrameReplayErrorCode.invalidConfig)
                return
            }
            ALFrameReplayCustomCamera.setInstanceWith(config) { imagePath in
                UIImage(contentsOfFile: resolver.path(for: imagePath))
            }
            call.resolve()
        }
    }

    @objc func clear(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            ALFrameReplayCustomCamera.clearInstance()
            call.resolve()
        }
    }
}
