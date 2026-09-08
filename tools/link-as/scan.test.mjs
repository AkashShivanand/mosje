/**
 * The gate's scan, tested on the tags that used to break it.
 *
 * Every case here is a `>` written somewhere a naive scan would treat as the
 * end of the tag. The FALSE NEGATIVE cases are the reason this file exists: a
 * tag missing `linkAs` after a comment used to pass the gate silently, which is
 * the full-page-reload defect `check.mjs` was written to catch.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { openingTag, scanSource, tagWithoutComments } from "./scan.mjs";

/** The one site `scanSource` finds for `<Ticker>` in `src`. */
const site = (src) => {
  const found = scanSource(src, new Set(["Ticker"]));
  assert.equal(found.length, 1, "expected exactly one call site");
  return found[0];
};

const tagAt = (src) => openingTag(src, src.indexOf("<Ticker"));

test("a `>` in a block comment does not end the tag — prop present, so it PASSES", () => {
  const src = `<Ticker
      label={label}
      /* A tag may explain itself: 30 script files -> 1.9s, so linkAs matters. */
      labelAs="h2"
      linkAs={NextLink}
    >`;
  assert.equal(site(src).passes, true);
  assert.ok(tagAt(src).includes("linkAs={NextLink}"));
});

test("a `>` in a block comment does not hide a MISSING prop — it still FAILS", () => {
  // The serious direction. The naive scan stopped at the `>` in the comment and
  // never reached the place where `linkAs` was not.
  const src = `<Ticker
      label={label}
      /* 30 script files -> 1.9s per click. */
      labelAs="h2"
    >`;
  assert.equal(site(src).passes, false);
});

test("an unbalanced `{` in a comment cannot borrow the NEXT tag's prop", () => {
  // The silent one, and the reason the false negative is more serious than the
  // false positive. A `{` inside a comment used to raise the brace depth with
  // nothing to lower it, so the scan ran past `/>` and into the sibling below,
  // found ITS `linkAs`, and credited it to a tag that does not pass the prop.
  const src = `<Ticker
      /* a { brace and a -> in one comment */
      label={label}
    />
    <Ticker label={other} linkAs={NextLink} />`;
  const found = scanSource(src, new Set(["Ticker"]));
  assert.equal(found.length, 2);
  assert.equal(found[0].passes, false, "the tag without the prop must not pass");
  assert.equal(found[1].passes, true);
});

test("an unbalanced `{` in a string prop cannot borrow the NEXT tag's prop", () => {
  const src = `<Ticker label="an unmatched { in copy" />
    <Ticker label={other} linkAs={NextLink} />`;
  const found = scanSource(src, new Set(["Ticker"]));
  assert.equal(found[0].passes, false);
  assert.equal(found[1].passes, true);
});

test("prose naming the prop is not the prop — a comment cannot satisfy the gate", () => {
  const src = `<Ticker
      /* This one is fine because linkAs={NextLink} is passed below. */
      label={label}
    >`;
  assert.equal(site(src).passes, false);
});

test("an apostrophe inside a comment is prose, not the start of a string", () => {
  // Comments are skipped before quotes are, and the order matters: read the
  // other way round, "the tag's end" opens a string that swallows everything
  // to the next apostrophe in the file.
  const src = `<Ticker
      /* Finding the tag's end is the part of this gate that can be wrong. */
      linkAs={NextLink}
    />`;
  assert.equal(site(src).passes, true);
});

test("a `>` in a line comment does not end the tag", () => {
  const src = `<Ticker
      label={label}
      // 30 script files -> 1.9s
      linkAs={NextLink}
    >`;
  assert.equal(site(src).passes, true);
});

test("a `>` inside a string prop value does not end the tag", () => {
  const src = `<Ticker label="Scheme > Component > Village" linkAs={NextLink} />`;
  assert.equal(site(src).passes, true);
  assert.equal(tagAt(src), src);
});

test("a `>` inside a template literal, template hole included, does not end the tag", () => {
  const src = "<Ticker label={`${a > b ? \"x>y\" : `${c}>`}`} linkAs={NextLink} />";
  assert.equal(site(src).passes, true);
});

test("a self-closing tag ends at `/>`", () => {
  const src = `<Ticker label={label} linkAs={NextLink} />\n<p>after</p>`;
  const tag = tagAt(src);
  assert.ok(tag.endsWith("/>"));
  assert.ok(!tag.includes("after"));
});

test("a self-closing tag missing the prop FAILS", () => {
  const src = `<Ticker label={label} /* -> nothing here */ />`;
  assert.equal(site(src).passes, false);
});

test("a nested object literal still cannot end the tag", () => {
  const src = `<Ticker style={{ zIndex: 1 }} linkAs={NextLink}>`;
  assert.equal(site(src).passes, true);
});

test("an arrow function in a prop does not end the tag", () => {
  const src = `<Ticker onSelect={(id) => setId(id)} linkAs={NextLink} />`;
  assert.equal(site(src).passes, true);
});

test("a spread is still reported as unprovable, not as a pass", () => {
  const src = `<Ticker {...props} /* -> see above */ />`;
  const s = site(src);
  assert.equal(s.passes, false);
  assert.equal(s.spread, true);
});

test("an exemption declared above the tag is still read", () => {
  const src = `{/* linkAs-exempt(specimen): nav hrefs are "#"; drawn, not navigated */}
    <Ticker label={label} />`;
  const s = site(src);
  assert.equal(s.passes, false);
  assert.equal(s.exemption.category, "specimen");
});

test("the reported line is the line the tag opens on", () => {
  const src = `const x = 1;\n\n<Ticker\n  /* -> */\n  linkAs={NextLink}\n>`;
  assert.equal(site(src).line, 3);
});

test("tagWithoutComments keeps strings and drops comments", () => {
  const out = tagWithoutComments(`<Ticker a="/* not a comment */" /* real -> */ b={1} />`);
  assert.ok(out.includes('a="/* not a comment */"'));
  assert.ok(!out.includes("real"));
  assert.ok(out.includes("b={1}"));
});

test("an unterminated tag returns the rest of the source rather than passing quietly", () => {
  const src = `<Ticker label={label}`;
  assert.equal(tagAt(src), src);
  assert.equal(site(src).passes, false);
});
