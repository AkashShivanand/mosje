#!/usr/bin/env node
/**
 * Builds `apps/hub/src/lib/website-next/legacy-scheme-map.generated.ts`: which of
 * the 140 scheme listings carried over from the old site (`content/website/
 * schemes.json`) is the same scheme as a record in the Department's scheme
 * master (`content/website/scheme-master.json`), and which are State Government
 * schemes.
 *
 * HOW THE MAP IS MADE
 *
 *   1. NAME MATCH (deterministic). Both names are normalised — lower case, "&" →
 *      "and", punctuation dropped, plurals folded, the community abbreviations
 *      written one way (SCs / Scheduled Castes → sc), and filler words ("scheme",
 *      "yojana", "for", "the", "central sector", …) removed. A listing matches a
 *      master record when EVERY word of one of the record's names — its master
 *      name, the abbreviation in its brackets, or an alias in ALIASES below —
 *      appears in the listing's name. Of several candidates the one whose name
 *      covers most words wins; an exact tie is left unmatched, never guessed.
 *   2. HAND REVIEW. Every match was read against the scheme placement audit
 *      (`docs/audit/website-schemes-placement-2026-09-09.csv`, "Where it should
 *      go") and the master's own `excluded` notes. REVIEWED records each decision
 *      that differs from, or adds to, the name match, with its reason.
 *   3. STATE SCHEMES come from the same audit: a row whose "What it actually is"
 *      reads "A State Government scheme". A State scheme is never mapped to a
 *      master record, however alike the names — a State's post-matric scholarship
 *      is not the Department's.
 *
 *   node scripts/build-legacy-scheme-map.mjs            # write
 *   node scripts/build-legacy-scheme-map.mjs --check    # fail if the file is stale
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT = join(ROOT, "apps/hub/src/content/website");
const AUDIT = join(ROOT, "docs/audit/website-schemes-placement-2026-09-09.csv");
const OUT = join(ROOT, "apps/hub/src/lib/website-next/legacy-scheme-map.generated.ts");
const CHECK = process.argv.includes("--check");

const legacy = JSON.parse(readFileSync(join(CONTENT, "schemes.json"), "utf8"));
const master = JSON.parse(readFileSync(join(CONTENT, "scheme-master.json"), "utf8")).schemes;

/** Other names a master record is known by on the old site. Each is a name the
 *  record's own sources use (the Annual Report section title or the legacy
 *  page), not a description. */
const ALIASES = {
  "pcr-poa": ["Protection of Civil Rights Act"],
  "avyay-elderline": ["Elderline"],
  "avyay-caregivers": ["Geriatric Caregivers", "Geriatric Care Givers"],
  "avyay-ipsrc": ["Integrated Programme for Senior Citizens"],
  "avyay-rvy": ["Rashtriya Vayoshri Yojana"],
  "daf-merit-award": ["Dr. Ambedkar National Merit Award"],
  "daf-medical-aid": ["Dr. Ambedkar Medical Aid"],
  "interest-subsidy-overseas": ["Interest Subsidy on Educational Loan for Overseas Studies"],
  "pm-cares-scholarship": ["Scholarship for PM CARES Children"],
  "yasasvi-college": ["Top Class Education in College for OBC EBC and DNT"],
  "nskfdc-loans": ["Schemes Implemented By National Safai Karamcharis Finance Development Corporation"],
  "top-class-sc": ["Top Class Education for SC Students"],
  napddr: ["National Action Plan for Drug Demand Reduction"],
  nos: ["National Overseas Scholarship"],
  namaste: ["NAMASTE"],
  seed: ["SEED"],
};

/**
 * Hand-reviewed decisions: `master` maps the listing, `null` refuses a name match.
 * Every entry says why, citing the placement audit row or the master.
 */
