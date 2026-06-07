# SAMAVESH Tokens Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up `@mosje/tokens` — a W3C DTCG token source compiled by Style Dictionary v4 into CSS / TS / Tailwind-v3 / Tailwind-v4 / Figma outputs, backward-compatible with the existing `--ds-*` contract so `dosje` never breaks.

**Architecture:** DTCG JSON (3 tiers: primitive → semantic → component; themes light/dark/high-contrast; density comfortable/compact; multi-script type) is the single source of truth. A Style Dictionary v4 config builds all consumable artifacts. The generated CSS is written *into* `packages/design-system/tokens.css` (the path `dosje` already imports) and MUST contain every legacy `--ds-*` variable with identical values, plus the new tiered `--sa-*` variables alongside.

**Tech Stack:** npm workspaces, Style Dictionary v4 (ESM), Node 22 `node --test`, Stylelint (token-lint gate). No new runtime deps in apps.

**Critical invariant (the non-breaking gate):** after every task, `dosje` must still build. The generated `--ds-*` set must be a byte-for-byte superset match of the legacy values captured in Task 0.

---

## File Structure

- `package.json` (root, NEW) — npm workspace declaration only.
- `packages/tokens/package.json` (NEW) — `@mosje/tokens`, Style Dictionary dep, build script.
- `packages/tokens/src/primitive.json` (NEW) — Tier 1 DTCG (private).
- `packages/tokens/src/semantic.json` (NEW) — Tier 2 DTCG, base + theme sets.
- `packages/tokens/src/component.json` (NEW) — Tier 3 DTCG.
- `packages/tokens/build/style-dictionary.config.mjs` (NEW) — SD config + custom formats.
- `packages/tokens/build/formats/legacy-ds-css.mjs` (NEW) — emits backward-compat `--ds-*` aliases.
- `packages/tokens/test/build-output.test.mjs` (NEW) — asserts outputs.
- `packages/tokens/test/legacy-snapshot.json` (NEW, generated in Task 0) — the frozen `--ds-*` contract.
- `packages/tokens/dist/*` (GENERATED) — tokens.css, tokens.ts, tailwind-v3.cjs, tailwind-v4.css, figma.tokens.json.
- `packages/design-system/tokens.css` (MODIFY → becomes generated artifact).
- `packages/design-system/tokens.ts` (MODIFY → becomes generated artifact).
- `.stylelintrc.tokens.json` (NEW) — token-lint config (no raw hex / no Tier-1 in app code).
- `packages/tokens/README.md` (NEW).

---

## Task 0: Freeze the legacy `--ds-*` contract

**Files:**
- Create: `packages/tokens/test/legacy-snapshot.json`

- [ ] **Step 1: Extract the current `--ds-*` variables into a snapshot**

Run (parses the existing hand-authored file into name→value JSON):

```bash
mkdir -p packages/tokens/test
node -e '
const fs=require("fs");
const css=fs.readFileSync("packages/design-system/tokens.css","utf8");
const out={};
for(const m of css.matchAll(/(--ds-[a-z0-9-]+)\s*:\s*([^;]+);/g)){out[m[1]]=m[2].trim();}
fs.writeFileSync("packages/tokens/test/legacy-snapshot.json",JSON.stringify(out,null,2)+"\n");
console.log("captured",Object.keys(out).length,"tokens");
'
```

Expected: `captured 44 tokens` (or current count). This JSON is the immutable contract the build must reproduce.

- [ ] **Step 2: Commit**

```bash
git add packages/tokens/test/legacy-snapshot.json
git commit -m "chore(tokens): freeze legacy --ds-* contract snapshot"
```

> If `git` is not yet initialized in this workspace, run `git init` first (see spec §12), then this commit.

---

## Task 1: Initialize the npm workspace (non-breaking)

**Files:**
- Create: `package.json` (root)

- [ ] **Step 1: Write the root workspace manifest**

```json
{
  "name": "mosje-estate",
  "version": "0.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "engines": {
    "node": ">=22"
  }
}
```

- [ ] **Step 2: Install and verify the workspace links without touching apps**

Run: `npm install --workspaces --include-workspace-root`
Expected: completes; `ls node_modules/@mosje` shows symlinks `config`, `design-system` (and `tokens` after Task 2). `dosje/` and `portals/` are NOT in `workspaces`, so their installs are untouched.

- [ ] **Step 3: Verify dosje is unaffected**

