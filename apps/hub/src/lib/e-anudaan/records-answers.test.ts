/**
 * The applicant's read-back of a submitted application counts only what its path asked.
 *
 * The full-wizard walk of 13 Sep 2026 opened every submitted application to "47 of 51", "51 of 54"
 * or "103 of 107 answered"; an AVYAY renewal listed "4. Justification 0 of 3", a step renewals are
 * never shown, and a NAPDDR new project listed "Use of the Previous Instalment 0 of 1".
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { answeredSections } from "./applicant.ts";
import { buildScenario } from "./demo-scenarios.ts";
import { RENEWAL_PICKER, fieldVisible, stepFields, visibleSteps, wizardFor, WIZARDS } from "./form-schema.ts";
import { renewableProjects, renewalOption } from "./instalments.ts";
import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import { answerField } from "./submit-application.ts";
import type { EAnudaanState } from "./types.ts";

const STATE: EAnudaanState = { version: 0, session: "ngo", schemes: SEED_SCHEMES, ...buildSeed() };

const NEW = "New project";
const RENEWAL = "Ongoing / Renewal of an existing project";

/** What the wizard would hold after an applicant on this branch answered only what they were shown. */
function submitted(scheme: string, caseType?: string, leaveOptionalBlank = true): Record<string, string> {
  const def = wizardFor(scheme)!;
  const all = buildScenario("complete", def).values;
  let values: Record<string, string> = caseType ? { ...all, case_type: caseType } : { ...all };
  // An AVYAY renewal names one of the NGO's own sanctioned projects, which brings its figures.
  // A renewal names one of the NGO's own sanctioned projects, which brings its figures.
  if (caseType && /ongoing|existing/i.test(caseType) && RENEWAL_PICKER[def.code]) {
    const step = visibleSteps(def, values)[0]!;
    const plans = renewableProjects(STATE, STATE.ngos[0]!.id, def.code);
    const option = renewalOption(plans.find((p) => p.instalment === 2) ?? plans[0]!);
    values = answerField(STATE, def, step, { ...all, case_type: caseType }, RENEWAL_PICKER[def.code], option);
    // The clerk gives the declarations afresh; they are not carried forward.
    values = { ...values, ...Object.fromEntries(Object.entries(all).filter(([k]) => k.startsWith("decl_") || k === "prev_instalment_utilised")) };
  }
  const shown: Record<string, string> = {};
  for (const step of visibleSteps(def, values)) {
    for (const f of stepFields(step)) {
      if (!fieldVisible(f, values)) continue;
      if (leaveOptionalBlank && !f.required) continue;
      if (values[f.name] !== undefined) shown[f.name] = values[f.name]!;
    }
  }
  // What the portal records beside the answers — which claim this is, and whether its account is
  // already registered — goes with them, as `fileApplication` keeps every value.
  for (const k of ["claim_stage", "fld_pfms_on_record", "fld_application_ref"]) if (values[k]) shown[k] = values[k]!;
  return shown;
}

test("AVYAY renewal does not list the Justification step it never asks", () => {
  const titles = answeredSections("AVYAY", submitted("AVYAY", RENEWAL)).map((s) => s.title);
  assert.ok(!titles.includes("Justification"), titles.join(" · "));
});

test("NAPDDR new project does not list the Previous Instalment it never asks", () => {
  const titles = answeredSections("NAPDDR", submitted("NAPDDR", NEW)).map((s) => s.title);
  assert.ok(!titles.includes("Use of the Previous Instalment"), titles.join(" · "));
});

test("a complete submission has no outstanding required question on any path", () => {
  const paths: [string, string | undefined][] = [
    ["NAPDDR", NEW],
    ["NAPDDR", RENEWAL],
    ["AVYAY", NEW],
    ["AVYAY", RENEWAL],
    ["SHRESHTA_M2", undefined],
  ];
  for (const opt of wizardFor("SMILE")!.steps.flatMap(stepFields).find((f) => f.name === "case_type")?.options ?? []) {
    paths.push(["SMILE", opt]);
  }
  for (const [scheme, caseType] of paths) {
    const sections = answeredSections(scheme, submitted(scheme, caseType));
    assert.ok(sections.length > 0, `${scheme} ${caseType}`);
    const missing = sections.filter((s) => s.missingRequired > 0).map((s) => `${s.title} (${s.missingRequired})`);
    assert.deepEqual(missing, [], `${scheme} · ${caseType ?? "single path"}`);
    assert.ok(sections.every((s) => s.fields.length > 0), "an empty section is listed");
  }
});

test("an optional question left blank is not an outstanding one, and a skipped required one is", () => {
  const values = submitted("SHRESHTA_M2", undefined, true);
  const before = answeredSections("SHRESHTA_M2", values);
  assert.equal(before.reduce((a, s) => a + s.missingRequired, 0), 0);
  const firstRequired = before.flatMap((s) => s.fields).find((f) => f.required)!;
  const without = { ...values };
  delete without[firstRequired.name];
  assert.equal(answeredSections("SHRESHTA_M2", without).reduce((a, s) => a + s.missingRequired, 0), 1);
});

test("every scheme's sections are numbered from 1 without gaps", () => {
  for (const code of Object.keys(WIZARDS)) {
    const s = answeredSections(code, submitted(code, NEW));
    assert.deepEqual(s.map((x) => x.index), s.map((_, i) => i + 1), code);
  }
});
