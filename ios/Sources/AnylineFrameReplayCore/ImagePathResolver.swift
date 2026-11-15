import Foundation

/// Where the image of a slide is read from on iOS.
///
/// A relative path is read from the `assets` folder of the web assets in the app bundle, which a Capacitor app ships
/// as `public/`. That is the folder Android reads it from too: there the SDK prepends the asset path prefix it was
/// initialised with, `public/assets` in a Capacitor APK. An absolute path is used as given.
public struct ImagePathResolver {
    public let assetsRoot: URL

    public init(assetsRoot: URL) {
        self.assetsRoot = assetsRoot
    }

    /// The resolver for an app bundle: `<bundle>/public/assets`.
    public init(bundleURL: URL) {
        self.init(assetsRoot: bundleURL.appendingPathComponent("public", isDirectory: true)
                    .appendingPathComponent("assets", isDirectory: true))
    }

    public func path(for imagePath: String) -> String {
        if (imagePath as NSString).isAbsolutePath {
            return imagePath
        }
        return assetsRoot.appendingPathComponent(imagePath).path
    }
}
