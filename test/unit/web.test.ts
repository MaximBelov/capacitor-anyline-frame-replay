import { CapacitorException, ExceptionCode } from '@capacitor/core';
import { describe, expect, it } from 'vitest';

import { AnylineFrameReplay } from '../../src';
import { AnylineFrameReplayWeb } from '../../src/web';

// No native bridge on globalThis, so Capacitor reports the platform as 'web' and loads src/web.ts.
describe('on the web', () => {
  it('rejects every call with UNAVAILABLE through the registered plugin', async () => {
    await expect(AnylineFrameReplay.set({ cutoutImageConfigs: [] })).rejects.toMatchObject({
      code: ExceptionCode.Unavailable,
    });
    await expect(AnylineFrameReplay.clear()).rejects.toMatchObject({ code: ExceptionCode.Unavailable });
  });

  it('rejects with a CapacitorException for each method', async () => {
    const web = new AnylineFrameReplayWeb();
    for (const call of [web.set(), web.clear()]) {
      expect(await call.catch((e: unknown) => e)).toBeInstanceOf(CapacitorException);
    }
  });
});
