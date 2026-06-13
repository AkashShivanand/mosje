import { test } from "node:test";
import assert from "node:assert/strict";
import { transformRecord } from "./transform.mjs";

const RAW = {
  id: 5, slug: "ncsk", link: "https://www.dosje.gov.in/organisation/ncsk/",
  title: { rendered: "National Commission for Safai Karamcharis" },
  content: { rendered: `<h2>About</h2><div class="elementor-widget-text-editor"><p>Body <a href="https://ncsk.nic.in">site</a>.</p></div>` },
};

test("transformRecord produces slug,title,sourceUrl,sections,website", () => {
  const rec = transformRecord(RAW, { taxonomyNames: {} });
  assert.equal(rec.slug, "ncsk");
  assert.equal(rec.title, "National Commission for Safai Karamcharis");
  assert.equal(rec.sourceUrl, "https://www.dosje.gov.in/organisation/ncsk/");
  assert.equal(rec.sections[0].heading, "About");
  assert.match(rec.sections[0].html, /Body <a href="https:\/\/ncsk\.nic\.in"/);
  assert.equal(rec.website, "https://ncsk.nic.in");
});

test("decodes HTML entities in title", () => {
  const rec = transformRecord({ ...RAW, title: { rendered: "A &amp; B" } }, { taxonomyNames: {} });
  assert.equal(rec.title, "A & B");
});
