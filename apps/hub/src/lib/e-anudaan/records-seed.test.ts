/**
 * One project, one story — the same record read from the applicant's screens and the officer's.
 *
 * Screen QA, 13 Sep 2026: the applicant saw SC/DL/NWD/02400 as a NAPDDR draft "New" project with two
 * years of attendance returns; officers saw it as a sanctioned SHRESHTA 3rd instalment; and the
 * officer's NGO profile called that "Hostel" a "Primary Non-Residential School". Officer
 * notifications read "Application moved forward" over a query sending a file back down.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { nextInstalment, notificationTitle, notifiesApplicant, projectRunningSince, schemeOfProjectId } from "./applicant.ts";
import { buildReturnRows } from "./roster.ts";
import { buildSeed, SEED_NOW, SEED_SCHEMES } from "./store/seed.ts";
import type { EAnudaanState } from "./types.ts";

const seed = buildSeed();
const state: EAnudaanState = { version: 0, session: null, schemes: SEED_SCHEMES, ...seed };
const projects = seed.ngos.flatMap((n) => n.institutions.map((i) => ({ ngo: n, inst: i })));
const filesOn = (id: string) => seed.applications.filter((a) => a.institutionId === id);

test("every project carries files under one scheme, the scheme its Project ID names", () => {
  for (const { inst } of projects) {
    const schemes = [...new Set(filesOn(inst.id).map((a) => a.schemeCode))];
    assert.ok(schemes.length <= 1, `${inst.id} has files under ${schemes.join(" and ")}`);
    if (schemes[0]) assert.equal(schemeOfProjectId(inst.id), schemes[0], inst.id);
  }
});

test("every file is raised by the NGO that holds its project", () => {
  for (const a of seed.applications) {
    const owner = seed.ngos.find((n) => n.institutions.some((i) => i.id === a.institutionId));
    assert.equal(owner?.id, a.ngoId, a.id);
  }
});

test("what a project is agrees with its scheme and its name", () => {
  const EXPECT: Record<string, readonly string[]> = {
    SHRESHTA_M2: ["Primary Residential School", "Secondary Residential School"],
    AVYAY: ["Senior Citizens' Home"],
    NAPDDR: ["Integrated Rehabilitation Centre for Addicts"],
    SMILE: ["Garima Greh (Shelter Home for Transgender Persons)"],
  };
  for (const { inst } of projects) {
    const scheme = schemeOfProjectId(inst.id)!;
    assert.ok(EXPECT[scheme]?.includes(inst.nature), `${inst.id} "${inst.name}" is a ${inst.nature}`);
    if (/Hostel|Residential/.test(inst.name)) assert.match(inst.nature, /(?<!Non-)Residential/, `${inst.id} "${inst.name}" is a ${inst.nature}`);
    if (scheme === "SHRESHTA_M2") assert.equal(inst.level, inst.nature.startsWith("Primary") ? "Primary" : "Secondary", inst.id);
  }
});

test("the answers on a file describe the project it is filed under", () => {
  for (const a of seed.applications) {
    const inst = projects.find((p) => p.inst.id === a.institutionId)!.inst;
    const v = a.formValues ?? {};
    assert.equal(v.fld_nature_of_institution, inst.nature, a.id);
    assert.equal(v.fld_institution_gender_type, inst.type, a.id);
    assert.equal(v.fld_building_ownership, inst.building, a.id);
    assert.equal(v.fld_project_id, inst.id, a.id);
  }
});

test("a project with no live claim is New throughout: no instalments, no returns", () => {
  for (const { inst } of projects) {
    const files = filesOn(inst.id);
    if (!files.length) continue;
    const live = files.filter((a) => a.status !== "Draft" && a.status !== "Rejected");
    if (live.length === 0) {
      for (const a of files) {
        assert.equal(a.caseType, "New", `${a.id} on never-claimed ${inst.id}`);
        assert.equal(a.instalment, undefined, a.id);
        assert.equal(a.sanction, undefined, a.id);
      }
      assert.equal(projectRunningSince(state, inst.id), null, inst.id);
      assert.deepEqual(buildReturnRows(new Date(SEED_NOW), 30, projectRunningSince(state, inst.id)), [], inst.id);
    }
    // Never sanctioned and never migrated: no returns, whatever else is on file.
    if (!files.some((a) => a.sanction) && !live.some((a) => a.caseType === "Ongoing")) {
      assert.deepEqual(buildReturnRows(new Date(SEED_NOW), 30, projectRunningSince(state, inst.id)), [], inst.id);
    }
  }
});

test("a New file is never raised on a project that already has a live claim", () => {
  const order = (a: (typeof seed.applications)[number]) => `${a.financialYear}|${a.submittedAt ?? "9"}`;
  for (const { inst } of projects) {
    const files = filesOn(inst.id).sort((x, y) => order(x).localeCompare(order(y)));
    let claimed = false;
    for (const a of files) {
      if (claimed) assert.equal(a.caseType, "Ongoing", `${a.id} is New after a claim on ${inst.id}`);
      if (a.status !== "Draft" && a.status !== "Rejected") claimed = true;
    }
  }
});

test("a draft claims exactly the instalment the wizard would give it", () => {
  for (const draft of seed.applications.filter((a) => a.status === "Draft" && a.caseType === "Ongoing")) {
    const others = { ...state, applications: seed.applications.filter((a) => a !== draft) };
    assert.equal(draft.instalment, nextInstalment(others, draft.schemeCode, draft.institutionId), draft.id);
  }
});

test("the applicant's draft on SC/DL/NWD/02400 is not a NAPDDR file, and the project's story reads one way", () => {
  const files = filesOn("SC/DL/NWD/02400");
  assert.ok(files.length > 0);
  assert.deepEqual([...new Set(files.map((a) => a.schemeCode))], ["SHRESHTA_M2"]);
});

test("notifications are titled by what happened, with one full stop", () => {
  for (const n of seed.notifications) {
    const app = seed.applications.find((a) => a.id === n.applicationId)!;
    const last = app.audit.at(-1)!;
    assert.equal(n.title, notificationTitle(last.action), `${n.id}: ${last.action}`);
    assert.notEqual(n.title, "Application moved forward");
    assert.ok(!/\.\.$/.test(n.body), n.body);
  }
  const query = seed.notifications.find((n) => /Clarify the non-recurring component/.test(n.body));
  // A query sends the file one level down: live names it "Return to Previous".
  assert.equal(query?.title, "Returned to Previous Level");
});

test("seed text uses the department's spellings", () => {
  const text = JSON.stringify(seed);
  for (const wrong of [/Program Division/, /Organization/, /installment/i, /SHRESHTA M2\b/, /Marginalized(?! Individuals for Livelihood)/]) {
    assert.ok(!wrong.test(text), `seed contains ${wrong}`);
  }
});

test("the answers on a file say the same case type as the record", async () => {
  const { caseTypeOf } = await import("./submission.ts");
  for (const a of seed.applications.filter((x) => x.schemeCode === "SHRESHTA_M2")) {
    assert.equal(caseTypeOf(a.formValues ?? {}), a.caseType, a.id);
  }
});

test("the applicant is notified only of what concerns them, never of the Ministry's internal moves", () => {
  const mine = seed.notifications.filter((n) => n.audience.includes("ngo"));
  assert.ok(mine.length > 0, "the applicant has notifications to read");
  for (const n of mine) {
    const app = seed.applications.find((a) => a.id === n.applicationId)!;
    const last = app.audit[app.audit.length - 1]!;
    assert.ok(notifiesApplicant(last.action), `${n.id} tells the applicant about "${last.action}"`);
  }
  for (const internal of ["forward", "raiseQuery", "resolveQuery", "concur", "certify", "raiseDeficiency", "return", "routeDown"] as const) {
    assert.equal(notifiesApplicant(internal), false, internal);
  }
});

test("every submitted inspection report carries a recommendation and findings, filed on or after the visit", () => {
  const reported = seed.inspections.filter((i) => i.status === "Submitted" || i.status === "Reviewed");
  assert.ok(reported.some((i) => i.status === "Submitted"), "the seed has submitted reports to check");
  for (const i of reported) {
    assert.ok(i.recommendation, `${i.institutionId} has no recommendation`);
    assert.ok(i.findings, `${i.institutionId} has no findings`);
    assert.ok(i.scheduledFor && i.submittedAt && i.submittedAt >= i.scheduledFor, `${i.institutionId} report filed before the visit`);
  }
  // The three the officer audit found reading "Not recorded".
  for (const id of ["SC/GJ/AHM/02077", "SC/GJ/AHM/03007", "SC/OD/KOR/02049"]) {
    assert.ok(seed.inspections.find((i) => i.institutionId === id)?.recommendation, id);
  }
});

test("a certified file carries the document verdicts its certification rests on, each naming who gave it", () => {
  const certified = seed.applications.filter((a) => a.certifiedAt);
  assert.ok(certified.length > 0);
  for (const a of certified) {
    for (const d of a.documents) {
      if (d.reviewStatus === "Pending") {
        assert.ok(d.versions?.some((v) => v.replacedAt > a.certifiedAt!), `${a.id} slot ${d.slot} is unreviewed under a certification`);
        continue;
      }
      assert.equal(d.reviewedBy, a.certifiedBy ?? "pd-aso", `${a.id} slot ${d.slot}`);
      assert.equal(d.reviewedAt, a.certifiedAt, `${a.id} slot ${d.slot}`);
    }
  }
});

/* ── One story per file (seed-data review, 16 Sep 2026) ────────────────────────
 * Each rule below was found broken on a seeded file: a "3rd instalment" with no earlier sanction, a
 * New project reporting GIA since 1983, set-up money on an instalment claim, a sanction two years
 * after its financial year, a declaration signed after submission, a document verified before it
 * was uploaded, "Needs correction" with no remark under a certification.
 */