const REVIEWED = {
  "10663": { master: "pre-matric-sc", why: "Audit row 1: an empty duplicate of the Pre-Matric Scholarship for SCs and Others, which carries the component for children in cleaning occupations (AR §3.2)." },
  "dr-ambedkar-centre-of-excellence-free-coaching-scheme-2": { master: "free-coaching", why: "Audit row 28: a duplicate of Free Coaching for SCs, OBCs and PM CARES Children." },
  "changes-in-the-centrally-sponsored-scheme-of-pre-matric-scholarship-to-children-of-those-engaged-in-unclean-occupations": { master: "pre-matric-sc", why: "Audit row 19: an empty notice about the Pre-Matric Scholarship component for children in unclean occupations (AR §3.2)." },
  "self-employment-scheme-for-rehabilitation-of-manual-scavengers-srms-applicable-from-november-2013": { master: "namaste", why: "Master `excluded`: SRMS was subsumed into NAMASTE from 2023-24 (AR §3.11). Audit rows 117-118." },
  "self-employment-scheme-for-rehabilitation-of-manual-scavengers-srms-applicable-from-november-2013-3": { master: "namaste", why: "As above: SRMS was subsumed into NAMASTE (AR §3.11)." },
  "seed-free-coaching": { master: "seed", why: "Audit row 113: a component of SEED. The name also contains \"Free Coaching\", which is a different scheme; SEED wins." },
  "list-of-46-offences-under-the-sc-and-st-poa-act-1989": { master: null, why: "Master `excluded`: a reference list, not a scheme. It is empty, so it redirects to Find a Scheme." },
  "atal-vayo-abhyuday-yojana-avyay": { master: null, why: "AVYAY is an umbrella of four master records; the listing is kept rather than sent to one of them." },
  "pm-yasasvi": { master: null, why: "PM-YASASVI is an umbrella of five master records; kept." },
  "pm-young-achievers-scholarship-award-scheme-for-vibrant-india-for-obcs-and-others-pm-yasasvi": { master: null, why: "PM-YASASVI under its full name; an umbrella, kept." },
  "support-for-marginalized-individuals-for-livelihood-and-enterprise-smile": { master: null, why: "SMILE is an umbrella of two master records; kept." },
  "scholarships-for-higher-education-for-young-achievers-scheme-shreyas-obc-others-2021-22-to-2025-26": { master: null, why: "SHREYAS for OBCs is an umbrella of two master records. It is empty, so it redirects to Find a Scheme." },
  "national-safai-karamcharis-finance-and-development-corporation-nskfdc": { master: null, why: "Audit row 78: the corporation itself, not its loans." },
  "national-scheduled-castes-finance-and-development-corporation-nsfdc": { master: null, why: "Audit row 79: the corporation itself, not its loans." },
  "skill-development-training-programmes-of-nskfdc-and-achievements": { master: null, why: "Audit row 120: an achievement table." },
  "financial-physical-achievements-of-last-five-years-upto-31-03-2018-under-loan-schemes-of-nskfdc": { master: null, why: "Audit row 44: an achievement table." },
  "status-of-loan-application-for-rehabilitation-of-manual-scavengers": { master: null, why: "Audit row 124: a status table." },
  "status-of-self-employment-scheme-for-rehabilitation-of-manual-scavengers-as-on-30-april2018": { master: null, why: "Audit row 125: a status table." },
};

const STOP = new Set(
  "the of for and to in on a an at by with from under scheme schemes yojana yojna central sector centrally sponsored implementation etc others other candidate student".split(" "),
);
const SAME = [
  [/\bscheduled castes?\b/g, "sc"],
  [/\bscs\b/g, "sc"],
  [/\bobcs\b/g, "obc"],
  [/\bebcs\b/g, "ebc"],
  [/\bdnts\b/g, "dnt"],
  [/\bmechanized\b/g, "mechanised"],
  [/\bcare givers\b/g, "caregivers"],
];

function words(name) {
  let t = name.toLowerCase().replace(/&/g, " and ").replace(/[—–-]/g, " ");
  for (const [re, to] of SAME) t = t.replace(re, to);
  return new Set(
    t
      .split(/[^a-z0-9]+/)
      .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w))
      .filter((w) => w && !STOP.has(w)),
  );
}

