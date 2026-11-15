import { registerPlugin } from '@capacitor/core';

import type { AnylineFrameReplayPlugin } from './definitions';

const AnylineFrameReplay = registerPlugin<AnylineFrameReplayPlugin>('AnylineFrameReplay', {
  web: () => import('./web').then((m) => new m.AnylineFrameReplayWeb()),
});

export * from './definitions';
export { AnylineFrameReplay };
