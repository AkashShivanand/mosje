// Tests for the EXIF GPS reader used by GeoPhotoInput.
// Run: npm test -w @mosje/design-system
//
// The downscaling half needs a canvas, so it is covered by browser QA rather
// than here. This file covers the part that is pure byte-parsing, which is
// exactly where a hand-rolled reader is most likely to be wrong.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readExifGps, formatCoordinates } from "./geo-image.ts";

/**
 * Build a minimal but structurally valid JPEG carrying an EXIF GPS tag.
 * Little-endian TIFF, IFD0 with only a GPS-IFD pointer, GPS IFD with the four
 * tags the reader looks at.
 */
function jpegWithGps(
  lat: [number, number, number],
  latRef: string,
  lng: [number, number, number],
  lngRef: string,
): File {
  const TIFF_LEN = 128;
  const tiff = new DataView(new ArrayBuffer(TIFF_LEN));
  const LE = true;

  // TIFF header
  tiff.setUint16(0, 0x4949); // "II" — little endian
  tiff.setUint16(2, 0x002a, LE); // magic 42
  tiff.setUint32(4, 8, LE); // IFD0 at offset 8

  // IFD0: a single entry pointing at the GPS IFD
  tiff.setUint16(8, 1, LE); // entry count
  tiff.setUint16(10, 0x8825, LE); // GPSInfoIFDPointer
  tiff.setUint16(12, 4, LE); // type LONG
  tiff.setUint32(14, 1, LE); // count
  tiff.setUint32(18, 26, LE); // → GPS IFD at offset 26
  tiff.setUint32(22, 0, LE); // no next IFD

  // GPS IFD at 26
  tiff.setUint16(26, 4, LE); // 4 entries

  // 0x0001 GPSLatitudeRef — ASCII, inline
  tiff.setUint16(28, 0x0001, LE);
  tiff.setUint16(30, 2, LE);
  tiff.setUint32(32, 2, LE);
  tiff.setUint8(36, latRef.charCodeAt(0));
  tiff.setUint8(37, 0);

  // 0x0002 GPSLatitude — 3 RATIONALs at offset 80
  tiff.setUint16(40, 0x0002, LE);
  tiff.setUint16(42, 5, LE);
  tiff.setUint32(44, 3, LE);
  tiff.setUint32(48, 80, LE);

  // 0x0003 GPSLongitudeRef
  tiff.setUint16(52, 0x0003, LE);
  tiff.setUint16(54, 2, LE);
  tiff.setUint32(56, 2, LE);
  tiff.setUint8(60, lngRef.charCodeAt(0));
  tiff.setUint8(61, 0);

  // 0x0004 GPSLongitude — 3 RATIONALs at offset 104
  tiff.setUint16(64, 0x0004, LE);
  tiff.setUint16(66, 5, LE);
  tiff.setUint32(68, 3, LE);
  tiff.setUint32(72, 104, LE);

  tiff.setUint32(76, 0, LE); // no next IFD

  // Rational payloads: degrees/1, minutes/1, seconds*100/100
  const writeDms = (at: number, dms: [number, number, number]) => {
    tiff.setUint32(at, dms[0], LE);
    tiff.setUint32(at + 4, 1, LE);
    tiff.setUint32(at + 8, dms[1], LE);
    tiff.setUint32(at + 12, 1, LE);
    tiff.setUint32(at + 16, Math.round(dms[2] * 100), LE);
    tiff.setUint32(at + 20, 100, LE);
  };
  writeDms(80, lat);
  writeDms(104, lng);

  // Wrap in JPEG: SOI + APP1(Exif) + EOI
  const exifHeader = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // "Exif\0\0"
  const segmentLength = 2 + exifHeader.length + TIFF_LEN;
  const out = new Uint8Array(2 + 2 + segmentLength + 2);
  const view = new DataView(out.buffer);

  view.setUint16(0, 0xffd8); // SOI
  view.setUint16(2, 0xffe1); // APP1
  view.setUint16(4, segmentLength);
  out.set(exifHeader, 6);
  out.set(new Uint8Array(tiff.buffer), 12);
  view.setUint16(out.length - 2, 0xffd9); // EOI

  return new File([out], "geotagged.jpg", { type: "image/jpeg" });
}

test("reads GPS coordinates from a JPEG's EXIF tag", async () => {
  // 18°31'13.34\" N, 73°51'24.12\" E — Pune.
  const file = jpegWithGps([18, 31, 13.34], "N", [73, 51, 24.12], "E");
  const gps = await readExifGps(file);

  assert.ok(gps, "expected coordinates to be read");
  assert.ok(Math.abs(gps.lat - 18.5203722) < 0.0001, `lat was ${gps.lat}`);
  assert.ok(Math.abs(gps.lng - 73.8567) < 0.0001, `lng was ${gps.lng}`);
});

test("applies southern and western hemisphere refs as negative", async () => {
  const file = jpegWithGps([33, 51, 30.0], "S", [151, 12, 30.0], "W");
  const gps = await readExifGps(file);

  assert.ok(gps);
  assert.ok(gps.lat < 0, "southern latitude should be negative");
  assert.ok(gps.lng < 0, "western longitude should be negative");
  assert.ok(Math.abs(gps.lat + 33.8583333) < 0.0001);
});

test("returns null for a JPEG with no EXIF — the WhatsApp case", async () => {
  // SOI + EOI only: a structurally valid JPEG carrying no APP1 segment, which
  // is what re-encoding messengers produce.
  const bare = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
  const file = new File([bare], "forwarded.jpg", { type: "image/jpeg" });

  assert.equal(await readExifGps(file), null);
});

test("returns null for PNG without attempting to parse", async () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const file = new File([png], "screenshot.png", { type: "image/png" });

  assert.equal(await readExifGps(file), null);
});

test("returns null rather than throwing on truncated bytes", async () => {
  const truncated = new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0x00]);
  const file = new File([truncated], "broken.jpg", { type: "image/jpeg" });

  assert.equal(await readExifGps(file), null);
});

test("treats a zeroed 0,0 tag as absent rather than Null Island", async () => {
  const file = jpegWithGps([0, 0, 0], "N", [0, 0, 0], "E");
  assert.equal(await readExifGps(file), null);
});

test("formatCoordinates renders hemispheres, not signs", () => {
  assert.equal(formatCoordinates(18.5204, 73.8567), "18.5204° N, 73.8567° E");
  assert.equal(formatCoordinates(-33.8688, -151.2093), "33.8688° S, 151.2093° W");
});
