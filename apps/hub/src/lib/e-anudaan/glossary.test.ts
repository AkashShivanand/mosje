// The glossary, and the one-request-one-answer defects batch B2 of the design-director audit of
// 16 Sep 2026 fixed at their source: X-10 (terminology), D-01 (a "Please confirm" document counted
// Ready), N-03 (a deficiency with two dates), N-04 (a submitted file "unanswered"), N-14
// (notification titles and "System"), O-01 (All Applications' three answers), R-07 (return labels).
//
// Run: node --test src/lib/e-anudaan/glossary.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  APPLICANT_STATUS,
  SCHEME_NAMES,
  schemeName,
  AUTO_CHECK,
  DEFICIENCY,
  OFFICER_VERDICT,
  RETIRED_TERMS,
  claimIntro,
  instalmentLabel,
  ordinal,
  wizardIntro,
} from "./glossary.ts";
import { ACTION_LABEL, RULES, STATUS_LABEL, permittedActions, statusLabel } from "./workflow.ts";
import { NGO_STATUS_FILTERS, answeredSectionSummary, answeredSectionsHeadline, formatGrant, matchesNgoFilter, ngoStatusLabel, schemeLabel } from "./selectors.ts";
import { answeredSections, applicantStages, caseLabel, notificationTitle, officerStatus, openDeficiencyOf, requestedAt } from "./applicant.ts";
import { DEFAULT_EXPLORER_FILTERS, INSPECTION_ACTION_LABEL, INSPECTION_STATUS_LABEL, explorerView, officerDashboard, type ExplorerFilters } from "./officer.ts";
import { DOC_STATE_META, officerCheckWords, summariseDocuments } from "./document-centre.ts";
import { VERDICT_LABEL, verdictPill, type VerdictState } from "./doc-verification.ts";
import { notificationItems } from "./notifications.ts";
import { ucDue, ucDueBy } from "./registers.ts";
import { formatMoney } from "./format.ts";
import { OFFICER_ROLES, ROLES } from "./roles.ts";
import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import type { AuditAction, EAnudaanState } from "./types.ts";

const seed = buildSeed();
const state: EAnudaanState = { version: 0, session: null, schemes: SEED_SCHEMES, ...seed };

/** Every label the libs publish, with where it came from. */
function everyLabel(): { from: string; text: string }[] {
  const out: { from: string; text: string }[] = [];
  const add = (from: string, text: string | undefined) => text && out.push({ from, text });
  for (const [k, v] of Object.entries(STATUS_LABEL)) add(`STATUS_LABEL.${k}`, v);
  for (const [k, v] of Object.entries(ACTION_LABEL)) add(`ACTION_LABEL.${k}`, v);
  for (const k of Object.keys(ACTION_LABEL) as AuditAction[]) add(`notificationTitle(${k})`, notificationTitle(k));
  for (const [k, v] of Object.entries(DOC_STATE_META)) add(`DOC_STATE_META.${k}`, v.words);
  for (const [k, v] of Object.entries(VERDICT_LABEL)) add(`VERDICT_LABEL.${k}`, v);
  for (const [k, v] of Object.entries(INSPECTION_STATUS_LABEL)) add(`INSPECTION_STATUS_LABEL.${k}`, v);
  for (const [k, v] of Object.entries(INSPECTION_ACTION_LABEL)) add(`INSPECTION_ACTION_LABEL.${k}`, v);
  for (const f of NGO_STATUS_FILTERS) add("NGO_STATUS_FILTERS", f);
  for (const a of seed.applications) {
    add(`statusLabel(${a.id})`, statusLabel(a));
    add(`ngoStatusLabel(${a.id})`, ngoStatusLabel(a));
    const s = officerStatus(a, true);
    add(`officerStatus(${a.id})`, s.label);
    add(`officerStatus(${a.id}).note`, s.note);
    add(`caseLabel(${a.id})`, caseLabel(a));
    for (const st of applicantStages(a)) add(`applicantStages(${a.id})`, st.title);
  }
  for (const role of OFFICER_ROLES) {
    const d = officerDashboard(state, role.id, "");
    for (const c of d.byCase) add(`byCase(${role.id})`, c.label);
    for (const m of d.movement) {
      add(`movement(${role.id})`, m.label);
      add(`movement(${role.id}).hint`, m.hint);
    }
    for (const a of seed.applications) for (const r of permittedActions(a, role)) add(`RULES.${r.action}(${role.id})`, r.label(role, a));
  }
  for (const role of ["ngo", ...OFFICER_ROLES.map((r) => r.id)] as const) {
    for (const n of notificationItems(state, role)) add(`notificationItems(${role})`, n.action);
  }
  return out;
}

