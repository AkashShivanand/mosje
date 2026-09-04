import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * EVERY TOKEN HAS A TYPE, EVERY GROUP HAS A DESCRIPTION.
 *
 * The 2026-09-04 foundations audit found 61 semantic leaves with no effective `$type`
 * (chart, bg, text, border, overlay, density, layout, focus, control, leading) and six
 * semantic groups with no `$description`. A token with no type is one the Figma exporter
 * has to guess at, and a group with no description is one a reader has to reverse-engineer
 * from its members. Both are DTCG requirements in spirit and benchmark practice in fact.
 *
 * The motion, layering and opacity rebuild closed both counts to zero. This keeps them there.
 */

const root = new URL("..", import.meta.url).pathname;
const FILES = ["src/primitive.json", "src/semantic.json", "src/component.json"];

function walk(node, path, inherited, out) {
  const type = node.$type ?? inherited;
  const keys = Object.keys(node).filter((k) => !k.startsWith("$"));
  const isGroup = keys.length > 0 && !("$value" in node);
  if (isGroup && path.length > 0 && !node.$description) out.undescribedGroups.push(path.join("."));
  for (const k of keys) {
    const v = node[k];
    if (!v || typeof v !== "object") continue;
    if ("$value" in v) {
      if (!(v.$type ?? type)) out.untyped.push(path.concat(k).join("."));
    } else walk(v, path.concat(k), type, out);
  }
}

for (const rel of FILES) {
  const json = JSON.parse(readFileSync(root + rel, "utf8"));
  test(`${rel}: every token resolves a $type`, () => {
    const out = { untyped: [], undescribedGroups: [] };
    walk(json, [], null, out);
    assert.deepEqual(out.untyped, [], `${out.untyped.length} token(s) with no effective $type`);
  });
}

test("src/semantic.json: every top-level group carries a $description", () => {
  const json = JSON.parse(readFileSync(root + "src/semantic.json", "utf8"));
  const missing = Object.keys(json)
    .filter((k) => !k.startsWith("$"))
    .filter((k) => json[k] && typeof json[k] === "object" && !("$value" in json[k]) && !json[k].$description);
  assert.deepEqual(missing, [], `${missing.length} semantic group(s) with no description`);
});

test("src/primitive.json: every top-level group carries a $description", () => {
  const json = JSON.parse(readFileSync(root + "src/primitive.json", "utf8"));
  const missing = Object.keys(json)
    .filter((k) => !k.startsWith("$"))
    .filter((k) => json[k] && typeof json[k] === "object" && !("$value" in json[k]) && !json[k].$description);
  assert.deepEqual(missing, [], `${missing.length} primitive group(s) with no description`);
});

test("no $description interpolates a reference — braces in prose are a Style Dictionary trap", () => {
  const bad = [];
  for (const rel of FILES) {
    const json = JSON.parse(readFileSync(root + rel, "utf8"));
    (function w(n, p) {
      for (const k of Object.keys(n)) {
        // A brace pair that IS a resolvable reference ({space.8}) is fine — Style Dictionary
        // interpolates it. Prose in braces ({color, offsetX}) is what breaks the build.
        if (k === "$description" && /\{[^}]*\}/.test(n[k]) && [...n[k].matchAll(/\{([^}]*)\}/g)].some((m) => !/^[A-Za-z0-9_.]+$/.test(m[1]))) bad.push(`${rel}: ${p.join(".")}`);
        else if (n[k] && typeof n[k] === "object" && !k.startsWith("$")) w(n[k], p.concat(k));
      }
    })(json, []);
  }
  assert.deepEqual(bad, []);
});
