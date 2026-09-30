import { test } from "node:test";
import assert from "node:assert/strict";

import { tidyProse } from "./prose.ts";

test("hard-space indents and empty paragraphs go; the words stay", () => {
  assert.equal(tidyProse("<p>    The Scheme has two parts.</p><p>&nbsp;</p>"), "<p>The Scheme has two parts.</p>");
  assert.equal(tidyProse("<p><span>&nbsp;&nbsp;Text.</span></p>"), "<p><span>Text.</span></p>");
});

test("a lone short line between longer text becomes a sub-heading, with its numbering spaced", () => {
  const out = tidyProse("<p>Intro sentence that runs on.</p><p><span>1.Assistance to Voluntary Organizations</span></p><p>The Scheme of Assistance is being implemented across the country.</p>");
  assert.match(out, /<h3><span>1\. Assistance to Voluntary Organizations<\/span><\/h3>/);
});

test("what is not a heading stays a paragraph", () => {
  const follow = "<p>A longer paragraph that follows the line in question and says a good deal more.</p>";
  for (const line of ["Sector: Education", "The features are as under: –", "The Scheme has two parts viz.", "4 Lakhs"]) {
    assert.doesNotMatch(tidyProse(`<p>${line}</p>${follow}`), /<h3>/, line);
  }
  // a last line has nothing under it
  assert.doesNotMatch(tidyProse("<p>Long text first.</p><p>Friends of Older People</p>"), /<h3>/);
  // a value under a label
  assert.doesNotMatch(tidyProse(`<h6>Applicant</h6><div><p>Belong to DNT/SBC Community</p></div>${follow}`), /<h3>/);
  // a run of short lines is a list the page never marked up
  assert.doesNotMatch(tidyProse(`<p>Contents</p><p>Walking Stick</p>${follow}`), /<h3>/);
});

test("consecutive numbered or lettered paragraphs become a list, numbering removed", () => {
  assert.equal(
    tidyProse("<p>1) Register on the portal</p><p>2)Profile verification</p><p>3) Selection of course</p>"),
    "<ol><li>Register on the portal</li><li>Profile verification</li><li>Selection of course</li></ol>",
  );
  assert.equal(tidyProse("<p>a. Meet urgent needs</p><p>b. Support initiatives</p>"), '<ol type="a"><li>Meet urgent needs</li><li>Support initiatives</li></ol>');
  // out of sequence is not a list
  assert.doesNotMatch(tidyProse("<p>1. One thing.</p><p>3. Another thing.</p>"), /<ol/);
});

test("tables are left exactly as they are", () => {
  const table = "<table><tbody><tr><td><p>&nbsp; Short cell</p></td></tr></tbody></table>";
  assert.equal(tidyProse(table), table);
});