/* ── the glossary itself ─────────────────────────────────────────────────── */

test("no published label uses a retired term", () => {
  const labels = everyLabel();
  assert.ok(labels.length > 500, `expected to sweep the seed's labels, got ${labels.length}`);
  for (const { from, text } of labels) {
    for (const { pattern, use } of RETIRED_TERMS) assert.doesNotMatch(text, pattern, `${from}: "${text}" — use ${use}`);
  }
});

test("the automatic check never speaks the officer's word", () => {
  for (const words of [...Object.values(AUTO_CHECK.applicant), ...Object.values(AUTO_CHECK.officer), ...Object.values(VERDICT_LABEL)]) {
    assert.doesNotMatch(words, /\bVerified\b|\bvalid\b/i, words);
  }
  for (const s of ["verified", "review", "invalid"] as const satisfies readonly VerdictState[]) {
    assert.doesNotMatch(officerCheckWords({ state: s, confidence: 98 }), /Verified|valid/i);
    assert.doesNotMatch(verdictPill({ state: s, confidence: 98 }) ?? "", /Verified|valid/i);
  }
  assert.equal(officerCheckWords({ state: "verified", confidence: 98 }), "Looks right · 98%");
  // …and the officer's verdict keeps it.
  assert.equal(OFFICER_VERDICT.Verified, "Verified");
  assert.equal(OFFICER_VERDICT.Deficient, "Needs Correction");
});

test("deficiency, action required, correction and needs correction are four concepts with four words", () => {
  const words = [DEFICIENCY.raised, APPLICANT_STATUS.actionRequired, DEFICIENCY.correctionSubmitted, OFFICER_VERDICT.Deficient];
  assert.equal(new Set(words).size, 4);
  // The event has one name on every surface that shows it.
  assert.equal(STATUS_LABEL.DeficiencyRaised, DEFICIENCY.raised);
  assert.equal(notificationTitle("communicateDeficiency"), DEFICIENCY.raised);
  assert.equal(notificationTitle("respondDeficiency"), DEFICIENCY.correctionSubmitted);
  assert.equal(ACTION_LABEL.respondDeficiency, DEFICIENCY.correctionSubmitted);
});

test("Instalment is spelled once, and ordinals are English", () => {
  assert.equal(instalmentLabel(2), "2nd Instalment");
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal), ["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd"]);
  assert.equal(claimIntro(3, "2026-27", "DR/DL/NWD/03622"), "3rd Instalment of FY 2026-27 · Project DR/DL/NWD/03622");
  assert.match(wizardIntro("AVYAY"), /^Application for grant-in-aid under AVYAY\./);
  assert.doesNotMatch(wizardIntro("AVYAY"), /register/i);
});

/* ── sanctioned vs released; returned vs rejected ──────────────────────────── */

test("a released grant is Grant Released to the applicant and the officer, never Sanctioned", () => {
  const released = seed.applications.filter((a) => a.status === "Released");
  assert.ok(released.length > 0, "the seed carries released grants");
  for (const a of released) {
    assert.equal(ngoStatusLabel(a), APPLICANT_STATUS.released, a.id);
    assert.equal(officerStatus(a).label, "Grant Released", a.id);
  }
});

test("a query between officers is In Review to the applicant, and every file matches exactly one chip", () => {
  for (const a of seed.applications) {
    if (a.status === "QueryRaised" || a.status === "Returned") assert.equal(ngoStatusLabel(a), APPLICANT_STATUS.inReview, a.id);
    const chips = NGO_STATUS_FILTERS.filter((f) => f !== "All" && matchesNgoFilter(a, f));
    assert.equal(chips.length, 1, `${a.id}: ${chips.join(", ")}`);
  }
});

test("every return button names the seat the file goes to", () => {
  const ret = RULES.find((r) => r.action === "return")!;
  assert.equal(ret.label(ROLES["programme-director"], seed.applications[0]!), "Return to the Assistant Section Officer");
  for (const role of OFFICER_ROLES) {
    for (const a of seed.applications) {
      for (const r of permittedActions(a, role)) {
        if (r.action === "raiseQuery" || r.action === "return") assert.match(r.label(role, a), /^Return to the [A-Z]/, `${role.id}: ${r.label(role, a)}`);
      }
    }
  }
});

/* ── D-01: a document the check was unsure about is not Ready ──────────────── */

