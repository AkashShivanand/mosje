/**
 * The Figma restructure, computed as a reviewable plan before anything is mutated.
 *
 * WHY A PLAN AND NOT A SCRIPT
 *
 * The live library is PUBLISHED. Its consumers are other files — the portal handoffs, the
 * design-QC file, the audit projects — and a plugin running inside the library cannot see
 * their bindings. So "is this variable safe to delete?" is not a risky question, it is an
 * UNANSWERABLE one, and any restructure that deletes is unverifiable by construction.
 *
 * Figma also refuses to move a variable between collections: `variableCollectionId` is
 * get-only (probed, not assumed). Moving means delete + recreate, which detaches every
 * binding in every consuming file.
 *
 * Those two facts together decide the method:
 *
 *   RENAME, never recreate. A rename preserves the variable id, so every binding in every
 *   file follows automatically. The tier then lives in the NAME TREE — `ref/…`, plain,
 *   `cmp/…` — which is navigable in Figma's variable picker exactly like a collection is,
 *   and which is the one axis Figma will actually let us restructure.
 *
 * WHAT CANONICAL MEANS HERE
 *
 * Spec §5.1: the path is the token's identity and every other form is a projection of it.
 * This module makes that literally true of Figma — the variable name IS the DTCG path,
 * `/`-delimited, so the Figma tree and the source tree are the same tree. That is what makes
 * the round-trip bijective instead of dependent on the hand-written mapping table in
 * figma-variables.mjs, where 435 of 669 names diverged from their own path.
 */

import { readFileSync } from "node:fs";
import { tierOfFile, checkSegments } from "./grammar.mjs";
import { index } from "./token-index.mjs";
import { figmaNameFor } from "./formats/figma-variables.mjs";

const liveSnapshot = () =>
  JSON.parse(readFileSync(new URL("../reference/figma-live.json", import.meta.url), "utf8"));

/**
 * Tier marker as the first path segment.
 *
 * Figma will not let a variable change collection, so the collection cannot carry the tier.
 * The name tree can, and a designer reading `cmp/action/brand/primary/hover/bg` knows without
 * being told that it is component-internal and not a token to reach for. This is the same
 * information §4.1 wanted from six collections, expressed on the axis Figma permits.
 */
export function canonicalFigmaName(path, tier) {
  const segs = tier === "sys" ? path : [tier, ...path];
  return segs.join("/");
}

/**
 * Live names that exist in Figma but not in the code index.
 *
 * These are the Figma-native primitives designers bind to directly — `Text/Dark` alone has
 * over a thousand bindings — plus a handful of pre-pipeline leftovers. They are NOT
 * exceptions to the naming rule; they are tokens the code does not own yet. Each gets an
 * explicit canonical home so the library has one vocabulary rather than two.
 *
 * Anything not listed here is reported, never silently renamed: a guessed rename on a
 * thousand-binding variable is exactly the class of change that must not be automated.
 */
export const NATIVE_RENAMES = {
  Color: {
    "Text/Dark": "ref/color/ink/dark",
    "Text/Light": "ref/color/ink/light",
    "Text/Primary": "ref/color/ink/primary",
    "Text/Secondary": "ref/color/ink/secondary",
    "Text/Hint": "ref/color/ink/hint",
    "Text/Disabled": "ref/color/ink/disabled",
    "Text/Success": "ref/color/ink/success",
    "Text/Error": "ref/color/ink/error",
    "Text/Warning": "ref/color/ink/warning",
    "Neutral/0 - White": "ref/color/neutral/0",
    "Badge/Beta": "ref/color/badge/beta",
    "Border/Neutral/Inverse": "border/neutral/inverse",
    "Focus/Ring": "focus/ring",
  },
  Typography: {
    // Superseded by font/family/latin and font/family/display, kept as bound aliases.
    "font-family/heading": "ref/font/family/heading",
    "font-family/body": "ref/font/family/body",
  },
};

