import { test } from "node:test";
import assert from "node:assert/strict";

import { DIALOG_OPEN_ATTR, openDialogLayer, type DialogLayerRoot } from "./dialog-layer.ts";

/** A stand-in for <html> that records its attributes. */
function fakeRoot(): DialogLayerRoot & { attrs: Set<string> } {
  const attrs = new Set<string>();
  return {
    attrs,
    setAttribute: (name) => void attrs.add(name),
    removeAttribute: (name) => void attrs.delete(name),
  };
}

test("one dialog marks the page and hands it back on release", () => {
  const root = fakeRoot();
  const release = openDialogLayer(root);
  assert.ok(root.attrs.has(DIALOG_OPEN_ATTR));
  release();
  assert.ok(!root.attrs.has(DIALOG_OPEN_ATTR));
});

test("a dialog opened from inside another does not hand the page back when it closes", () => {
  const root = fakeRoot();
  const outer = openDialogLayer(root);
  const inner = openDialogLayer(root);
  inner();
  assert.ok(root.attrs.has(DIALOG_OPEN_ATTR), "the outer dialog still owns the page");
  outer();
  assert.ok(!root.attrs.has(DIALOG_OPEN_ATTR));
});

test("releasing twice cannot unbalance the count", () => {
  const root = fakeRoot();
  const outer = openDialogLayer(root);
  const inner = openDialogLayer(root);
  inner();
  inner(); // a cleanup React ran twice
  assert.ok(root.attrs.has(DIALOG_OPEN_ATTR), "the second release of the same dialog is a no-op");
  outer();
  assert.ok(!root.attrs.has(DIALOG_OPEN_ATTR));
});