function namesOf(m) {
  const names = [m.name, ...(ALIASES[m.id] ?? [])];
  for (const [, abbr] of m.name.matchAll(/\(([^)]+)\)/g)) names.push(abbr);
  return names.map(words).filter((w) => w.size > 0);
}

function readCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const audit = readCsv(readFileSync(AUDIT, "utf8"));
const slugOf = (url) => decodeURIComponent(url.replace(/\/$/, "").split("/").pop());
const stateSlugs = new Set(
  audit.filter((r) => /State Government scheme/i.test(r["What it actually is"])).map((r) => slugOf(r.URL)),
);

const masterNames = master.map((m) => ({ id: m.id, names: namesOf(m) }));
const map = {};
const byName = {};
for (const rec of legacy) {
  const slug = rec.slug;
  if (stateSlugs.has(slug)) continue;
  const have = words(rec.title);
  let best = null;
  let tie = false;
  for (const m of masterNames) {
    for (const n of m.names) {
      if (![...n].every((w) => have.has(w))) continue;
      if (!best || n.size > best.size) { best = { id: m.id, size: n.size }; tie = false; }
      else if (n.size === best.size && best.id !== m.id) tie = true;
    }
  }
  if (best && !tie) byName[slug] = best.id;
  const reviewed = REVIEWED[slug];
  const id = reviewed ? reviewed.master : byName[slug];
  if (id && id !== slug) map[slug] = id;
  // A listing whose slug IS a master id (pm-daksh) is already served by the master.
  if (id && id === slug) map[slug] = id;
}

for (const slug of Object.keys(REVIEWED)) {
  if (!legacy.some((r) => r.slug === slug)) throw new Error(`REVIEWED names ${slug}, which is not in schemes.json`);
}
for (const id of Object.values(map)) {
  if (!master.some((m) => m.id === id)) throw new Error(`Mapped to ${id}, which is not a master id`);
}

const sorted = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
const out = `/**
 * GENERATED by scripts/build-legacy-scheme-map.mjs — do not edit by hand; edit
 * the script's ALIASES or REVIEWED tables and re-run it.
 *
 * Old-site scheme listings (content/website/schemes.json) that are the same
 * scheme as a record in the scheme master, found by normalised name match and
 * then hand-reviewed against docs/audit/website-schemes-placement-2026-09-09.csv.
 * A mapped listing permanently redirects to the master page and is not indexed
 * by search on its own. ${Object.keys(map).length} of ${legacy.length} listings are mapped.
 */
export const LEGACY_TO_MASTER: Readonly<Record<string, string>> = ${JSON.stringify(sorted(map), null, 2)};

/**
 * Listings the placement audit identifies as State Government schemes. They are
 * not schemes of the Department, so search does not index them. ${stateSlugs.size} listings.
 */
export const STATE_SCHEME_SLUGS: ReadonlySet<string> = new Set(${JSON.stringify([...stateSlugs].sort(), null, 2)});
`;

if (CHECK) {
  const now = readFileSync(OUT, "utf8");
  if (now !== out) {
    console.error("legacy-scheme-map.generated.ts is stale. Run: node scripts/build-legacy-scheme-map.mjs");
    process.exit(1);
  }
  console.log("legacy-scheme-map: up to date");
} else {
  writeFileSync(OUT, out);
  console.log(`Wrote ${OUT}: ${Object.keys(map).length} mapped, ${stateSlugs.size} State schemes.`);
  for (const [slug, id] of Object.entries(sorted(map))) {
    const how = REVIEWED[slug] ? "reviewed" : "name";
    console.log(`  ${how.padEnd(8)} ${slug.slice(0, 70).padEnd(70)} → ${id}`);
  }
  const refused = Object.entries(byName).filter(([s]) => REVIEWED[s] && REVIEWED[s].master !== byName[s]);
  for (const [s, id] of refused) console.log(`  overruled ${s} (name match ${id}) → ${REVIEWED[s].master ?? "unmapped"}`);
}
