import { test } from "node:test";
import assert from "node:assert/strict";
import { localAssetPath, rewriteImageRefs } from "./assets.mjs";

test("localAssetPath maps a remote url to a stable public path", () => {
  assert.equal(
    localAssetPath("organisation", "https://cdn/wp-content/uploads/2025/11/Logo-NSKFDC.png"),
    "/content/organisation/Logo-NSKFDC.png"
  );
});

test("rewriteImageRefs replaces only mapped urls", () => {
  const map = new Map([["https://cdn/a.png", "/content/x/a.png"]]);
  const html = `<img src="https://cdn/a.png"><img src="https://cdn/b.png">`;
  assert.equal(
    rewriteImageRefs(html, map),
    `<img src="/content/x/a.png"><img src="https://cdn/b.png">`
  );
});
