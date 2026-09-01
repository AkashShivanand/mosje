#!/usr/bin/env node
/* =============================================================================
   EVERY "#anchor" IN AN ORGANISATION INDEX MUST NAME A BAND THAT RENDERS.

   The organisation index is a table of contents. An entry pointing at an id no
   band emits is a line that looks like navigation and does nothing — the reader
   clicks, the page does not move, and there is no error anywhere to notice.

   Nothing caught this. `check:website-links` walks internal PAGE links and the
   anchors inside ingested content; it never compares a nav entry's `#id` against
   the ids `OrganisationDetail.tsx` actually pushes. Six such entries had been
   live across NCSK and NCSC, and collapsing four bands into one nearly added a
   seventh without a single check going red.

   Known-dangling entries are listed in BASELINE so this gate can go in green
   today and still fail on anything new. Fixing one means deleting its line here;
   the list only ever shrinks.
   ========================================================================== */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const TEMPLATE = join(ROOT, "apps/hub/src/components/website/templates/OrganisationDetail.tsx");
const CONTENT = join(ROOT, "apps/hub/src/content/website/organisation-details.ts");

/**
 * Anchors known to dangle, each already broken before this gate existed.
 * `org #anchor`. Delete a line when the band it wants is built.
 */
const BASELINE = new Set([
  "national-commission-for-safai-karamcharis #annual-reports",
  "national-commission-for-safai-karamcharis #sop-and-advisories",
  "national-commission-for-safai-karamcharis #acts-and-rules",
  "national-commission-for-safai-karamcharis #circulars-notifications",
  "national-commission-for-safai-karamcharis #rules-of-procedure",
  "national-commission-for-scheduled-castes #annual-reports",
]);

const template = readFileSync(TEMPLATE, "utf8");
const bands = new Set(
  [...template.matchAll(/bands\.push\(\{\s*\n?\s*id: "([a-z0-9-]+)"/g)].map((m) => m[1]),
);
// `id` is also passed inline in a couple of pushes; catch every string id emitted.
for (const m of template.matchAll(/\bid: "([a-z0-9-]+)"/g)) bands.add(m[1]);

const lines = readFileSync(CONTENT, "utf8").split("\n");
const owners = [];
lines.forEach((line, i) => {
  const m = line.match(/^ {2}"?([a-z0-9-]+)"?: \{/) || line.match(/^ {2}\[([A-Z_]+)\]: \{/);
  if (m) owners.push([m[1], i]);
});
const ownerOf = (i) => {
  let name = "(unknown)";
  for (const [n, at] of owners) if (at <= i) name = n;
  return name;
};

const dangling = [];
lines.forEach((line, i) => {
  for (const m of line.matchAll(/href: "#([a-z0-9-]+)"/g)) {
    if (!bands.has(m[1])) dangling.push(`${ownerOf(i)} #${m[1]}`);
  }
});

const fresh = dangling.filter((d) => !BASELINE.has(d));
const fixed = [...BASELINE].filter((b) => !dangling.includes(b));

if (fresh.length > 0) {
  console.error("✖ org-anchors: index entries pointing at a band that never renders:\n");
  for (const d of new Set(fresh)) console.error(`    ${d}`);
  console.error(
    "\n  Either give the band that id in OrganisationDetail.tsx, point the entry\n" +
      "  somewhere real, or drop the entry. Do not add it to BASELINE.\n",
  );
  process.exit(1);
}

if (fixed.length > 0) {
  console.error("✖ org-anchors: these baseline entries now resolve — delete them from BASELINE:\n");
  for (const f of fixed) console.error(`    ${f}`);
  process.exit(1);
}

console.log(
  `✔ org-anchors: ${bands.size} band id(s); every organisation index entry resolves ` +
    `(${BASELINE.size} known-dangling entr${BASELINE.size === 1 ? "y" : "ies"} still on the baseline).`,
);
