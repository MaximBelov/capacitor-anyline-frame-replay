require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'CapacitorAnylineFrameReplay'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = package['repository']['url']
  s.author = package['author']
  s.source = { :git => package['repository']['url'], :tag => s.version.to_s }
  # AnylineFrameReplayCore and AnylineFrameReplayPlugin are one module here; the plugin imports the core only when it
  # is a module of its own (SPM).
  s.source_files = 'ios/Sources/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target = '15.0'
  s.dependency 'Capacitor'
  # The app's Anyline pod is the one used; Frame Replay is in every 56.x release.
  s.dependency 'Anyline', '>= 56.0.0'
  s.swift_version = '5.9'
end
