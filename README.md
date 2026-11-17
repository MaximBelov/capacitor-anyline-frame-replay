# capacitor-anyline-frame-replay

Feeds the Anyline scanner from images instead of the camera, so a scan can be tested without a camera or a real barcode,
tag or document: on a device farm, on a phone on a desk, in an automated run.

It exposes the Anyline SDK's own test feature, **Frame Replay**, which the Anyline wrappers do not. The plugin is an
add-on to the wrapper that opens the scanner, such as `io-anyline-cordova` running under Capacitor's Cordova
compatibility layer: it calls the SDK's static Frame Replay entry points and nothing else, and every scan view the
wrapper creates afterwards picks them up. Nothing changes until `set()` is called.

| Platform | SDK call                                                                                  |
| -------- | ----------------------------------------------------------------------------------------- |
| Android  | `CustomCameraInterfaceProvider.Factory.setFrameReplayCutoutSlideshowCustomCameraInstance` |
| iOS      | `ALFrameReplayCustomCamera setInstanceWithConfig:imageLoader:`                            |

It is the Capacitor counterpart of `cordova-plugin-anyline-frame-replay`, with the same two calls.

## Install

```bash
npm install capacitor-anyline-frame-replay
npx cap sync
```

Requires Capacitor 8, Android 8.0 (API 26) or newer, iOS 15 or newer, and an Anyline SDK of 56.x, which the app already
has through its Anyline wrapper. There is no web implementation: every call rejects with `UNAVAILABLE` in a browser.

Frame Replay is a test feature. Ship the plugin in test builds only, or make sure nothing calls `set()` in a production
build.

### One copy of the SDK

The plugin brings no Anyline SDK of its own; it uses the one the app's wrapper brings.

- **iOS**: the Swift package depends on `https://github.com/Anyline/anyline-ocr-spm-module.git` (product
  `AnylinePackage`), the package `io-anyline-cordova` takes the SDK from. Swift Package Manager resolves the two to one
  package, so the app links one `Anyline.xcframework`, at the version the app's `Package.resolved` pins. The lower bound
  is 56.0.0. With CocoaPods the plugin depends on the `Anyline` pod, likewise without an upper bound.
- **Android**: the plugin compiles against `io.anyline:anylinesdk` and packages none of it (`compileOnly`), so the APK
  carries the wrapper's copy. It compiles against 56.7.0 unless the app's `variables.gradle` sets `anylineSdkVersion`.
  Without a wrapper in the app, `set()` fails at run time with a missing class.

## Images

A relative `imagePath` is read from the `assets` folder of the app's web assets, on both platforms. In a Capacitor app
that is `public/assets`: so `fixtures/code128.png` is the file your web build writes to `assets/fixtures/code128.png`.

- **iOS**: the plugin reads `<app bundle>/public/assets/<imagePath>`. An absolute path is used as given.
- **Android**: the SDK reads `<asset path prefix>/<imagePath>` from the APK's assets, where the prefix is the folder the
  wrapper initialised the SDK with. `io-anyline-cordova` 56.6.0 passes `www/assets`, Cordova's folder; a Capacitor APK
  has its web assets under `public/`, so under Capacitor the wrapper has to pass `public/assets` for the two platforms to
  agree. The example app carries that change as a patch (`example-app/patches/`).

## Usage

```ts
import { AnylineFrameReplay } from 'capacitor-anyline-frame-replay';

await AnylineFrameReplay.set({
  backgroundColor: '000000',
  cutoutImageConfigs: [
    {
      pluginId: 'barcode',
      imageInfo: [{ imagePath: 'fixtures/code128.png', behavior: { durationMs: 0 } }],
    },
  ],
});
// open the scanner with your Anyline wrapper as usual: it reads the image

await AnylineFrameReplay.clear();
// the next scanner uses the camera again
```

Without a bundler the plugin is `Capacitor.Plugins.AnylineFrameReplay`.

