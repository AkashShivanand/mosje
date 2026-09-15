// The masthead's "Associated Organisations" mega menu keeps its own copy of this
// registry — a hand-written NAV constant in `components/website/Header.tsx`, which
// cannot import from here because it needs the abbreviations laid out in columns.
//
// A second copy of a list is a list that drifts, and this one did. On 2026-09-11 the
// menu filed DWBDNC under "Scheme Specific Thematic Portals" while the registry said
// `foundations` — DWBDNC is a statutory Board that RUNS a scheme, not a scheme — and
// gave NISD a column of its own that the department's own site does not have. Nothing
// failed, because nothing compared them.
//
// This does. It reads the menu as source and asserts the two agree, in both
// directions: no organisation is filed under the wrong heading, and none is missing.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  ORGANISATIONS,
  ORGANISATION_CATEGORY_LABELS,
  type OrganisationCategory,
} from "./organisations.ts";

const HEADER_SRC = fileURLToPath(
  new URL("../../components/website/Header.tsx", import.meta.url),
);

/**
 * The department words its column headings its own way; ours are the registry's
 * labels. This is the one place the two vocabularies are allowed to meet, and it is
 * deliberately explicit — a heading that stops matching should fail loudly here
 * rather than quietly drop a whole column out of the comparison.
 */
const HEADING_TO_CATEGORY: Record<string, OrganisationCategory> = {
  Commissions: "commissions",
  Corporations: "corporations",
  "Foundation / Autonomous Bodies": "foundations",
  "Scheme Specific Thematic Portals": "schemes",
};

/** The org menu's columns, read out of the NAV constant as written. */
function menuColumns(): { heading: string; abbrs: string[] }[] {
  const src = readFileSync(HEADER_SRC, "utf8");
  const start = src.indexOf('label: "Associated Organisations"');
  assert.notEqual(start, -1, "the masthead no longer has an Associated Organisations entry");
  const end = src.indexOf('label: "Offerings"', start);
  assert.notEqual(end, -1, "Offerings used to follow the organisations menu; it no longer does");

  const block = src.slice(start, end);
  const columns: { heading: string; abbrs: string[] }[] = [];
  const headingRe = /heading: "([^"]+)"/g;
  let match: RegExpExecArray | null;
  const heads: { heading: string; at: number }[] = [];
  while ((match = headingRe.exec(block))) {
    const heading = match[1];
    if (heading) heads.push({ heading, at: match.index });
  }

  heads.forEach((h, i) => {
    const slice = block.slice(h.at, heads[i + 1]?.at ?? block.length);
    const abbrs = [...slice.matchAll(/abbr: "([^"]+)"/g)]
      .map((m) => m[1])
      .filter((a): a is string => a !== undefined);
    columns.push({ heading: h.heading, abbrs });
  });
  return columns;
}

test("every heading in the org menu maps to a registry category", () => {
  for (const { heading } of menuColumns()) {
    assert.ok(
      heading in HEADING_TO_CATEGORY,
      `the menu has a column "${heading}" with no registry category behind it — ` +
        `add it to HEADING_TO_CATEGORY, or file its items under an existing column`,
    );
  }
});

test("no organisation is filed under a heading its category contradicts", () => {
  const byAbbr = new Map(ORGANISATIONS.map((o) => [o.abbr, o]));

  for (const { heading, abbrs } of menuColumns()) {
    const expected = HEADING_TO_CATEGORY[heading];
    if (!expected) continue; // reported by the test above

    for (const abbr of abbrs) {
      const org = byAbbr.get(abbr);
      if (!org) continue; // reported by the test below
      assert.equal(
        org.category,
        expected,
        `${abbr} sits under "${heading}" in the masthead but is ` +
          `"${ORGANISATION_CATEGORY_LABELS[org.category]}" in the registry. ` +
          `One of the two is wrong — check what the department's own site does.`,
      );
    }
  }
});

test("every organisation in the registry is reachable from the masthead", () => {
  const inMenu = new Set(menuColumns().flatMap((c) => c.abbrs));
  const missing = ORGANISATIONS.filter((o) => !inMenu.has(o.abbr)).map((o) => o.abbr);
  assert.deepEqual(
    missing,
    [],
    `these organisations are in the registry but in no menu column: ${missing.join(", ")}`,
  );
});

test("the category tab counts are derived, so they cannot be stale", () => {
  const sum = (Object.keys(ORGANISATION_CATEGORY_LABELS) as OrganisationCategory[]).reduce(
    (n, key) => n + ORGANISATIONS.filter((o) => o.category === key).length,
    0,
  );
  assert.equal(sum, ORGANISATIONS.length, "an organisation carries a category no tab renders");
});
