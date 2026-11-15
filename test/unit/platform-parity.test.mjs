// Every method of the TypeScript API has its native method on both platforms and its section in the README, and neither
// platform has a method the API does not declare. A miss on either side compiles fine and fails only on a phone. Plain
// Node, no install.
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const definitions = read('src/definitions.ts');
const api = [...definitions.matchAll(/^\s+(\w+)\([^)]*\):\s*Promise</gm)].map((m) => m[1]).sort();
const swift = read('ios/Sources/AnylineFrameReplayPlugin/AnylineFrameReplayPlugin.swift');
const kotlin = read('android/src/main/kotlin/io/github/maximbelov/anylineframereplay/AnylineFrameReplayPlugin.kt');
const ios = [...swift.matchAll(/CAPPluginMethod\(name:\s*"(\w+)"/g)].map((m) => m[1]).sort();
const iosFunctions = [...swift.matchAll(/@objc (?:override )?(?:public )?func (\w+)\(_ call: CAPPluginCall\)/g)]
  .map((m) => m[1])
  .sort();
const android = [...kotlin.matchAll(/@PluginMethod\s+(?:override\s+)?fun (\w+)\(/g)].map((m) => m[1]).sort();

test('the API declares its methods', () => {
  assert.deepEqual(api, ['clear', 'set']);
});

test('iOS registers exactly the methods of the API', () => {
  assert.deepEqual(ios, api);
});

test('iOS has an @objc function for every registered method', () => {
  assert.deepEqual(iosFunctions, api);
});

test('Android annotates exactly the methods of the API', () => {
  assert.deepEqual(android, api);
});

test('the plugin has the same name in JavaScript, Swift and Kotlin', () => {
  assert.match(read('src/index.ts'), /registerPlugin<AnylineFrameReplayPlugin>\('AnylineFrameReplay'/);
  assert.match(swift, /jsName = "AnylineFrameReplay"/);
  assert.match(kotlin, /name = "AnylineFrameReplay"/);
});

test('both platforms reject with the same error codes, and only codes the API declares', () => {
  const declared = [...definitions.matchAll(/'([A-Z_]+)'/g)].map((m) => m[1]).sort();
  const swiftCore = read('ios/Sources/AnylineFrameReplayCore/FrameReplayConfig.swift');
  const kotlinCore = read('android/src/main/kotlin/io/github/maximbelov/anylineframereplay/FrameReplayConfig.kt');
  const iosCodes = [...swiftCore.matchAll(/static let \w+ = "([A-Z_]+)"/g)].map((m) => m[1]).sort();
  const androidCodes = [...kotlinCore.matchAll(/const val \w+ = "([A-Z_]+)"/g)].map((m) => m[1]).sort();
  assert.deepEqual(iosCodes, declared);
  assert.deepEqual(androidCodes, declared);
});

test('both platforms refuse a config without cutoutImageConfigs with the same message', () => {
  const message = 'Invalid frame replay config: cutoutImageConfigs must be a non-empty array';
  assert.ok(read('ios/Sources/AnylineFrameReplayCore/FrameReplayConfig.swift').includes(message));
  assert.ok(read('android/src/main/kotlin/io/github/maximbelov/anylineframereplay/FrameReplayConfig.kt').includes(message));
});

test('the SDK comes from the packages the app wrapper uses, so the app links one copy', () => {
  // iOS: the same SPM package, identity and product as io-anyline-cordova. Android: compiled against, never packaged.
  assert.match(read('Package.swift'), /\.package\(url: "https:\/\/github\.com\/Anyline\/anyline-ocr-spm-module\.git", from: "[\d.]+"\)/);
  assert.match(read('Package.swift'), /\.product\(name: "AnylinePackage", package: "anyline-ocr-spm-module"\)/);
  const gradle = read('android/build.gradle');
  assert.match(gradle, /compileOnly "io\.anyline:anylinesdk:\$anylineSdkVersion"/);
  assert.doesNotMatch(gradle, /(?:implementation|api) ["']io\.anyline:anylinesdk/);
});

test('the README documents every method', () => {
  const readme = read('README.md');
  for (const method of api) {
    assert.match(readme, new RegExp(`### ${method}\\(`), `README.md has no section for ${method}()`);
  }
});
