import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

/**
 * The Document Centre's six components, held to three things their stylesheets got wrong while
 * the Figma masters were being drawn (16 Sep 2026).
 *
 * 1. A MODIFIER THAT PROMISED A DIFFERENCE AND MADE NONE. `ds-docrow--attention` was set on four
 *    of the ten states and matched no rule anywhere; `data-matches` was set on every compared
 *    field and matched none either. Both read as styling hooks and were neither, so the next
 *    person to reach for one would have found the row unchanged and gone looking for the wrong
 *    bug. A plain BEM element name (`ds-doccheck__errors`, `ds-dochist__action`) is a label on a
 *    node and owes nothing; a `--modifier` or a `data-` attribute is a claim that something
 *    LOOKS different, and this test is what makes that claim true.
 * 2. A VIEWPORT MEDIA QUERY INSIDE A CONTAINER-SCOPED ROW. DocumentRow lays itself out by its own
 *    width; DocumentFindings opens inside it and DocumentPlacementTray sits above the same list.
 *    Both asked the VIEWPORT, so at 1440px they drew their wide layout inside an officer's ~650px
 *    column.
 * 3. A FILLED CHILD OVER A ROUNDED PARENT. The history sheet's current row squared off the
 *    sheet's 8px corners because the list had no `overflow: hidden`.
 */

const dir = new URL("./", import.meta.url);
const read = (f: string): string => readFileSync(new URL(f, dir), "utf8");
/** CSS with comments stripped — a class named only in prose is not a rule. */
const rules = (f: string): string => read(f).replace(/\/\*[\s\S]*?\*\//g, "");

const COMPONENTS = [
  "document-row",
  "document-checklist",
  "document-findings",
  "document-placement-tray",
  "document-history-sheet",
  "document-tile",
] as const;

/** Every stylesheet the forms group publishes — a shared modifier may live in any of them. */
const ALL_CSS = readdirSync(new URL("./", import.meta.url))
  .filter((f) => f.endsWith(".css"))
  .map((f) => rules(f))
  .join("\n");

for (const name of COMPONENTS) {
  test(`${name}.tsx emits no modifier class that nothing styles`, () => {
    const src = read(`${name}.tsx`);
    const emitted = new Set(
      [...src.matchAll(/"(ds-[a-z0-9_-]*--[a-z0-9-]+)"/g)].map((m) => m[1]!),
    );
    // `ds-docrow__expand--${at}`: the stem is written here, the suffix is interpolated, so the
    // stylesheet's own variants of that stem are what must exist.
    for (const m of src.matchAll(/`(ds-[a-z0-9_-]+)--\$\{/g)) {
      const found = [...ALL_CSS.matchAll(new RegExp(`\\.${m[1]!}--[a-z-]+`, "g"))];
      assert.notEqual(found.length, 0, `${name}.tsx: nothing styles any ${m[1]!}--* variant`);
    }
    const orphans = [...emitted].filter((c) => !new RegExp(`\\.${c}(?![\\w-])`).test(ALL_CSS));
    assert.deepEqual(orphans, [], `${name}.tsx: ${orphans.join(", ")}`);
  });

  test(`${name}.tsx emits no data attribute that nothing styles`, () => {
    const src = read(`${name}.tsx`);
    const emitted = [...new Set([...src.matchAll(/\s(data-[a-z][a-z-]*)=/g)].map((m) => m[1]!))];
    const orphans = emitted.filter((a) => !ALL_CSS.includes(`[${a}`));
    assert.deepEqual(orphans, [], `${name}.tsx: ${orphans.join(", ")}`);
  });
}

/*
 * DocumentRow, DocumentFindings and DocumentPlacementTray all render inside a column whose width
 * is nothing to do with the viewport's, so NONE of them may reflow on a viewport width. The two
 * media features that are about the reader rather than the layout — reduced motion, forced
 * colours — stay.
 */
const CONTAINER_SCOPED = ["document-row.css", "document-findings.css", "document-placement-tray.css"] as const;

for (const file of CONTAINER_SCOPED) {
  test(`${file} reflows on its own width, never the viewport's`, () => {
    const media = [...rules(file).matchAll(/@media\s*\(([^)]*)\)/g)].map((m) => m[1]!.trim());
    const layout = media.filter((q) => /\b(min|max)-(width|inline-size)\b/.test(q));
    assert.deepEqual(layout, [], `${file}: ${layout.join(" · ")}`);
    assert.match(rules(file), /container:\s*ds-doc\w+\s*\/\s*inline-size/);
    assert.match(rules(file), /@container\s+ds-doc\w+\s*\(/);
  });
}

test("the history sheet clips its rows, so the current one keeps the sheet's corners", () => {
  const list = rules("document-history-sheet.css").match(/\.ds-dochist__list\s*\{[^}]*\}/)?.[0] ?? "";
  assert.match(list, /border-radius:/);
  assert.match(list, /overflow:\s*hidden/);
});

/*
 * The word for `review` is the one the Document Centre spec settled on (§3.2 as amended by audit
 * D-01): it points at the reason line and "What we found", which are on the row. "Please confirm"
 * pointed at a confirm action that is not, and e-Anudaan's glossary retires the phrase.
 */
test("the default word for `review` is the one the spec decided", () => {
  assert.match(read("document-row.tsx"), /review:\s*"Check the details",/);
  for (const name of COMPONENTS) assert.doesNotMatch(read(`${name}.tsx`), /Please confirm/i);
});

/*
 * EVERY CONTROL IN A ROW IS NAMED FOR ITS OWN DOCUMENT. A checklist draws one row per document —
 * sixteen on SHRESHTA Mode 2, seventeen on AVYAY — so a control whose accessible name is the same
 * on every row tells a screen-reader user nothing about which document it acts on. Replace, Try
 * Again, Details and the menu were qualified from the start; "What we found" was not, and drew
 * sixteen identical buttons (measured on the running step, 16 Sep 2026).
 */
test("every control in a document row is named for its own document", () => {
  const src = read("document-row.tsx");
  const buttons = [...src.matchAll(/<button\b[\s\S]*?>/g)].map((m) => m[0]);
  assert.ok(buttons.length >= 2, `expected the row's buttons, found ${buttons.length}`);
  for (const b of buttons) {
    assert.match(
      b,
      /aria-label=\{titleText/,
      `a row control carries no document-specific name:\n${b.slice(0, 160)}`,
    );
  }
  // The menu's trigger is named through Menu's own `label` prop, not a button tag.
  assert.match(src, /label=\{titleText \? `More actions for \$\{titleText\}`/);
});