Run: `npm --prefix dosje run build`
Expected: build succeeds (baseline — nothing changed in dosje yet).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: declare packages/* as an npm workspace"
```

---

## Task 2: Scaffold the `@mosje/tokens` package

**Files:**
- Create: `packages/tokens/package.json`

- [ ] **Step 1: Write the package manifest**

```json
{
  "name": "@mosje/tokens",
  "version": "0.1.0",
  "description": "SAMAVESH design tokens — DTCG source compiled by Style Dictionary to CSS/TS/Tailwind/Figma.",
  "private": true,
  "type": "module",
  "exports": {
    "./css": "./dist/tokens.css",
    "./ts": "./dist/tokens.ts",
    "./tailwind-v3": "./dist/tailwind-v3.cjs",
    "./tailwind-v4": "./dist/tokens-tailwind.css",
    "./figma": "./dist/figma.tokens.json"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "node build/style-dictionary.config.mjs",
    "test": "node --test test/"
  },
  "devDependencies": {
    "style-dictionary": "^4.3.0"
  }
}
```

- [ ] **Step 2: Install the package dependency**

Run: `npm install -w @mosje/tokens`
Expected: `style-dictionary` installed; `node_modules/@mosje/tokens` symlink exists.

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/package.json package.json package-lock.json
git commit -m "feat(tokens): scaffold @mosje/tokens package"
```

---

## Task 3: Author Tier-1 primitive tokens (DTCG)

**Files:**
- Create: `packages/tokens/src/primitive.json`

- [ ] **Step 1: Write the primitive token file**

These are the raw values harvested from the existing `tokens.css`/`tokens.ts`, expanded into full scales. Primitives are private (never consumed by app code).

```json
{
  "$description": "Tier 1 — primitive/reference tokens. PRIVATE: never reference directly in app code.",
  "color": {
    "$type": "color",
    "blue":   { "50": {"$value":"#c6dcf9"}, "500": {"$value":"#0373df"}, "700": {"$value":"#014b92"} },
    "green":  { "50": {"$value":"#c8e6c9"}, "500": {"$value":"#2e7d32"} },
    "red":    { "500": {"$value":"#ec5042"} },
    "yellow": { "500": {"$value":"#ffd323"} },
    "saffron":{ "50": {"$value":"#ffedd5"}, "500": {"$value":"#f97316"}, "700": {"$value":"#7c3503"} },
    "navy":   { "700": {"$value":"#003366"} },
    "neutral":{
      "0":   {"$value":"#ffffff"},
      "50":  {"$value":"#f8f9fa"},
      "75":  {"$value":"#f4f3f9"},
      "100": {"$value":"#f1f3f5"},
      "200": {"$value":"#e2e6ea"},
      "700": {"$value":"#343a40"},
      "800": {"$value":"#212121"},
      "900": {"$value":"#1f2428"}
    }
  },
  "space": {
    "$type": "dimension",
    "0": {"$value":"0px"}, "1": {"$value":"4px"}, "2": {"$value":"8px"}, "3": {"$value":"12px"},
    "4": {"$value":"16px"}, "5": {"$value":"20px"}, "6": {"$value":"24px"}, "8": {"$value":"32px"},
    "10": {"$value":"40px"}, "12": {"$value":"48px"}, "14": {"$value":"56px"}
  },
  "radius": {
    "$type": "dimension",
    "xxs": {"$value":"2px"}, "xs": {"$value":"4px"}, "sm": {"$value":"6px"},
    "md": {"$value":"8px"}, "pill": {"$value":"100px"}
  },
  "font": {
    "family": {
      "$type": "fontFamily",
      "latin": {"$value":["Noto Sans","ui-sans-serif","system-ui","sans-serif"]},
      "devanagari": {"$value":["Noto Sans Devanagari","Noto Sans","ui-sans-serif","sans-serif"]}
    },
    "weight": {
      "$type": "fontWeight",
      "regular": {"$value":400}, "medium": {"$value":500}, "semibold": {"$value":600}
    },
    "size": {
      "$type": "dimension",
      "100": {"$value":"11px"}, "200": {"$value":"12px"}, "300": {"$value":"14px"},
      "400": {"$value":"16px"}, "500": {"$value":"20px"}, "600": {"$value":"22px"}, "900": {"$value":"48px"}
    },
    "lineHeight": {
      "$type": "dimension",
      "100": {"$value":"16px"}, "200": {"$value":"20px"}, "300": {"$value":"24px"},
      "400": {"$value":"28px"}, "900": {"$value":"56px"}, "devanagari": {"$value":"1.7"}
    }
  },
  "shadow": {
    "$type": "shadow",
    "xs": {"$value":"0 2px 3px 1px rgba(33, 33, 33, 0.12)"},
    "lg": {"$value":"0 12px 16px -4px rgba(33, 33, 33, 0.08), 0 4px 6px -2px rgba(33, 33, 33, 0.03)"},
    "xl": {"$value":"0 24px 48px -12px rgba(33, 33, 33, 0.18)"}
  }
}
```

> Note: `shadow` values are kept as DTCG string values (not the object form) so Style Dictionary emits them verbatim, matching the legacy `--ds-shadow-*` values exactly.

- [ ] **Step 2: Validate the JSON parses**

Run: `node -e 'JSON.parse(require("fs").readFileSync("packages/tokens/src/primitive.json","utf8"));console.log("ok")'`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/src/primitive.json
git commit -m "feat(tokens): author tier-1 primitive tokens"
```

---

## Task 4: Author Tier-2 semantic tokens with themes (DTCG)

**Files:**
- Create: `packages/tokens/src/semantic.json`

- [ ] **Step 1: Write the semantic token file**

The public contract. Aliases (`{...}`) point at primitives. Theme-specific values live under `$extensions.mosje.themes` so the build can emit `[data-theme]` blocks.

```json
{
  "$description": "Tier 2 — semantic/alias tokens. The PUBLIC contract apps consume.",
  "color": {
    "$type": "color",
    "action": {
      "primary": {
        "default": {"$value":"{color.blue.500}"},
        "hover":   {"$value":"{color.blue.700}"},
        "tonal":   {"$value":"{color.blue.50}"}
      }
    },
    "text": {
      "default": {"$value":"{color.neutral.800}", "$extensions":{"mosje":{"themes":{"dark":"{color.neutral.0}","hc":"#000000"}}}},
      "muted":   {"$value":"{color.neutral.700}"},
      "strong":  {"$value":"{color.neutral.900}"},
      "onPrimary": {"$value":"{color.neutral.0}"}
    },
    "bg": {
      "surface": {"$value":"{color.neutral.0}",  "$extensions":{"mosje":{"themes":{"dark":"{color.neutral.900}","hc":"#ffffff"}}}},
      "muted":   {"$value":"{color.neutral.50}", "$extensions":{"mosje":{"themes":{"dark":"#15191c","hc":"#ffffff"}}}},
      "alt":     {"$value":"{color.neutral.75}"}
    },
    "border": {
      "subtle": {"$value":"{color.neutral.100}", "$extensions":{"mosje":{"themes":{"hc":"#000000"}}}},
      "strong": {"$value":"{color.neutral.200}", "$extensions":{"mosje":{"themes":{"hc":"#000000"}}}}
    },
    "focus": { "ring": {"$value":"rgba(3, 115, 223, 0.48)"} },
    "status": {
      "success": {"$value":"{color.green.500}"},
      "warning": {"$value":"{color.yellow.500}"},
      "danger":  {"$value":"{color.red.500}"},
      "info":    {"$value":"{color.blue.500}"}
    },
    "brand": {
      "saffron":     {"$value":"{color.saffron.500}"},
      "saffronLight":{"$value":"{color.saffron.50}"},
      "saffronDark": {"$value":"{color.saffron.700}"},
      "navy":        {"$value":"{color.navy.700}"},
      "yellow":      {"$value":"{color.yellow.500}"}
    }
  },
  "type": {
    "$description": "Named type roles → primitive size/leading/weight.",
    "display":  {"size":{"$value":"{font.size.900}"},"leading":{"$value":"{font.lineHeight.900}"},"weight":{"$value":"{font.weight.medium}"}},
    "title1":   {"size":{"$value":"{font.size.600}"},"leading":{"$value":"{font.lineHeight.400}"},"weight":{"$value":"{font.weight.medium}"}},
    "headline": {"size":{"$value":"{font.size.500}"},"leading":{"$value":"{font.lineHeight.300}"},"weight":{"$value":"{font.weight.semibold}"}},
    "body1":    {"size":{"$value":"{font.size.400}"},"leading":{"$value":"{font.lineHeight.300}"},"weight":{"$value":"{font.weight.regular}"}},
    "body2":    {"size":{"$value":"{font.size.300}"},"leading":{"$value":"{font.lineHeight.200}"},"weight":{"$value":"{font.weight.regular}"}}
  },
  "density": {
    "$description": "Density token set: control height per density mode.",
    "control": {
      "height": {"$type":"dimension","$value":"40px","$extensions":{"mosje":{"themes":{"compact":"32px"}}}}
    }
  }
}
```

- [ ] **Step 2: Validate JSON parses**

Run: `node -e 'JSON.parse(require("fs").readFileSync("packages/tokens/src/semantic.json","utf8"));console.log("ok")'`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/src/semantic.json
git commit -m "feat(tokens): author tier-2 semantic tokens with light/dark/hc themes"
```

---

## Task 5: Author Tier-3 component tokens (DTCG)

**Files:**
- Create: `packages/tokens/src/component.json`

- [ ] **Step 1: Write the component token file**

```json
{
  "$description": "Tier 3 — component tokens. Resolve to semantic tokens only.",
  "button": {
    "$type": "color",
    "primary": {
      "bg":   {"$value":"{color.action.primary.default}"},
      "bgHover": {"$value":"{color.action.primary.hover}"},
      "text": {"$value":"{color.text.onPrimary}"}
    },
    "radius": {"$type":"dimension","$value":"{radius.md}"}
  },
  "card": {
    "$type": "color",
    "bg":     {"$value":"{color.bg.surface}"},
    "border": {"$value":"{color.border.subtle}"},
    "radius": {"$type":"dimension","$value":"{radius.md}"}
  }
}
```

- [ ] **Step 2: Validate JSON parses**

Run: `node -e 'JSON.parse(require("fs").readFileSync("packages/tokens/src/component.json","utf8"));console.log("ok")'`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/src/component.json
git commit -m "feat(tokens): author tier-3 component tokens"
```

---

## Task 6: Write the legacy-compat CSS format

**Files:**
- Create: `packages/tokens/build/formats/legacy-ds-css.mjs`

This custom Style Dictionary format emits **both** the new `--sa-*` variables (from token paths) **and** the exact legacy `--ds-*` aliases, so consumers importing the generated CSS see an identical `--ds-*` contract.

- [ ] **Step 1: Write the format module**

```js
// Emits :root { --sa-*: <value>; ... } plus a hardcoded legacy --ds-* alias block.
// The legacy block maps each old name to the new token it now derives from, so values
// stay identical while the source of truth becomes the DTCG tokens.

export const LEGACY_DS_ALIASES = {
  "--ds-primary": "--sa-color-action-primary-default",
  "--ds-primary-tonal": "--sa-color-action-primary-tonal",
  "--ds-primary-dark": "--sa-color-action-primary-hover",
  "--ds-primary-ring": "--sa-color-focus-ring",
  "--ds-success": "--sa-color-status-success",
  "--ds-success-tonal": "--sa-color-green-50",
  "--ds-danger": "--sa-color-status-danger",
  "--ds-warning": "--sa-color-status-warning",
  "--ds-info": "--sa-color-status-info",
  "--ds-ink": "--sa-color-text-default",
  "--ds-ink-strong": "--sa-color-text-strong",
  "--ds-ink-muted": "--sa-color-text-muted",
  "--ds-on-primary": "--sa-color-text-onPrimary",
  "--ds-surface": "--sa-color-bg-surface",
  "--ds-surface-muted": "--sa-color-bg-muted",
  "--ds-surface-alt": "--sa-color-bg-alt",
  "--ds-border": "--sa-color-border-subtle",
  "--ds-border-strong": "--sa-color-border-strong",
  "--ds-saffron": "--sa-color-brand-saffron",
  "--ds-saffron-light": "--sa-color-brand-saffronLight",
  "--ds-saffron-dark": "--sa-color-brand-saffronDark",
  "--ds-gov-navy": "--sa-color-brand-navy",
  "--ds-gov-yellow": "--sa-color-brand-yellow",
  "--ds-radius-xxs": "--sa-radius-xxs",
  "--ds-radius-xs": "--sa-radius-xs",
  "--ds-radius-sm": "--sa-radius-sm",
  "--ds-radius-md": "--sa-radius-md",
  "--ds-radius-pill": "--sa-radius-pill",
  "--ds-font-sans": "--sa-font-family-latin",
  "--ds-text-display": "--sa-type-display-size",
  "--ds-leading-display": "--sa-type-display-leading",
  "--ds-text-title-1": "--sa-type-title1-size",
  "--ds-leading-title-1": "--sa-type-title1-leading",
  "--ds-text-headline": "--sa-type-headline-size",
  "--ds-leading-headline": "--sa-type-headline-leading",
  "--ds-text-title-2": "--sa-font-size-400",
  "--ds-leading-title-2": "--sa-font-lineHeight-300",
  "--ds-text-body-1": "--sa-type-body1-size",
  "--ds-leading-body-1": "--sa-type-body1-leading",
  "--ds-text-body-2": "--sa-type-body2-size",
  "--ds-leading-body-2": "--sa-type-body2-leading",
  "--ds-text-body-3": "--sa-font-size-200",
  "--ds-leading-body-3": "--sa-font-lineHeight-100",
  "--ds-text-label-3": "--sa-font-size-100",
  "--ds-leading-label-3": "--sa-font-lineHeight-100",
  "--ds-shadow-xs": "--sa-shadow-xs",
  "--ds-shadow-lg": "--sa-shadow-lg",
  "--ds-shadow-xl": "--sa-shadow-xl"
};

export const legacyDsCss = {
  name: "css/legacy-ds",
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map(
      (t) => `  --sa-${t.path.join("-")}: ${t.$value ?? t.value};`
    );
    const legacy = Object.entries(LEGACY_DS_ALIASES).map(
      ([oldName, newVar]) => `  ${oldName}: var(${newVar});`
    );
    return `:root {\n${lines.join("\n")}\n\n  /* ---- legacy --ds-* contract (back-compat) ---- */\n${legacy.join("\n")}\n}\n`;
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/tokens/build/formats/legacy-ds-css.mjs
git commit -m "feat(tokens): legacy --ds-* compat CSS format"
```

