import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

// The brand contrast gate. White-labelling swaps the brand pack's colour ramp;
// this asserts the load-bearing semantic pairings still meet WCAG 2.1 AA so a
// re-skin can never ship an inaccessible government portal. This is the real
// mechanism behind "the brand can't break accessibility" — there is no
// "compliance by construction", there is this gate.

const root = new URL("..", import.meta.url).pathname;

function resolveVar(css, name, depth = 0) {
  if (depth > 6) return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = css.match(new RegExp(`${escaped}\\s*:\\s*([^;]+);`));
  if (!m) return null;
  const v = m[1].trim();
  const ref = v.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  return ref ? resolveVar(css, ref[1], depth + 1) : v;
}

function hexToRgb(h) {
  h = h.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function relLum([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [f(r), f(g), f(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrast(a, b) {
  const l1 = relLum(hexToRgb(a));
  const l2 = relLum(hexToRgb(b));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// Load-bearing pairings that a brand swap can break. min = WCAG AA threshold
// (4.5 for text, 3.0 for UI element / large text).
const PAIRINGS = [
  { fg: "--ds-on-primary", bg: "--ds-primary", min: 4.5, label: "button label on primary" },
  { fg: "--ds-ink", bg: "--ds-surface", min: 4.5, label: "body text on surface" },
  { fg: "--ds-ink-muted", bg: "--ds-surface", min: 4.5, label: "muted text on surface" },
  { fg: "--ds-primary", bg: "--ds-surface", min: 3.0, label: "primary as link/UI on surface" },
  // Status text on its own tonal chip. These are the badge/pill pairings
  // (`text-success` on `bg-success-tonal`, etc.) used across every portal's
  // status indicators. All four shipped below AA until 2026-08 — the ramp step
  // for the foreground was chosen for the solid fill, not for the tonal pairing.
  { fg: "--ds-success", bg: "--ds-success-tonal", min: 4.5, label: "success badge text on success tonal" },
  { fg: "--ds-warning", bg: "--ds-warning-tonal", min: 4.5, label: "warning badge text on warning tonal" },
  { fg: "--ds-danger", bg: "--ds-danger-tonal", min: 4.5, label: "danger badge text on danger tonal" },
  { fg: "--ds-info", bg: "--ds-info-tonal", min: 4.5, label: "info badge text on info tonal" },
];

function assertBrandPasses(brand) {
  execSync(`npm run build`, { cwd: root, env: { ...process.env, BRAND: brand } });
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  for (const p of PAIRINGS) {
    const fg = resolveVar(css, p.fg);
    const bg = resolveVar(css, p.bg);
    assert.ok(fg && /^#/.test(fg), `${p.fg} did not resolve to a hex colour (got ${fg})`);
    assert.ok(bg && /^#/.test(bg), `${p.bg} did not resolve to a hex colour (got ${bg})`);
    const ratio = contrast(fg, bg);
    assert.ok(
      ratio >= p.min,
      `[brand: ${brand}] ${p.label} (${p.fg} ${fg} on ${p.bg} ${bg}) = ${ratio.toFixed(2)}:1, below AA minimum ${p.min}:1`,
    );
  }
}

test("active brand (mosje) meets WCAG AA on load-bearing pairings", () => {
  assertBrandPasses("mosje");
});

test("a re-skin (_starter brand pack) also passes the contrast gate", () => {
  try {
    assertBrandPasses("_starter");
  } finally {
    // Restore the default brand so dist/ + design-system/tokens.css stay on mosje.
    execSync("npm run build", { cwd: root, env: { ...process.env, BRAND: "mosje" } });
  }
});
