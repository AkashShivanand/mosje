// The scraped organisation prose repeats the page title, and the page banner
// already carries it. What makes this worth a test is the failure it had: the
// first version compared the body's <h1> against the page title and kept it
// when they differed — so correcting a title in the CMS silently produced a
// page with two <h1> elements saying almost the same thing.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { trimRedundantOpening } from "./organisation-prose.ts";

test("a leading h1 is stripped even when it does NOT match the page title", () => {
  const html =
    "<h1>Grants-in-aid to State/Districts</h1><p>The Grants-in-Aid component…</p>";
  const out = trimRedundantOpening(html);
  assert.ok(!out.includes("<h1"), "the banner already carries this page's h1");
  assert.ok(out.startsWith("<p>"));
});

test("the back-link the scrape opens with goes too", () => {
  const html = '<a href="/pm-ajay">PM-AJAY</a><h1>Adarsh Gram</h1><p>Body.</p>';
  assert.equal(trimRedundantOpening(html), "<p>Body.</p>");
});

test("an h1 further down is DEMOTED, not deleted — its words are real content", () => {
  const html = "<p>Intro.</p><h1>Eligibility</h1><p>More.</p>";
  const out = trimRedundantOpening(html);
  assert.ok(out.includes("<h2>Eligibility</h2>"));
  assert.ok(!out.includes("<h1"));
});

test("attributes on a demoted heading survive", () => {
  const out = trimRedundantOpening('<p>x</p><h1 id="a" class="b">T</h1>');
  assert.ok(out.includes('<h2 id="a" class="b">T</h2>'));
});

test("prose with no heading at all is returned unchanged", () => {
  assert.equal(trimRedundantOpening("<p>Just a paragraph.</p>"), "<p>Just a paragraph.</p>");
});
