/* ============================================================================
   MoSJE / SAMAVESH — chart export

   Turns a rendered chart into a downloadable file. Three formats, one source
   each, all already present in the DOM every chart produces:

     PNG  — rasterise the <svg> through a canvas (2× for a crisp image)
     SVG  — the same <svg>, styles inlined so it stands alone
     CSV  — the screen-reader <table> every ChartFrame renders

   The hard part is the SVG. Our charts style their marks with CSS classes and
   `var(--sa-chart-*)` custom properties, which resolve against the page. Lift
   the <svg> out of the page and those rules evaporate — an unstyled black
   drawing. So before serialising we walk the clone and copy each element's
   COMPUTED paint/typography onto the element itself, which freezes the live
   theme (blue, navy, dbim, light or dark) into the file.

   Dependency-free: XMLSerializer, canvas, Blob — all platform.
   ========================================================================= */

/** The style properties that actually paint a chart. Copied onto each node. */
const PAINT_PROPS = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-dasharray",
  "stroke-linecap",
  "stroke-linejoin",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "letter-spacing",
  "text-anchor",
  "dominant-baseline",
  "color",
] as const;

/** Copy computed paint styles from a live node onto its clone, recursively. */
function inlineComputedStyles(live: Element, clone: Element): void {
  const cs = window.getComputedStyle(live);
  let decl = "";
  for (const prop of PAINT_PROPS) {
    const value = cs.getPropertyValue(prop);
    if (value && value !== "normal" && value !== "none") {
      decl += `${prop}:${value};`;
    }
  }
  if (decl) clone.setAttribute("style", decl);

  const liveKids = live.children;
  const cloneKids = clone.children;
  for (let i = 0; i < liveKids.length; i += 1) {
    const lk = liveKids[i];
    const ck = cloneKids[i];
    if (lk && ck) inlineComputedStyles(lk, ck);
  }
}

/** A standalone SVG string with the live theme baked in, sized in real pixels. */
export function serialiseSvg(svg: SVGSVGElement): string {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  const clone = svg.cloneNode(true) as SVGSVGElement;
  inlineComputedStyles(svg, clone);

  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  // Paint the page's surface behind the marks so a PNG is not transparent.
  const bg = window
    .getComputedStyle(document.body)
    .getPropertyValue("--sa-bg-neutral-base")
    .trim();
  clone.style.background = bg || "#ffffff";

  return new XMLSerializer().serializeToString(clone);
}

/** Hand the browser a Blob to save under `filename`. */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so the download has claimed the URL.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Download the chart's SVG, styles inlined. */
export function downloadSvg(svg: SVGSVGElement, filename: string): void {
  const source = serialiseSvg(svg);
  triggerDownload(new Blob([source], { type: "image/svg+xml;charset=utf-8" }), filename);
}

/** Rasterise the SVG to a PNG Blob at `scale`× the on-screen size. */
export function svgToPngBlob(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const source = serialiseSvg(svg);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      const bg = window
        .getComputedStyle(document.body)
        .getPropertyValue("--sa-bg-neutral-base")
        .trim();
      ctx.fillStyle = bg || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load serialised SVG"));
    img.src = svgUrl;
  });
}

/** Download the chart as a PNG. */
export async function downloadPng(
  svg: SVGSVGElement,
  filename: string,
  scale = 2,
): Promise<void> {
  const blob = await svgToPngBlob(svg, scale);
  triggerDownload(blob, filename);
}

/** Escape one CSV field per RFC 4180 (quote when it holds a comma, quote or newline). */
function csvField(value: string): string {
  const v = value.replace(/\s+/g, " ").trim();
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Turn the screen-reader data table into CSV text. */
export function tableToCsv(table: HTMLTableElement): string {
  const lines: string[] = [];
  const heads = [...table.querySelectorAll("thead th")].map((th) =>
    csvField(th.textContent ?? ""),
  );
  if (heads.length) lines.push(heads.join(","));
  for (const tr of table.querySelectorAll("tbody tr")) {
    const cells = [...tr.querySelectorAll("th, td")].map((c) =>
      csvField(c.textContent ?? ""),
    );
    if (cells.length) lines.push(cells.join(","));
  }
  return lines.join("\r\n");
}

/** Download the chart's data table as CSV. */
export function downloadCsv(table: HTMLTableElement, filename: string): void {
  const csv = tableToCsv(table);
  // BOM so Excel opens Indian-digit and non-ASCII text as UTF-8.
  triggerDownload(
    new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }),
    filename,
  );
}

/** Kebab-case a chart title into a safe filename stem. */
export function toFileStem(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "chart"
  );
}
