import XCTest
@testable import AnylineFrameReplayCore

final class FrameReplayConfigTests: XCTestCase {
    func testAcceptsAConfigWithACutout() {
        let options: [String: Any] = [
            "backgroundColor": "000000",
            "cutoutImageConfigs": [["pluginId": "barcode", "imageInfo": [["imagePath": "fixtures/code128.png"]]]]
        ]
        XCTAssertNil(FrameReplayConfig.problem(in: options))
    }

    func testRefusesAConfigWithoutCutouts() {
        XCTAssertNotNil(FrameReplayConfig.problem(in: [:]))
        XCTAssertNotNil(FrameReplayConfig.problem(in: ["cutoutImageConfigs": []]))
        XCTAssertNotNil(FrameReplayConfig.problem(in: ["cutoutImageConfigs": "barcode"]))
    }

    func testTurnsTheOptionsIntoTheJsonTheSdkParses() throws {
        let options: [String: Any] = [
            "cutoutImageConfigs": [["pluginId": "barcode", "imageInfo": [["imagePath": "a.png", "behavior": ["durationMs": 0]]]]]
        ]
        let json = try FrameReplayConfig.json(from: options)
        let back = try XCTUnwrap(JSONSerialization.jsonObject(with: Data(json.utf8)) as? [String: Any])
        let cutouts = try XCTUnwrap(back["cutoutImageConfigs"] as? [[String: Any]])
        XCTAssertEqual(cutouts.first?["pluginId"] as? String, "barcode")
    }

    func testTheErrorCodeIsTheOneTheApiDeclares() {
        XCTAssertEqual(FrameReplayErrorCode.invalidConfig, "INVALID_CONFIG")
    }
}

final class ImagePathResolverTests: XCTestCase {
    func testReadsARelativePathFromPublicAssetsInTheBundle() {
        let resolver = ImagePathResolver(bundleURL: URL(fileURLWithPath: "/var/App.app", isDirectory: true))
        XCTAssertEqual(resolver.path(for: "fixtures/code128.png"), "/var/App.app/public/assets/fixtures/code128.png")
    }

    func testUsesAnAbsolutePathAsGiven() {
        let resolver = ImagePathResolver(bundleURL: URL(fileURLWithPath: "/var/App.app", isDirectory: true))
        XCTAssertEqual(resolver.path(for: "/tmp/tag.png"), "/tmp/tag.png")
    }
}
