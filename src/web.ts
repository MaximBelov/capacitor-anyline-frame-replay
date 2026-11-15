import { WebPlugin } from '@capacitor/core';

import type { AnylineFrameReplayPlugin } from './definitions';

/** The Anyline SDK has no web version: every call rejects with Capacitor's `UNAVAILABLE`. */
export class AnylineFrameReplayWeb extends WebPlugin implements AnylineFrameReplayPlugin {
  async set(): Promise<void> {
    throw this.unavailable('Anyline Frame Replay is not available on the web.');
  }

  async clear(): Promise<void> {
    throw this.unavailable('Anyline Frame Replay is not available on the web.');
  }
}
