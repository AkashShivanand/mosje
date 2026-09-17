// The error catalogue is complete and well-formed, and the demo's one-shot failure is honoured once.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ERROR_CATALOGUE,
  ERROR_OCCASIONS,
  armFailure,
  bodyOf,
  entriesAt,
  readArmedFailure,
  takeFailure,
  type ErrorOccasion,
} from "./error-catalogue.ts";

const REQUIRED = [
  "network-offline",
  "timeout",
  "server-error",
  "session-expired",
  "forbidden-role",
  "not-found-withdrawn",
  "conflict-stale",
  "validation-rejected",
  "duplicate-submission",
  "rate-limited",
  "file-store-unavailable",
  "virus-scan-failed",
  "darpan-unavailable",
  "pfms-unavailable",
  "deadline-closed",
  "maintenance",
];

test("ids are unique and the required failures are all catalogued", () => {
  const ids = ERROR_CATALOGUE.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of REQUIRED) assert.ok(ids.includes(id), id);
});

test("every entry has words, an action, a render target and a place it occurs", () => {
  const targets = new Set(["inline", "summary", "banner", "toast", "page"]);
  const occasions = new Set<string>(ERROR_OCCASIONS.map((o) => o.id));
  for (const e of ERROR_CATALOGUE) {
    assert.ok(e.title.trim() && e.body.trim() && e.actionLabel.trim() && e.preservedNote.trim(), e.id);
    assert.ok(e.action, e.id);
    const at = Object.entries(e.renderIn);
    assert.ok(at.length > 0, `${e.id} occurs nowhere`);
    for (const [occasion, target] of at) {
      assert.ok(occasions.has(occasion), `${e.id}: ${occasion}`);
      assert.ok(targets.has(target!), `${e.id}: ${target}`);
    }
  }
});

test("no code, status number or endpoint reaches the words", () => {
  for (const e of ERROR_CATALOGUE) {
    const words = `${e.title} ${bodyOf(e)} ${e.actionLabel} ${e.preservedNote}`;
    assert.doesNotMatch(words, /\b[45]\d\d\b|https?:|\/api\/|HTTP|_[A-Z]/, e.id);
    assert.doesNotMatch(bodyOf(e), /\{minutes\}/, e.id);
    if (e.action === "wait-retry") assert.ok(e.retryAfterMinutes, e.id);
  }
});

test("titles are Title Case", () => {
  const small = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "into", "for", "on", "with"]);
  for (const e of ERROR_CATALOGUE) {
    for (const w of e.title.split(/\s+/)) {
      const bare = w.replace(/[^A-Za-z-]/g, "");
      if (!bare || small.has(bare)) continue;
      assert.match(bare, /^[A-Z]/, `${e.id}: "${w}"`);
    }
  }
});

test("every occasion has at least one entry, so the demo panel group is never empty", () => {
  for (const o of ERROR_OCCASIONS) assert.ok(entriesAt(o.id).length > 0, o.id);
});

function memory() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
}

test("an armed failure is honoured once, and only where it was armed", () => {
  const s = memory();
  armFailure({ id: "timeout", occasion: "submit" }, s);
  assert.equal(takeFailure("upload", s), null, "a different occasion does not consume it");
  assert.equal(takeFailure("submit", s)?.id, "timeout");
  assert.equal(takeFailure("submit", s), null, "the retry succeeds");
});

test("a failure armed for a place it cannot occur is ignored", () => {
  const s = memory();
  armFailure({ id: "virus-scan-failed", occasion: "sign-in" as ErrorOccasion }, s);
  assert.equal(readArmedFailure(s), null);
});
