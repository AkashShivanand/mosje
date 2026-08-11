import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mergeFindings } from "../build/figma-ghost-audit.mjs";

/**
 * The ghost-binding ratchet (see `build/figma-ghost-audit.mjs` for the incident and the runner).
 *
 * A variable deleted from a collection stays resolvable in Figma for as long as something is
 * bound to it. It renders, it reads as bound in the inspector, and it is invisible to every
 * other test here — they all enumerate FROM `collection.variableIds`, which a deleted variable
 * is by definition not in. No assertion over that enumeration could ever have caught this.
 *
 * WHY A RATCHET AND NOT A CLEAN ASSERTION
 * ---------------------------------------
 * The first audit run found this is not a handful of nodes. The 2026-08 rename deleted the old
 * `Font Size/N` and `Line Heights/N` variables, and the library's **padding, itemSpacing and
 * cornerRadius** layer is still bound to them across every component page — a typography ramp
 * doing a spacing ramp's job, permanently detached from `@mosje/tokens`. Dropdown alone carries
 * 551 nodes with `Font Size/3` as horizontal padding.
 *
 * Asserting zero would fail the suite on day one and stay failing for as long as remediation
 * takes, which trains people to ignore it. So this follows the same shape as
 * `apps/storybook/coverage-baseline.json`: existing debt is listed and frozen, anything NEW
 * fails, and an entry that disappears must be deleted from the baseline. The file can only
 * shrink.
 *
 * Keyed by the deleted variable's identity, not by page, because the same ~25 variables recur
 * everywhere — that keeps the baseline small and stable, and keeps it meaningful even while
 * page coverage is still partial.
 */

const root = new URL("..", import.meta.url).pathname;
const live = JSON.parse(readFileSync(root + "reference/figma-live.json", "utf8"));
const baseline = JSON.parse(readFileSync(root + "reference/ghost-bindings-baseline.json", "utf8"));
const audit = live.$ghostAudit;

const accepted = new Set(baseline.accepted.map((e) => e.id));
const observed = new Map((audit?.findings ?? []).map((f) => [f.id, f]));

test("the live snapshot carries a ghost-binding audit", () => {
  // Without this the suite goes green on a snapshot that was never audited — the exact state
  // the library was in when the bug was found.
  assert.ok(audit, "reference/figma-live.json has no $ghostAudit block — re-run the audit");
  assert.ok(audit.auditedAt, "$ghostAudit.auditedAt is missing");
  assert.ok(["partial", "complete"].includes(audit.status), "$ghostAudit.status must be declared");
});

test("no NEW ghost binding — the baseline may shrink, never grow", () => {
  const added = [...observed.values()]
    .filter((f) => !accepted.has(f.id))
    .map((f) => `${f.name} (${f.id}) via ${f.property}, ${f.boundOn}× on ${(f.pages ?? []).join(", ")}`);
  assert.deepEqual(
    added.slice(0, 10),
    [],
    `${added.length} ghost binding(s) not in reference/ghost-bindings-baseline.json. Something ` +
      `was bound to a variable that no collection owns — @mosje/tokens can never update it. ` +
      `Rebind to the canonical variable carrying the same value; do not extend the baseline.`,
  );
});

test("no stale baseline entry once coverage is complete", () => {
  // Under partial coverage an accepted entry may simply not have been reached yet, so this
  // check only has meaning on a full run. Gating it is what stops the ratchet from demanding
  // deletions that a later page would contradict.
  if (audit.status !== "complete") return;
  const gone = baseline.accepted.filter((e) => !observed.has(e.id)).map((e) => `${e.name} (${e.id})`);
  assert.deepEqual(
    gone.slice(0, 10),
    [],
    `${gone.length} baseline entr(ies) no longer occur — delete them so the ratchet tightens`,
  );
});

test("the audit actually walked the file", () => {
  // A script that silently matched nothing returns zero findings too. Requiring positive
  // traffic distinguishes "clean" from "never looked".
  assert.ok(audit.nodesWalked > 0, "audit walked 0 nodes");
  assert.ok(
    audit.variableRefsChecked > 0,
    "audit checked 0 variable references — not a plausible state for this library",
  );
});

test("partial coverage is declared, not implied", () => {
  // The realistic failure of a manual per-page sweep is a page missed to a timeout. Partial
  // coverage reporting few findings is indistinguishable from a healthy file unless the
  // shortfall is recorded where a reader will see it.
  if (audit.status === "complete") {
    assert.equal(audit.pagesScanned, audit.pagesTotal, "status 'complete' but pages are missing");
    return;
  }
  assert.ok(
    audit.pagesScanned < audit.pagesTotal,
    "status 'partial' but every page was scanned — mark it complete",
  );
  assert.ok(audit.note, "a partial audit must carry a $ghostAudit.note saying what is unscanned");
});

test("the audit is not older than the variable snapshot it accompanies", () => {
  // `$readAt` and `$auditedAt` describe the same file. A snapshot refreshed without re-running
  // the audit would carry a stale all-clear.
  assert.ok(
    Date.parse(audit.auditedAt) >= Date.parse(live.$readAt),
    `$ghostAudit.auditedAt (${audit.auditedAt}) predates $readAt (${live.$readAt})`,
  );
});

// --- the gate's own failure path -------------------------------------------
// A check nobody has watched fail cannot be trusted. These drive mergeFindings directly so the
// shape the assertions above depend on is proven rather than assumed.

test("mergeFindings aggregates one ghost across pages", () => {
  const m = mergeFindings(
    [
      { page: "Navbar", nodes: 10, refs: 4, findings: [{ id: "VariableID:1:1", kind: "ghost", property: "fontSize", name: "Font Size/3", boundOn: 2 }] },
      { page: "Footer", nodes: 5, refs: 3, findings: [{ id: "VariableID:1:1", kind: "ghost", property: "fontSize", name: "Font Size/3", boundOn: 1 }] },
    ],
    { pagesTotal: 2, auditedAt: "2026-08-11" },
  );
  assert.equal(m.findings.length, 1, "the same ghost on two pages is one finding");
  assert.equal(m.findings[0].boundOn, 3, "counts sum across pages");
  assert.deepEqual(m.findings[0].pages, ["Navbar", "Footer"]);
  assert.equal(m.nodesWalked, 15);
  assert.equal(m.variableRefsChecked, 7);
});

test("mergeFindings keeps one ghost's distinct properties apart", () => {
  // `Font Size/6` was bound to lineHeight while `Font Size/4` was bound to fontSize, and
  // `Font Size/3` to paddingLeft. The mis-typing IS the diagnostic, so collapsing by id alone
  // would throw away the reason the rename happened.
  const m = mergeFindings(
    [{ page: "Navbar", nodes: 1, refs: 2, findings: [
      { id: "VariableID:1:1", kind: "ghost", property: "fontSize", name: "Font Size/4", boundOn: 1 },
      { id: "VariableID:1:1", kind: "ghost", property: "paddingLeft", name: "Font Size/4", boundOn: 1 },
    ] }],
    { pagesTotal: 1, auditedAt: "2026-08-11" },
  );
  assert.equal(m.findings.length, 2, "same id, different property = separate findings");
});

test("a new ghost is caught by the ratchet", () => {
  // Proves the comparison the second test relies on actually discriminates.
  const acceptedIds = new Set(["VariableID:known"]);
  const found = [{ id: "VariableID:known" }, { id: "VariableID:brand-new" }];
  const added = found.filter((f) => !acceptedIds.has(f.id));
  assert.equal(added.length, 1);
  assert.equal(added[0].id, "VariableID:brand-new");
});
