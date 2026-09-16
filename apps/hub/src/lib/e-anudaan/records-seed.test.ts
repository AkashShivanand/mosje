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

import { answeredSections, nextInstalment, notificationTitle, notifiesApplicant, projectRunningSince, schemeOfProjectId } from "./applicant.ts";
import { applicationRefOf, claimIdFor, instalmentPlan, upcomingInstalments } from "./instalments.ts";
import { buildReturnRows } from "./roster.ts";
import { demoVerdictFor } from "./doc-verification.ts";
import { schemeName } from "./glossary.ts";
import { automaticCheckOf, awaitingVerdict, bulkVerifiable, isFlagged } from "./review-readiness.ts";
import { buildSeed, cctvActivationCode, SEED_NOW, SEED_SCHEMES } from "./store/seed.ts";
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
  // A query sends the file one level down; its notice carries the status it leaves the file in.
  assert.equal(query?.title, "Returned for Rework");
});

test("seed text uses the department's spellings", () => {
  // `fld_installment_no` is the form's own field NAME (form-schema.ts), a key the applicant never
  // reads; its label is "Instalment". The words the seed writes are what this test holds.
  const text = JSON.stringify(seed).replaceAll('"fld_installment_no"', '"fld_instalment_no"');
  for (const wrong of [/Program Division/, /Organization/, /installment/i, /SHRESHTA M2\b/, /Marginalized/]) {
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

/* ── Design-director audit, 16 Sep 2026 (batch B8) ─────────────────────────────────────────────── */

const live = (a: (typeof seed.applications)[number]) => a.status !== "Draft" && a.status !== "Rejected";
const seedNow = new Date(SEED_NOW);

test("a draft instalment claim is the claim the dashboard offers: one instalment, one year, one reference", () => {
  const drafts = seed.applications.filter((a) => a.status === "Draft" && a.caseType === "Ongoing");
  assert.ok(drafts.length > 0, "the seed should hold at least one draft claim to show the pairing");
  for (const d of drafts) {
    const plan = instalmentPlan(state, d.schemeCode, d.institutionId, seedNow);
    assert.equal(plan.state, "open", `${d.id}: a claim was started on ${d.institutionId}, where nothing can be claimed (${plan.state})`);
    assert.equal(d.instalment, plan.instalment, `${d.id}: draft claims instalment ${d.instalment}, the dashboard offers ${plan.instalment}`);
    assert.equal(d.financialYear, plan.financialYear, `${d.id}: draft is FY ${d.financialYear}, the dashboard offers FY ${plan.financialYear}`);
    if (plan.applicationRef) assert.equal(d.id, claimIdFor(plan.applicationRef, plan.instalment!), d.id);
    assert.equal(d.formValues?.fld_financial_year, d.financialYear, d.id);
    assert.match(d.projectLabel, new RegExp(`FY ${d.financialYear}$`), d.id);
  }
  // Every offer on the applicant's dashboard has at most one draft beside it, and that draft is the
  // same claim — so the row can say "Continue Draft" and never offer a second claim (N-02).
  for (const notice of upcomingInstalments(state, seed.ngos[0]!.id, seedNow)) {
    const p = notice.plan;
    const beside = seed.applications.filter((a) => a.status === "Draft" && a.schemeCode === p.scheme && a.institutionId === p.projectId && a.caseType === "Ongoing");
    assert.ok(beside.length <= 1, `${p.projectId}: ${beside.length} draft claims`);
    for (const d of beside) {
      assert.deepEqual([d.instalment, d.financialYear], [p.instalment, p.financialYear], `${p.projectId}: offer and draft disagree`);
    }
  }
});

test("Hostel — Thane's 3rd instalment is offered and drafted as the same claim", () => {
  const plan = instalmentPlan(state, "SHRESHTA_M2", "SC/MH/THN/02530", seedNow);
  const draft = seed.applications.find((a) => a.institutionId === "SC/MH/THN/02530" && a.status === "Draft");
  assert.ok(draft, "the Thane draft is kept");
  assert.deepEqual([draft.instalment, draft.financialYear], [plan.instalment, plan.financialYear]);
});

test("a project's claims run in order: by year and instalment each was filed after the one before, and none waits while a later one is paid", () => {
  const byProject = new Map<string, (typeof seed.applications)[number][]>();
  for (const a of seed.applications.filter(live)) byProject.set(`${a.schemeCode}|${a.institutionId}`, [...(byProject.get(`${a.schemeCode}|${a.institutionId}`) ?? []), a]);
  for (const [k, files] of byProject) {
    const ordered = files.sort((x, y) => x.financialYear.localeCompare(y.financialYear) || (x.instalment ?? 0) - (y.instalment ?? 0));
    for (let i = 1; i < ordered.length; i++) {
      const [prev, next] = [ordered[i - 1]!, ordered[i]!];
      assert.ok(when(prev) <= when(next), `${k}: ${next.id} (FY ${next.financialYear}) was filed ${when(next).slice(0, 10)}, before ${prev.id} (FY ${prev.financialYear}) on ${when(prev).slice(0, 10)}`);
      if (next.sanction) assert.ok(prev.sanction, `${k}: ${prev.id} (FY ${prev.financialYear}) is still ${prev.status} while the later ${next.id} (FY ${next.financialYear}) is sanctioned`);
    }
  }
});

test("a year written into a reference or a sanction order is the file's own year", () => {
  for (const a of seed.applications) {
    const inId = a.id.match(/^GIA\/(\d{4}-\d{2})\//)?.[1];
    if (inId && !a.id.includes("/I")) assert.equal(inId, a.financialYear, a.id);
    const inOrder = a.sanction?.orderNo.match(/^SAN\/(\d{4}-\d{2})\//)?.[1];
    if (inOrder) assert.equal(inOrder, a.financialYear, `${a.id}: ${a.sanction!.orderNo}`);
  }
  const ids = seed.applications.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length, "application references are unique");
  const projectIds = seed.ngos.flatMap((n) => n.institutions.map((i) => i.id));
  assert.equal(new Set(projectIds).size, projectIds.length, "Project IDs are unique");
});

test("a corrected document is dated its correction, and the file it replaced was uploaded with the application", () => {
  let corrected = 0;
  for (const a of seed.applications) {
    for (const d of a.documents.filter((x) => x.versions?.length)) {
      corrected++;
      const replacedAt = d.versions!.at(-1)!.replacedAt;
      assert.equal(d.uploadedAt, replacedAt, `${a.id} slot ${d.slot}: corrected file dated ${d.uploadedAt}, replaced ${replacedAt}`);
      const item = a.deficiencies.flatMap((x) => x.items ?? []).find((it) => it.docId === d.id);
      assert.equal(item?.correctedAt, d.uploadedAt, `${a.id} slot ${d.slot}: the item says corrected ${item?.correctedAt}`);
      const responded = a.deficiencies.find((x) => x.items?.some((it) => it.docId === d.id))?.respondedAt;
      if (responded) assert.ok(d.uploadedAt! <= responded, `${a.id} slot ${d.slot}: uploaded after the correction was submitted`);
      for (const v of d.versions!) {
        if (v.uploadedAt && a.submittedAt) assert.ok(v.uploadedAt <= a.submittedAt, `${a.id} slot ${d.slot}: replaced file uploaded after submission`);
        if (v.uploadedAt) assert.ok(v.uploadedAt <= v.replacedAt, `${a.id} slot ${d.slot}: replaced before it was uploaded`);
      }
    }
  }
  assert.ok(corrected > 0, "the seed should hold corrected documents to check");
});

test("a field correction names a question its file answered, and carries the answer as submitted", () => {
  let items = 0;
  for (const a of seed.applications) {
    for (const it of a.deficiencies.flatMap((x) => x.items ?? []).filter((x) => x.kind === "field")) {
      items++;
      const value = (a.formValues?.[it.fieldName!] ?? "").trim();
      assert.ok((it.originalValue ?? "").trim(), `${a.id}: "${it.label}" carries no submitted answer`);
      assert.ok(value, `${a.id}: "${it.label}" (${it.fieldName}) is not answered on the file`);
      if (it.correctedAt) assert.notEqual(value, it.originalValue, `${a.id}: "${it.label}" marked corrected with the submitted figure`);
      else assert.equal(value, it.originalValue, `${a.id}: "${it.label}" changed before it was corrected`);
    }
  }
  assert.ok(items > 0, "the seed should hold field corrections to check");
});

test("a submitted file answers every required question its own path asks", () => {
  const gaps: string[] = [];
  for (const a of seed.applications.filter((x) => x.status !== "Draft")) {
    for (const section of answeredSections(a.schemeCode, a.formValues ?? {})) {
      for (const f of section.fields) {
        if (!f.required || (a.formValues?.[f.name] ?? "").trim()) continue;
        gaps.push(`${a.id} · ${section.title} · ${f.name}`);
      }
    }
  }
  assert.deepEqual(gaps.slice(0, 10), [], `${gaps.length} unanswered required questions on submitted files`);
});

test("the applicant's claims name their claim: instalment and reference", () => {
  for (const a of seed.applications.filter((x) => x.status !== "Draft" && x.caseType === "Ongoing" && x.instalment && x.formValues?.claim_stage)) {
    assert.equal(a.formValues!.claim_stage, a.instalment! > 1 ? "later-instalment" : "first-instalment", a.id);
    if (a.instalment! > 1) assert.equal(a.formValues!.fld_application_ref, applicationRefOf(a), a.id);
  }
});

test("the CCTV an NGO registers is on the record, one setup per project, readable by the officer who needs it", () => {
  const applicant = seed.ngos[0]!;
  const projects = new Map(applicant.institutions.map((i) => [i.id, i]));
  assert.ok(seed.cctv.length > 0, "the seed should hold CCTV setups");
  const seen = new Set<string>();
  for (const c of seed.cctv) {
    assert.ok(projects.has(c.projectId), `${c.projectId} is not a project of the organisation whose CCTV this is`);
    assert.equal(seen.has(c.projectId), false, `${c.projectId} carries two CCTV setups`);
    seen.add(c.projectId);
    assert.ok(c.cameras >= 1 && c.cameras <= 8, `${c.projectId}: ${c.cameras} cameras`);
    assert.equal(c.activationCode, cctvActivationCode(c.projectId, c.cameras), `${c.projectId}: activation code`);
    assert.match(c.activationCode, /^EANU-\d{4}-\d{4}$/, c.projectId);
    assert.ok(c.savedAt <= SEED_NOW, `${c.projectId}: registered ${c.savedAt}, after the demo's today`);
    if (c.contactMobile) assert.match(c.contactMobile, /^\d{10}$/, `${c.projectId}: contact mobile`);
  }
  // No two projects share a code — an officer opening a feed by code must reach one centre.
  assert.equal(new Set(seed.cctv.map((c) => c.activationCode)).size, seed.cctv.length);
  // Both answers the page and the officer read have members: some projects are not set up, and one
  // registered recorder has never reached the portal.
  assert.ok(seed.cctv.length < applicant.institutions.length, "every project is configured, so the outstanding state is never shown");
  assert.ok(seed.cctv.some((c) => c.liveFeed) && seed.cctv.some((c) => !c.liveFeed), "live and not-live are both shown");
});

test("a scheme is named once, the way the glossary names it", () => {
  for (const s of SEED_SCHEMES) {
    const named = schemeName(s.code);
    assert.equal(s.name, named.title, s.code);
    assert.match(s.name, / — /, `${s.code}: the pattern is "Acronym — Full name"`);
  }
  const text = JSON.stringify(seed);
  assert.ok(!/SMILE \(Garima Greh\)/.test(text), 'the seed still says "SMILE (Garima Greh)"');
});

test("the file the Programme Division's ASO opens leaves at least one document for the officer to judge", () => {
  const held = seed.applications.filter((a) => a.holder.kind === "chain" && a.holder.division === "pd" && a.holder.grade === "aso" && !a.certifiedAt);
  assert.ok(held.length > 0, "the ASO should hold files to review");
  // Both readings of "the first file the ASO opens": the dashboard's queue (oldest first) and the
  // order the applications themselves are in, which is what a review link built from the list uses.
  const byAgeing = [...held].sort((a, b) => b.ageingDays - a.ageingDays || a.id.localeCompare(b.id))[0]!;
  for (const app of new Set([byAgeing, held[0]!])) {
    const flagged = app.documents.filter((d) => isFlagged(automaticCheckOf(app, d)));
    assert.ok(flagged.length > 0, `${app.id}: the automatic check vouches for every document, so nothing is left to judge`);
    assert.ok(
      bulkVerifiable(app).length < awaitingVerdict(app).length,
      `${app.id}: "Mark All Remaining as Verified" would clear every document awaiting a verdict`,
    );
  }
  // The one stamped verdict is the portal's reading, not the Ministry's: the officer's own verdict
  // is still to come, the document is required, it has a file, and no deficiency touches it.
  const stamped = seed.applications.flatMap((a) => a.documents.filter((d) => d.aiVerdict).map((d) => ({ a, d })));
  assert.equal(stamped.length, 1, `${stamped.length} documents carry a stamped automatic check`);
  const { a, d } = stamped[0]!;
  assert.equal(d.reviewStatus, "Pending", `${a.id} slot ${d.slot}`);
  assert.equal(d.optional, undefined, `${a.id} slot ${d.slot} is optional, so no verdict is owed on it`);
  assert.ok(d.fileName, `${a.id} slot ${d.slot}: flagged with no file uploaded`);
  assert.ok(isFlagged(d.aiVerdict), `${a.id} slot ${d.slot}: stamped verdict does not flag anything`);
  assert.deepEqual(d.aiVerdict, demoVerdictFor(d.aiVerdict!.state, d.title, a.financialYear), "the check's words are its own");
  assert.equal(a.deficiencies.flatMap((x) => x.items ?? []).some((it) => it.docId === d.id), false, `${a.id} slot ${d.slot} is already under correction`);
});

test("an organisation's registration names the Act it is registered under, with a number and date that fit it", () => {
  for (const ngo of seed.ngos) {
    const act = ngo.registeredUnder ?? "";
    assert.match(act, /Act, \d{4}$|Act, 2013$/, `${ngo.name}: "${act}" is not an Act`);
    const date = new Date(`${ngo.registrationDate} UTC`).toISOString().slice(0, 10);
    if (/Companies Act, 2013/.test(act)) {
      // Section 8 came in with the 2013 Act, so a company cannot be registered under it before it.
      assert.ok(date >= "2014-04-01", `${ngo.name}: registered ${date} under the Companies Act, 2013`);
      assert.match(ngo.registrationNo, /^U\d{5}[A-Z]{2}\d{4}NPL\d{5,6}$/, `${ngo.name}: ${ngo.registrationNo}`);
    } else if (/Trusts Act/.test(act)) {
      assert.match(ngo.registrationNo, /^E-\d+$/, `${ngo.name}: ${ngo.registrationNo}`);
      assert.match(ngo.name, /Trust/, `${ngo.name} is registered as a trust`);
    } else {
      assert.equal(act, "Societies Registration Act, 1860", `${ngo.name}: ${act}`);
      assert.match(ngo.registrationNo, /^\d{2}-\d{2}$/, `${ngo.name}: ${ngo.registrationNo}`);
    }
    assert.ok(date <= SEED_NOW.slice(0, 10), `${ngo.name}: registered ${date}, after the demo's today`);
  }
  // Every file answers the statute, and answers it with its own organisation's.
  for (const a of seed.applications) {
    const ngo = seed.ngos.find((n) => n.id === a.ngoId)!;
    const answered = a.formValues?.fld_statute_act;
    if (answered !== undefined) assert.equal(answered, ngo.registeredUnder, a.id);
  }
});
