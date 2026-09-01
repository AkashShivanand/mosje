// The NAPDDR committee PDF export actually renders.
//
// This file's dependencies crossed TWO majors in one change — jspdf 2 → 4 and
// jspdf-autotable 3 → 5, taken to clear a CRITICAL advisory (arbitrary JS
// execution via PDF injection). Nothing exercised it: `exportPdf` ends in
// `doc.save()`, which is a browser download, so the build never runs it, there
// was no test, and the one contact with the changed surface was a cast through
// `unknown` — so `tsc --noEmit` covered none of it either.
//
// The failure this guards against is not a crash. `lastAutoTable` is set by the
// plugin at runtime and is not in its types; if a major dropped it, `finalY`
// silently becomes undefined, `startY` falls back to 60, and the meeting-minutes
// table is drawn ON TOP of the committee table. An officer gets a PDF that looks
// plausible and is unreadable.
//
// Run: npm test --prefix apps/hub

import test from "node:test";
import assert from "node:assert/strict";

import { buildCommitteePdf } from "./export.ts";
import type { CommitteeRecord } from "./types.ts";

const FILE = { name: "notification.pdf", sizeBytes: 12_400, mime: "application/pdf", blobUrl: null };

const RECORDS: CommitteeRecord[] = [
  {
    id: "scc-br",
    tier: "STATE",
    state: "Bihar",
    chiefSecretaryName: "Chief Secretary, Bihar",
    memberSecretaryName: "Secretary, Social Welfare",
    memberSecretaryDesignation: "Secretary",
    nodalDepartment: "Social Welfare Department",
    formationDate: "2026-05-02",
    memberCount: 14,
    notification: FILE,
    minutes: [
      {
        id: "m-1",
        committeeId: "scc-br",
        committeeName: "Bihar State Level Committee",
        meetingDate: "2026-08-09",
        file: { ...FILE, name: "minutes-2026-08-09.pdf" },
      },
    ],
    createdBy: "demo-admin",
    createdAt: "2026-05-02T09:00:00.000Z",
  },
  {
    id: "dcc-pat",
    tier: "DISTRICT",
    state: "Bihar",
    district: "Patna",
    chairpersonName: "District Collector, Patna",
    chairpersonDesignation: "Deputy Commissioner",
    memberSecretaryName: "District Social Welfare Officer",
    nodalDepartment: "Social Welfare Department",
    formationDate: "2026-06-11",
    memberCount: 11,
    notification: FILE,
    minutes: [],
    createdBy: "demo-admin",
    createdAt: "2026-06-11T09:00:00.000Z",
  },
];

test("the committee PDF renders to a non-empty document", async () => {
  const doc = await buildCommitteePdf(RECORDS, "Bihar");
  const bytes = doc.output("arraybuffer");
  assert.ok(
    bytes.byteLength > 1000,
    `expected a real PDF, got ${bytes.byteLength} byte(s) — jsPDF produced nothing`,
  );
});

test("autoTable still reports where it finished, so the second table is not drawn over the first", async () => {
  const doc = await buildCommitteePdf(RECORDS, "Bihar");

  // This is the assumption `jspdf-autotable.d.ts` declares and the plugin sets
  // at runtime. If a future major drops it, this fails HERE rather than in a
  // report a district officer downloads.
  assert.ok(doc.lastAutoTable, "jspdf-autotable no longer sets `lastAutoTable` on the document");
  assert.equal(
    typeof doc.lastAutoTable?.finalY,
    "number",
    "`lastAutoTable.finalY` is not a number — the minutes table would stack on the committee table",
  );
  assert.ok(
    (doc.lastAutoTable?.finalY ?? 0) > 0,
    "`finalY` is not past the top of the page, so no table was drawn",
  );
});

test("both tables are drawn — the document runs to more than one page of content", async () => {
  const many: CommitteeRecord[] = Array.from({ length: 40 }, (_, i) => ({
    ...RECORDS[1]!,
    id: `dcc-${i}`,
    district: `District ${i}`,
  }));
  const doc = await buildCommitteePdf(many, "Bihar");
  assert.ok(
    doc.getNumberOfPages() >= 2,
    `forty records should span pages; got ${doc.getNumberOfPages()}`,
  );
});