const when = (a: (typeof seed.applications)[number]) => a.submittedAt ?? a.updatedAt;
const fyStartIso = (fy: string) => `${fy.slice(0, 4)}-04-01`;

test("an instalment claim follows an earlier grant on its project that was sanctioned and released", () => {
  for (const a of seed.applications.filter((x) => x.caseType === "Ongoing" && x.instalment)) {
    const earlier = seed.applications.filter((x) => x !== a && x.institutionId === a.institutionId && x.schemeCode === a.schemeCode && x.sanction && x.release && x.sanction.sanctionedAt <= when(a));
    assert.ok(earlier.length > 0, `${a.id} claims the ${a.instalment} instalment with no released grant before it`);
  }
});

test("a New application reports no grant history", () => {
  for (const a of seed.applications.filter((x) => x.caseType === "New")) {
    const v = a.formValues ?? {};
    for (const k of ["fld_gia_since_year", "fld_gia_released_last_3yrs", "fld_beneficiaries_previous_year"]) assert.equal((v[k] ?? "").trim(), "", `${a.id}: ${k}`);
    if (v.assistance_3yrs !== undefined) assert.equal(v.assistance_3yrs, "No", a.id);
  }
});

test("no document carries a verdict dated before it was uploaded, or is uploaded after its application was submitted", () => {
  for (const a of seed.applications) {
    for (const d of a.documents) {
      if (d.reviewedAt && d.uploadedAt) assert.ok(d.uploadedAt <= d.reviewedAt, `${a.id} slot ${d.slot}: verified ${d.reviewedAt} before upload ${d.uploadedAt}`);
      if (a.submittedAt && d.uploadedAt && !d.versions?.length) assert.ok(d.uploadedAt <= a.submittedAt, `${a.id} slot ${d.slot}: uploaded after submission`);
      if (d.reUploadedThisYear && d.uploadedAt) assert.ok(d.uploadedAt >= fyStartIso(a.financialYear), `${a.id} slot ${d.slot}: "re-uploaded this year" before FY ${a.financialYear}`);
    }
  }
});

