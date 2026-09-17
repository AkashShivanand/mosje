/**
 * A sample document drawn straight into a PDF with the fourteen standard fonts, which a PDF reader
 * already has, so nothing is embedded.
 *
 * Printing the same pages from a browser embedded a font subset per run of text: 145 samples came
 * to 7.9 MB, 55–90 KB a page. Drawn here they are a few KB each. The cost is WinAnsi text — the
 * standard fonts have no rupee sign, so amounts read "Rs.", as many departmental documents do.
 */
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

const A4 = [595.28, 841.89];
const M = 46;
const W = A4[0] - M * 2;
const INK = rgb(0.11, 0.11, 0.11);
const MUTED = rgb(0.4, 0.4, 0.4);
const LINE = rgb(0.72, 0.72, 0.72);
const SHADE = rgb(0.945, 0.945, 0.945);

/** The standard fonts speak WinAnsi; say the few characters they cannot in words they can. */
const ansi = (s) => String(s).replace(/₹\s?/g, "Rs. ").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/→/g, "->");

function wrap(text, font, size, width) {
  const out = [];
  for (const para of ansi(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width || !line) line = next;
      else { out.push(line); line = word; }
    }
    out.push(line);
  }
  return out;
}

/**
 * @param {object} d  { issuer, title, fields?: [label, value|null][], table?: {head, rows}, parts?: [heading, body|null][],
 *                      sign, orgName, footer, watermark? }
 * @returns {Promise<Uint8Array>}
 */
