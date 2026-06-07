#!/usr/bin/env node
/**
 * MoSJE token generator. Reads tokens.json (the single source of truth) and writes
 * tokens.css (CSS custom properties) + tokens.ts (typed export). Run after editing
 * tokens.json or syncing from Figma:  npm run build:tokens
 *
 * The generated files are NOT hand-edited — change tokens.json instead.
 */
import { readFile, writeFile } from "node:fs/promises";

const ROOT = new URL(".", import.meta.url).pathname;
const json = JSON.parse(await readFile(ROOT + "tokens.json", "utf8"));

const camel = (k) => k.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const GEN = "/* GENERATED from tokens.json by build-tokens.mjs — DO NOT EDIT. Run `npm run build:tokens`. */";

/* ---------- tokens.css ---------- */
const css = [];
css.push(GEN);
css.push(":root {");
css.push("  /* colours */");
for (const [k, v] of Object.entries(json.color)) css.push(`  --ds-${k}: ${v};`);
css.push("");
css.push("  /* radius */");
for (const [k, v] of Object.entries(json.radius)) css.push(`  --ds-radius-${k}: ${v};`);
css.push("");
css.push("  /* typography */");
css.push(`  --ds-font-sans: ${json.font.sans};`);
for (const [k, t] of Object.entries(json.type)) {
  css.push(`  --ds-text-${k}: ${t.size};`);
  css.push(`  --ds-leading-${k}: ${t.leading};`);
}
css.push("");
css.push("  /* elevation */");
for (const [k, v] of Object.entries(json.shadow)) css.push(`  --ds-shadow-${k}: ${v};`);
css.push("}");
css.push("");
await writeFile(ROOT + "tokens.css", css.join("\n"));

/* ---------- tokens.ts ---------- */
const obj = (entries, indent = "  ") =>
  entries.map(([k, v]) => `${indent}${camel(k)}: ${JSON.stringify(v)},`).join("\n");

const typeObj = Object.entries(json.type)
  .map(
    ([k, t]) =>
      `  ${camel(k)}: { size: ${JSON.stringify(t.size)}, leading: ${JSON.stringify(
        t.leading,
      )}, weight: ${t.weight}, tracking: ${JSON.stringify(t.tracking)} },`,
  )
  .join("\n");

const ts = `${GEN}
/** Typed mirror of tokens.json — single source of truth for non-CSS consumers. */
export const colors = {
${obj(Object.entries(json.color))}
} as const;

export const radius = {
${obj(Object.entries(json.radius))}
} as const;

export const fontFamily = {
  sans: ${JSON.stringify(json.font.sans)},
} as const;

/** Named type styles. */
export const typography = {
${typeObj}
} as const;

export const shadow = {
${obj(Object.entries(json.shadow))}
} as const;

export const tokens = { colors, radius, fontFamily, typography, shadow } as const;
export default tokens;
`;
await writeFile(ROOT + "tokens.ts", ts);

console.log(
  `✓ Generated tokens.css + tokens.ts from tokens.json (` +
    `${Object.keys(json.color).length} colours, ${Object.keys(json.type).length} type styles, ` +
    `${Object.keys(json.radius).length} radii, ${Object.keys(json.shadow).length} shadows).`,
);
