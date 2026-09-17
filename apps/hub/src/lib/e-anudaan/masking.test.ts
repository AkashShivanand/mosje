// Run: node --test src/lib/e-anudaan/masking.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { maskAadhaar, maskIdNumber, maskMobile, maskedIdentity } from "./masking.ts";

test("Aadhaar shows only its last four digits", () => {
  assert.equal(maskAadhaar("123456781234"), "XXXX-XXXX-1234");
  assert.equal(maskAadhaar("1234 5678 1234"), "XXXX-XXXX-1234");
  assert.equal(maskAadhaar(""), "");
  assert.equal(maskAadhaar(undefined), "");
  // Not twelve digits: masked as an ordinary number, never printed whole.
  assert.equal(maskAadhaar("12345"), "XX2345");
});

test("a mobile shows its first two and last three digits", () => {
  assert.equal(maskMobile("9876543210"), "98XXXXX210");
  assert.equal(maskMobile("+91-98765 43210"), "98XXXXX210");
  assert.equal(maskMobile("09876543210"), "98XXXXX210");
  assert.equal(maskMobile("12345"), "XXX45");
  assert.equal(maskMobile(undefined), "");
});

test("other document numbers keep their last four", () => {
  assert.equal(maskIdNumber("ABCDE1234F"), "XXXXXX234F");
  assert.equal(maskIdNumber("1234"), "XXXX");
  assert.equal(maskIdNumber("12345"), "XX2345");
  assert.equal(maskedIdentity("Aadhaar", "100000079190"), "Aadhaar XXXX-XXXX-9190");
  assert.equal(maskedIdentity("Ration Card No", "RC99887766"), "Ration Card No XXXXXX7766");
});

test("no masked value contains more than four digits of the original in a row", () => {
  for (const v of ["123456789012", "9822014530", "ABCD123456789"]) {
    for (const m of [maskAadhaar(v), maskMobile(v), maskIdNumber(v)]) assert.doesNotMatch(m, /\d{5,}/, m);
  }
});
