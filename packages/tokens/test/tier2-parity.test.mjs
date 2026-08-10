import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * The canonical Tier-2 namespace must be a FAITHFUL, FULLY-THEMED mirror of the legacy
 * `--ds-*` layer — in every axis block, not just at :root.
 *
 * This is the guarantee that makes the migration additive rather than a rewrite. If a new
 * token resolves to a different value than its legacy counterpart under [data-theme="dark"],
 * migrating a call site would silently change how the page renders in dark mode, which is
 * exactly the class of regression a mechanical rename would have introduced.
 *
 * It also catches the frozen-alias bug directly: Style Dictionary resolves references to
 * literals by default, so `--sa-text-neutral: #1f2428` would pass at :root and fail here.
 *
 * Spec §5, §7.2; design.md §1A on island re-resolution.
 */

const root = new URL("..", import.meta.url).pathname;
const css = readFileSync(root + "dist/tokens.css", "utf8");

/** Every selector block in the generated stylesheet, in source order. */
function blocks() {
  const out = [];
  const re = /^(:root|\[[^\]]+\])\s*\{\n([\s\S]*?)^\}/gm;
  let m;
  while ((m = re.exec(css))) out.push({ selector: m[1], body: m[2] });
  return out;
}

const ALL = blocks();
const ROOT = ALL.find((b) => b.selector === ":root");
assert.ok(ROOT, "no :root block in the generated CSS");

/**
 * Resolve a custom property as the browser would at an element carrying `selector`:
 * look in that block first, then fall back to :root.
 */
function resolveIn(selector, name, depth = 0) {
  if (depth > 12) return null;
  const scoped = ALL.filter((b) => b.selector === selector);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^\\s*${escaped}\\s*:\\s*([^;]+);`, "m");

  let value = null;
  for (const b of [...scoped, ROOT]) {
    const hit = b.body.match(re);
    if (hit) {
      value = hit[1].trim();
      break;
    }
  }
  if (value === null) return null;
  const ref = value.match(/^var\((--[A-Za-z0-9-]+)\)$/);
  return ref ? resolveIn(selector, ref[1], depth + 1) : value;
}

/** new canonical name ↔ the legacy name it must agree with. */
const PAIRS = [
  ["--sa-text-neutral-primary", "--ds-ink"],
  ["--sa-text-neutral-secondary", "--ds-ink-muted"],
  ["--sa-text-neutral-strong", "--ds-ink-strong"],
  ["--sa-text-neutral-inverse", "--ds-on-primary"],
  ["--sa-text-brand-primary-base", "--ds-primary"],
  ["--sa-text-status-success-base", "--ds-success"],
  ["--sa-text-status-error-base", "--ds-danger"],
  ["--sa-text-status-warning-base", "--ds-warning"],
  ["--sa-text-status-info-base", "--ds-info"],
  ["--sa-text-link-brand-default", "--ds-link"],
  ["--sa-bg-neutral-base", "--ds-surface"],
  ["--sa-bg-neutral-soft", "--ds-surface-muted"],
  ["--sa-border-neutral-subtle", "--ds-border"],
  ["--sa-border-neutral-base", "--ds-border-strong"],
  ["--sa-border-brand-primary-base", "--ds-primary"],
  ["--sa-focus-ring", "--ds-primary-ring"],
  ["--sa-overlay-neutral-stronger", "--ds-overlay"],
  ["--sa-inline-m", "--ds-inline-m"],
  ["--sa-stack-m", "--ds-stack-m"],
  ["--sa-padding-l", "--ds-padding-l"],
  ["--sa-section-m", "--ds-section-m"],
];

test("every Tier-2 token resolves — none is a dangling or missing declaration", () => {
  const missing = PAIRS.flatMap(([next, legacy]) =>
    [next, legacy].filter((n) => resolveIn(":root", n) === null),
  );
  assert.deepEqual(missing, [], `unresolvable at :root:\n  ${missing.join("\n  ")}`);
});

test("the canonical Tier-2 namespace agrees with the legacy layer in EVERY axis block", () => {
  const selectors = [":root", ...new Set(ALL.map((b) => b.selector).filter((s) => s !== ":root"))];
  const mismatches = [];

  for (const selector of selectors) {
    for (const [next, legacy] of PAIRS) {
      const a = resolveIn(selector, next);
      const b = resolveIn(selector, legacy);
      if (a === null || b === null) continue;
      if (a !== b) mismatches.push(`${selector}  ${next}=${a}  ≠  ${legacy}=${b}`);
    }
  }

  assert.deepEqual(
    mismatches,
    [],
    `\n  ${mismatches.join("\n  ")}\n\n` +
      `A mismatch means migrating a call site would change how the page renders under that ` +
      `axis. Usually the alias was emitted as a resolved literal instead of a var() chain, ` +
      `or the block re-asserts the legacy alias but not the canonical one.`,
  );
});

test("canonical Tier-2 aliases keep their var() chain and are not flattened to literals", () => {
  // A literal here would pass the :root comparison above and silently break theme islands —
  // BUT only for tokens that are genuinely aliases. Tokens that were RENAMED onto the
  // canonical path are now real tokens carrying their own theme overrides, so a literal is
  // correct for them: the emitter re-declares them inside each [data-theme] block directly.
  // Assert that instead of demanding a chain they no longer have.
  const themeBlocks = ALL.filter((b) => /^\[data-(theme|brand)=/.test(b.selector));
  const declaresIn = (block, name) =>
    new RegExp(`^\\s*${name.replace(/[-]/g, "\\-")}\\s*:`, "m").test(block.body);
  for (const [next, legacy] of PAIRS) {
    const declared = ROOT.body.match(
      new RegExp(`^\\s*${next.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\s*:\\s*([^;]+);`, "m"),
    );
    if (!declared) continue;
    const value = declared[1].trim();
    if (/^var\(--/.test(value)) continue;
    // A literal is fine for a token that does not vary at all (spacing, radius). What must
    // never happen is the LEGACY name varying in a block while the canonical one does not —
    // that is the frozen-alias bug, and it only shows up under a theme island.
    for (const block of themeBlocks) {
      if (!declaresIn(block, legacy)) continue;
      assert.ok(
        declaresIn(block, next),
        `${block.selector} re-declares ${legacy} but not ${next} (a literal, ${value}) — the ` +
          `canonical token will keep its :root value while the legacy one re-themes.`,
      );
    }
  }
});