export async function renderPdf(d) {
  const doc = await PDFDocument.create();
  doc.setTitle(ansi(d.title));
  doc.setSubject("Sample document - SAMAVESH prototype demo data - not a departmental record");
  doc.setProducer("tools/e-anudaan-samples");
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  let page;
  let y;
  const newPage = () => {
    page = doc.addPage(A4);
    page.drawText(d.watermark ?? "SAMPLE", { x: 120, y: 260, size: 96, font: bold, color: rgb(0, 0, 0), opacity: 0.05, rotate: degrees(28) });
    // The banner, on every page.
    page.drawRectangle({ x: M, y: A4[1] - M - 22, width: W, height: 22, color: rgb(1, 0.827, 0.137), borderColor: rgb(0.54, 0.43, 0), borderWidth: 1 });
    page.drawText("SAMPLE DOCUMENT  ·  SAMAVESH PROTOTYPE DEMO DATA  ·  NOT A DEPARTMENTAL RECORD", { x: M + 10, y: A4[1] - M - 14.5, size: 7.5, font: bold, color: rgb(0.29, 0.23, 0) });
    y = A4[1] - M - 40;
  };
  const room = (h) => { if (y - h < M + 60) newPage(); };
  const text = (s, { font = regular, size = 10, color = INK, x = M, width = W, gap = 3 } = {}) => {
    for (const line of wrap(s, font, size, width)) {
      room(size + gap);
      page.drawText(line, { x, y: y - size, size, font, color });
      y -= size + gap;
    }
  };

  newPage();
  text(d.issuer.toUpperCase(), { font: bold, size: 8, color: MUTED });
  y -= 2;
  text(d.title, { font: bold, size: 15, gap: 4 });
  page.drawRectangle({ x: M, y: y - 4, width: W, height: 1.5, color: INK });
  y -= 16;

  /** A bordered row of cells; `widths` in points. A null value is a blank to fill in. */
  const row = (cells, widths, { head = false, shadeFirst = false } = {}) => {
    const size = 9;
    const lines = cells.map((c, i) => (c == null ? [""] : wrap(c, head || (shadeFirst && i === 0) ? bold : regular, size, widths[i] - 10)));
    const h = Math.max(...lines.map((l) => l.length)) * (size + 3) + 9;
    room(h);
    let x = M;
    cells.forEach((c, i) => {
      const shade = head || (shadeFirst && i === 0);
      page.drawRectangle({ x, y: y - h, width: widths[i], height: h, borderColor: LINE, borderWidth: 0.8, ...(shade ? { color: SHADE } : {}) });
      if (c == null) {
        page.drawLine({ start: { x: x + 6, y: y - h + 7 }, end: { x: x + widths[i] - 6, y: y - h + 7 }, thickness: 0.6, color: MUTED, dashArray: [1.5, 2] });
      } else {
        lines[i].forEach((line, k) => page.drawText(line, { x: x + 5, y: y - 5 - size - k * (size + 3) + 1, size, font: shade ? bold : regular, color: INK }));
      }
      x += widths[i];
    });
    y -= h;
  };

  if (d.fields?.length) {
    for (const [k, v] of d.fields) row([k, v], [W * 0.36, W * 0.64], { shadeFirst: true });
    y -= 12;
  }
  if (d.table) {
    const widths = d.table.head.map(() => W / d.table.head.length);
    row(d.table.head, widths, { head: true });
    for (const r of d.table.rows) row(r, widths);
    y -= 12;
  }
  for (const [h, body] of d.parts ?? []) {
    room(40);
    text(h, { font: bold, size: 10.5, gap: 4 });
    if (body == null) {
      page.drawLine({ start: { x: M, y: y - 8 }, end: { x: M + W, y: y - 8 }, thickness: 0.6, color: MUTED, dashArray: [1.5, 2] });
      y -= 18;
    } else text(body, { gap: 3.5 });
    y -= 6;
  }

  // Signatures, seals and stamps.
  const sig = d.signature;
  if (sig) {
    room(130);
    y -= 26;
    const colW = (W - 110) / 2;
    sig.people.forEach(([hand, role], i) => {
      const x = M + i * (colW + 14);
      if (hand) page.drawText(ansi(hand), { x: x + 4, y: y + 4, size: 14, font: italic, color: rgb(0.13, 0.19, 0.43) });
      if (role !== "") page.drawLine({ start: { x, y }, end: { x: x + colW, y }, thickness: 0.8, color: MUTED });
      wrap(role, regular, 8, colW).forEach((line, k) => page.drawText(line, { x, y: y - 11 - k * 10, size: 8, font: regular, color: INK }));
    });
    if (sig.seal) {
      // Below the signature line, clear of whatever sits above the block.
      const cx = M + W - 48;
      const cy = y - 20;
      const purple = rgb(0.42, 0.16, 0.53);
      page.drawEllipse({ x: cx, y: cy, xScale: 44, yScale: 44, borderColor: purple, borderWidth: 1.8, opacity: 0 });
      page.drawEllipse({ x: cx, y: cy, xScale: 38, yScale: 38, borderColor: purple, borderWidth: 0.6, opacity: 0 });
      const lines = wrap(sig.seal.toUpperCase(), bold, 6, 58);
      lines.forEach((line, k) => {
        const w = bold.widthOfTextAtSize(line, 6);
        page.drawText(line, { x: cx - w / 2, y: cy + (lines.length / 2 - k - 1) * 8 + 2, size: 6, font: bold, color: purple });
      });
    }
    y -= sig.seal ? 72 : 40;
    if (sig.stamp) {
      const red = rgb(0.6, 0.11, 0.11);
      const lines = wrap(sig.stamp, bold, 7.5, 260);
      const h = lines.length * 10 + 8;
      page.drawRectangle({ x: M, y: y - h, width: 272, height: h, borderColor: red, borderWidth: 1.6 });
      lines.forEach((line, k) => page.drawText(line, { x: M + 6, y: y - 12 - k * 10, size: 7.5, font: bold, color: red }));
      y -= h + 10;
    }
  }

  // The footer, on the last page, saying what the file is.
  const foot = wrap(d.footer, regular, 7, W);
  const top = M + 10 + foot.length * 9;
  if (y < top + 10) newPage();
  page.drawLine({ start: { x: M, y: top + 4 }, end: { x: M + W, y: top + 4 }, thickness: 0.5, color: LINE });
  foot.forEach((line, k) => page.drawText(line, { x: M, y: top - 6 - k * 9, size: 7, font: regular, color: MUTED }));

  return doc.save({ useObjectStreams: true });
}