## Differences from cordova-plugin-anyline-frame-replay

- The plugin is `AnylineFrameReplay` from the package, or `Capacitor.Plugins.AnylineFrameReplay`, instead of
  `cordova.plugins.anylineFrameReplay`. The calls return promises; there are no success and failure callbacks.
- A relative image path is read from `public/assets` (Capacitor's web assets) instead of `www/assets`.
- A config without a non-empty `cutoutImageConfigs` array is refused on both platforms, and every refusal has the code
  `INVALID_CONFIG`.

## Tests

- `npm test` runs the TypeScript unit tests; `npm run test:parity` checks that both platforms implement exactly the API,
  with the same error codes, and take the SDK from the wrapper's packages.
- `npm run test:android` runs the JVM tests of the Kotlin: the plugin's name and methods, and the config check.
- `npm run test:ios` runs the Swift core's tests on a Mac (`swift test`): the config check and the image path. The
  Anyline SDK has no macOS or arm64 simulator slice, so the plugin layer is built for a device (`npm run verify:ios`)
  rather than tested on a simulator.
- `example-app/` opens a barcode scanner with `io-anyline-cordova`, with Frame Replay on or off. It needs an Anyline
  licence key for the app id `com.example.plugin`, typed into the page.

## API

<docgen-index>

* [`set(...)`](#set)
* [`clear()`](#clear)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### set(...)

```typescript
set(config: FrameReplayCutoutSlideshowConfig) => Promise<void>
```

Replaces the camera with the images in `config` for every scan view the Anyline SDK creates after this call, until
`clear()`. A scan view that is already open keeps its camera.

Rejects with `INVALID_CONFIG` when the config is refused.

| Param        | Type                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------- |
| **`config`** | <code><a href="#framereplaycutoutslideshowconfig">FrameReplayCutoutSlideshowConfig</a></code> |

**Since:** 0.1.0

--------------------


### clear()

```typescript
clear() => Promise<void>
```

Brings the camera back for every scan view created after this call. Calling it when nothing was set is fine.

**Since:** 0.1.0

--------------------


### Interfaces


#### FrameReplayCutoutSlideshowConfig

The Anyline SDK's <a href="#framereplaycutoutslideshowconfig">`FrameReplayCutoutSlideshowConfig`</a>. Only the fields most tests need are typed here; the SDK reads
the whole object, so any other field it documents can be passed too.

| Prop                     | Type                                        | Description                                                                |
| ------------------------ | ------------------------------------------- | -------------------------------------------------------------------------- |
| **`backgroundColor`**    | <code>string</code>                         | Hex colour without `#` (`RRGGBB` or `AARRGGBB`), drawn around the cutouts. |
| **`cutoutImageConfigs`** | <code>FrameReplayCutoutImageConfig[]</code> | One entry per scan plugin. At least one is required.                       |


#### FrameReplayCutoutImageConfig

The images for the cutout of one scan plugin.

| Prop            | Type                                | Description                                                                        |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------- |
| **`pluginId`**  | <code>string</code>                 | The scan plugin whose cutout the images fill, by its `id` in the scan view config. |
| **`imageInfo`** | <code>FrameReplayImageInfo[]</code> | The images, in the order they are shown.                                           |


#### FrameReplayImageInfo

One image of a slideshow.

| Prop            | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`imagePath`** | <code>string</code>                   | The image file. A relative path is read from the `assets` folder of the app's web assets, `public/assets`: in the app bundle on iOS, and in the APK on Android, where the SDK prepends the folder the Anyline wrapper initialised it with (see Images above). So `fixtures/code128.png` is the file your web build puts at `assets/fixtures/code128.png`. iOS also takes an absolute path, used as given. |
| **`behavior`**  | <code>{ durationMs?: number; }</code> | How long the image is shown before the next one. `durationMs: 0` keeps it for good.                                                                                                                                                                                                                                                                                                                       |

</docgen-api>