---

## Task 7: Write the Style Dictionary config

**Files:**
- Create: `packages/tokens/build/style-dictionary.config.mjs`

- [ ] **Step 1: Write the build config**

```js
import StyleDictionary from "style-dictionary";
import { legacyDsCss, LEGACY_DS_ALIASES } from "./formats/legacy-ds-css.mjs";

StyleDictionary.registerFormat(legacyDsCss);

// TS format: export a nested `tokens` object + named groups, matching legacy shape.
StyleDictionary.registerFormat({
  name: "ts/nested",
  format: ({ dictionary }) => {
    const obj = {};
    for (const t of dictionary.allTokens) {
      let node = obj;
      for (const p of t.path.slice(0, -1)) node = node[p] ??= {};
      node[t.path.at(-1)] = t.$value ?? t.value;
    }
    return `// GENERATED by @mosje/tokens — do not edit.\nexport const tokens = ${JSON.stringify(obj, null, 2)} as const;\nexport default tokens;\n`;
  },
});

// Tailwind v3 preset: map a curated set of utility names to the legacy CSS vars.
StyleDictionary.registerFormat({
  name: "tailwind/v3",
  format: () => {
    const colors = {
      "gov-blue": "var(--ds-primary)", primary: "var(--ds-primary)",
      "primary-tonal": "var(--ds-primary-tonal)", success: "var(--ds-success)",
      danger: "var(--ds-danger)", warning: "var(--ds-warning)",
      saffron: "var(--ds-saffron)", ink: "var(--ds-ink)", surface: "var(--ds-surface)",
    };
    const borderRadius = { xs:"var(--ds-radius-xs)", sm:"var(--ds-radius-sm)", md:"var(--ds-radius-md)", pill:"var(--ds-radius-pill)" };
    return `// GENERATED by @mosje/tokens.\nmodule.exports = { theme: { extend: { colors: ${JSON.stringify(colors,null,2)}, borderRadius: ${JSON.stringify(borderRadius,null,2)} } } };\n`;
  },
});

