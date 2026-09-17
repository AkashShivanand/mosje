/** Every form the demo dock can fill has one correct fill, unique ids, and Title Case labels. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMS, formsForPath } from "./index.ts";

test("each form has exactly one correct fill and at least one rule preset", () => {
  const ids = FORMS.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length, "form ids repeat");
  for (const form of FORMS) {
    assert.equal(form.presets.filter((p) => p.valid).length, 1, `${form.id} needs exactly one correct fill`);
    assert.ok(form.presets.some((p) => !p.valid), `${form.id} has no rule preset`);
    const presetIds = form.presets.map((p) => p.id);
    assert.equal(new Set(presetIds).size, presetIds.length, `${form.id} preset ids repeat`);
    for (const p of form.presets) assert.match(p.label, /^[A-Z0-9]/, `${form.id} · ${p.id} label is not Title Case`);
  }
});

test("a form is found on its own page and nowhere else", () => {
  assert.deepEqual(formsForPath("/portals/e-anudaan/ngo/project-location-change").map((f) => f.id), ["project-location-change"]);
  assert.deepEqual(formsForPath("/portals/e-anudaan/ngo/dashboard"), []);
});
