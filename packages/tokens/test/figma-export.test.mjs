import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;

test("figma.tokens.json is valid JSON and resolves aliases to final values", () => {
  const json = JSON.parse(readFileSync(root + "dist/figma.tokens.json", "utf8"));
  assert.equal(json.color.action.primary.default, "#0373df");
  assert.equal(json.color.status.danger, "#b8382f");
  // primitives + dimensions are present and resolved (px preserved, not rem).
  // `spacing` became `space` on 2026-08-10 — the grammar's own group dictionary (§5.4) says
  // `space`, and the legacy root was one of the four that skipped grammar parsing entirely.
  assert.equal(json.space.lg, "16px");
  assert.equal(json.radius.md, "8px");
  assert.equal(json.radius.full, "999px");
});

test("every Figma variable ships a usage description — no silent empties", () => {
  // `guidanceFor` returns null for any path it has no case for, and the exporter turns that
  // into "". Nothing checked, so the gap was invisible until the LIBRARY was audited: five
  // ref/border/width/* shipped blank because `primitivePointer` had no `border` case, and all
  // seven legacy cmp/button|card tokens shipped blank because only the cmp ACTION matrix was
  // handled. A description is how a designer knows which of two neighbouring tokens to pick,
  // so an empty one is a real defect, not cosmetic.
  //
  // This also guards the SYNC: descriptions are pushed to Figma from this payload, so an empty
  // string here does not just omit guidance — it ERASES whatever the library already had.
  const payload = JSON.parse(
    readFileSync(new URL("../dist/figma.variables.json", import.meta.url), "utf8"),
  );
  const blank = [];
  for (const c of payload.collections) {
    for (const v of c.variables) {
      if (!v.description || !v.description.trim()) blank.push(`${c.name}::${v.name}`);
    }
  }
  assert.deepEqual(
    blank.slice(0, 12),
    [],
    `${blank.length} variable(s) would ship to Figma with an empty description. Add the ` +
      `missing case to guidanceFor/primitivePointer in build/usage-guidance.mjs — do not ` +
      `hand-write the sentence onto the token.`,
  );
});
