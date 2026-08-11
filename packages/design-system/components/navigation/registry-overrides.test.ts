import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  REGISTRY_CONFIG_MAX_BYTES,
  applyRegistryOverrides,
  bucketKey,
  buildRegistryConfig,
  effectiveStatus,
  emptyRegistryConfig,
  hiddenEntries,
  matchHiddenEntry,
  parseRegistryConfig,
  resetRegistryWarnings,
  serializeRegistryConfig,
  withDenseOrder,
  type AppEntry,
  type RegistryConfig,
  type RegistryRowInput,
  type RegistryStatus,
} from "./registry-overrides.ts";
import { DEFAULT_APPS } from "./app-switcher-utils.ts";

/** A small stand-in registry, so ordering assertions do not depend on DEFAULT_APPS. */
const BASE: AppEntry[] = [
  { name: "Site", path: "/website", group: "Website", status: "live" },
  { name: "Alpha", path: "/portals/alpha", group: "Portals", category: "Cat A", status: "live" },
  { name: "Bravo", path: "/portals/bravo", group: "Portals", category: "Cat A", status: "live" },
  { name: "Charlie", path: "/portals/charlie", group: "Portals", category: "Cat A", status: "planned" },
  { name: "Delta", path: "/portals/delta", group: "Portals", category: "Cat B", status: "live" },
  { name: "Docs", path: "/design-system", group: "Resources", status: "live" },
];

const paths = (entries: AppEntry[]) => entries.map((e) => e.path);

function config(entries: RegistryConfig["entries"]): RegistryConfig {
  return { version: 1, entries };
}

// ── applyRegistryOverrides ────────────────────────────────────────────────

test("null config returns the code registry unchanged", () => {
  const result = applyRegistryOverrides(BASE, null);
  assert.deepEqual(paths(result), paths(BASE));
});

test("null config returns a copy, so callers cannot reorder the source", () => {
  const result = applyRegistryOverrides(BASE, null);
  assert.notEqual(result, BASE);
  result.reverse();
  assert.equal(BASE[0]?.path, "/website");
});

test("an empty config leaves every entry as code defines it", () => {
  const result = applyRegistryOverrides(BASE, emptyRegistryConfig());
  assert.deepEqual(paths(result), paths(BASE));
});

test("hidden entries are dropped from the merged registry", () => {
  const result = applyRegistryOverrides(
    BASE,
    config({ "/portals/bravo": { status: "hidden" } }),
  );
  assert.deepEqual(paths(result), [
    "/website",
    "/portals/alpha",
    "/portals/charlie",
    "/portals/delta",
    "/design-system",
  ]);
});

test("status overrides flip live and planned", () => {
  const result = applyRegistryOverrides(
    BASE,
    config({
      "/portals/charlie": { status: "live" },
      "/portals/alpha": { status: "planned" },
    }),
  );
  const byPath = new Map(result.map((e) => [e.path, e]));
  assert.equal(byPath.get("/portals/charlie")?.status, "live");
  assert.equal(byPath.get("/portals/alpha")?.status, "planned");
});

test("explicit order sorts within a category and does not cross buckets", () => {
  const result = applyRegistryOverrides(
    BASE,
    config({
      "/portals/alpha": { order: 2 },
      "/portals/bravo": { order: 1 },
      "/portals/charlie": { order: 0 },
    }),
  );
  assert.deepEqual(paths(result), [
    "/website",
    "/portals/charlie",
    "/portals/bravo",
    "/portals/alpha",
    "/portals/delta",
    "/design-system",
  ]);
});

test("entries without an explicit order keep their code position", () => {
  const result = applyRegistryOverrides(
    BASE,
    config({ "/portals/charlie": { order: 0 } }),
  );
  // Charlie moves to the front of Cat A; alpha and bravo keep code order behind it.
  assert.deepEqual(paths(result).slice(1, 4), [
    "/portals/charlie",
    "/portals/alpha",
    "/portals/bravo",
  ]);
});

test("label overrides replace text and leave the rest of the entry alone", () => {
  const result = applyRegistryOverrides(
    BASE,
    config({
      "/portals/alpha": {
        name: "Alpha Renamed",
        desc: "New description",
        org: "New org",
        abbr: "AR",
      },
    }),
  );
  const alpha = result.find((e) => e.path === "/portals/alpha");
  assert.equal(alpha?.name, "Alpha Renamed");
  assert.equal(alpha?.desc, "New description");
  assert.equal(alpha?.org, "New org");
  assert.equal(alpha?.abbr, "AR");
  assert.equal(alpha?.group, "Portals");
  assert.equal(alpha?.path, "/portals/alpha");
});

