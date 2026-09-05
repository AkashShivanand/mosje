import assert from "node:assert/strict";
import { test } from "node:test";

import { nextCheckboxValue, nextSelectAllValue, selectAllState } from "./control-group-logic.ts";

const OPTIONS = [
  { value: "hostel" },
  { value: "scholarship" },
  { value: "device", disabled: true },
  { value: "none", exclusive: true },
];

test("nextCheckboxValue emits in OPTION order, never click order", () => {
  const a = nextCheckboxValue(OPTIONS, [], "scholarship");
  const b = nextCheckboxValue(OPTIONS, a, "hostel");
  assert.deepEqual(b, ["hostel", "scholarship"]);
});

test("nextCheckboxValue toggles an option off and never mutates its input", () => {
  const input = ["hostel", "scholarship"];
  const out = nextCheckboxValue(OPTIONS, input, "hostel");
  assert.deepEqual(out, ["scholarship"]);
  assert.deepEqual(input, ["hostel", "scholarship"]);
});

test("an exclusive option clears the others, and any other clears it", () => {
  assert.deepEqual(nextCheckboxValue(OPTIONS, ["hostel", "scholarship"], "none"), ["none"]);
  assert.deepEqual(nextCheckboxValue(OPTIONS, ["none"], "hostel"), ["hostel"]);
});

test("selectAllState reports unchecked, indeterminate and checked, ignoring disabled and exclusive", () => {
  assert.equal(selectAllState(OPTIONS, []), "unchecked");
  assert.equal(selectAllState(OPTIONS, ["hostel"]), "indeterminate");
  assert.equal(selectAllState(OPTIONS, ["hostel", "scholarship"]), "checked");
  assert.equal(selectAllState(OPTIONS, ["none"]), "unchecked");
  assert.equal(selectAllState([{ value: "x", disabled: true }], []), "unchecked");
});

test("nextSelectAllValue selects only ENABLED options and leaves a disabled one as it was", () => {
  assert.deepEqual(nextSelectAllValue(OPTIONS, [], true), ["hostel", "scholarship"]);
  assert.deepEqual(nextSelectAllValue(OPTIONS, ["hostel", "device"], true), ["hostel", "scholarship", "device"]);
  assert.deepEqual(nextSelectAllValue(OPTIONS, ["hostel", "scholarship", "device"], false), ["device"]);
  assert.deepEqual(nextSelectAllValue(OPTIONS, ["none"], true), ["hostel", "scholarship"]);
});
