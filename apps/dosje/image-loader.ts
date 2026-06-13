/**
 * Custom next/image loader that injects the app basePath onto local image URLs.
 *
 * Why this exists: this app is mounted under `basePath: "/website"` and proxied
 * by the hub (Multi-Zones). In this Next version, next/image does NOT prefix the
 * basePath onto absolute string `src` values — it emits `/images/x.png` (404 under
 * the mount) and builds optimizer URLs as `/_next/image?url=/images/x.png`, which
 * the optimizer can't resolve (the file is served at `/website/images/x.png`),
 * returning 400 "not a valid image". A custom loader serves the file directly with
 * the basePath applied, which works for both raster images and SVGs.
 *
 * Trade-off: bypasses Next's on-the-fly optimization/resizing. Acceptable here —
 * the cloned assets are already appropriately sized and most usages set width/height.
 *
 * Keep BASE_PATH in sync with `basePath` in next.config.ts.
 */
const BASE_PATH = "/website";

export default function basePathImageLoader({ src }: { src: string; width: number; quality?: number }): string {
  // Leave absolute/remote URLs untouched (e.g. hotlinked CDN images).
  if (/^https?:\/\//.test(src)) return src;
  // Already prefixed — don't double-apply.
  if (src.startsWith(`${BASE_PATH}/`)) return src;
  return `${BASE_PATH}${src.startsWith("/") ? "" : "/"}${src}`;
}