test("a category override moves the entry into that category's bucket", () => {
  const result = applyRegistryOverrides(
    BASE,
    config({ "/portals/alpha": { category: "Cat B" } }),
  );
  const alpha = result.find((e) => e.path === "/portals/alpha");
  assert.equal(alpha?.category, "Cat B");
  // Cat A keeps its position ahead of Cat B — a category override must not
  // hoist the destination category up the page. Within Cat B, alpha carries no
  // explicit order, so it keeps its code-relative position (index 1) ahead of
  // delta (index 4).
  assert.deepEqual(paths(result), [
    "/website",
    "/portals/bravo",
    "/portals/charlie",
    "/portals/alpha",
    "/portals/delta",
    "/design-system",
  ]);
});

test("an override naming a category that does not exist in code appends a bucket", () => {
  const result = applyRegistryOverrides(
    BASE,
    config({ "/portals/alpha": { category: "Cat Z" } }),
  );
  // Cat Z is not in the code registry, so it lands after every known bucket
  // rather than displacing one.
  assert.equal(paths(result).at(-1), "/portals/alpha");
});

test("overrides never mutate the base registry", () => {
  const snapshot = JSON.stringify(BASE);
  applyRegistryOverrides(
    BASE,
    config({ "/portals/alpha": { name: "Mutated", status: "hidden" } }),
  );
  assert.equal(JSON.stringify(BASE), snapshot);
});

test("unknown paths are ignored rather than throwing", () => {
  resetRegistryWarnings();
  const result = applyRegistryOverrides(
    BASE,
    config({ "/portals/does-not-exist": { status: "hidden" } }),
  );
  assert.deepEqual(paths(result), paths(BASE));
});

test("the real DEFAULT_APPS survives a round trip through an empty config", () => {
  const result = applyRegistryOverrides(DEFAULT_APPS, emptyRegistryConfig());
  assert.deepEqual(paths(result), paths(DEFAULT_APPS));
});

// ── parseRegistryConfig ───────────────────────────────────────────────────

test("null and blank input parse to null", () => {
  assert.equal(parseRegistryConfig(null), null);
  assert.equal(parseRegistryConfig(undefined), null);
  assert.equal(parseRegistryConfig(""), null);
  assert.equal(parseRegistryConfig("   "), null);
});

test("invalid JSON is rejected", () => {
  assert.equal(parseRegistryConfig("{not json"), null);
});

test("a non-object payload is rejected", () => {
  assert.equal(parseRegistryConfig("[1,2,3]"), null);
  assert.equal(parseRegistryConfig('"a string"'), null);
});

test("an unsupported version is rejected", () => {
  assert.equal(
    parseRegistryConfig(JSON.stringify({ version: 2, entries: {} })),
    null,
  );
  assert.equal(parseRegistryConfig(JSON.stringify({ entries: {} })), null);
});

test("a non-object entries field is rejected", () => {
  assert.equal(
    parseRegistryConfig(JSON.stringify({ version: 1, entries: [] })),
    null,
  );
});

test("an unknown status value is rejected", () => {
  assert.equal(
    parseRegistryConfig(
      JSON.stringify({ version: 1, entries: { "/a": { status: "invisible" } } }),
    ),
    null,
  );
});

test("a non-integer or negative order is rejected", () => {
  assert.equal(
    parseRegistryConfig(
      JSON.stringify({ version: 1, entries: { "/a": { order: 1.5 } } }),
    ),
    null,
  );
  assert.equal(
    parseRegistryConfig(
      JSON.stringify({ version: 1, entries: { "/a": { order: -1 } } }),
    ),
    null,
  );
  assert.equal(
    parseRegistryConfig(
      JSON.stringify({ version: 1, entries: { "/a": { order: "2" } } }),
    ),
    null,
  );
});

test("a non-string label is rejected", () => {
  assert.equal(
    parseRegistryConfig(
      JSON.stringify({ version: 1, entries: { "/a": { name: 42 } } }),
    ),
    null,
  );
});

test("an oversized payload is rejected before it is parsed", () => {
  const oversized = JSON.stringify({
    version: 1,
    entries: { "/a": { desc: "x".repeat(REGISTRY_CONFIG_MAX_BYTES) } },
  });
  assert.equal(parseRegistryConfig(oversized), null);
});

