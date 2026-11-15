/** One image of a slideshow. */
export interface FrameReplayImageInfo {
  /**
   * The image file. A relative path is read from the `assets` folder of the app's web assets, `public/assets`: in the
   * app bundle on iOS, and in the APK on Android, where the SDK prepends the folder the Anyline wrapper initialised it
   * with (see Images above). So `fixtures/code128.png` is the file your web build puts at `assets/fixtures/code128.png`.
   * iOS also takes an absolute path, used as given.
   */
  imagePath: string;
  /** How long the image is shown before the next one. `durationMs: 0` keeps it for good. */
  behavior?: { durationMs?: number };
}

/** The images for the cutout of one scan plugin. */
export interface FrameReplayCutoutImageConfig {
  /** The scan plugin whose cutout the images fill, by its `id` in the scan view config. */
  pluginId: string;
  /** The images, in the order they are shown. */
  imageInfo: FrameReplayImageInfo[];
}

/**
 * The Anyline SDK's `FrameReplayCutoutSlideshowConfig`. Only the fields most tests need are typed here; the SDK reads
 * the whole object, so any other field it documents can be passed too.
 */
export interface FrameReplayCutoutSlideshowConfig {
  /** Hex colour without `#` (`RRGGBB` or `AARRGGBB`), drawn around the cutouts. */
  backgroundColor?: string;
  /** One entry per scan plugin. At least one is required. */
  cutoutImageConfigs: FrameReplayCutoutImageConfig[];
  [field: string]: unknown;
}

/**
 * What a call rejects with, in the error's `code`:
 *
 * - `INVALID_CONFIG`: `set` was given a config without a non-empty `cutoutImageConfigs` array, or one the SDK refused;
 *   the message says which.
 */
export type AnylineFrameReplayErrorCode = 'INVALID_CONFIG';

export interface AnylineFrameReplayPlugin {
  /**
   * Replaces the camera with the images in `config` for every scan view the Anyline SDK creates after this call, until
   * `clear()`. A scan view that is already open keeps its camera.
   *
   * Rejects with `INVALID_CONFIG` when the config is refused.
   *
   * @since 0.1.0
   */
  set(config: FrameReplayCutoutSlideshowConfig): Promise<void>;

  /**
   * Brings the camera back for every scan view created after this call. Calling it when nothing was set is fine.
   *
   * @since 0.1.0
   */
  clear(): Promise<void>;
}