test("an unsure check asks for attention, blocks nothing, and is never counted Ready", () => {
  const meta = DOC_STATE_META.review;
  assert.equal(meta.bucket, "attention");
  assert.equal(meta.blocksContinue, false);
  assert.equal(meta.blocksSubmit, false);
  assert.doesNotMatch(meta.words, /confirm/i, "there is nothing on the row to confirm with");

  const checklist = [1, 2, 3].map((n) => ({ n, title: `Document ${n}` }));
  const v = (state: VerdictState) => ({ verdict: { state } });
  const s = summariseDocuments(checklist, { 1: v("verified"), 2: v("review"), 3: v("review") });
  // The header, the chips and the gate: one answer.
  assert.equal(s.readyRequired, 1);
  assert.equal(s.counts.ready, 1);
  assert.equal(s.counts.attention, 2);
  assert.equal(s.continueBlockers.length, 0);
  assert.equal(s.submitBlockers.length, 0);
});

test("Ready means ready: every Ready state reads as settled, never as a request", () => {
  for (const [state, meta] of Object.entries(DOC_STATE_META)) {
    if (meta.bucket !== "ready") continue;
    assert.notEqual(meta.tone, "warning", state);
    assert.notEqual(meta.tone, "error", state);
  }
});

/* ── N-03 and N-14: notifications ──────────────────────────────────────────── */

test("a deficiency's notification carries the date the dashboard and the application page show", () => {
  const items = notificationItems(state, "ngo");
  const open = seed.applications.filter((a) => a.ngoId === seed.ngos[0]!.id && openDeficiencyOf(a));
  assert.ok(open.length > 0, "the seed carries open deficiencies for the applicant");
  for (const app of open) {
    const def = openDeficiencyOf(app)!;
    const item = items.find((i) => i.id === `action-${app.id}`)!;
    assert.equal(item.at, requestedAt(app, def), app.id);
    assert.equal(item.action, DEFICIENCY.raised);
    assert.notEqual(item.actor, undefined, "the issuing office is named, not System");
    assert.doesNotMatch(item.actor ?? "", /Officer|Secretary/, "an applicant is told the office, never the officer");
    // The ASO's internal note stays inside the Ministry.
    if (def.message !== def.detail) assert.notEqual(item.note, def.detail, app.id);
  }
});

test("every notification title is Title Case", () => {
  const small = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "into", "for", "on", "with", "after", "by"]);
  for (const role of ["ngo", ...OFFICER_ROLES.map((r) => r.id)] as const) {
    for (const n of notificationItems(state, role)) {
      const words = n.action.split(/\s+/).slice(1);
      for (const w of words) if (!small.has(w) && /^[a-z]/.test(w)) assert.fail(`${role}: "${n.action}"`);
    }
  }
});

test("an officer's notice names the seat that acted", () => {
  const items = notificationItems(state, "pd-so");
  assert.ok(items.some((i) => i.actor && /, Programme Division$|Director|NGO|Sansthan|Society|Trust|Sangh/.test(i.actor)), "at least one notice names its actor");
});

/* ── N-04: a submitted file owes no answers ────────────────────────────────── */

test("a submitted file never reports unanswered required questions; a draft still does", () => {
  const section = { fields: [{}, {}, {}] as never[], missingRequired: 2 };
  assert.equal(answeredSectionSummary(section, { status: "Draft" }), "2 required questions unanswered");
  assert.equal(answeredSectionSummary(section, { status: "UnderReview" }), "3 questions");
  assert.equal(answeredSectionsHeadline([section], { status: "Draft" }), "2 required questions still to answer.");
  assert.equal(answeredSectionsHeadline([section], { status: "Submitted" }), undefined);
  for (const a of seed.applications.filter((x) => x.status !== "Draft")) {
    for (const s of answeredSections(a.schemeCode, a.formValues ?? {})) assert.doesNotMatch(answeredSectionSummary(s, a), /unanswered/, a.id);
  }
});

/* ── O-01: All Applications, one resolution ────────────────────────────────── */

