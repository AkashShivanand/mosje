/**
 * SENIOR CITIZENS WELFARE — the dated mirror the dashboard falls back to when a feed does not
 * answer (`.claude/rules/live-data-fallback.md`). Every figure here was read from the API the
 * SCW1 tab of the KPI proforma names for it, on the date shown; none is modelled.
 *
 *  - Facilities: `GET seniorcitizen-api-user.mosje.in/api/v1/user/facilities_list`, 808 rows,
 *    all `is_active`, read 9 Oct 2026 and counted by `home_type`.
 *  - Pledges: `GET …/api/v1/user/pledges/dashboard-count`, `totalCount`, read 9 Oct 2026.
 *  - RVY: `GET adip.depwd.gov.in/auth/api/sje/rvysummary` (DEPwD's ADIP portal; the sheet's
 *    "Third party api", behind an `x-api-key`). The response `{ camp, nob, noa }` as supplied by
 *    the Department's team on 9 Oct 2026; the key did not answer from this build's network.
 */
export const SCW_SNAPSHOT = {
  asOn: "09.10.2026",
  facilities: [
    { label: "Senior Citizens Homes", value: 764 },
    { label: "Mobile Medicare Units", value: 17 },
    { label: "Continuous Care Homes", value: 13 },
    { label: "Regional Resource and Training Centres", value: 11 },
    { label: "Physiotherapy Clinics", value: 3 },
  ],
  pledges: 9_040_477,
  rvy: { camps: 3_290, beneficiaries: 10_32_667, devices: 55_28_017 },
} as const;