test("a Needs Correction verdict carries its remark, and never sits under a certification of complete documents", () => {
  const inCorrection = new Set(["DeficiencyProposed", "DeficiencyRaised", "DeficiencyResponded"]);
  for (const a of seed.applications) {
    for (const d of a.documents.filter((x) => x.reviewStatus === "Deficient")) {
      assert.ok((d.officerRemarks ?? "").trim(), `${a.id} slot ${d.slot}: no remark`);
      if (a.certifiedAt && !inCorrection.has(a.status) && !a.deficiencies.length) {
        assert.fail(`${a.id} slot ${d.slot}: marked for correction on a file certified complete`);
      }
    }
  }
});

test("the declaration is dated on or before submission", () => {
  for (const a of seed.applications.filter((x) => x.submittedAt && x.formValues?.fld_auth_date)) {
    assert.ok(a.formValues!.fld_auth_date! <= a.submittedAt!.slice(0, 10), `${a.id}: declared ${a.formValues!.fld_auth_date} after submitting ${a.submittedAt!.slice(0, 10)}`);
  }
});

test("a sanction is dated within its financial year or the year after", () => {
  for (const a of seed.applications.filter((x) => x.sanction)) {
    const at = a.sanction!.sanctionedAt.slice(0, 10);
    const lastDay = `${Number(a.financialYear.slice(0, 4)) + 2}-03-31`;
    assert.ok(at >= fyStartIso(a.financialYear) && at <= lastDay, `${a.id}: FY ${a.financialYear} sanctioned ${at}`);
  }
});

test("an instalment claim releases recurring grant only", () => {
  for (const a of seed.applications.filter((x) => x.caseType === "Ongoing")) {
    assert.equal(a.nonRecurring, 0, a.id);
    if (a.sanction) assert.equal(a.sanction.nonRecurring, 0, a.id);
  }
});

test("the registration date on every file is the NGO record's", () => {
  for (const a of seed.applications.filter((x) => x.formValues?.fld_registration_date)) {
    const ngo = seed.ngos.find((n) => n.id === a.ngoId)!;
    const recorded = new Date(`${ngo.registrationDate} UTC`).toISOString().slice(0, 10);
    assert.equal(a.formValues!.fld_registration_date, recorded, a.id);
  }
});

test("seeded events fall at varied times of day, and forward notes are not one repeated sentence", () => {
  const times = new Set(seed.applications.flatMap((a) => a.audit.map((e) => e.at.slice(11, 16))));
  assert.ok(times.size > 50, `only ${times.size} distinct times`);
  const notes = seed.applications.flatMap((a) => a.audit.filter((e) => e.action === "forward").map((e) => e.remarks));
  assert.ok(!notes.includes("Forwarded to the next authority."));
  assert.ok(new Set(notes).size >= 10);
});
