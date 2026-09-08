/**
 * Bleed each mark's own colour outward into its transparent pixels.
 *
 * ── THE DEFECT ──────────────────────────────────────────────────────────────
 *
 * A PNG stores a colour for every pixel, INCLUDING the fully transparent ones.
 * Most exporters write white there, because white is what the artwork was
 * flattened against. Nothing sees those pixels — until the browser resizes the
 * image, at which point it interpolates neighbouring pixels and the invisible
 * white bleeds into the visible edge.
 *
 * On this estate that produced a pale ring around the organisation mark on the
 * hero, reported repeatedly as "a white cast around the logo" and repeatedly not
 * found, because it is not in the CSS and not in the visible artwork. Measured
 * on `nmba.png`: 30,907 transparent pixels, every one of them `rgb(255,255,255)`,
 * of which 874 sit directly against the seal.
 *
 * It shows on the DIAGONALS and not at the horizontal centre, which is the
 * signature: the seal fills the square edge to edge left and right, so there are
 * no transparent neighbours there to bleed. A scan line through the middle of
 * the mark finds nothing wrong. That is why this took three passes to locate.
 *
 * ── THE FIX ─────────────────────────────────────────────────────────────────
 *
 * Dilate the artwork's colour outward into the transparent region and leave
 * every alpha byte exactly as it was. No visible pixel changes value; the
 * interpolator now blends green into green.
 *
 * These marks are INDEXED PNGs whose transparent entries are all the same white,
 * duplicated across dozens of palette slots — so the fix reuses those redundant
 * slots for the bled colours. Palette size, bit depth and file size are
 * essentially unchanged, and no pixel a reader can see is touched.
 *
 * Usage:  node tools/logo-alpha-bleed/bleed.mjs [--check]
 *   --check  report what remains. It does NOT reach zero and is not a gate: a
 *            transparent pixel wedged between two differently coloured opaque
 *            ones can only carry one of them, so it will always differ from the
 *            other. On `nmba.png` that irreducible residue is 155 pixels out of
 *            the 874 that started wrong — down from every one of them holding
 *            pure white. Read the number as "how much boundary is left", not as
 *            a pass or a fail.
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const DIR = "apps/hub/public/website/images/org-logos";
/** How far the colour is carried outward. Only the first pixel or two is ever
 *  interpolated into a visible edge; 6 is margin, not a guess. */
const DEPTH = 6;

function readChunks(buf) {
  const out = [];
  let pos = 8;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("latin1", pos + 4, pos + 8);
    out.push({ type, data: buf.subarray(pos + 8, pos + 8 + len) });
    pos += 12 + len;
  }
  return out;
}

function crc32(buf) {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function writePng(chunks) {
  const parts = [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])];
  for (const { type, data } of chunks) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    parts.push(len, body, crc);
  }
  return Buffer.concat(parts);
}

