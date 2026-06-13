import { test } from "node:test";
import assert from "node:assert/strict";
import { extractSections, collectImageUrls } from "./html-extract.mjs";

const SAMPLE = `
<div class="elementor-widget-image"><div class="swiper"><img src="https://cdn/x.jpg"/></div>
  <div class="elementor-swiper-button">next</div></div>
<h2 class="elementor-heading-title">About</h2>
<div class="elementor-widget-text-editor"><p>First para.</p><p>Second para.</p></div>
<h2>Functions</h2>
<ul><li>One</li><li>Two</li></ul>
`;

test("extractSections splits by headings, keeps prose, drops swiper chrome", () => {
  const out = extractSections(SAMPLE);
  assert.equal(out.length, 2);
  assert.equal(out[0].heading, "About");
  assert.match(out[0].html, /First para\./);
  assert.match(out[0].html, /Second para\./);
  assert.ok(!/swiper-button/.test(out[0].html));
  assert.equal(out[1].heading, "Functions");
  assert.match(out[1].html, /<li>One<\/li>/);
});

test("content before the first heading becomes a lead section with null heading", () => {
  const out = extractSections(`<p>Intro.</p><h2>Body</h2><p>More.</p>`);
  assert.equal(out[0].heading, null);
  assert.match(out[0].html, /Intro\./);
});

test("collectImageUrls returns absolute image srcs, ignoring data-uris", () => {
  const urls = collectImageUrls(`<img src="https://cdn/a.png"><img src="data:image/x">`);
  assert.deepEqual(urls, ["https://cdn/a.png"]);
});

test("nested blockquote>p is not duplicated (outermost-only)", () => {
  const out = extractSections(`<blockquote><p>Quote text.</p></blockquote>`);
  assert.equal(out.length, 1);
  const matches = out[0].html.match(/Quote text\./g) || [];
  assert.equal(matches.length, 1);
});

test("heading nested inside a blockquote does not split the quote", () => {
  const out = extractSections(`<h2>Top</h2><blockquote><h3>Sub</h3><p>Body.</p></blockquote>`);
  assert.equal(out.length, 1);
  assert.equal(out[0].heading, "Top");
  assert.match(out[0].html, /<blockquote>/);
  assert.match(out[0].html, /Body\./);
});

test("empty input yields empty arrays", () => {
  assert.deepEqual(extractSections(""), []);
  assert.deepEqual(collectImageUrls(""), []);
});

test("collectImageUrls ignores images inside dropped chrome", () => {
  const html = `<div class="elementor-swiper-button"><img src="https://cdn/chrome.png"></div><p><img src="https://cdn/real.png"></p>`;
  assert.deepEqual(collectImageUrls(html), ["https://cdn/real.png"]);
});
