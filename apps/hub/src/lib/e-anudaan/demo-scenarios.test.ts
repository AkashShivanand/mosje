/**
 * The demo dock's fills: "Complete & valid" passes every step of every scheme with believable
 * answers, and each rule preset trips exactly the rule it is named for.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { buildRulePreset, buildScenario, RULE_PRESETS, rulePresetsFor } from "./demo-scenarios.ts";
import { stepFields, validateStep, visibleSteps, WIZARDS } from "./form-schema.ts";

const TODAY = "2026-09-17";

test("Complete & valid passes every form step of every scheme", () => {
  for (const def of Object.values(WIZARDS)) {
    const { values } = buildScenario("complete", def);
    for (const step of visibleSteps(def, values)) {
      if (step.kind === "documents" || step.kind === "review") continue;
      // The declaration date is stamped by the wizard at the moment it is signed.
      const errors = validateStep(step, { ...values, fld_auth_date: TODAY }, TODAY);
      assert.deepEqual(errors, {}, `${def.code} · ${step.title}`);
    }
  }
});

test("no demo answer reads as demo tooling", () => {
  for (const def of Object.values(WIZARDS)) {
    const { values } = buildScenario("complete", def);
    for (const [name, v] of Object.entries(values)) {
      assert.doesNotMatch(v, /illustrative|prototype demo|lorem/i, `${def.code} · ${name} = ${v}`);
    }
    // One applicant: a Pune society's project is in Maharashtra.
    for (const name of ["fld_project_state", "fld_site_state"]) {
      if (values[name]) assert.equal(values[name], "Maharashtra", `${def.code} · ${name}`);
    }
  }
});

test("every free-text field a scheme asks is answered", () => {
  for (const def of Object.values(WIZARDS)) {
    const { values } = buildScenario("complete", def);
    for (const step of visibleSteps(def, values)) {
      for (const f of stepFields(step)) {
        if (!f.required || f.auto || f.optionsFrom) continue;
        if (f.showWhen && !f.showWhen.equals.includes(values[f.showWhen.field] ?? "")) continue;
        assert.ok((values[f.name] ?? "").trim() !== "", `${def.code} · ${f.name} is unanswered`);
      }
    }
  }
});

test("each rule preset trips its own rule on its own field, and nothing else", () => {
  let exercised = 0;
  for (const def of Object.values(WIZARDS)) {
    for (const { preset } of rulePresetsFor(def)) {
      const built = buildRulePreset(preset.id, def);
      assert.ok(built, `${def.code} · ${preset.id} has no target`);
      const { detail, route } = built;
      const step = visibleSteps(def, detail.values)[detail.errorsAt!]!;
      const errors = validateStep(step, { ...detail.values, fld_auth_date: TODAY }, TODAY);
      assert.equal(Object.keys(errors).length, 1, `${def.code} · ${preset.id}: ${JSON.stringify(errors)}`);
      assert.match(route, new RegExp(`/scheme/${def.code}/step-1`));
      exercised++;
    }
  }
  assert.ok(exercised >= 45, `only ${exercised} presets exercised`);
});

test("every rule the form enforces has a preset somewhere", () => {
  const reachable = new Set(Object.values(WIZARDS).flatMap((def) => rulePresetsFor(def).map((r) => r.preset.id)));
  for (const p of RULE_PRESETS) assert.ok(reachable.has(p.id), `${p.id} is reachable in no scheme`);
});
