/**
 * A screenshot of the page as the reader sees it, taken in the browser. Browser-only.
 *
 * Rendered from the live DOM by `modern-screenshot`, which clones the page into an SVG
 * `foreignObject` and lets the browser itself paint it — so Tailwind v4's `oklch()` colours,
 * `color-mix()`, grid and the Noto Sans webfont all come out as they are on screen.
 * `html2canvas`, the usual choice, re-implements CSS and throws on `oklch()`.
 *
 * Two things a DOM capture does not do, stated so nobody debugs them as defects: it cannot
 * see inside a cross-origin iframe (a YouTube embed or a map renders blank), and an image
 * served without CORS headers from another host renders as an empty box.
 *
 * The demo rail is left out of every capture; anything the reader would see on the page —
 * the accessibility control, the chat launcher, a cookie banner — is kept, because a
 * screenshot of the page should be the page.
 */

import type { CaptureScope } from "./capture-name";

const PIN_ATTR = "data-sa-capture-pin";

/**
 * Chrome refuses a canvas over 32,767px on a side or ~268M pixels in all. A full page is
 * brought under both by lowering the scale, never by cropping it.
 */
const MAX_SIDE = 32_000;
const MAX_AREA = 200_000_000;

interface Pin {
  top: number;
  left: number;
  width: number;
  height: number;
  /** Sticky elements hold their place in the flow, so a copy is drawn and the original kept. */
  sticky: boolean;
}

/**
 * In the visible-area capture, fixed and sticky elements have to be drawn where they are ON
 * SCREEN. The clone is not scrolled, so without this a sticky masthead renders at the top of
 * the document — outside the captured window — and a fixed launcher in the wrong place.
 *
 * Only attributes are written to the live page (they are copied into the clone and removed
 * straight after), so nothing on screen moves while the capture runs.
 */
function markFloating(): { pins: Map<string, Pin>; clear: () => void } {
  const pins = new Map<string, Pin>();
  const marked: Element[] = [];
  const sx = window.scrollX;
  const sy = window.scrollY;
  for (const el of Array.from(document.body.querySelectorAll("*"))) {
    const { position } = getComputedStyle(el);
    if (position !== "fixed" && position !== "sticky") continue;
    if (el.closest("[data-sa-demo-tools]")) continue;
    // A floating element inside another is moved with its parent.
    if (marked.some((m) => m.contains(el))) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const id = String(pins.size);
    pins.set(id, {
      top: rect.top + sy,
      left: rect.left + sx,
      width: rect.width,
      height: rect.height,
      sticky: position === "sticky",
    });
    el.setAttribute(PIN_ATTR, id);
    marked.push(el);
  }
  return { pins, clear: () => marked.forEach((el) => el.removeAttribute(PIN_ATTR)) };
}

function pinClones(root: Node, pins: Map<string, Pin>): void {
  if (!(root instanceof Element)) return;
  for (const original of Array.from(root.querySelectorAll<HTMLElement>(`[${PIN_ATTR}]`))) {
    const pin = pins.get(original.getAttribute(PIN_ATTR) ?? "");
    if (!pin) continue;
    let el = original;
    if (pin.sticky) {
      // The original stays where it is, invisible, so the page below it keeps its exact
      // place. A spacer of the element's measured height was tried first and moved the
      // website's content up 90px: a sticky masthead's footprint in the flow is not its
      // box on screen once it has stuck at a negative `top`.
      el = original.cloneNode(true) as HTMLElement;
      original.style.setProperty("opacity", "0", "important");
    }
    // Re-parented to the root, which the capture translates by the scroll offset, so a
    // document coordinate here lands on its on-screen position in the image.
    root.appendChild(el);
    Object.assign(el.style, {
      position: "absolute",
      inset: "auto",
      top: `${pin.top}px`,
      left: `${pin.left}px`,
      width: `${pin.width}px`,
      height: `${pin.height}px`,
      margin: "0",
      transform: "none",
    });
  }
}

/**
 * Load every lazy image first, and wait for them — bounded.
 *
 * The library waits for each image it clones, and a `loading="lazy"` image that has never
 * been scrolled near has not been fetched, so each one ran out its whole timeout: a capture
 * of the website home page took over 45 seconds for its 31 unloaded images. Switching them
 * to eager fetches them in parallel instead, and the page is no worse for having them.
 */
async function loadLazyImages(budgetMs: number): Promise<void> {
  const pending = Array.from(document.images).filter((img) => {
    if (img.closest("[data-sa-demo-tools]")) return false;
    if (img.loading === "lazy") img.loading = "eager";
    return !img.complete;
  });
  if (pending.length === 0) return;
  const loaded = Promise.all(
    pending.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
  await Promise.race([loaded, new Promise((r) => window.setTimeout(r, budgetMs))]);
}

/**
 * The CSS properties to copy onto each cloned element: every real property, and none of
 * the custom ones.
 *
 * Every element on this estate inherits the whole token contract — thousands of `--sa-*`
 * custom properties — and by default the library copies each one onto every clone. On the
 * website home page that was 184 seconds of `setProperty` for 2,300 elements; without them
 * the same page clones in about two. Nothing is lost: a computed value has already resolved
 * its `var()`, so the clones never read a custom property.
 */
function standardProperties(): string[] {
  const computed = getComputedStyle(document.documentElement);
  const names: string[] = [];
  for (let i = 0; i < computed.length; i++) {
    const name = computed.item(i);
    if (!name.startsWith("--")) names.push(name);
  }
  return names;
}

function pageBackground(): string {
  for (const el of [document.body, document.documentElement]) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") return bg;
  }
  return "#ffffff";
}

export async function capturePage(scope: CaptureScope): Promise<Blob> {
  const { domToBlob } = await import("modern-screenshot");
  const root = document.documentElement;
  const full = scope === "page";
  const width = root.clientWidth;
  const height = full ? root.scrollHeight : window.innerHeight;

  let scale = Math.min(window.devicePixelRatio || 1, 2);
  scale = Math.min(scale, MAX_SIDE / width, MAX_SIDE / height, Math.sqrt(MAX_AREA / (width * height)));

  await loadLazyImages(6_000);
  const floating = full ? null : markFloating();
  try {
    const blob = await domToBlob(root, {
      width,
      height,
      scale,
      type: "image/png",
      backgroundColor: pageBackground(),
      includeStyleProperties: standardProperties(),
      filter: (node) => !(node instanceof Element && node.hasAttribute("data-sa-demo-tools")),
      // The visible area is the whole page slid up by the scroll offset and cut to the
      // viewport by the image's own bounds. Not by `overflow: hidden` on the root: that clip
      // is drawn in the root's own coordinates and moves up with it.
      style: full
        ? null
        : { transform: `translate(${-window.scrollX}px, ${-window.scrollY}px)`, transformOrigin: "0 0" },
      onCloneNode: floating
        ? (clone) => {
            // The library pins the root to the IMAGE height with !important, which would
            // stop the page's background at the first screen once it is slid up.
            if (clone instanceof HTMLElement) clone.style.setProperty("height", "auto", "important");
            pinClones(clone, floating.pins);
          }
        : null,
      // Everything was loaded above; anything still missing is not worth a longer wait.
      timeout: 3_000,
    });
    if (!blob) throw new Error("The page could not be drawn.");
    return blob;
  } finally {
    floating?.clear();
  }
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoked on the next turn, once the download has taken the URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
