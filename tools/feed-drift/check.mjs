#!/usr/bin/env node
/* =============================================================================
   IS THE COMMITTED SNAPSHOT STILL WHAT THE FEED SAYS?

   A snapshot is NOT supposed to equal the live feed — it is the fallback for
   when the feed does not answer, and a fallback that tracks live is not a
   fallback. What it IS supposed to be is honest: the numbers the feed gave on
   the date the file claims.

   Nothing checked that. `PMAJAY_AS_ON` is hand-maintained: the date can be
   bumped while the figures beneath it are not re-captured, and the file then
   asserts a freshness it does not have. That is how the hostel snapshot came to
   hold 2,30,977 / 1,25,485 under a date of 28 August 2026 while the feed said
   1,57,708 / 89,776 — a 32% gap, invisible until someone put both on one screen.

   REPORT, NOT GATE. This calls live government endpoints, so it must never
   decide whether a build passes: a ministry API being slow is not a reason to
   fail CI, and drift is a judgement call rather than a defect. Run it before
   touching a dashboard, or when a figure looks wrong:

       npm run check:feed-drift

   READ THE ZEROS BEFORE ACTING ON THEM. A feed answering 0 for every field of
   every year is a degraded endpoint, not a department that approved nothing —
   GIA's physical-progress and gender endpoints are doing exactly that today.
   Copying those zeros over a good snapshot destroys real data. This tool says
   which fields moved; a human decides which of them mean anything.
   ========================================================================== */

const PMAJAY = "https://pmajay-api-admin.mosje.in/api/v1/admin/public/reports";
const ADARSH = "https://adarshgram-api-dev.mosje.in/api/v1/admin/public/ag/home-counters";
const TIMEOUT = 15_000;

/** What the repository currently commits, and where it lives. */
const SNAPSHOTS = [
  {
    name: "Hostels",
    file: "apps/hub/src/lib/website/pmajay-stats.ts → HOSTEL_FALLBACK",
    url: `${PMAJAY}/hostel/summary`,
    pick: (d) => d,
    committed: { completed_hostels: 0, beneficiaries_covered: 157708, beneficiaries_occupied: 89776 },
  },
  {
    name: "GIA physical progress (all years)",
    file: "apps/hub/src/lib/website/pmajay-stats.ts → GIA_ALL_PHYSICAL_FALLBACK",
    url: `${PMAJAY}/gia/physical-progress?fin_year=all`,
    pick: (d) => ({ total_projects: d.total_projects, in_progress_projects: d.in_progress_projects }),
    committed: { total_projects: 23802, in_progress_projects: 150 },
  },
  {
    name: "Adarsh Gram counters",
    file: "apps/hub/src/lib/website/adarsh-gram-stats.ts → ADARSH_GRAM_COUNTS_FALLBACK",
    url: ADARSH,
    pick: (d) => d.counts,
    committed: {
      states_covered: 26,
      districts_covered: 596,
      villages: 47247,
      assessment_initiated: 36672,
      assessment_completed: 33837,
      works_identified: 391317,
      works_gap_filling: 156590,
      works_completed: 47367,
      vdp_generated: 25437,
      vdp_dlcc_approved: 22281,
      adarsh_gram_declared: 17946,
    },
  },
];

const fmt = (n) => (typeof n === "number" ? n.toLocaleString("en-IN") : String(n));

async function read(url, pick) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
    if (!res.ok) return { ok: false, why: `HTTP ${res.status}` };
    const body = await res.json();
    return { ok: true, data: pick(body?.data ?? {}) };
  } catch (err) {
    return { ok: false, why: err?.name === "TimeoutError" ? "timed out" : "unreachable" };
  }
}

let moved = 0;
let zeroed = 0;

for (const snap of SNAPSHOTS) {
  const live = await read(snap.url, snap.pick);
  console.log(`\n${snap.name}`);
  console.log(`  ${snap.file}`);

  if (!live.ok) {
    console.log(`  — feed ${live.why}. Nothing to compare; the snapshot is doing its job.`);
    continue;
  }

  const keys = Object.keys(snap.committed);
  const diffs = keys.filter((k) => live.data[k] !== snap.committed[k]);
  const allZero = keys.every((k) => live.data[k] === 0);

  if (allZero) {
    zeroed += 1;
    console.log("  ⚠ feed answered 0 for EVERY field — a degraded endpoint, not a reading.");
    console.log("    Do not copy these over the snapshot.");
    continue;
  }
  if (diffs.length === 0) {
    console.log("  ✔ every committed field matches the feed.");
    continue;
  }

  moved += diffs.length;
  console.log(`  ${diffs.length} field(s) differ from the feed:`);
  for (const k of diffs) {
    console.log(`    ${k.padEnd(28)} committed ${fmt(snap.committed[k]).padStart(14)}   feed ${fmt(live.data[k]).padStart(14)}`);
  }
}

console.log(
  `\n${moved} field(s) differ, ${zeroed} feed(s) fully zeroed.\n` +
    "Differing is normal — a snapshot is a dated mirror, not a live copy. What is NOT\n" +
    "normal is a figure from either source appearing on a page as plain prose, with no\n" +
    "provenance and no response to the data-mode switch. That is what put 2,30,977\n" +
    "above a chart reading 1,57,708.\n",
);
