import { test } from "node:test";
import assert from "node:assert/strict";

import { sortTopics, tidyProse } from "./prose.ts";

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

test("labelled parts move to their own section, label kept; the rest stays", () => {
  const s = sortTopics(
    "<p>The scheme supports students.</p><p><strong>Beneficiaries:</strong> Graduate students</p><p><strong>Eligibility:</strong></p><ol><li>60% marks</li></ol><h3>Required Documents</h3><ol><li>Aadhaar Card</li></ol><h3>Important Timelines</h3><ol><li>Portal opens in February.</li></ol>",
  );
  assert.equal(s.stay, "<p>The scheme supports students.</p>");
  assert.equal(s.eligibility, "<p><strong>Beneficiaries:</strong> Graduate students</p><ol><li>60% marks</li></ol>");
  assert.equal(s.process, "<h3>Required Documents</h3><ol><li>Aadhaar Card</li></ol><h3>Important Timelines</h3><ol><li>Portal opens in February.</li></ol>");
});

test("steps filed under About are how to apply", () => {
  const s = sortTopics("<ol><li>Register on the portal</li><li>Verify the profile</li></ol><p>Other text.</p>");
  assert.equal(s.process, "<h3>Steps to Apply</h3><ol><li>Register on the portal</li><li>Verify the profile</li></ol>");
  assert.equal(s.stay, "<p>Other text.</p>");
});

test("a label in capitals reads in Title Case; an unfiled label line stays with its part", () => {
  const s = sortTopics("<p><b>CONDITIONS OF ELIGIBILITY:</b></p><p>i. Studying in class IX.</p><p><b>Income Ceiling:</b></p><p>Up to Rs. 2.5 lakh.</p><p><b>How to apply:</b></p><p>Through the State portal.</p>");
  assert.match(s.eligibility, /^<h3>Conditions of Eligibility<\/h3>/);
  assert.match(s.eligibility, /Income Ceiling/);
  assert.equal(s.process, "<p>Through the State portal.</p>");
  assert.equal(s.stay, "");
});

test("tables and unfiled headings stay where they are", () => {
  const s = sortTopics('<h3>Scheme Components</h3><div class="wn-table-wrap" role="region"><table><tr><td>x</td></tr></table></div>');
  assert.match(s.stay, /<h3>Scheme Components<\/h3>/);
  assert.match(s.stay, /<table>/);
});