test("a blank label override is dropped, restoring the code value", () => {
  const parsed = parseRegistryConfig(
    JSON.stringify({ version: 1, entries: { "/portals/alpha": { name: "  " } } }),
  );
  assert.deepEqual(parsed?.entries["/portals/alpha"], {});
  const result = applyRegistryOverrides(BASE, parsed);
  assert.equal(result.find((e) => e.path === "/portals/alpha")?.name, "Alpha");
});

test("a valid config parses, and a parsed object round-trips through serialize", () => {
  const parsed = parseRegistryConfig(
    JSON.stringify({
      version: 1,
      entries: { "/portals/alpha": { status: "hidden", order: 3, name: "A" } },
    }),
  );
  assert.deepEqual(parsed, {
    version: 1,
    entries: { "/portals/alpha": { status: "hidden", order: 3, name: "A" } },
  });
  assert.deepEqual(parseRegistryConfig(serializeRegistryConfig(parsed!)), parsed);
});

test("an already-parsed object is accepted, so the admin action can validate before writing", () => {
  const parsed = parseRegistryConfig({
    version: 1,
    entries: { "/portals/alpha": { status: "planned" } },
  });
  assert.equal(parsed?.entries["/portals/alpha"]?.status, "planned");
});

// ── status, buckets, hidden matching ──────────────────────────────────────

test("effectiveStatus falls back to the entry then to live", () => {
  const entry = BASE[1]!;
  assert.equal(effectiveStatus(entry, null), "live");
  assert.equal(
    effectiveStatus(entry, config({ "/portals/alpha": { status: "hidden" } })),
    "hidden",
  );
  const noStatus: AppEntry = { name: "X", path: "/x", group: "Portals" };
  assert.equal(effectiveStatus(noStatus, null), "live");
});

test("bucketKey separates groups and categories", () => {
  assert.notEqual(bucketKey(BASE[1]!), bucketKey(BASE[4]!));
  assert.equal(bucketKey(BASE[1]!), bucketKey(BASE[2]!));
});

test("hiddenEntries lists only the hidden ones", () => {
  assert.deepEqual(hiddenEntries(BASE, null), []);
  const hidden = hiddenEntries(
    BASE,
    config({ "/portals/bravo": { status: "hidden" }, "/website": { status: "hidden" } }),
  );
  assert.deepEqual(paths(hidden).sort(), ["/portals/bravo", "/website"]);
});

test("matchHiddenEntry blocks the path and everything beneath it", () => {
  const hidden = hiddenEntries(BASE, config({ "/portals/bravo": { status: "hidden" } }));
  assert.equal(matchHiddenEntry(hidden, "/portals/bravo")?.path, "/portals/bravo");
  assert.equal(matchHiddenEntry(hidden, "/portals/bravo/login")?.path, "/portals/bravo");
  assert.equal(matchHiddenEntry(hidden, "/portals/alpha"), null);
  // Not a prefix match on a partial segment.
  assert.equal(matchHiddenEntry(hidden, "/portals/bravo-two"), null);
});

test("matchHiddenEntry prefers the longest match and tolerates a trailing slash", () => {
  const hidden: AppEntry[] = [
    { name: "All portals", path: "/portals", group: "Portals" },
    { name: "Bravo", path: "/portals/bravo", group: "Portals" },
    { name: "Storybook", path: "/storybook/", group: "Resources" },
  ];
  assert.equal(matchHiddenEntry(hidden, "/portals/bravo/x")?.path, "/portals/bravo");
  assert.equal(matchHiddenEntry(hidden, "/portals/other")?.path, "/portals");
  assert.equal(matchHiddenEntry(hidden, "/storybook")?.path, "/storybook/");
  assert.equal(matchHiddenEntry(hidden, "/storybook/iframe.html")?.path, "/storybook/");
});

// ── includeHidden ─────────────────────────────────────────────────────────

test("includeHidden keeps hidden entries, in their effective order", () => {
  const result = applyRegistryOverrides(
    BASE,
    config({ "/portals/bravo": { status: "hidden" } }),
    { includeHidden: true },
  );
  assert.deepEqual(paths(result), paths(BASE));
});

// ── buildRegistryConfig ───────────────────────────────────────────────────

/** Rows that reproduce the code registry exactly. */
function codeRows(): RegistryRowInput[] {
  return BASE.map((entry) => ({
    path: entry.path,
    status: (entry.status ?? "live") as RegistryStatus,
    name: entry.name,
    desc: entry.desc,
    org: entry.org,
    abbr: entry.abbr,
    category: entry.category,
  }));
}