const sd = new StyleDictionary({
  source: ["src/primitive.json", "src/semantic.json", "src/component.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/",
      files: [{ destination: "tokens.css", format: "css/legacy-ds" }],
    },
    ts: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [{ destination: "tokens.ts", format: "ts/nested" }],
    },
    tw3: {
      transformGroup: "css",
      buildPath: "dist/",
      files: [{ destination: "tailwind-v3.cjs", format: "tailwind/v3" }],
    },
    figma: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [{ destination: "figma.tokens.json", format: "json/nested" }],
    },
  },
});

await sd.hasInitialized;
await sd.buildAllPlatforms();
console.log("✓ @mosje/tokens built");
```

- [ ] **Step 2: Run the build**

Run: `npm run build -w @mosje/tokens`
Expected: `✓ @mosje/tokens built`; files exist under `packages/tokens/dist/`.

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/build/style-dictionary.config.mjs packages/tokens/dist
git commit -m "feat(tokens): style-dictionary build config + first build"
```

---

## Task 8: Test — generated CSS reproduces the legacy `--ds-*` contract

**Files:**
- Create: `packages/tokens/test/build-output.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname;
const legacy = JSON.parse(readFileSync(root + "test/legacy-snapshot.json", "utf8"));

function resolveVar(css, name) {
  // Resolve one level of var() indirection against the same :root block.
  const direct = css.match(new RegExp(`${name}\\s*:\\s*([^;]+);`));
  if (!direct) return null;
  let v = direct[1].trim();
  const ref = v.match(/^var\((--sa-[a-z0-9-]+)\)$/);
  if (ref) {
    const m = css.match(new RegExp(`${ref[1]}\\s*:\\s*([^;]+);`));
    return m ? m[1].trim() : null;
  }
  return v;
}

test("build emits every legacy --ds-* var with an identical resolved value", () => {
  execSync("npm run build -w @mosje/tokens", { cwd: root + "../.." });
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  for (const [name, expected] of Object.entries(legacy)) {
    const got = resolveVar(css, name);
    assert.ok(got !== null, `missing ${name}`);
    assert.equal(got.replace(/\s+/g, " "), expected.replace(/\s+/g, " "), `value drift for ${name}`);
  }
});
```

