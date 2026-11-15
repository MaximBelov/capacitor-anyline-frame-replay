// swift-tools-version: 5.9
import Foundation
import PackageDescription

// AnylineFrameReplayCore (reading the config, resolving an image path) needs only Foundation; AnylineFrameReplayPlugin
// is the Capacitor and Anyline layer on top. The Anyline SDK ships no macOS slice and no arm64 simulator slice, so on a
// Mac `ANYLINE_FRAME_REPLAY_CORE_ONLY=1 swift test` builds and tests the core alone. An app never sets it.
//
// The SDK is taken from the same package, under the same identity, as io-anyline-cordova takes it, so Swift Package
// Manager resolves the two to one package and the app links one copy of Anyline.xcframework. The lower bound is the
// first release with Frame Replay; the app's own pin decides the version.
let coreOnly = ProcessInfo.processInfo.environment["ANYLINE_FRAME_REPLAY_CORE_ONLY"] != nil

var targets: [Target] = [
    .target(
        name: "AnylineFrameReplayCore",
        path: "ios/Sources/AnylineFrameReplayCore"),
    .testTarget(
        name: "AnylineFrameReplayCoreTests",
        dependencies: ["AnylineFrameReplayCore"],
        path: "ios/Tests/AnylineFrameReplayCoreTests")
]
var products: [Product] = [
    .library(name: "AnylineFrameReplayCore", targets: ["AnylineFrameReplayCore"])
]
var dependencies: [Package.Dependency] = []

if !coreOnly {
    dependencies += [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/Anyline/anyline-ocr-spm-module.git", from: "56.0.0")
    ]
    products = [
        .library(
            name: "CapacitorAnylineFrameReplay",
            targets: ["AnylineFrameReplayPlugin"])
    ]
    targets += [
        .target(
            name: "AnylineFrameReplayPlugin",
            dependencies: [
                "AnylineFrameReplayCore",
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "AnylinePackage", package: "anyline-ocr-spm-module")
            ],
            path: "ios/Sources/AnylineFrameReplayPlugin")
    ]
}

let package = Package(
    name: "CapacitorAnylineFrameReplay",
    platforms: [.iOS(.v15), .macOS(.v12)],
    products: products,
    dependencies: dependencies,
    targets: targets
)