/** `Stroke/300`, `Primary/Source`, `White Transparent/24%` → a canonical ref path. */
function nativeRampName(name) {
  const m = /^([A-Za-z ]+?)(?: Transparent)?\/(\d+%?|Source)$/.exec(name);
  if (!m) return null;
  const family = m[1].trim().toLowerCase().replace(/\s+/g, "");
  const step = m[2].toLowerCase();
  const alpha = / Transparent\//.test(name);
  if (step === "source") return `ref/color/${family}/source`;
  if (alpha) return `ref/color/${family}/a/${step.replace("%", "")}`;
  return `ref/color/${family}/${step}`;
}

/**
 * Compute the full rename plan.
 *
 * @returns {{plan: object, collisions: string[], unmapped: string[], stats: object}}
 */
export function buildRenamePlan() {
  const live = liveSnapshot();
  const plan = {};
  const collisions = [];
  const unmapped = [];
  let unchanged = 0;

  // 1. Everything the code owns: current projection → canonical path.
  const claimed = new Map(); // "Collection::newName" → source, to catch two tokens colliding
  for (const { path, filePath } of index()) {
    const tier = tierOfFile(filePath);
    const target = figmaNameFor(path, tier);
    if (!target) continue;
    const from = target.name;
    const to = canonicalFigmaName(path, tier);

    const segErr = checkSegments(path);
    if (segErr) {
      // A path that breaks RULE 1 must be fixed in the SOURCE first — projecting it into
      // Figma would import the defect rather than remove it.
      unmapped.push(`${target.collection}::${from} — source path breaks RULE 1: ${segErr}`);
      continue;
    }
    if (!live[target.collection]?.includes(from)) continue; // not in the library yet

    const key = `${target.collection}::${to}`;
    if (claimed.has(key) && claimed.get(key) !== from) {
      collisions.push(`${key} claimed by both "${claimed.get(key)}" and "${from}"`);
      continue;
    }
    claimed.set(key, from);
    if (from === to) { unchanged++; continue; }
    (plan[target.collection] ??= []).push({ from, to });
  }

  // 2. Everything Figma owns that the code does not.
  const codeOwned = new Set(
    Object.entries(plan).flatMap(([c, rs]) => rs.map((r) => `${c}::${r.from}`)),
  );
  for (const [collection, names] of Object.entries(live)) {
    if (collection.startsWith("$")) continue;
    for (const from of names) {
      if (codeOwned.has(`${collection}::${from}`)) continue;
      if (claimed.has(`${collection}::${from}`)) continue;
      const explicit = NATIVE_RENAMES[collection]?.[from];
      const to = explicit ?? nativeRampName(from);
      if (!to) {
        if (![...claimed.keys()].some((k) => k.startsWith(`${collection}::`) && claimed.get(k) === from)) {
          unmapped.push(`${collection}::${from} — no canonical home; decide explicitly before renaming`);
        }
        continue;
      }
      const key = `${collection}::${to}`;
      if (claimed.has(key)) {
        collisions.push(`${key} claimed by both "${claimed.get(key)}" and "${from}"`);
        continue;
      }
      claimed.set(key, from);
      if (from === to) { unchanged++; continue; }
      (plan[collection] ??= []).push({ from, to });
    }
  }

  // 3. A rename plan whose targets are not unique would silently merge two variables.
  for (const [collection, renames] of Object.entries(plan)) {
    const seen = new Map();
    for (const { from, to } of renames) {
      if (seen.has(to)) collisions.push(`${collection}::${to} is the target of both "${seen.get(to)}" and "${from}"`);
      seen.set(to, from);
    }
  }

  const stats = {
    renames: Object.values(plan).reduce((n, r) => n + r.length, 0),
    unchanged,
    collisions: collisions.length,
    unmapped: unmapped.length,
    byCollection: Object.fromEntries(Object.entries(plan).map(([c, r]) => [c, r.length])),
  };
  return { plan, collisions, unmapped, stats };
}