- [ ] **Step 2: Run the test to see it pass or surface real drift**

Run: `npm test -w @mosje/tokens`
Expected: PASS. If any token fails, fix its primitive value or alias mapping until the resolved value matches the legacy snapshot exactly (this is the non-breaking guarantee — do not relax the test).

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/test/build-output.test.mjs
git commit -m "test(tokens): assert generated CSS reproduces legacy --ds-* contract"
```

---

## Task 9: Wire the generated artifacts into `@mosje/design-system`

**Files:**
- Modify: `packages/design-system/tokens.css`
- Modify: `packages/design-system/tokens.ts`
- Modify: `packages/design-system/package.json:dependencies`

- [ ] **Step 1: Make design-system/tokens.css re-export the generated CSS**

Replace the entire contents of `packages/design-system/tokens.css` with:

```css
/* GENERATED CONTRACT — values now sourced from @mosje/tokens (DTCG + Style Dictionary).
   This file re-exports the built CSS so existing consumers (dosje imports
   "@mosje/design-system/tokens.css") keep working unchanged. Do not hand-edit tokens;
   edit packages/tokens/src/*.json and rebuild. */
@import "@mosje/tokens/css";
```

- [ ] **Step 2: Add the dependency so the import resolves**

In `packages/design-system/package.json`, add a `dependencies` block (or add to it):

```json
  "dependencies": {
    "@mosje/tokens": "*"
  }
