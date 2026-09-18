import { test } from "node:test";
import assert from "node:assert/strict";
import { lastListingPage } from "./record-pages.mjs";

test("lastListingPage reads the highest data-page in the pagination", () => {
  assert.equal(lastListingPage(`<a data-page="1">1</a><a data-page="602">602</a><a class="next" data-page="2"></a>`), 602);
  assert.equal(lastListingPage("<tr></tr>"), 1);
});
