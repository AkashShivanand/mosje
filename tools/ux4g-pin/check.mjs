/**
 * Is the pinned UX4G accessibility widget still there, and still the widget we skin?
 *
 * UX4G deletes old builds from its CDN without notice: v3.28 on 25 Sep 2026, v3.36 on
 * 30 Sep 2026. Each time the answer was a 404 with an HTML body, which the browser's
 * Opaque Response Blocking cuts off, so the estate's one accessibility panel silently
 * never loaded and every accessibility button fell back to the statement page. Nothing
 * failed; a reviewer noticed days later.
 *
 * This reads the pin from the component (so there is one source of truth), fetches the
 * script and the stylesheet it loads from beside itself, and checks the hooks the
 * component and its skin depend on. Run daily by .github/workflows/ux4g-widget-pin.yml.
 *
 *   npm run check:ux4g-pin
 */
import { readFileSync } from "node:fs";

const SRC_FILE = new URL(
  "../../packages/design-system/components/utilities/ux4g-accessibility-widget.tsx",
  import.meta.url,
);
const src = readFileSync(SRC_FILE, "utf8");
const url = /UX4G_A11Y_WIDGET_SRC\s*=\s*\n?\s*"([^"]+)"/.exec(src)?.[1];
if (!url) {
  console.error("✖ ux4g-pin: could not find UX4G_A11Y_WIDGET_SRC in the component");
  process.exit(1);
}

/** What the component and ux4g-accessibility-widget.css rely on — see the component's docblock. */
const JS_HOOKS = [
  "uw-widget-custom-trigger",
  "uw-main",
  "__ux4g_accessibility_loaded",
  "ux4g-accessibility-short-key",
  "ux4g-accessibility-icon-chevron",
  "UX4G_Analytics",
  "accessibilitySettings",
];
const CSS_HOOKS = ["--color-dark-blue-1"];

async function get(u) {
  const res = await fetch(u, { redirect: "follow", headers: { "user-agent": "mosje-ux4g-pin-check" } });
  return { status: res.status, type: res.headers.get("content-type") ?? "", body: await res.text() };
}

const failures = [];
const js = await get(url);
if (js.status !== 200 || !/javascript/i.test(js.type)) {
  failures.push(`${url} answered ${js.status} ${js.type || "(no content-type)"} — the build has been removed`);
} else {
  for (const h of JS_HOOKS) if (!js.body.includes(h)) failures.push(`script no longer contains "${h}"`);
}
const cssUrl = url.replace(/[^/]+\.js$/, "accessibility-widget.css");
const css = await get(cssUrl);
if (css.status !== 200) failures.push(`${cssUrl} answered ${css.status}`);
else for (const h of CSS_HOOKS) if (!css.body.includes(h)) failures.push(`stylesheet no longer contains "${h}" — the brand skin will not apply`);

if (failures.length) {
  console.error(`✖ ux4g-pin: ${url}`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error("  Re-pin to the build https://ux4g.gov.in/ loads (read its <script> tags), then re-check the skin.");
  process.exit(1);
}
console.log(`✓ ux4g-pin: ${url} is live, ${JS_HOOKS.length + CSS_HOOKS.length} hooks present`);