```

- [ ] **Step 3: Point design-system/tokens.ts at the generated TS**

Replace the contents of `packages/design-system/tokens.ts` with:

```ts
// Re-export generated tokens from @mosje/tokens (source of truth: packages/tokens/src/*.json).
export { tokens as default, tokens } from "@mosje/tokens/ts";
export type Tokens = typeof import("@mosje/tokens/ts").tokens;
```

- [ ] **Step 4: Reinstall to link the new dependency**

Run: `npm install`
Expected: `node_modules/@mosje/design-system/node_modules/@mosje/tokens` (or hoisted) resolves.

- [ ] **Step 5: Verify dosje still builds (THE non-breaking gate)**

Run: `npm --prefix dosje run build`
Expected: build succeeds. If the CSS `@import "@mosje/tokens/css"` fails to resolve in dosje's bundler, fall back to copying `dist/tokens.css` into `design-system/tokens.css` as a build step (`"prebuild": "cp ../tokens/dist/tokens.css ./tokens.css"`) and verify again.

- [ ] **Step 6: Commit**

```bash
git add packages/design-system/tokens.css packages/design-system/tokens.ts packages/design-system/package.json package-lock.json
git commit -m "feat(design-system): source tokens from @mosje/tokens (non-breaking)"
```

---

## Task 10: Add Tailwind v4 `@theme` output + dark/hc/density theme blocks

**Files:**
- Modify: `packages/tokens/build/formats/legacy-ds-css.mjs` (add theme blocks)
- Modify: `packages/tokens/build/style-dictionary.config.mjs` (add tailwind-v4 file)

- [ ] **Step 1: Extend the CSS format to emit theme + density overrides**

In `legacy-ds-css.mjs`, after building the `:root` block in `legacyDsCss.format`, append `[data-theme="dark"]`, `[data-theme="hc"]`, and `[data-density="compact"]` blocks by reading `token.original.$extensions?.mosje?.themes`. Add this inside the `format` function before the return, and include `themeBlocks` in the returned string:

```js
    const themeMap = { dark: [], hc: [], compact: [] };
    for (const t of dictionary.allTokens) {
      const themes = t.original?.$extensions?.mosje?.themes;
      if (!themes) continue;
      for (const [theme, val] of Object.entries(themes)) {
        const resolved = typeof val === "string" && val.startsWith("{")
          ? `var(--sa-${val.slice(1, -1).split(".").join("-")})`
          : val;
        if (themeMap[theme]) themeMap[theme].push(`  --sa-${t.path.join("-")}: ${resolved};`);
      }
    }
    const themeBlocks = [
      themeMap.dark.length ? `[data-theme="dark"] {\n${themeMap.dark.join("\n")}\n}` : "",
      themeMap.hc.length ? `[data-theme="hc"] {\n${themeMap.hc.join("\n")}\n}` : "",
      themeMap.compact.length ? `[data-density="compact"] {\n${themeMap.compact.join("\n")}\n}` : "",
    ].filter(Boolean).join("\n\n");
