// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.6.2"),
        .package(name: "CapacitorAnylineFrameReplay", path: "../../../.."),
        .package(name: "io-anyline-cordova", path: "../../../node_modules/io-anyline-cordova")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorAnylineFrameReplay", package: "CapacitorAnylineFrameReplay"),
                .product(name: "io-anyline-cordova", package: "io-anyline-cordova")
            ]
        )
    ]
)