test("All Applications: the figures, the count line and the pager read one filtered set", () => {
  const combos: Partial<ExplorerFilters>[] = [
    {},
    { status: "all" },
    { status: "sanctioned" },
    { status: "all", financialYear: "2026-27" },
    { status: "all", search: "SHRESHTA" },
    { status: "all", search: "no file is called this" },
    { status: "returned", instalment: "New" },
  ];
  for (const role of ["pd-aso", "pd-us", "finance-so", "programme-director"] as const) {
    for (const c of combos) {
      const v = explorerView(state, role, { ...DEFAULT_EXPLORER_FILTERS, ...c });
      assert.equal(v.tiles.total, v.rows.length, `${role} ${JSON.stringify(c)}`);
      assert.ok(v.tiles.progress + v.tiles.sanctioned + v.tiles.returned <= v.tiles.total);
      assert.ok(v.countLine.startsWith(v.rows.length.toLocaleString("en-IN")), v.countLine);
      assert.ok(v.rows.every((a) => a.status !== "Draft"));
    }
  }
  // The Status filter moves the figures, as the search does.
  const all = explorerView(state, "pd-aso", { ...DEFAULT_EXPLORER_FILTERS, status: "all" });
  const mine = explorerView(state, "pd-aso", DEFAULT_EXPLORER_FILTERS);
  assert.ok(mine.tiles.total < all.tiles.total);
  assert.equal(all.countLine, `${all.register.length.toLocaleString("en-IN")} applications`);
  assert.equal(mine.activeFilterCount, 0, "Needs My Action is the resting state, not a filter");
});

/* ── money ─────────────────────────────────────────────────────────────── */

test("a grant in a table is the summary form of the one money rule", () => {
  for (const n of [0, 99_999, 2_900_000, 222_797_125]) assert.equal(formatGrant(n), formatMoney(n, "summary"));
});

/* ── the schemes ───────────────────────────────────────────────────────────── */

test("a scheme is named one way — Acronym — Full name — on both sides of the portal", () => {
  assert.equal(schemeName("AVYAY").title, "AVYAY — Atal Vayo Abhyuday Yojana");
  // The stored code the seed still uses resolves to the same scheme as the picker's.
  assert.equal(schemeName("SMILE_GG"), schemeName("SMILE"));
  assert.equal(schemeLabel("SMILE_GG"), "SMILE");
  for (const [code, s] of Object.entries(SCHEME_NAMES)) {
    assert.equal(s.title, `${s.short} — ${s.fullName}`, code);
    assert.doesNotMatch(s.title, /\(|\)/, `${code}: one pattern, not "AVYAY (Atal Vayo…)"`);
    assert.doesNotMatch(s.fullName, /Marginalized/, `${code}: British spelling`);
  }
  // Every scheme in the register can be named, and the officer's column agrees with the applicant's.
  for (const a of seed.applications) {
    assert.equal(schemeLabel(a.schemeCode), schemeName(a.schemeCode).short, a.schemeCode);
    assert.doesNotMatch(schemeLabel(a.schemeCode), /_/, a.schemeCode);
  }
});

/* ── N-14: due dates, and the most overdue first ───────────────────────────── */

test("a utilisation certificate is due twelve months after its financial year closed", () => {
  // GFR 12-A, the same rule `ucDue` selects on: FY 2025-26 closes 31 March 2026.
  assert.equal(ucDueBy({ financialYear: "2025-26" }), "2027-03-31");
  assert.equal(ucDueBy({ financialYear: "2026-27" }), "2028-03-31");
  const items = notificationItems(state, "ngo").filter((i) => i.id.startsWith("uc-"));
  const due = ucDue(state, seed.ngos[0]!.id);
  assert.equal(items.length, due.length);
  assert.ok(items.length > 0, "the seed carries certificates due");
  for (const app of due) {
    const item = items.find((i) => i.id === `uc-${app.id}`)!;
    assert.equal(item.dueAt, ucDueBy(app), app.id);
  }
});

test("a deficiency shows a date to answer by only where the Ministry recorded one", () => {
  for (const i of notificationItems(state, "ngo").filter((x) => x.id.startsWith("action-"))) {
    const app = seed.applications.find((a) => a.id === i.id.replace(/^action-/, ""))!;
    assert.equal(i.dueAt, openDeficiencyOf(app)?.respondBy);
  }
});

test("action items are sorted by when they must be answered, the most overdue first", () => {
  const actions = notificationItems(state, "ngo").filter((i) => i.actionRequired);
  assert.ok(actions.length > 1);
  const key = (i: (typeof actions)[number]) => Date.parse(i.dueAt ?? i.at);
  for (let n = 1; n < actions.length; n += 1) {
    assert.ok(key(actions[n - 1]!) <= key(actions[n]!), `${actions[n - 1]!.id} then ${actions[n]!.id}`);
  }
  // …and every action item still sorts above every update.
  const all = notificationItems(state, "ngo");
  assert.equal(all.findIndex((i) => !i.actionRequired), actions.length);
});
