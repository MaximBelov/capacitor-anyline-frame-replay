# Example app

A test page for a phone: it initialises the Anyline SDK through `io-anyline-cordova`, turns Frame Replay on or off with
this plugin, and opens a barcode scanner. With Frame Replay on, the scanner reads `src/public/assets/fixtures/code128.png`
(a Code 128 of the dummy value `EXAMPLE-0001`, generated with `bwip-js` 4.11.4: scale 4, height 18, 30 px padding) instead of the camera.

```bash
npm install            # also applies patches/ to io-anyline-cordova
npm run build
npx cap sync           # or: npx cap sync android / ios
npx cap run android    # or open ios/App/App.xcodeproj in Xcode
```

The SDK needs a licence key for the app id `com.example.plugin`; type it into the page.

`patches/io-anyline-cordova+56.6.0.patch` makes `io-anyline-cordova` 56.6.0 work under Capacitor:

- Android: it initialises the SDK with `public/assets`, where a Capacitor APK has its web assets, instead of
  `www/assets`, so a relative image path resolves to the same file as on iOS. It also builds on Gradle 9
  (`groovy.xml.XmlSlurper` imported, `mavenCentral()` in place of the removed `jcenter()`).
- iOS: its Swift package takes Cordova from `capacitor-swift-pm` rather than `cordova-ios`.
