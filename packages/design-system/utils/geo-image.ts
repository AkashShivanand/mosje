/* ============================================================================
   MoSJE / SAMAVESH — geo-image utilities
   EXIF GPS extraction + canvas downscaling for GeoPhotoInput.

   Why downscale at all: field evidence photos arrive at up to 10 MB each and
   the prototype persists them as data-URLs in localStorage (~5 MB origin
   quota). Four 10 MB originals are ~53 MB once base64-encoded, so originals
   can never be persisted. We keep a 1600px view copy and a 320px thumbnail
   (~1.2 MB per submission) and hold the original only as an in-session blob.

   No dependencies: the EXIF reader is a minimal TIFF/IFD walker that reads
   only the GPS sub-IFD.
   ============================================================================ */

/** Decimal-degree coordinate pair read from a photo's own EXIF metadata. */
export interface ExifGps {
  lat: number;
  lng: number;
}

/** Result of downscaling an image through a canvas. */
export interface DownscaleResult {
  dataUrl: string;
  width: number;
  height: number;
}

const JPEG_SOI = 0xffd8;
const MARKER_APP1 = 0xffe1;
const EXIF_SIG_HEAD = 0x45786966; // "Exif"
const TIFF_LITTLE_ENDIAN = 0x4949; // "II"
const TIFF_BIG_ENDIAN = 0x4d4d; // "MM"
const TIFF_MAGIC = 0x002a;

const TAG_GPS_IFD_POINTER = 0x8825;
const TAG_GPS_LAT_REF = 0x0001;
const TAG_GPS_LAT = 0x0002;
const TAG_GPS_LNG_REF = 0x0003;
const TAG_GPS_LNG = 0x0004;

const TYPE_ASCII = 2;
const TYPE_RATIONAL = 5;

/** EXIF lives near the start of the file; 256 KB is far more than enough. */
const EXIF_SCAN_BYTES = 256 * 1024;

interface IfdEntry {
  tag: number;
  type: number;
  count: number;
  /** Offset of the entry's 4-byte value/offset field. */
  valueFieldOffset: number;
}

function readEntries(view: DataView, ifdOffset: number, le: boolean): IfdEntry[] {
  const entries: IfdEntry[] = [];
  if (ifdOffset < 0 || ifdOffset + 2 > view.byteLength) return entries;
  const count = view.getUint16(ifdOffset, le);
  for (let i = 0; i < count; i += 1) {
    const entry = ifdOffset + 2 + i * 12;
    if (entry + 12 > view.byteLength) break;
    entries.push({
      tag: view.getUint16(entry, le),
      type: view.getUint16(entry + 2, le),
      count: view.getUint32(entry + 4, le),
      valueFieldOffset: entry + 8,
    });
  }
  return entries;
}

function findEntry(entries: IfdEntry[], tag: number): IfdEntry | undefined {
  return entries.find((e) => e.tag === tag);
}

/** Read a short ASCII tag (the N/S/E/W hemisphere refs are 2 bytes each). */
function readAsciiTag(
  view: DataView,
  entries: IfdEntry[],
  tag: number,
  tiffStart: number,
  le: boolean,
): string | null {
  const entry = findEntry(entries, tag);
  if (!entry || entry.type !== TYPE_ASCII || entry.count === 0) return null;
  // Values of 4 bytes or fewer are stored inline in the value field.
  const base =
    entry.count <= 4 ? entry.valueFieldOffset : tiffStart + view.getUint32(entry.valueFieldOffset, le);
  if (base < 0 || base >= view.byteLength) return null;
  const code = view.getUint8(base);
  return code === 0 ? null : String.fromCharCode(code);
}

/** Read `n` RATIONALs (each a uint32 numerator + uint32 denominator). */
function readRationalTag(
  view: DataView,
  entries: IfdEntry[],
  tag: number,
  tiffStart: number,
  le: boolean,
  n: number,
): number[] | null {
  const entry = findEntry(entries, tag);
  if (!entry || entry.type !== TYPE_RATIONAL || entry.count < n) return null;
  // 3 rationals = 24 bytes, never inline, so the value field is always an offset.
  const base = tiffStart + view.getUint32(entry.valueFieldOffset, le);
  if (base < 0 || base + n * 8 > view.byteLength) return null;

  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const numerator = view.getUint32(base + i * 8, le);
    const denominator = view.getUint32(base + i * 8 + 4, le);
    if (denominator === 0) return null;
    out.push(numerator / denominator);
  }
  return out;
}

function dmsToDecimal(dms: number[], ref: string): number {
  const deg = dms[0] ?? 0;
  const min = dms[1] ?? 0;
  const sec = dms[2] ?? 0;
  const magnitude = deg + min / 60 + sec / 3600;
  return ref === "S" || ref === "W" ? -magnitude : magnitude;
}

