// Every field the wizards define has an edit rule for every stage, and the rules agree with the form.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { WIZARDS, type FieldDef } from "./form-schema.ts";
import type { GrantApplication } from "./types.ts";
import {
  EDIT_GROUPS,
  EDIT_STAGES,
  FIELD_GROUP,
  applyAnswer,
  canEdit,
  editRuleOnFile,
  changedAnswers,
  changesForAudit,
  editRule,
  editStageOf,
} from "./edit-policy.ts";

function allFields(): Map<string, FieldDef> {
  const out = new Map<string, FieldDef>();
  for (const w of Object.values(WIZARDS)) for (const s of w.steps) for (const sec of s.sections) for (const f of sec.fields) out.set(f.name, f);
  return out;
}

test("every form field has a rule for every stage — a new field without one fails here", () => {
  const missing: string[] = [];
  for (const name of allFields().keys()) {
    for (const stage of EDIT_STAGES) if (!editRule(name, stage)) missing.push(`${name} @ ${stage}`);
  }
  assert.deepEqual(missing, [], `Add these fields to a group in edit-policy.ts:\n${missing.join("\n")}`);
});

test("no field is listed in two groups, and no group lists a field the forms do not have", () => {
  const seen = new Map<string, string>();
  const twice: string[] = [];
  for (const [id, g] of Object.entries(EDIT_GROUPS)) {
    for (const f of g.fields) {
      if (seen.has(f)) twice.push(`${f}: ${seen.get(f)} and ${id}`);
      seen.set(f, id);
    }
  }
  assert.deepEqual(twice, []);
  const fields = allFields();
  const stale = [...FIELD_GROUP.keys()].filter((n) => !fields.has(n));
  assert.deepEqual(stale, [], "Remove these from edit-policy.ts — no form asks them any more");
});

test("a locked rule always says why, and a reason-required rule says why a reason is asked", () => {
  for (const [id, g] of Object.entries(EDIT_GROUPS)) {
    for (const stage of EDIT_STAGES) {
      const rule = g.policy[stage];
      if (rule.kind === "locked") assert.ok(rule.reason.trim().length > 20, `${id} @ ${stage}`);
      if (rule.kind === "editable-with-reason") assert.ok(rule.why.trim().length > 20, `${id} @ ${stage}`);
      if (rule.kind === "locked" && rule.changeAt) assert.match(rule.changeAt.href, /^(https:\/\/|\/portals\/e-anudaan\/)/);
    }
  }
});

test("a draft locks exactly the answers the form itself draws read-only or calculates", () => {
  // A field name can be shared by schemes that treat it differently (AVYAY calculates the recurring
  // grant SHRESHTA asks for), so a draft locks a field only where EVERY form that asks it does.
  const defs = new Map<string, FieldDef[]>();
  for (const w of Object.values(WIZARDS)) for (const s of w.steps) for (const sec of s.sections) for (const f of sec.fields) defs.set(f.name, [...(defs.get(f.name) ?? []), f]);
  for (const [name, list] of defs) {
    const fixed = list.every((f) => f.readOnly || f.auto);
    assert.equal(editRule(name, "draft")?.kind === "locked", fixed, name);
  }
});

test("nothing is editable while the application is under examination", () => {
  for (const name of allFields().keys()) assert.equal(canEdit(editRule(name, "submitted")), false, name);
});

test("the named cases: DARPAN identity, bank account and location after sanction", () => {
  const ngoName = editRule("fld_ngo_name", "correction");
  assert.equal(ngoName?.kind, "locked");
  assert.equal(ngoName?.kind === "locked" && ngoName.changeAt?.external, true);
  const bank = editRule("fld_bank_account_number", "sanctioned");
  assert.equal(bank?.kind === "locked" && bank.changeAt?.href, "/portals/e-anudaan/ngo/bank-accounts");
  const loc = editRule("fld_project_location", "sanctioned");
  assert.equal(loc?.kind === "locked" && loc.changeAt?.href, "/portals/e-anudaan/ngo/project-location-change");
  assert.equal(editRule("fld_bank_ifsc", "correction")?.kind, "editable-with-reason");
  assert.equal(editRule("fld_beneficiaries_sc", "correction")?.kind, "editable");
});

test("stages from status; a closed file locks everything", () => {
  assert.equal(editStageOf("Draft"), "draft");
  assert.equal(editStageOf("UnderReview"), "submitted");
  assert.equal(editStageOf("DeficiencyResponded"), "submitted");
  assert.equal(editStageOf("DeficiencyRaised"), "correction");
  assert.equal(editStageOf("Released"), "sanctioned");
  assert.equal(editStageOf("Rejected"), null);
  assert.equal(editRule("fld_beneficiaries_sc", null)?.kind, "locked");
});

test("changed answers are listed with labels and reasons, and written for the audit trail", () => {
  const changes = changedAnswers(
    { fld_beneficiaries_sc: "227", fld_bank_ifsc: "SBIN0001234", same: "x" },
    { fld_beneficiaries_sc: "220", fld_bank_ifsc: "SBIN0004321", same: "x" },
    (n) => ({ fld_beneficiaries_sc: "SC Beneficiaries", fld_bank_ifsc: "IFSC Code" })[n],
    { fld_bank_ifsc: "Branch merged" },
  );
  assert.equal(changes.length, 2);
  assert.equal(changesForAudit(changes), "SC Beneficiaries: 227 → 220; IFSC Code: SBIN0001234 → SBIN0004321 (reason: Branch merged)");
});

test("a changed answer carries what is calculated from it", () => {
  const app = {
    id: "x",
    schemeCode: "SHRESHTA_M2",
    recurring: 100,
    nonRecurring: 50,
    total: 150,
    scBeneficiaries: 10,
    otherBeneficiaries: 2,
    totalBeneficiaries: 12,
    formValues: { fld_grant_recurring: "100", fld_grant_non_recurring: "50", fld_grant_total: "150", fld_beneficiaries_sc: "10", fld_beneficiaries_other: "2", fld_total_beneficiaries: "12" },
  } as unknown as GrantApplication;
  const grant = applyAnswer(app, "fld_grant_recurring", "300");
  assert.equal(grant.formValues?.fld_grant_total, "350");
  assert.equal(grant.total, 350);
  const people = applyAnswer(app, "fld_beneficiaries_sc", "7");
  assert.equal(people.totalBeneficiaries, 9);
  assert.equal(people.formValues?.fld_total_beneficiaries, "9");
});

test("a correction on an instalment claim keeps what the sanctioned project's record locks", () => {
  const claim = { schemeCode: "SHRESHTA_M2", status: "DeficiencyRaised", instalment: 2 } as const;
  const fresh = { schemeCode: "SHRESHTA_M2", status: "DeficiencyRaised", instalment: undefined } as const;
  const ifsc = editRuleOnFile(claim, "fld_bank_ifsc");
  assert.equal(ifsc?.kind === "locked" && ifsc.changeAt?.href, "/portals/e-anudaan/ngo/bank-accounts");
  assert.equal(editRuleOnFile(fresh, "fld_bank_ifsc")?.kind, "editable-with-reason");
  assert.equal(editRuleOnFile(claim, "fld_contact_email")?.kind, "editable");
  // Calculated on SHRESHTA, so never typed there.
  assert.equal(editRuleOnFile(fresh, "fld_total_beneficiaries")?.kind, "locked");
});
