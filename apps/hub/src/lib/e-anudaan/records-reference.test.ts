/**
 * Reference numbers, as minted on submit.
 *
 * The full-wizard walk of 13 Sep 2026 submitted all seven scheme paths. The district segment was
 * built from an ADDRESS typed into the form (`…/PLOT_14_SECTOR_5_ROHINI_NORTH/…`), a SMILE renewal
 * of a Pune project read NICOBAR, a NAPDDR renewal of a Nicobar project read PUNE, and the serial
 * was a count of applications, which repeats as soon as the list is not append-only.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { buildReference, mintReference, nextReferenceSerial, REFERENCE_SERIAL_BASE } from "./applicant.ts";
import { placeOfProjectId } from "./geography.ts";
import { buildSeed } from "./store/seed.ts";

const seed = buildSeed();
const ngo = seed.ngos[0]!;
const ADDRESS = "Plot 14, Sector 5, Rohini, North West Delhi, Delhi 110085. Established residential facility serving the community.";
const district = (ref: string) => ref.split("/")[3];

test("the district segment is the project's district, never the address typed into the form", () => {
  const known = ngo.institutions.find((i) => i.id.startsWith("SC/DL/NWD/"))!;
  const { id } = mintReference(ngo, [], "SHRESHTA_M2", "2026-27", {
    fld_institution_id: known.id,
    fld_institution_location: ADDRESS,
    fld_project_location: ADDRESS,
  });
  assert.equal(district(id), "NORTH_WEST_DELHI");
  assert.ok(!id.includes("PLOT"), id);
});

test("a renewal takes the district of the project it renews, whatever else the form holds", () => {
  const cases: [string, Record<string, string>, string][] = [
    // SMILE renewal of a Pune project, with Nicobar answered elsewhere on the form.
    ["SMILE", { fld_smile_project_select: "TG/MH/PUN/09003 — Garima Greh, Pune", fld_site_state: "Andaman and Nicobar Islands", fld_site_district: "Nicobar" }, "PUNE"],
    // NAPDDR renewal of a Nicobar project, filed by an NGO registered in Pune.
    ["NAPDDR", { fld_renewal_project: "DR/AN/NIC/40536 — Project, Nicobar · FY 2026-27", fld_reg_office_district: "Pune" }, "NICOBAR"],
    // SHRESHTA names an institution the NGO's own register does not list, by its codes alone.
    ["SHRESHTA_M2", { fld_institution_id: "SC/DL/NWD/09001 — Hostel, North West Delhi · last applied FY 2025-26", fld_institution_location: ADDRESS }, "NORTH_WEST_DELHI"],
    ["AVYAY", { fld_renewal_project: "SR/AR/DIB/40040 — Senior Citizens' Home, Dibang Valley · awaiting sanction", fld_project_location: ADDRESS }, "DIBANG_VALLEY"],
  ];
  for (const [scheme, values, want] of cases) {
    const { id } = mintReference(ngo, [], scheme, "2026-27", values);
    assert.equal(district(id), want, `${scheme}: ${id}`);
  }
});

test("a new project's reference names the district its new Project ID was minted for", () => {
  const { id, project } = mintReference(ngo, [], "AVYAY", "2026-27", {
    fld_project_title: "Anand Old Age Home",
    fld_project_state: "Maharashtra",
    fld_project_district: "Thane",
    fld_project_location: ADDRESS,
  });
  assert.equal(project.created?.district, "Thane");
  assert.equal(district(id), "THANE");
  assert.equal(placeOfProjectId(project.institutionId)?.district, "Thane");
});

test("seven submissions in a row get seven different references", () => {
  const ids = seed.applications.map((a) => a.id);
  const paths: [string, Record<string, string>][] = [
    ["NAPDDR", { fld_project_state: "Delhi", fld_project_district: "North West Delhi" }],
    ["NAPDDR", { fld_renewal_project: "DR/AN/NIC/40536 — Project, Nicobar · FY 2026-27" }],
    ["AVYAY", { fld_project_state: "Maharashtra", fld_project_district: "Pune" }],
    ["AVYAY", { fld_renewal_project: "SR/AR/DIB/40040 — Senior Citizens' Home, Dibang Valley · awaiting sanction" }],
    ["SHRESHTA_M2", { fld_institution_id: ngo.institutions[0]!.id }],
    ["SMILE", { fld_site_state: "Maharashtra", fld_site_district: "Pune" }],
    ["SMILE", { fld_smile_project_select: "TG/MH/PUN/09003 — Garima Greh, Pune" }],
  ];
  const minted: string[] = [];
  for (const [scheme, values] of paths) {
    const { id } = mintReference(ngo, ids, scheme, "2026-27", values);
    ids.unshift(id);
    minted.push(id);
  }
  const serials = minted.map((id) => id.split("/").pop());
  assert.equal(new Set(serials).size, minted.length, serials.join(", "));
  assert.equal(new Set(ids).size, ids.length, "a minted reference repeats one already on record");
});

test("the serial follows the highest issued, not the number of records", () => {
  // One record on file whose serial equals BASE + 1 — a count-based serial mints it again.
  const onFile = [`GIA/2026-27/SMILE/PUNE/${REFERENCE_SERIAL_BASE + 1}`];
  assert.equal(nextReferenceSerial(onFile), REFERENCE_SERIAL_BASE + 2);
  assert.equal(nextReferenceSerial([]), REFERENCE_SERIAL_BASE);
  assert.equal(nextReferenceSerial(["LGCY/76012", "GIA/2026-27/SHRESHTA_M2/PUNE/01660"]), REFERENCE_SERIAL_BASE);
});

test("an empty district still yields a well-formed reference", () => {
  assert.equal(buildReference("smile", "2026-27", undefined, 83500), "GIA/2026-27/SMILE/PROVISIONAL/83500");
});
