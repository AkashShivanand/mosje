/** Every form the demo dock can fill has one correct fill, unique ids, and Title Case labels. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMS, formsForPath } from "./index.ts";
import { correctedValueOf } from "./correct-application.ts";

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

test("each NGO form is offered on its own page", () => {
  const on = (path: string) => formsForPath(`/portals/e-anudaan${path}`).map((f) => f.id);
  assert.deepEqual(on("/ngo/bank-accounts"), ["bank-account-change"]);
  assert.deepEqual(on("/ngo/beneficiaries"), ["add-beneficiary", "add-employee"]);
  assert.deepEqual(on("/ngo/attendance"), ["weekly-attendance"]);
  assert.deepEqual(on("/ngo/cctv"), ["cctv-camera", "cctv-certificate", "cctv-records", "cctv-uptime"]);
  assert.deepEqual(on("/ngo/my-applications/EA-2026-000123"), ["correct-application"]);
  assert.deepEqual(on("/ngo/my-applications/EA-2026-000123/uc"), ["utilisation-certificate"]);
  assert.deepEqual(on("/ngo/my-applications/deficiencies"), []);
  assert.deepEqual(on("/ngo/my-applications"), []);
});

test("a corrected answer differs from the one submitted and keeps its kind", () => {
  assert.equal(correctedValueOf("215"), "204");
  assert.equal(correctedValueOf("1"), "0");
  assert.equal(correctedValueOf("0"), "1");
  assert.equal(correctedValueOf("Hadapsar"), "Hadapsar (revised)");
  for (const v of ["215", "1", "0", "3", "Pune", ""]) assert.notEqual(correctedValueOf(v), v);
});
