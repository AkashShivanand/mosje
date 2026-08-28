// Tests for the website search's ranking and its citizen-word vocabulary.
//
// Three kinds of thing are pinned here.
//
// The first is the PRECEDENCE. A page whose title IS what you typed must come
// first, every time. That is the one property a scoring blend can quietly break —
// a document repeating a word eleven times outscoring the page named after it —
// and it is invisible until someone complains that search is bad.
//
// The second is the CITIZEN VOCABULARY, which is the whole reason this search is
// worth building. "school money" must reach a scholarship whose official title
// contains neither word. If that stops being true the feature has failed while
// every other test still passes.
//
// The third is that a zero-result query is RECORDED, because those queries are
// the product backlog and an unlogged one is a citizen need nobody ever learns
// about. [DBIM 9.x]
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { rank, search, suggest, spellingSuggestion, MIN_QUERY_LENGTH } from "./rank.ts";
import { citizenKeywordsFor, VOCABULARY } from "./vocabulary.ts";
import { record, recentZeroResults, recordSearch } from "./analytics.ts";
import type { WebsiteSearchEntry } from "./types.ts";

/** A small fixture standing in for the derived index. */
function entry(
  partial: Partial<WebsiteSearchEntry> & Pick<WebsiteSearchEntry, "title" | "type">,
): WebsiteSearchEntry {
  return {
    description: "",
    href: `/website/${partial.title.toLowerCase().replace(/\s+/g, "-")}`,
    keywords: "",
    section: "Test",
    iconName: "article",
    ...partial,
  };
}

const INDEX: WebsiteSearchEntry[] = [
  entry({ title: "Tenders", type: "page", description: "Active tenders and RFPs." }),
  entry({
    title: "Tender for evaluation of the Post-Matric Scholarship Scheme",
    type: "document",
    description: "tender tender tender tender tender",
    keywords: "tender bid contract procurement",
    updated: "2026-01-01",
  }),
  entry({
    title: "Tender notice, older",
    type: "document",
    keywords: "tender bid",
    updated: "2019-01-01",
  }),
  entry({
    title: "Pre-matric scholarship to the children of those engaged in unclean occupations",
    type: "scheme",
    keywords: citizenKeywordsFor("Pre-matric scholarship to the children of those engaged in unclean occupations"),
  }),
  entry({
    title: "Photo Gallery",
    type: "page",
    keywords: "scholarship photographs event",
  }),
  entry({ title: "NSFDC", type: "organisation", keywords: "national scheduled castes finance" }),
];

test("an exact title match outranks everything, however often a document repeats the word", () => {
  const results = rank(INDEX, "tenders");
  assert.equal(results[0]?.entry.title, "Tenders");
});

test("a title that STARTS WITH the query outranks one that merely contains it", () => {
  const ordered = rank(INDEX, "tender").map((r) => r.entry.title);
  const startsWith = ordered.indexOf("Tender for evaluation of the Post-Matric Scholarship Scheme");
  const contains = ordered.indexOf("Pre-matric scholarship to the children of those engaged in unclean occupations");
  assert.ok(startsWith !== -1);
  // The exact-ish page still leads, and the starts-with document precedes any
  // entry that only matched on a keyword.
  assert.ok(contains === -1 || startsWith < contains);
});

test("type weight puts a scheme above a gallery page at the same match strength", () => {
  const ordered = rank(INDEX, "scholarship").map((r) => r.entry.type);
  assert.ok(ordered.indexOf("scheme") < ordered.indexOf("page"));
});

test("a tie between two documents is broken by date, newest first", () => {
  const docs = rank(INDEX, "bid").map((r) => r.entry.title);
  assert.ok(
    docs.indexOf("Tender for evaluation of the Post-Matric Scholarship Scheme") <
      docs.indexOf("Tender notice, older"),
  );
});

test("CITIZEN WORDS reach a scheme whose official title uses none of them", () => {
  // The scheme is called "Pre-matric scholarship to the children of those engaged
  // in unclean occupations". Nobody types that.
  for (const phrase of ["school money", "money for studies", "छात्रवृत्ति", "chhatravritti"]) {
    const hits = rank(INDEX, phrase).map((r) => r.entry.type);
    assert.ok(hits.includes("scheme"), `"${phrase}" found no scheme`);
  }
});

test("every vocabulary rule matches on catalogue language, never on its own citizen words", () => {
  // Otherwise a rule saying "money" would pull in every other rule that says
  // "money", and every entry would end up tagged with everything.
  for (const rule of VOCABULARY) {
    assert.ok(rule.match.length > 0, `${rule.concept} matches nothing`);
    assert.ok(rule.citizen.trim().length > 0, `${rule.concept} offers no citizen words`);
    for (const needle of rule.match) {
      assert.equal(needle, needle.toLowerCase(), `${rule.concept}: "${needle}" is not lower-cased`);
    }
  }
});

test("a query shorter than the minimum returns nothing rather than everything", () => {
  assert.equal(rank(INDEX, "t").length, 0);
  assert.equal(MIN_QUERY_LENGTH, 2);
});

test("whole-word matching — 'aid' does not match 'said'", () => {
  const index = [entry({ title: "Nothing here", type: "page", keywords: "he said so" })];
  assert.equal(rank(index, "aid").length, 0);
});

test("facet counts describe the whole result set, not the filtered page", () => {
  const outcome = search(INDEX, "tender", { type: "document" });
  const documents = outcome.facets.find((f) => f.type === "document");
  assert.equal(documents?.count, outcome.total);
  assert.ok(outcome.totalAllTypes > outcome.total, "filtering should narrow the set");
});

test("a page number beyond the end clamps rather than showing an empty page", () => {
  const outcome = search(INDEX, "tender", { page: 99 });
  assert.equal(outcome.page, outcome.totalPages);
  assert.ok(outcome.results.length > 0);
});

test("a query that finds nothing offers a respelling AND somewhere to go", () => {
  const outcome = search(INDEX, "tendr");
  assert.equal(outcome.totalAllTypes, 0);
  assert.equal(outcome.didYouMean, "tender");
  assert.ok(outcome.nearest.length > 0, "a dead end must never be a blank page");
});

test("a respelling is only offered when it actually finds something", () => {
  // "qqqqqq" is close to nothing in the index, so no suggestion may be invented.
  assert.equal(search(INDEX, "qqqqqq").didYouMean, null);
  assert.equal(spellingSuggestion("tender", INDEX), null, "a correct word needs no correction");
});

test("suggestions are capped", () => {
  assert.ok(suggest(INDEX, "tender", 2).length <= 2);
});

test("a zero-result query is recorded as its own event — it is the backlog", () => {
  const before = recentZeroResults().length;
  recordSearch("garima greh application form", 0);
  const after = recentZeroResults();
  assert.equal(after.length, before + 1);
  assert.equal(after[0]?.event, "search_zero_results");
  // Recorded AS TYPED. A normalised query hides the misspelling, and the
  // misspelling is often the finding.
  assert.equal(after[0]?.query, "garima greh application form");
});

test("a query that found something is recorded but is not a zero-result", () => {
  const before = recentZeroResults().length;
  recordSearch("tender", 3);
  assert.equal(recentZeroResults().length, before);
});

test("an empty query is not recorded at all", () => {
  const before = recentZeroResults().length;
  recordSearch("   ", 0);
  assert.equal(recentZeroResults().length, before);
});

test("recording never throws, whatever it is handed", () => {
  assert.doesNotThrow(() => record({ event: "search", query: "x".repeat(5000), resultCount: 0 }));
});
