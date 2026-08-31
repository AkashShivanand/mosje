// The portal-filter vocabulary and the rule that decides whether a filter is
// worth rendering. Run: node --test packages/design-system/components/navigation/portal-categories.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_APPS,
  PORTAL_CATEGORIES,
  portalCategoriesIn,
} from "./app-switcher-utils.ts";

const portals = DEFAULT_APPS.filter((a) => a.group === "Portals");
const live = portals.filter((a) => a.status !== "planned");

test("every portal carries a category from the published vocabulary", () => {
  for (const p of portals) {
    assert.ok(p.category, `${p.path} has no category`);
    assert.ok(
      (PORTAL_CATEGORIES as readonly string[]).includes(p.category!),
      `${p.path} has "${p.category}", which is not in PORTAL_CATEGORIES`,
    );
  }
});

test("categories come back in PORTAL_CATEGORIES order, not insertion order", () => {
  const got = portalCategoriesIn(portals);
  const expected = PORTAL_CATEGORIES.filter((c) => got.includes(c));
  assert.deepEqual(got, expected);
});

test("a category with no entries is not reported", () => {
  assert.deepEqual(portalCategoriesIn([{ category: "Commission" }]), ["Commission"]);
  assert.deepEqual(portalCategoriesIn([]), []);
});

test("entries with no category are ignored rather than becoming a blank chip", () => {
  assert.deepEqual(portalCategoriesIn([{}, { category: "Corporations" }]), [
    "Corporations",
  ]);
});

/*
 * The rule the banner renders on: a filter is shown only when the set spans more
 * than one category. This is not a style preference — one chip beside "All"
 * gives two controls with a single outcome.
 */
test("the LIVE set spans one category today, so the filter must stay hidden", () => {
  assert.equal(
    portalCategoriesIn(live).length,
    1,
    "if this now exceeds 1 a commission or corporation has gone live and the " +
      "banner's filter has started rendering — that is the intended behaviour, " +
      "so update this assertion rather than the component",
  );
});

test("the FULL set spans several categories, so the filter would render", () => {
  assert.ok(portalCategoriesIn(portals).length > 1);
});
