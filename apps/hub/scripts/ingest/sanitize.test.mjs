import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitize } from "./sanitize.mjs";

test("strips scripts and on* handlers, keeps allowed tags/attrs", () => {
  const dirty = `<p onclick="x()">Hi <a href="https://a" target="_blank">link</a></p><script>bad()</script>`;
  const out = sanitize(dirty);
  assert.match(out, /<p>Hi <a href="https:\/\/a"/);
  assert.ok(!/onclick/.test(out));
  assert.ok(!/script/.test(out));
});

test("keeps img src/alt and table markup", () => {
  const out = sanitize(`<img src="https://a.png" alt="x" onerror="y"><table><tr><td>c</td></tr></table>`);
  assert.match(out, /<img[^>]*src="https:\/\/a\.png"/);
  assert.ok(!/onerror/.test(out));
  assert.match(out, /<td>c<\/td>/);
});
