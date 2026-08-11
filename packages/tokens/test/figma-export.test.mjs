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