/** Undo the per-scanline filters of an 8-bit indexed image. */
function unfilter(raw, w, h) {
  const out = Buffer.alloc(w * h);
  let prev = Buffer.alloc(w);
  let i = 0;
  for (let y = 0; y < h; y++) {
    const ft = raw[i++];
    const line = Buffer.from(raw.subarray(i, i + w));
    i += w;
    for (let x = 0; x < w; x++) {
      const a = x >= 1 ? line[x - 1] : 0;
      const b = prev[x];
      const c = x >= 1 ? prev[x - 1] : 0;
      if (ft === 1) line[x] = (line[x] + a) & 255;
      else if (ft === 2) line[x] = (line[x] + b) & 255;
      else if (ft === 3) line[x] = (line[x] + ((a + b) >> 1)) & 255;
      else if (ft === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        line[x] = (line[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    line.copy(out, y * w);
    prev = line;
  }
  return out;
}

function filterNone(px, w, h) {
  const raw = Buffer.alloc((w + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w + 1)] = 0;
    px.copy(raw, y * (w + 1) + 1, y * w, (y + 1) * w);
  }
  return raw;
}

function bleedFile(file, check) {
  const buf = fs.readFileSync(file);
  const chunks = readChunks(buf);
  const ihdr = chunks.find((c) => c.type === "IHDR");
  const w = ihdr.data.readUInt32BE(0);
  const h = ihdr.data.readUInt32BE(4);
  const depth = ihdr.data[8];
  const colorType = ihdr.data[9];
  const name = path.basename(file);

  const plteC = chunks.find((c) => c.type === "PLTE");
  const trnsC = chunks.find((c) => c.type === "tRNS");
  if (colorType !== 3 || depth !== 8 || !plteC || !trnsC) {
    return { name, skipped: `colour type ${colorType}, depth ${depth}${trnsC ? "" : ", no tRNS"}` };
  }

  const pal = [];
  for (let i = 0; i < plteC.data.length / 3; i++) {
    pal.push([plteC.data[i * 3], plteC.data[i * 3 + 1], plteC.data[i * 3 + 2]]);
  }
  const alpha = [...trnsC.data];
  while (alpha.length < pal.length) alpha.push(255);

  const idat = Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data));
  const px = unfilter(zlib.inflateSync(idat), w, h);

  const isClear = (i) => alpha[i] === 0;

  /*
   * A BLEEDER IS A TRANSPARENT PIXEL WHOSE COLOUR DIFFERS FROM THE ARTWORK IT
   * TOUCHES — not one that merely looks pale.
   *
   * The first version of this test asked "is it near-white?", which is the
   * symptom rather than the fault. It kept reporting 308 pixels on `nmba.png`
   * after they had been correctly repaired, because the seal's own top edge is
   * `rgb(248,252,252)` around the National Emblem: the bleed had copied that
   * colour outward, exactly as intended, and the check called the result white.
   *
   * What actually matters is the DELTA across the alpha boundary. Zero delta
   * means the interpolator blends a colour into itself and nothing appears.
   */
  const differs = (a, b) =>
    Math.abs(pal[a][0] - pal[b][0]) + Math.abs(pal[a][1] - pal[b][1]) +
    Math.abs(pal[a][2] - pal[b][2]) > 12;

  let bleeders = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = px[y * w + x];
      if (!isClear(i) || Math.min(...pal[i]) < 240) continue;
      const near = [px[y * w + x - 1], px[y * w + x + 1], px[(y - 1) * w + x], px[(y + 1) * w + x]];
      /*
       * WHITE, AND UNLIKE THE ARTWORK IT TOUCHES. Both halves are load-bearing
       * and each one alone was wrong on a first attempt:
       *
       *  · "is it pale?" alone kept reporting 308 pixels on `nmba.png` that had
       *    already been repaired — the seal's own edge around the National
       *    Emblem is `rgb(248,252,252)`, so the correct bleed looks white.
       *  · "does it differ?" alone reported all seventeen marks, because a
       *    transparent pixel beside a PARTIALLY transparent one differs by
       *    definition. That is anti-aliasing, not a halo.
       *
       * So: fully opaque neighbours only, and only where the stored colour is
       * the exporter's white rather than the artwork's own.
       */
      if (near.some((j) => alpha[j] === 255 && differs(i, j))) bleeders++;
    }
  }
  if (bleeders === 0) return { name, clean: true };
  if (check) return { name, bleeders, dirty: true };

  // Redundant slots: transparent entries holding a colour nothing else needs.
  const spare = [];
  const seenClear = new Set();
  for (let i = 0; i < pal.length; i++) {
    if (!isClear(i)) continue;
    const key = pal[i].join(",");
    if (seenClear.has(key)) spare.push(i);
    else seenClear.add(key);
  }

  // Dilate: carry each opaque colour outward, one ring at a time.
  const colourOf = new Map(); // "r,g,b" -> transparent palette index
  let exhausted = 0;
  let frontier = [];
  const assigned = new Uint8Array(w * h); // 1 once a transparent pixel has been given a colour
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) if (alpha[px[y * w + x]] > 0) frontier.push(y * w + x);
  }
  for (let step = 0; step < DEPTH && frontier.length; step++) {
    const next = [];
    for (const p of frontier) {
      const x = p % w, y = (p / w) | 0;
      const src = pal[px[p]];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (assigned[q] || alpha[px[q]] > 0) continue;
        const key = src.join(",");
        let idx = colourOf.get(key);
        if (idx === undefined) {
          if (!spare.length) { exhausted++; continue; }
          idx = spare.pop();
          pal[idx] = src;
          alpha[idx] = 0;
          colourOf.set(key, idx);
        }
        px[q] = idx;
        assigned[q] = 1;
        next.push(q);
      }
    }
    frontier = next;
  }

  const outChunks = [];
  for (const c of chunks) {
    if (c.type === "IDAT") continue;
    if (c.type === "PLTE") {
      const d = Buffer.alloc(pal.length * 3);
      pal.forEach(([r, g, b], i) => { d[i * 3] = r; d[i * 3 + 1] = g; d[i * 3 + 2] = b; });
      outChunks.push({ type: "PLTE", data: d });
    } else if (c.type === "tRNS") {
      outChunks.push({ type: "tRNS", data: Buffer.from(alpha.slice(0, trnsC.data.length)) });
    } else if (c.type === "IEND") {
      outChunks.push({ type: "IDAT", data: zlib.deflateSync(filterNone(px, w, h), { level: 9 }) });
      outChunks.push(c);
    } else outChunks.push(c);
  }
  const before = fs.statSync(file).size;
  fs.writeFileSync(file, writePng(outChunks));
  return { name, bleeders, colours: colourOf.size, exhausted, before, after: fs.statSync(file).size };
}

const check = process.argv.includes("--check");
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".png")).map((f) => path.join(DIR, f));
let dirty = 0;
for (const f of files) {
  const r = bleedFile(f, check);
  if (r.clean) continue;
  if (r.skipped) { console.log(`  – ${r.name.padEnd(14)} skipped: ${r.skipped}`); continue; }
  if (r.dirty) { dirty++; console.log(`  · ${r.name.padEnd(14)} ${r.bleeders} boundary pixel(s) remain`); continue; }
  console.log(
    `  ✔ ${r.name.padEnd(14)} bled ${String(r.bleeders).padStart(5)} edge px into ${r.colours} colour(s)` +
    `  ${r.before} → ${r.after} bytes${r.exhausted ? `  (${r.exhausted} px had no spare palette slot)` : ""}`,
  );
}
if (check) {
  console.log(
    dirty
      ? `\n${dirty} mark(s) carry residual boundary pixels — see the note on --check above. Not a failure.`
      : "\n✔ every mark carries its own colour under transparency.",
  );
}