function parseTiffForGps(view: DataView, tiffStart: number): ExifGps | null {
  if (tiffStart + 8 > view.byteLength) return null;

  const byteOrder = view.getUint16(tiffStart);
  if (byteOrder !== TIFF_LITTLE_ENDIAN && byteOrder !== TIFF_BIG_ENDIAN) return null;
  const le = byteOrder === TIFF_LITTLE_ENDIAN;

  if (view.getUint16(tiffStart + 2, le) !== TIFF_MAGIC) return null;

  const ifd0 = tiffStart + view.getUint32(tiffStart + 4, le);
  const gpsPointer = findEntry(readEntries(view, ifd0, le), TAG_GPS_IFD_POINTER);
  if (!gpsPointer) return null;

  const gpsIfd = tiffStart + view.getUint32(gpsPointer.valueFieldOffset, le);
  const gpsEntries = readEntries(view, gpsIfd, le);
  if (gpsEntries.length === 0) return null;

  const latRef = readAsciiTag(view, gpsEntries, TAG_GPS_LAT_REF, tiffStart, le);
  const lngRef = readAsciiTag(view, gpsEntries, TAG_GPS_LNG_REF, tiffStart, le);
  const lat = readRationalTag(view, gpsEntries, TAG_GPS_LAT, tiffStart, le, 3);
  const lng = readRationalTag(view, gpsEntries, TAG_GPS_LNG, tiffStart, le, 3);
  if (!latRef || !lngRef || !lat || !lng) return null;

  const latDecimal = dmsToDecimal(lat, latRef);
  const lngDecimal = dmsToDecimal(lng, lngRef);

  if (!Number.isFinite(latDecimal) || !Number.isFinite(lngDecimal)) return null;
  if (Math.abs(latDecimal) > 90 || Math.abs(lngDecimal) > 180) return null;
  // 0,0 is Null Island — in practice a cleared/absent tag, not a real location.
  if (latDecimal === 0 && lngDecimal === 0) return null;

  return { lat: latDecimal, lng: lngDecimal };
}

/**
 * Read GPS coordinates from a photo's own EXIF metadata.
 *
 * Returns `null` whenever the tag is absent or unreadable, which is the common
 * case: WhatsApp, Telegram, iOS screenshots and most re-encoders strip EXIF.
 * Callers must treat `null` as "fall back to device location", never as an
 * error worth blocking the user over.
 */
export async function readExifGps(file: File): Promise<ExifGps | null> {
  // Only JPEG carries EXIF in a form worth parsing here; PNG has no standard
  // GPS chunk, so we skip straight to the device-location fallback.
  if (file.type !== "image/jpeg") return null;

  try {
    const head = await file.slice(0, Math.min(EXIF_SCAN_BYTES, file.size)).arrayBuffer();
    const view = new DataView(head);
    if (view.byteLength < 4 || view.getUint16(0) !== JPEG_SOI) return null;

    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      const marker = view.getUint16(offset);
      // Every JPEG segment marker starts with 0xFF; anything else means we have
      // walked into entropy-coded data and there is no APP1 to find.
      if ((marker & 0xff00) !== 0xff00) return null;

      const segmentLength = view.getUint16(offset + 2);
      if (segmentLength < 2) return null;

      if (marker === MARKER_APP1) {
        const sig = offset + 4;
        if (
          sig + 6 <= view.byteLength &&
          view.getUint32(sig) === EXIF_SIG_HEAD &&
          view.getUint16(sig + 4) === 0x0000
        ) {
          return parseTiffForGps(view, sig + 6);
        }
      }

      offset += 2 + segmentLength;
    }
    return null;
  } catch {
    return null;
  }
}

interface DecodedImage {
  width: number;
  height: number;
  source: CanvasImageSource;
  release: () => void;
}

async function decodeImage(file: File): Promise<DecodedImage> {
  // createImageBitmap with `from-image` applies the EXIF orientation flag, so
  // portrait phone photos are not written to canvas sideways.
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        width: bitmap.width,
        height: bitmap.height,
        source: bitmap,
        release: () => bitmap.close(),
      };
    } catch {
      // Fall through to the HTMLImageElement path below.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Image could not be decoded."));
      el.src = objectUrl;
    });
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      source: image,
      release: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

/**
 * Downscale an image so its longest edge is at most `maxEdge`, encoded as JPEG.
 *
 * Images already smaller than `maxEdge` are still re-encoded, which is
 * deliberate: a 9 MB PNG shrinks to a few hundred KB as JPEG, and uniform
 * output keeps the persisted size predictable.
 */
export async function downscaleImage(
  file: File,
  maxEdge: number,
  quality: number,
): Promise<DownscaleResult> {
  const decoded = await decodeImage(file);
  try {
    const { width, height } = decoded;
    if (width === 0 || height === 0) {
      throw new Error("Image reported zero dimensions.");
    }

    const scale = Math.min(1, maxEdge / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable.");
    ctx.drawImage(decoded.source, 0, 0, targetWidth, targetHeight);

    return {
      dataUrl: canvas.toDataURL("image/jpeg", quality),
      width: targetWidth,
      height: targetHeight,
    };
  } finally {
    decoded.release();
  }
}

/** Browser geolocation as a promise, resolving to `null` on denial or timeout. */
export function readDeviceLocation(
  timeoutMs = 10_000,
): Promise<{ lat: number; lng: number; accuracyM: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracyM: position.coords.accuracy,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}

/** Format a coordinate pair for display, e.g. `18.5204° N, 73.8567° E`. */
export function formatCoordinates(lat: number, lng: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}
