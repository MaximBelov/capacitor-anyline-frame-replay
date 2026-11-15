import { AnylineFrameReplay } from 'capacitor-anyline-frame-replay';

// Every call is written into #log and kept in window.frameReplayLog, so a person can read it and a script can poll it.
window.frameReplayLog = [];
const log = (line) => {
  window.frameReplayLog.push(line);
  document.getElementById('log').textContent = window.frameReplayLog.join('\n');
};
const run = (name, action) => async () => {
  try {
    log(`${name}: ${JSON.stringify((await action()) ?? 'ok')}`);
  } catch (error) {
    log(`${name}: FAIL ${error.code ?? ''} ${error.message ?? error}`);
  }
};

// io-anyline-cordova is a Cordova plugin: its calls take callbacks.
const anyline = (method, ...args) =>
  new Promise((resolve, reject) => {
    if (!window.Anyline) {
      reject(new Error('io-anyline-cordova is not in this build'));
      return;
    }
    window.Anyline[method](...args, resolve, reject);
  });

// A minimal barcode scan view: one plugin, whose id is the pluginId the replay config names.
const SCAN_CONFIG = {
  viewPluginConfig: {
    pluginConfig: { id: 'barcode', barcodeConfig: { barcodeFormats: ['CODE_128'] }, cancelOnResult: true },
  },
};

const REPLAY_CONFIG = {
  backgroundColor: '000000',
  cutoutImageConfigs: [
    { pluginId: 'barcode', imageInfo: [{ imagePath: 'fixtures/code128.png', behavior: { durationMs: 0 } }] },
  ],
};

const click = (id, handler) => document.getElementById(id).addEventListener('click', handler);
click(
  'init',
  run('initAnylineSDK', () => anyline('initAnylineSDK', document.getElementById('licence').value.trim())),
);
click(
  'set',
  run('set', () => AnylineFrameReplay.set(REPLAY_CONFIG)),
);
click(
  'clear',
  run('clear', () => AnylineFrameReplay.clear()),
);
click(
  'scan',
  run('scan', async () => {
    const result = await anyline('scan', SCAN_CONFIG);
    return result?.barcodeResult?.barcodes?.[0]?.value ?? result;
  }),
);
