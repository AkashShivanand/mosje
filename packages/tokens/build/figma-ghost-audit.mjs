/**
 * Ghost-binding audit — the check `figma-roundtrip.test.mjs` structurally cannot perform.
 *
 * THE BUG THIS EXISTS FOR (found 2026-08-11, on Navbar and Footer)
 * ---------------------------------------------------------------
 * The 2026-08 rename to canonical DTCG paths created `ref/font/size/16` and friends, and
 * deleted the old `Font Size/3`, `Line Heights/11`, `Letter Spacing/5`. The variable table
 * migrated. The canvas did not: 11 text nodes stayed bound to the DELETED variables.
 *
 * Figma keeps a deleted variable resolvable by id for as long as something is bound to it, so
 * those nodes kept rendering and looked bound in the inspector — while being:
 *
 *   - absent from `collection.variableIds`   (Type reported 108; the ghosts were not among them)
 *   - absent from `getLocalVariablesAsync()` (864 locals; likewise absent)
 *   - unreachable by the sync pipeline, so no `@mosje/tokens` build would ever update them
 *   - still `hiddenFromPublishing: false` in two cases, so CONSUMING files could bind them too
 *
 * Worse, the old scheme was type-incorrect and the error was still live: `Font Size/6` was
 * bound to `lineHeight` and `Font Size/1` to `paragraphSpacing`. That mis-typing is presumably
 * why the rename happened, and it survived the rename by hiding on the canvas.
 *
 * WHY THE EXISTING TESTS COULD NOT SEE IT
 * ---------------------------------------
 * Every check in this package enumerates FROM `collection.variableIds` — the exporter builds
 * its payload from it, and the roundtrip test compares that payload to the authored source. A
 * ghost is by definition not in that list, so the entire suite is blind to it by construction.
 * Adding more assertions over the same enumeration could never have caught this. The audit has
 * to start from the CANVAS and look up, not from the token source and look down.
 *
 * WHAT IT CHECKS
 * --------------
 * Deliberately wider than the bug that prompted it. The defect was found in text properties,
 * but nothing about the mechanism is specific to type — a fill, a corner radius or an
 * auto-layout gap can reference a deleted variable exactly the same way, and so can one
 * variable aliasing another. So the audit collects every variable reference reachable from:
 *
 *   1. `node.boundVariables` on every node, every property, scalar and array-valued alike
 *      (`fills`/`strokes` bind as arrays; text properties bind as scalars).
 *   2. Local text, paint and effect styles' own `boundVariables`.
 *   3. Variable-to-variable aliases in `valuesByMode`, across every mode.
 *
 * ...and reports any referenced id that no local collection lists. Nodes inside instances are
 * INCLUDED: an instance can carry a local override that binds a ghost independently of its
 * main component, and that override is exactly as invisible to the pipeline.
 *
 * HOW TO RUN IT
 * -------------
 * Figma's Plugin API loads pages incrementally and forbids more than one
 * `setCurrentPageAsync` per execution, so this is one call per page. Run `pageScript(i)` for
 * every i in `0..figma.root.children.length - 1` via the Figma MCP's `use_figma`, then feed
 * the results to `mergeFindings()` and write the result into
 * `reference/figma-live.json` under `$ghostAudit`. `figma-ghost-bindings.test.mjs` asserts
 * against that record, so a refresh of the snapshot re-arms the guard.
 */

/** Properties that bind as arrays rather than scalars — one alias per paint/effect. */
export const ARRAY_BOUND_PROPS = ["fills", "strokes", "effects", "layoutGrids", "componentProperties"];

/**
 * The audit script for a single page, as source to hand to `use_figma`.
 *
 * Returns `{ page, index, nodes, refs, findings }` where `findings` is one entry per distinct
 * (variableId, property) pair that resolves to a variable no collection contains. `refs` is the
 * total number of variable references seen, so a run that silently walked nothing is visible as
 * `refs: 0` rather than passing as "no findings".
 */