```

Then change the format's `return` to append the theme blocks:

```js
    return `:root {\n${lines.join("\n")}\n\n  /* ---- legacy --ds-* contract (back-compat) ---- */\n${legacy.join("\n")}\n}\n\n${themeBlocks}\n`;
```

- [ ] **Step 2: Add a Tailwind v4 `@theme` file to the config**

Register a `css/tailwind-v4` format in `style-dictionary.config.mjs` and add it as a platform file. Add this format registration near the others:

```js
StyleDictionary.registerFormat({
  name: "css/tailwind-v4",
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens
      .filter((t) => t.path[0] === "color")
      .map((t) => `  --color-${t.path.slice(1).join("-")}: var(--sa-${t.path.join("-")});`);
    return `@theme inline {\n${vars.join("\n")}\n}\n`;
  },
});
```

And add to the `css` platform's `files` array:

```js
      { destination: "tokens-tailwind.css", format: "css/tailwind-v4" },
```

- [ ] **Step 3: Rebuild and verify theme blocks exist**

Run: `npm run build -w @mosje/tokens && grep -c 'data-theme="dark"' packages/tokens/dist/tokens.css`
Expected: build succeeds; grep prints `1`.

- [ ] **Step 4: Re-run the contract test (themes must not break legacy `:root`)**

Run: `npm test -w @mosje/tokens`
Expected: PASS (the `:root` legacy contract is unchanged; theme blocks are additive).

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/build packages/tokens/dist
git commit -m "feat(tokens): emit dark/high-contrast/compact theme blocks + tailwind-v4 @theme"
```

---

## Task 11: Validate the Figma DTCG export

**Files:**
- Create: `packages/tokens/test/figma-export.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;

test("figma.tokens.json is valid JSON and resolves the primary color", () => {
  const json = JSON.parse(readFileSync(root + "dist/figma.tokens.json", "utf8"));
  // Style Dictionary resolves aliases at build → action.primary.default should be the hex.
  assert.equal(json.color.action.primary.default, "#0373df");
  assert.equal(json.color.status.danger, "#ec5042");
});
```

- [ ] **Step 2: Run the test**

