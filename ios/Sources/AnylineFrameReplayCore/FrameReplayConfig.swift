import Foundation

/// The error codes a call rejects with. The TypeScript API declares the same strings.
public enum FrameReplayErrorCode {
    public static let invalidConfig = "INVALID_CONFIG"
}

/// Reads the options of a `set` call, which are the SDK's FrameReplayCutoutSlideshowConfig itself.
public enum FrameReplayConfig {
    /// Why `options` cannot be a Frame Replay config, or nil when it can. The SDK checks the rest; this catches the call
    /// that would otherwise replay nothing: no `cutoutImageConfigs`, or an empty one.
    public static func problem(in options: [String: Any]) -> String? {
        guard let configs = options["cutoutImageConfigs"] as? [Any], !configs.isEmpty else {
            return "Invalid frame replay config: cutoutImageConfigs must be a non-empty array"
        }
        return nil
    }

    /// The options as the JSON text the SDK parses.
    public static func json(from options: [String: Any]) throws -> String {
        let data = try JSONSerialization.data(withJSONObject: options, options: [.sortedKeys])
        guard let text = String(data: data, encoding: .utf8) else {
            throw CocoaError(.coderInvalidValue)
        }
        return text
    }
}
