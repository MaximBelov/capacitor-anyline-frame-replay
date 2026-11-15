import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import type { AnylineFrameReplayPlugin, FrameReplayCutoutSlideshowConfig } from '../../src';

// What the native side of Capacitor injects into the web view: a bridge object that makes the platform 'android', the
// headers of the installed plugins, and nativePromise, which every promise method of a plugin goes through.
const methods = ['set', 'clear'];
const nativePromise = vi.fn<(...args: unknown[]) => Promise<unknown>>(async () => undefined);
const g = globalThis as Record<string, unknown>;

let AnylineFrameReplay: AnylineFrameReplayPlugin;

beforeAll(async () => {
  g.androidBridge = {};
  g.Capacitor = {
    PluginHeaders: [{ name: 'AnylineFrameReplay', methods: methods.map((name) => ({ name, rtype: 'promise' })) }],
    nativePromise,
  };
  ({ AnylineFrameReplay } = await import('../../src'));
});

afterAll(() => {
  delete g.androidBridge;
  delete g.Capacitor;
});

const config: FrameReplayCutoutSlideshowConfig = {
  backgroundColor: '000000',
  cutoutImageConfigs: [
    { pluginId: 'barcode', imageInfo: [{ imagePath: 'fixtures/code128.png', behavior: { durationMs: 0 } }] },
  ],
};

describe('on a native platform', () => {
  it('sends the config itself as the options of set, to the native plugin named AnylineFrameReplay', async () => {
    await AnylineFrameReplay.set(config);
    expect(nativePromise).toHaveBeenLastCalledWith('AnylineFrameReplay', 'set', config);
  });

  it('passes on what the native side rejects with, code included', async () => {
    nativePromise.mockRejectedValueOnce(
      Object.assign(new Error('Invalid frame replay config: cutoutImageConfigs must be a non-empty array'), {
        code: 'INVALID_CONFIG',
      }),
    );
    await expect(AnylineFrameReplay.set({ cutoutImageConfigs: [] })).rejects.toMatchObject({
      code: 'INVALID_CONFIG',
    });
  });

  it('calls clear with no options', async () => {
    await AnylineFrameReplay.clear();
    expect(nativePromise.mock.lastCall?.slice(0, 2)).toEqual(['AnylineFrameReplay', 'clear']);
  });
});
