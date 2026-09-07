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

   TWO WAYS AN ANCHOR CAN DANGLE, AND THIS CHECKS BOTH.

   The first is an id no band ever emits — NCSK pointed at five of those. A set
   of every string id in the template catches it, and it cannot drift.

   The second is subtler and went unnoticed until an audit rendered all fifteen
   indexes: an id the template DOES emit, for a record that never reaches the
   branch emitting it. Both live examples were of that kind. NMBA's index
   offered "Documents & Downloads" -> "#documents-downloads" while the record
   asked for a since-removed layout that split its documents into six bands and
   emitted no such section; SCW offered "Contact Division" -> "#contact" while
   carrying no `contact` block at all. Neither could be seen by comparing an
   anchor against a list of ids, because the ids were on the list.

   So for the bands a RECORD owns, the record's own block is checked for the
   field that produces them. Only the six whose guard is a plain field test are
   covered — see RECORD_OWNED. Bands that depend on the scrape (the document
   shelf fills from matched documents as well as the record) are deliberately
   left out: an under-count is a missed defect, an over-count is a gate nobody
   trusts.

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
  // Empty, and it should stay that way. All six entries that were here — NCSK's
  // five document-category anchors and NCSC's Annual Reports — pointed at bands
  // that had been folded into the one document shelf. They now point at
  // "#documents-downloads", which is the section those categories live in.
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

/**
 * Bands whose guard in the template is a plain test of one record field.
 * `band id -> the field on the organisation's own entry that produces it`.
 *
 * Keep this in step with the `if (detail?.X != null)` guards in
 * `OrganisationDetail.tsx`. A band added here that is NOT guarded that simply
 * would report records as broken when they render perfectly.
 */
const RECORD_OWNED = {
  impact: "impact",
  gallery: "gallery",
  messages: "messages",
  "social-feed": "socialFeed",
  contact: "contact",
  tags: "tags",
};

/** The record's own source block, so a field can be looked for inside it. */
function blockOf(name) {
  const at = owners.findIndex(([n]) => n === name);
  if (at === -1) return "";
  const from = owners[at][1];
  const to = at + 1 < owners.length ? owners[at + 1][1] : lines.length;
  return lines.slice(from, to).join("\n");
}

const blocks = new Map();
const dangling = [];
lines.forEach((line, i) => {
  for (const m of line.matchAll(/href: "#([a-z0-9-]+)"/g)) {
    const id = m[1];
    const org = ownerOf(i);
    if (!bands.has(id)) {
      dangling.push(`${org} #${id}`);
      continue;
    }
    const field = RECORD_OWNED[id];
    if (field == null) continue;
    if (!blocks.has(org)) blocks.set(org, blockOf(org));
    // Four spaces: a field of the record itself, not one nested inside another.
    const declared = new RegExp(`\\n {4}${field}: [\\[{]`).test(blocks.get(org));
    if (!declared) dangling.push(`${org} #${id}`);
  }
});

const fresh = dangling.filter((d) => !BASELINE.has(d));
const fixed = [...BASELINE].filter((b) => !dangling.includes(b));

if (fresh.length > 0) {
  console.error("✖ org-anchors: index entries pointing at a band that never renders:\n");
  for (const d of new Set(fresh)) console.error(`    ${d}`);
  console.error(
    "\n  Either the id is one no band emits, or the band is one THIS record does\n" +
      "  not produce — check the organisation's own entry for the field named in\n" +
      "  RECORD_OWNED. Give the record the content, point the entry somewhere\n" +
      "  real, or drop the entry. Do not add it to BASELINE.\n",
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
