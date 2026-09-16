/**
 * Saved drafts: listed with the step they resume on (serious audit UX-04, 14 Sep 2026).
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { draftFromRegister, draftKey, draftStep, listDrafts, needsDraftWrite, stepRoute } from "./drafts.ts";
import { AVYAY_WIZARD, visibleSteps, wizardFor } from "./form-schema.ts";

const NEW = { case_type: "New project", fld_ngo_name: "Sankalp Seva Sansthan" };
const raw = (d: unknown) => JSON.stringify(d);

test("lists this NGO's drafts with answers, newest first, and nobody else's", () => {
  const entries: [string, string | null][] = [
    [draftKey("ngo-001", "AVYAY"), raw({ values: NEW, savedAt: "2026-09-14T10:00:00Z", step: 3 })],
    [draftKey("ngo-001", "NAPDDR"), raw({ values: { case_type: "New project" }, savedAt: "2026-09-14T11:00:00Z", step: 0 })],
    [draftKey("ngo-001", "SMILE"), raw({})], // an untouched form is not a draft
    [draftKey("ngo-002", "AVYAY"), raw({ values: NEW, savedAt: "2026-09-14T12:00:00Z" })],
    ["e-anudaan.store.v1", "{}"],
    [draftKey("ngo-001", "SHRESHTA_M2"), "{broken"],
  ];
  const list = listDrafts(entries, "ngo-001");
  assert.deepEqual(list.map((d) => d.code), ["NAPDDR", "AVYAY"]);
  const avyay = list.find((d) => d.code === "AVYAY")!;
  assert.equal(avyay.step.index, 3);
  assert.equal(avyay.step.title, visibleSteps(AVYAY_WIZARD, NEW)[3]!.title);
  assert.equal(avyay.route, "/portals/e-anudaan/apply-grant/scheme/AVYAY/step-1?step=3");
});

test("a draft resumes on its own step, clamped to the steps its answers show", () => {
  assert.equal(draftStep("AVYAY", { values: NEW, step: 99 })!.index, visibleSteps(AVYAY_WIZARD, NEW).length - 1);
  assert.equal(draftStep("AVYAY", { values: NEW })!.index, 0);
  assert.equal(draftStep("NOPE", { values: NEW }), null);
});

test("the upload and review steps have routes of their own", () => {
  const steps = visibleSteps(AVYAY_WIZARD, NEW);
  const docs = steps.findIndex((s) => s.kind === "documents");
  const review = steps.findIndex((s) => s.kind === "review");
  assert.equal(stepRoute("AVYAY", NEW, docs), "/portals/e-anudaan/apply-grant/scheme/AVYAY/step-2");
  assert.equal(stepRoute("AVYAY", NEW, review), "/portals/e-anudaan/apply-grant/scheme/AVYAY/review");
  assert.equal(stepRoute("AVYAY", NEW, 0), "/portals/e-anudaan/apply-grant/scheme/AVYAY/step-1");
});

test("moving between steps writes a draft only once the applicant has changed something", () => {
  const prefill = JSON.stringify({ values: { fld_ngo_name: "Sankalp Seva Sansthan" }, docs: {} });
  const changed = JSON.stringify({ values: { fld_ngo_name: "Sankalp Seva Sansthan", case_type: "New project" }, docs: {} });
  // Submit on an untouched review page opens the first incomplete step: no draft appears.
  assert.equal(needsDraftWrite(prefill, prefill, null), false);
  assert.equal(needsDraftWrite(prefill, prefill, raw({})), false, "an empty stored object is not a draft either");
  assert.equal(needsDraftWrite(changed, prefill, null), true);
  // A stored draft is rewritten on every move, so it resumes on the step moved to.
  assert.equal(needsDraftWrite(prefill, prefill, raw({ values: NEW })), true);
  assert.equal(needsDraftWrite(prefill, null, null), true, "before the opening snapshot is taken, write as before");
});

test("C4 · S15: a register Draft continues in the form on its Review step, and Submit checks it", async () => {
  const { buildSeed, SEED_SCHEMES } = await import("./store/seed.ts");
  const { checkApplication } = await import("./submission.ts");
  const { fileApplication } = await import("./submit-application.ts");
  const seed = buildSeed();
  const mine = seed.ngos[0]!.id;
  const drafts = seed.applications.filter((a) => a.ngoId === mine && a.status === "Draft");
  assert.ok(drafts.length > 0, "the seed holds register drafts to continue");

  for (const app of drafts) {
    const opened = draftFromRegister(app);
    assert.ok(opened, app.id);
    assert.equal(opened.key, draftKey(mine, app.schemeCode));
    assert.equal(opened.draft.registerId, app.id);
    assert.match(opened.route, new RegExp(`/scheme/${app.schemeCode}/review$`), app.id);
    // Submit runs the whole check; a seeded draft is not complete, so it goes to a step, not the register.
    const check = checkApplication(wizardFor(app.schemeCode)!, opened.draft.values ?? {}, opened.draft.docs ?? {});
    assert.equal(check.ok, false, `${app.id} would be filed as it stands`);
  }
  assert.equal(draftFromRegister({ ...drafts[0]!, status: "Submitted" }), null, "only a Draft opens as a draft");

  // Filed from the form, it takes the Draft's place in the register instead of sitting beside it.
  const app = drafts.find((a) => a.schemeCode === "AVYAY")!;
  const state = { version: 9, session: "ngo" as const, schemes: SEED_SCHEMES, ...seed };
  const clock = { now: "2026-09-14T10:00:00.000Z", id: (p: string) => `${p}-t` };
  const input = { schemeCode: "AVYAY", financialYear: "2026-27", values: { fld_grant_recurring: "100", fld_grant_non_recurring: "100" } };
  const filed = fileApplication(state, { ...input, replacesDraftId: app.id }, clock).state;
  assert.equal(filed.applications.length, state.applications.length);
  assert.equal(filed.applications.some((a) => a.id === app.id), false);
  assert.equal(fileApplication(state, input, clock).state.applications.length, state.applications.length + 1, "a fresh application replaces nothing");
  const other = seed.applications.find((a) => a.status !== "Draft")!;
  assert.equal(fileApplication(state, { ...input, replacesDraftId: other.id }, clock).state.applications.some((a) => a.id === other.id), true, "a filed application is never replaced");
});