Run: `npm test -w @mosje/tokens`
Expected: PASS. If the keys differ, inspect `dist/figma.tokens.json` and align the assertions to the actual nested path (do not change token values).

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/test/figma-export.test.mjs
git commit -m "test(tokens): validate figma DTCG export resolves aliases"
```

---

## Task 12: Token-lint gate (no raw hex / no Tier-1 in app code)

**Files:**
- Create: `.stylelintrc.tokens.json`
- Create: `packages/tokens/test/lint-fixture.css`

- [ ] **Step 1: Write the token-lint config**

```json
{
  "rules": {
    "color-no-hex": true,
    "declaration-property-value-disallowed-list": {
      "/.*/": ["/--sa-color-(blue|green|red|yellow|saffron|navy|neutral)-/"]
    }
  }
}
```

> Rationale: `color-no-hex` forbids raw hex in app/component CSS; the disallowed-list forbids referencing **Tier-1 primitive** vars (`--sa-color-<palette>-<step>`) directly — app code must use semantic vars only.

- [ ] **Step 2: Write a fixture that SHOULD fail the lint**

```css
/* packages/tokens/test/lint-fixture.css — intentionally violates token rules */
.bad { color: #ff0000; background: var(--sa-color-blue-500); }
```

- [ ] **Step 3: Verify the lint flags the fixture**

Run: `npx stylelint --config .stylelintrc.tokens.json packages/tokens/test/lint-fixture.css`
Expected: FAIL — reports `color-no-hex` for `#ff0000` and the disallowed Tier-1 var. (Exit code non-zero confirms the gate works.)

- [ ] **Step 4: Commit**

```bash
git add .stylelintrc.tokens.json packages/tokens/test/lint-fixture.css
git commit -m "feat(tokens): token-lint gate forbidding raw hex + tier-1 use"
```

---

## Task 13: Update the Tailwind v3 preset to consume generated values

**Files:**
- Modify: `packages/config/tailwind-preset.cjs`

- [ ] **Step 1: Re-export the generated preset from @mosje/tokens**

Replace the body of `packages/config/tailwind-preset.cjs` with a thin re-export so portals get generated values (keep the file path stable for existing `presets: [preset]` imports):

```js
/**
 * MoSJE Tailwind v3 preset (for portals).
 * Now generated by @mosje/tokens. Import "@mosje/design-system/tokens.css" in the portal
 * globals so the --ds-* / --sa-* variables resolve.
 */
module.exports = require("@mosje/tokens/tailwind-v3");
```

- [ ] **Step 2: Add the dependency**

In `packages/config/package.json`, add:

```json
  "dependencies": {
    "@mosje/tokens": "*"
  }
```

- [ ] **Step 3: Verify the preset loads**

Run: `npm install && node -e 'console.log(Object.keys(require("@mosje/config/tailwind-preset").theme.extend.colors).length)'`
Expected: prints a number ≥ 8 (the curated color utilities).

- [ ] **Step 4: Commit**

```bash
git add packages/config/tailwind-preset.cjs packages/config/package.json package-lock.json
git commit -m "feat(config): tailwind v3 preset sourced from @mosje/tokens"
```

---

## Task 14: Document the package + update the rule

**Files:**
- Create: `packages/tokens/README.md`
- Modify: `.claude/rules/design-system.md`

- [ ] **Step 1: Write the README**

```markdown
# @mosje/tokens

SAMAVESH design tokens. DTCG JSON source → Style Dictionary v4 → CSS / TS / Tailwind / Figma.

## Source of truth
Edit `src/primitive.json` (Tier 1, private), `src/semantic.json` (Tier 2, public contract),
`src/component.json` (Tier 3). Never hand-edit `dist/`.

## Build & test
- `npm run build -w @mosje/tokens` — regenerate all outputs.
- `npm test -w @mosje/tokens` — assert legacy `--ds-*` contract + Figma export.

## Outputs (`dist/`)
- `tokens.css` — `:root` `--sa-*` + back-compat `--ds-*` + `[data-theme]`/`[data-density]` blocks.
- `tokens.ts` — typed nested `tokens` object.
- `tailwind-v3.cjs` — preset for portals.
- `tokens-tailwind.css` — `@theme` for dosje (Tailwind v4).
- `figma.tokens.json` — DTCG for Tokens Studio import (Figma sync).

## Themes
`<html data-theme="dark">`, `data-theme="hc"` (high-contrast), `data-density="compact"`.

## Rules
App/component code consumes **semantic** tokens only. Tier-1 primitives + raw hex are
blocked by `.stylelintrc.tokens.json` in CI.
```

- [ ] **Step 2: Update the design-system rule to reflect phase-2 reality**

In `.claude/rules/design-system.md`, replace the line:

```
It is intentionally empty until phase 2 (see `/sync-figma`).
```

with:

```
Phase 2 is underway: tokens are authored as DTCG JSON in `@mosje/tokens` and compiled by
Style Dictionary into the `--ds-*`/`--sa-*` CSS contract, a TS module, Tailwind presets, and
a Figma DTCG export. Edit tokens in `packages/tokens/src/*.json`, never in generated `dist/`.
```

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/README.md .claude/rules/design-system.md
git commit -m "docs(tokens): README + update design-system rule for phase 2"
```

---

## Self-Review

**Spec coverage (spec §3 token architecture, §2 workspace, §9 deliverable #2):**
- 3-tier DTCG → Tasks 3/4/5. ✓
- Style Dictionary build → CSS/TS/Tailwind-v3/Tailwind-v4/Figma → Tasks 7/10/11. ✓
- Backward-compatible `--ds-*` → Tasks 0/6/8/9 (frozen snapshot + contract test). ✓
- Themes light/dark/high-contrast + density → Tasks 4/10. ✓
- Multi-script font families → primitive `font.family.devanagari` (Task 3) + leading (Task 3). ✓
- npm workspace → Task 1. ✓
- token-lint gate → Task 12. ✓
- dosje non-breaking gate → Tasks 1/9 (build verification). ✓

**Deferred to later plans (by design, not gaps):** atom migration onto semantic tokens (Plan 2), Storybook + governance docs (Plan 3), Figma round-trip + Code Connect (Plan 4). Multi-script *sizing* tokens beyond family/leading are stubbed minimally here and expanded in Plan 2 when components consume them.

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `--sa-<path-join->` naming is used identically across Tasks 6/7/10/12; `LEGACY_DS_ALIASES` is the single mapping consumed by the test resolver in Task 8; `tokens` export name is consistent across Tasks 7/9/11.