test("an untouched registry builds an empty patch", () => {
  assert.deepEqual(buildRegistryConfig(BASE, codeRows()), {
    version: 1,
    entries: {},
  });
});

test("only a changed status is written", () => {
  const rows = codeRows();
  rows[1]!.status = "hidden";
  assert.deepEqual(buildRegistryConfig(BASE, rows).entries, {
    "/portals/alpha": { status: "hidden" },
  });
});

test("a label equal to the code value is not written, so code keeps winning", () => {
  const rows = codeRows();
  rows[1]!.name = "Alpha"; // unchanged
  rows[2]!.name = "Bravo Renamed";
  assert.deepEqual(buildRegistryConfig(BASE, rows).entries, {
    "/portals/bravo": { name: "Bravo Renamed" },
  });
});

test("a blank label clears the override rather than blanking the label", () => {
  const rows = codeRows();
  rows[1]!.desc = "   ";
  assert.deepEqual(buildRegistryConfig(BASE, rows).entries, {});
});

test("reordering a bucket writes a dense order for that bucket only", () => {
  const rows = codeRows();
  // Cat A submitted as charlie, alpha, bravo.
  const [site, alpha, bravo, charlie, delta, docs] = rows as RegistryRowInput[];
  const reordered = [site!, charlie!, alpha!, bravo!, delta!, docs!];
  const entries = buildRegistryConfig(BASE, reordered).entries;
  assert.deepEqual(entries, {
    "/portals/charlie": { order: 0 },
    "/portals/alpha": { order: 1 },
    "/portals/bravo": { order: 2 },
  });
});

test("moving an entry back to its code position removes the order override", () => {
  const rows = codeRows();
  const [site, alpha, bravo, charlie, delta, docs] = rows as RegistryRowInput[];
  const moved = [site!, charlie!, alpha!, bravo!, delta!, docs!];
  const back = [site!, alpha!, bravo!, charlie!, delta!, docs!];
  assert.ok(Object.keys(buildRegistryConfig(BASE, moved).entries).length > 0);
  assert.deepEqual(buildRegistryConfig(BASE, back).entries, {});
});

test("the built patch round-trips through parse and reproduces the submitted order", () => {
  const rows = codeRows();
  const [site, alpha, bravo, charlie, delta, docs] = rows as RegistryRowInput[];
  const reordered = [site!, charlie!, alpha!, bravo!, delta!, docs!];
  const built = buildRegistryConfig(BASE, reordered);
  const parsed = parseRegistryConfig(serializeRegistryConfig(built));
  assert.deepEqual(paths(applyRegistryOverrides(BASE, parsed)), [
    "/website",
    "/portals/charlie",
    "/portals/alpha",
    "/portals/bravo",
    "/portals/delta",
    "/design-system",
  ]);
});

test("rows for unknown paths are dropped", () => {
  const rows = [
    ...codeRows(),
    { path: "/portals/ghost", status: "hidden" as RegistryStatus },
  ];
  assert.deepEqual(buildRegistryConfig(BASE, rows).entries, {});
});

test("a category change writes the category and re-buckets the ordering", () => {
  const rows = codeRows();
  rows[1]!.category = "Cat B";
  const entries = buildRegistryConfig(BASE, rows).entries;
  assert.equal(entries["/portals/alpha"]?.category, "Cat B");
  // Cat A is now bravo, charlie — still code order, so no order is pinned.
  assert.equal(entries["/portals/bravo"]?.order, undefined);
});

// ── withDenseOrder ────────────────────────────────────────────────────────

test("withDenseOrder writes a dense 0..n-1 order for every path given", () => {
  const next = withDenseOrder(emptyRegistryConfig(), [
    "/portals/charlie",
    "/portals/alpha",
    "/portals/bravo",
  ]);
  assert.equal(next.entries["/portals/charlie"]?.order, 0);
  assert.equal(next.entries["/portals/alpha"]?.order, 1);
  assert.equal(next.entries["/portals/bravo"]?.order, 2);
});

test("withDenseOrder preserves other override fields", () => {
  const next = withDenseOrder(
    config({ "/portals/alpha": { name: "Kept", status: "planned" } }),
    ["/portals/alpha"],
  );
  assert.deepEqual(next.entries["/portals/alpha"], {
    name: "Kept",
    status: "planned",
    order: 0,
  });
});