export function pageScript(pageIndex) {
  return `
const IDX = ${pageIndex};
const page = figma.root.children[IDX];
await figma.setCurrentPageAsync(page);

// Every id any local collection admits to owning. Anything referenced but not in here is a ghost.
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const live = new Set(cols.flatMap((c) => c.variableIds));

const ids = (v) => (Array.isArray(v) ? v : [v]).filter((x) => x && x.id).map((x) => x.id);
const seen = new Map(); // "id::prop" -> count
let refs = 0;
const note = (id, prop) => {
  refs++;
  if (live.has(id)) return;
  const k = id + "::" + prop;
  seen.set(k, (seen.get(k) || 0) + 1);
};

// 1. every node, every bound property — instances included (local overrides bind independently)
let nodes = 0;
for (const n of page.findAll(() => true)) {
  nodes++;
  for (const [prop, b] of Object.entries(n.boundVariables || {})) {
    // componentProperties nests one level deeper: { propName: { type, id } }
    if (b && !Array.isArray(b) && !b.id) {
      for (const inner of Object.values(b)) for (const id of ids(inner)) note(id, prop);
      continue;
    }
    for (const id of ids(b)) note(id, prop);
  }
}

// 2. local styles carry their own bindings, and are published independently of any node.
//    Also file-global — scoped to index 0 so styles are not counted once per page.
if (IDX === 0) {
  const styles = [
    ...(await figma.getLocalTextStylesAsync()),
    ...(await figma.getLocalPaintStylesAsync()),
    ...(await figma.getLocalEffectStylesAsync()),
  ];
  for (const s of styles) {
    for (const [prop, b] of Object.entries(s.boundVariables || {})) {
      for (const id of ids(b)) note(id, "style:" + prop);
    }
  }
}

// 3. variable -> variable aliases, across every mode of every collection.
//    File-global rather than per-page, so it runs once (on index 0) instead of 68 times.
if (IDX === 0) {
  for (const c of cols) {
    for (const vid of c.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(vid).catch(() => null);
      if (!v) continue;
      for (const val of Object.values(v.valuesByMode)) {
        if (val && val.type === "VARIABLE_ALIAS") note(val.id, "alias:" + v.name);
      }
    }
  }
}

// Not everything outside the local collections is a ghost. Three distinct kinds:
//
//   ghost        resolvable, remote === false, absent from every local collection.
//                A DELETED LOCAL VARIABLE. This is the defect — permanently detached from
//                the token pipeline while still rendering.
//   foreign      remote === true. An imported variable from another library. A legitimate
//                mechanism, but reported because this file is meant to be the canonical
//                source: a component binding another library's \`radius-md\` is a governance
//                question, not a broken binding.
//   unresolvable getVariableByIdAsync returns null. A dangling reference to nothing.
//
// Treating foreign as ghost was the first version's bug — it flagged every cross-library
// reference, drowning the real signal on pages that legitimately import.
const findings = [];
for (const [k, count] of seen) {
  const [id, prop] = k.split("::");
  const v = await figma.variables.getVariableByIdAsync(id).catch(() => null);
  const kind = !v ? "unresolvable" : v.remote ? "foreign" : "ghost";
  findings.push({
    id,
    kind,
    property: prop,
    name: v ? v.name : "(unresolvable)",
    stillPublished: v ? !v.hiddenFromPublishing : null,
    boundOn: count,
  });
}
return { page: page.name, index: IDX, nodes, refs, findings };
`.trim();
}

/**
 * Fold per-page results into the `$ghostAudit` record stored in `reference/figma-live.json`.
 *
 * `pagesScanned` vs `pagesTotal` is load-bearing: the failure mode of a manual, per-page audit
 * is a page quietly skipped (a timeout, a missed index), which would otherwise read as a clean
 * result. The test asserts the two are equal, so partial coverage fails instead of passing.
 */
export function mergeFindings(pageResults, { pagesTotal, auditedAt }) {
  const byKey = new Map();
  for (const r of pageResults) {
    for (const f of r.findings || []) {
      const k = `${f.id}::${f.property}`;
      const prev = byKey.get(k);
      if (prev) {
        prev.boundOn += f.boundOn;
        if (!prev.pages.includes(r.page)) prev.pages.push(r.page);
      } else {
        byKey.set(k, { ...f, pages: [r.page] });
      }
    }
  }
  return {
    auditedAt,
    pagesScanned: pageResults.length,
    pagesTotal,
    nodesWalked: pageResults.reduce((n, r) => n + (r.nodes || 0), 0),
    variableRefsChecked: pageResults.reduce((n, r) => n + (r.refs || 0), 0),
    findings: [...byKey.values()].sort((a, b) => b.boundOn - a.boundOn),
  };
}
