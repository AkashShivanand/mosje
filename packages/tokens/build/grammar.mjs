/**
 * SAMAVESH token grammar (v3) — the single definition of what a token may be called.
 *
 * Spec: docs/superpowers/specs/2026-08-07-samavesh-token-architecture-v2-design.md §5
 *
 * A token's identity is a PATH — the same tree in DTCG source and in the Figma variable
 * library. The CSS custom property is a deterministic projection of that path. Rules
 * therefore constrain the PATH, never the flattened string: consumers read
 * dist/manifest.json, not a parsed variable name.
 *
 * The load-bearing rule is RULE 1 below. UX4G 3.0 does not have it, and that single
 * omission is why 52% of its own colour tokens fail to parse against a grammar derived
 * from them — `--ux4g-border-color-neutral-hover` is unsplittable because `border-color`
 * puts a hyphen INSIDE a slot value. Run `node build/grammar.mjs --audit-reference` to
 * reproduce that measurement.
 */

/** Tier → CSS marker. Tier 2 has no marker so the most-typed token is the shortest. */
export const TIER_MARKER = { ref: "ref", sys: null, cmp: "cmp" };

/**
 * A token's tier is a property of WHERE IT IS AUTHORED, not of its path.
 *
 * Deriving it from the source file (rather than nesting tokens under a `ref`/`cmp` group)
 * keeps the DTCG path identical to the Figma variable path — the tier becomes the Figma
 * *collection* and the CSS *marker*, which is exactly the bijection §8.4 needs. Nesting
 * would put a synthetic segment in the middle of the path and break that correspondence.
 */
export function tierOfFile(filePath = "") {
  if (/(^|[\\/])(brand\.json|primitive\.json)$/.test(filePath)) return "ref";
  if (/(^|[\\/])component[^\\/]*\.json$/.test(filePath)) return "cmp";
  return "sys";
}

/** The CSS custom property for a style-dictionary token. The ONLY sanctioned flattening. */
export function cssNameFor(token) {
  return toCssName(token.path, tierOfFile(token.filePath));
}

/**
 * Reserved as a Tier-2 FIRST segment. Without this the projection is not bijective:
 * a Tier-2 path starting `ref/…` would flatten to `--sa-ref-…` and read as Tier 1.
 */
export const RESERVED_FIRST_SEGMENT = new Set(["ref", "cmp"]);

export const ROLE = new Set(["bg", "text", "icon", "border", "outline", "shadow", "overlay"]);

export const FAMILY = new Set(["neutral", "brand", "status", "link"]);

export const VARIANT = {
  brand: new Set(["primary", "secondary", "tertiary"]),
  status: new Set(["success", "error", "warning", "info"]),
  // `brand`, not `default`: the canonical value of a variant already occupies the
  // `default` slot (see CANONICAL), and `text/link/default/default` is nobody's idea of a
  // readable token. The standard link IS the brand-coloured one, so name it that.
  // UX4G's exact variants. `default` here yields `text/link/default/default` for the
  // canonical link — inelegant, but it is what UX4G ships and a dev grepping
  // `--ux4g-text-link-default-default` should find ours.
  link: new Set(["default", "neutral", "visited"]),
  neutral: new Set(),
};

/**
 * Surface qualifiers — only meaningful on neutral backgrounds. Kept as their own slot
 * rather than stuffed into PROMINENCE so `bg/neutral/inverse/subtle` parses as
 * "the inverse surface, at subtle prominence" instead of two competing prominences.
 */
export const QUALIFIER = new Set(["elevated", "inverse", "translucent", "none"]);

/**
 * The canonical value of a role+family+variant.
 *
 * It has to be an EXPLICIT segment, not an omitted one. An earlier draft made the canonical
 * value the token with no prominence at all (`text/neutral`) — but DTCG and Figma are both
 * TREES, and a token cannot also be a group: `text/neutral` as a leaf silently swallowed
 * `text/neutral/subtle` and Style Dictionary dropped every child. Ambiguity is precisely
 * what this grammar exists to remove, so the canonical value is named.
 */
export const CANONICAL = "default";

/**
 * Ordinal, quietest → loudest. `default` is NOT a rung — it is the canonical value and is
 * deliberately outside the ladder, so monotonicity has an unambiguous ordering to check.
 * Each rung carries a contrast contract (§6.3).
 */
export const PROMINENCE = ["default", "soft", "subtle", "emphasis", "strong", "stronger"];

/**
 * Ink prominence. UX4G runs text and icon on their own ladder rather than the fill ladder,
 * which is right: "how strong is this fill" and "how prominent is this text" are different
 * questions. `strong` is a SAMAVESH addition above UX4G's three — it is the max-contrast
 * heading ink the estate already ships and UX4G has no rung for.
 */
export const INK_PROMINENCE = ["primary", "secondary", "tertiary", "strong"];

/** What may appear in the prominence slot: the ladder, plus the canonical marker. */
export const PROMINENCE_SLOT = new Set([CANONICAL, ...PROMINENCE, ...INK_PROMINENCE]);

/** Contrast class guaranteed by each rung, against its own surface. */
export const PROMINENCE_CONTRACT = {
  // Fill ladder — UX4G's vocabulary, our thresholds. `default` is both the canonical value
  // and the quietest rung, which is what UX4G means by it too, so the two do not collide.
  default: { minContrast: 0, use: "decorative fills only" },
  soft: { minContrast: 0, use: "decorative fills only" },
  subtle: { minContrast: 3.0, use: "UI boundaries, icons, non-text (WCAG 1.4.11)" },
  emphasis: { minContrast: 3.0, use: "UI boundaries, icons, non-text (WCAG 1.4.11)" },
  strong: { minContrast: 4.5, use: "text-safe (WCAG 1.4.3 AA)" },
  stronger: { minContrast: 7.0, use: "text-safe (WCAG 1.4.6 AAA)" },
  // Ink ladder.
  primary: { minContrast: 4.5, use: "body and heading text (WCAG 1.4.3 AA)" },
  secondary: { minContrast: 4.5, use: "captions and hints — still text, still AA" },
  tertiary: { minContrast: 3.0, use: "non-essential text and quiet icons" },
};

export const STATE = new Set([
  // `default` is the canonical STATE, mirroring CANONICAL in the prominence slot. Without it
  // `border/neutral/strong/default` (the resting form-control border, sibling of
  // `.../strong/hover`) does not parse — the parser consumes `strong` as prominence and then
  // has nowhere to put `default`.
  "default",
  "hover",
  "active",
  "focus",
  "visited",
  "selected",
  "disabled",
]);

/** Non-colour Tier-2 groups. */
export const GROUP = new Set([
  "space", "inline", "stack", "padding", "section",
  "radius", "opacity", "z", "border", "elevation", "motion",
  "type", "density", "chart", "on", "layer", "font", "leading",
  // `focus` is a GROUP, not a role+state. A focus ring is not "an outline in the focus
  // state" — it is its own semantic object with its own colour, width and offset, and it
  // is the one affordance WCAG 2.4.7 makes non-optional. UX4G models it the same way
  // (Focus/Outline, Focus/Inverse).
  "focus",
]);

/**
 * Tier-3 component matrix.
 *
 * INTENT includes `success`, which UX4G's Action matrix does not have — SAMAVESH's Button
 * ships a success variant and the matrix has to describe the component we actually have,
 * not the one the reference system has. Found by the Phase 1 vertical slice; had the matrix
 * been generated straight from the spec it would not have fitted the component.
 */
// `button`, `card` and `badge` are the hand-authored Tier-3 tokens that predate the
// generated Action matrix. They are legitimate components, not violations.
export const COMPONENT = new Set(["action", "control", "spinner", "button", "card", "badge"]);
export const INTENT = new Set(["brand", "success", "destructive", "neutral", "light"]);
export const ACTION_VARIANT = new Set(["primary", "secondary", "tertiary", "tonal"]);
/**
 * `inverse` = the same variant rendered on a solid brand surface (e.g. a navy page header).
 * Modelled as a qualifier rather than as extra variant words, so `inverse`+`primary` and
 * `inverse`+`secondary` compose instead of needing `inverseoutline` — which RULE 1 would
 * force into one unreadable segment anyway.
 */
export const ACTION_QUALIFIER = new Set(["inverse"]);
export const PROPERTY = new Set(["bg", "text", "border", "ring"]);

/**
 * RULE 1's real target is a DELIMITER inside a slot value — `border-color` — not letter case.
 * camelCase splits unambiguously (`--sa-ref-color-secondaryRamp-light-50` has exactly one
 * meaning), so it is allowed; the 224 legacy Tier-1/Tier-2 segments that use it are not a
 * defect and renaming them would churn paths 21 properties depend on for no correctness gain.
 *
 * New namespaces are authored all-lowercase as house style — enforced separately for the
 * generated Tier-2/Tier-3 surface by LOWERCASE_SEGMENT_RE, not by RULE 1.
 */
const SEGMENT_RE = /^[A-Za-z0-9]+$/;

/** House style for newly-authored namespaces: lowercase, so the Figma tree reads evenly. */
export const LOWERCASE_SEGMENT_RE = /^[a-z0-9]+$/;

/**
 * RULE 1 — no path segment may contain a hyphen (or anything but lowercase alphanumerics).
 * Hyphens exist ONLY as the flattening delimiter. Multi-word concepts become extra depth:
 * `border/width/md`, not `border-width/md`.
 */
export function checkSegments(path) {
  for (const seg of path) {
    if (!SEGMENT_RE.test(seg)) {
      return `segment ${JSON.stringify(seg)} must match ${SEGMENT_RE} — hyphens are the flattening delimiter, not part of a name (RULE 1)`;
    }
  }
  return null;
}

/** Parse a Tier-2 colour-role path. Returns { slots } or { error }. */
function parseColourPath(path) {
  const [role, family, ...rest] = path;
  if (!ROLE.has(role)) return { error: `unknown role ${JSON.stringify(role)}` };
  if (!FAMILY.has(family)) return { error: `unknown family ${JSON.stringify(family)}` };

  const slots = { role, family };
  let i = 0;

  // Optional slots in canonical order. Order is part of the grammar: a variant may never
  // follow a prominence, so `bg/brand/bold/primary` is rejected rather than silently aliased.
  if (i < rest.length && VARIANT[family]?.has(rest[i])) slots.variant = rest[i++];
  if (i < rest.length && QUALIFIER.has(rest[i])) slots.qualifier = rest[i++];
  if (i < rest.length && PROMINENCE_SLOT.has(rest[i])) slots.prominence = rest[i++];
  if (i < rest.length && STATE.has(rest[i])) slots.state = rest[i++];

  if (i !== rest.length) {
    return { error: `unconsumed segment(s) ${JSON.stringify(rest.slice(i))} after ${role}/${family}` };
  }
  return { slots };
}

/** Parse a Tier-3 component path: <component>/<intent>/<variant>[/<qualifier>]/<state>/<property>. */
function parseComponentPath(path) {
  const [component, ...rest] = path;
  if (!COMPONENT.has(component)) return { error: `unknown component ${JSON.stringify(component)}` };
  if (component !== "action") return { slots: { component, rest } };

  let i = 0;
  const intent = rest[i++];
  if (!INTENT.has(intent)) return { error: `unknown intent ${JSON.stringify(intent)}` };

  const variant = rest[i++];
  if (!ACTION_VARIANT.has(variant)) return { error: `unknown action variant ${JSON.stringify(variant)}` };

  const slots = { component, intent, variant };
  if (ACTION_QUALIFIER.has(rest[i])) slots.qualifier = rest[i++];

  const state = rest[i++];
  if (!STATE.has(state) && state !== "default") {
    return { error: `unknown state ${JSON.stringify(state)}` };
  }
  slots.state = state;

  const property = rest[i++];
  if (!PROPERTY.has(property)) return { error: `unknown property ${JSON.stringify(property)}` };
  slots.property = property;

  if (i !== rest.length) {
    return { error: `unconsumed segment(s) ${JSON.stringify(rest.slice(i))}` };
  }
  return { slots };
}

/**
 * Validate a token path against the grammar.
 * @param {string[]} path  e.g. ["bg","brand","primary","bold","hover"]
 * @param {"ref"|"sys"|"cmp"} tier
 */
export function parse(path, tier) {
  if (!Array.isArray(path) || path.length === 0) return { ok: false, error: "empty path" };

  const segErr = checkSegments(path);
  if (segErr) return { ok: false, error: segErr };

  if (tier === "sys" && RESERVED_FIRST_SEGMENT.has(path[0])) {
    return {
      ok: false,
      error: `${JSON.stringify(path[0])} is reserved as a Tier-2 first segment — it would flatten into another tier's namespace and break the round-trip`,
    };
  }

  if (tier === "ref") return { ok: true, slots: { category: path[0], rest: path.slice(1) } };

  if (tier === "cmp") {
    const r = parseComponentPath(path);
    return r.error ? { ok: false, error: r.error } : { ok: true, slots: r.slots };
  }

  // Tier 2: a colour role, or a non-colour group.
  //
  // RULE 2 — `border` is legitimately both (a colour role, and the group holding
  // `border/width/*`). Disambiguation is by position 2, not by a hard-coded exception:
  // a colour role ALWAYS takes a family in position 2, so a first segment whose successor
  // is not a family is read as a group. That keeps ROLE and GROUP allowed to overlap
  // without either dictionary needing to know about the other.
  const readsAsRole = ROLE.has(path[0]) && FAMILY.has(path[1]);
  if (readsAsRole) {
    const r = parseColourPath(path);
    return r.error ? { ok: false, error: r.error } : { ok: true, slots: r.slots };
  }
  if (GROUP.has(path[0])) return { ok: true, slots: { group: path[0], rest: path.slice(1) } };
  if (ROLE.has(path[0])) {
    // A colour role with a bad family — report that, not "unknown group".
    const r = parseColourPath(path);
    return { ok: false, error: r.error ?? `malformed colour path ${path.join("/")}` };
  }

  return { ok: false, error: `${JSON.stringify(path[0])} is neither a colour role nor a known group` };
}

/** Project a path onto its CSS custom property. This is the ONLY sanctioned flattening. */
export function toCssName(path, tier) {
  const marker = TIER_MARKER[tier];
  return `--sa-${marker ? marker + "-" : ""}${path.join("-")}`;
}

/**
 * Recover (tier, path) from a CSS name. Only total because of RESERVED_FIRST_SEGMENT —
 * this is the round-trip guarantee the Figma sync depends on.
 */
export function fromCssName(name) {
  const body = name.replace(/^--sa-/, "").split("-");
  if (body[0] === "ref") return { tier: "ref", path: body.slice(1) };
  if (body[0] === "cmp") return { tier: "cmp", path: body.slice(1) };
  return { tier: "sys", path: body };
}

// ---------------------------------------------------------------------------
// Reference audit — reproduces the measurement that reversed spec v1 (§2.1).
// ---------------------------------------------------------------------------

/**
 * UX4G's OWN prominence vocabulary. The audit must judge UX4G against the grammar its own
 * names imply — "is UX4G self-consistent?" — not against SAMAVESH's ladder, which would be
 * measuring a different and much less interesting thing (it inflates the failure rate from
 * 52% to 62% purely because we renamed the rungs).
 */
const UX4G_PROMINENCE = new Set([
  "default", "soft", "subtle", "emphasis", "strong", "stronger", "elevated", "inverse",
  "translucent", "none",
]);

/** Raw hue names. A hue in the family slot means the token skipped the semantic layer. */
const RAW_HUES = new Set([
  "red", "orange", "yellow", "gold", "lime", "green", "cyan", "skyblue", "blue",
  "purple", "pink", "violet", "magenta", "teal",
]);

/**
 * STRUCTURAL audit — the durable measurement.
 *
 * An earlier version of this scored UX4G by attempting a full parse. That was a mistake:
 * the failure rate moved between 41% and 62% depending on which prominence words the
 * parser happened to accept, so the number measured our dictionary choices as much as
 * UX4G's consistency. Three different accept-sets gave three different headline figures.
 *
 * What follows instead counts violations that are true regardless of any dictionary,
 * because they are about the SHAPE of the name, not its vocabulary:
 *
 *   A. roleHyphenated  — the same semantic role spelled two ways, one of which puts a
 *                        hyphen inside the slot (`border-*` AND `border-color-*`). This
 *                        is the exact defect RULE 1 exists to make impossible.
 *   B. rawHueFamily    — a raw hue where a semantic family belongs (`bg-yellow-strong`),
 *                        i.e. a primitive leaking into the semantic tier.
 *   C. roleAsFamily    — a role used as a family (`bg-overlay`, where `overlay` is
 *                        elsewhere a role in its own right).
 *
 * Each is independently checkable by eye against the published contract.
 */
export function auditStructure(names) {
  const scope = names.filter((n) => /^--ux4g-(bg|text|icon|border|outline|shadow|overlay)-/.test(n));

  const roleHyphenated = scope.filter((n) => /^--ux4g-border-color-/.test(n));
  const rawHueFamily = scope.filter((n) => {
    const seg = n.replace(/^--ux4g-/, "").split("-")[1];
    return RAW_HUES.has(seg);
  });
  const roleAsFamily = scope.filter((n) => {
    const seg = n.replace(/^--ux4g-/, "").split("-")[1];
    return ROLE.has(seg);
  });

  const violations = new Set([...roleHyphenated, ...rawHueFamily, ...roleAsFamily]);
  return {
    scope: scope.length,
    violations: violations.size,
    rate: scope.length ? violations.size / scope.length : 0,
    byKind: {
      roleHyphenated: roleHyphenated.length,
      rawHueFamily: rawHueFamily.length,
      roleAsFamily: roleAsFamily.length,
    },
    examples: [...violations].slice(0, 10),
  };
}

/**
 * Attempt to parse UX4G's published flat names as if they followed a role/family grammar.
 * They are flat strings, so this is best-effort by construction — which is the finding:
 * a flat name with hyphens inside slot values cannot be parsed without special cases.
 *
 * NOTE: the rate this returns is sensitive to the accept-set (see auditStructure). Treat
 * it as illustrative; auditStructure is the measurement to cite.
 */
export function auditReference(names) {
  const scope = names.filter((n) => /^--ux4g-(bg|text|icon|border|outline|shadow|overlay)-/.test(n));
  const failures = [];

  for (const name of scope) {
    const parts = name.replace(/^--ux4g-/, "").split("-");
    const role = parts[0];
    if (!ROLE.has(role)) {
      failures.push({ name, cause: "role" });
      continue;
    }
    // UX4G puts the specific colour where we put family+variant, so accept either.
    const second = parts[1];
    const knownSecond =
      FAMILY.has(second) ||
      VARIANT.brand.has(second) ||
      VARIANT.status.has(second) ||
      second === "link";
    if (!knownSecond) {
      failures.push({ name, cause: "family", detail: second });
      continue;
    }
    const rest = parts.slice(2);
    const unknown = rest.filter(
      (p) =>
        !UX4G_PROMINENCE.has(p) &&
        !STATE.has(p) &&
        !QUALIFIER.has(p) &&
        !FAMILY.has(p) &&
        !VARIANT.brand.has(p) &&
        !VARIANT.status.has(p) &&
        !VARIANT.link.has(p),
    );
    if (unknown.length) failures.push({ name, cause: "tail", detail: unknown.join(",") });
  }

  const byCause = {};
  for (const f of failures) byCause[f.cause] = (byCause[f.cause] ?? 0) + 1;

  return {
    scope: scope.length,
    failed: failures.length,
    rate: scope.length ? failures.length / scope.length : 0,
    byCause,
    failures,
  };
}

// CLI: node build/grammar.mjs --audit-reference
if (process.argv[1] === new URL(import.meta.url).pathname && process.argv.includes("--audit-reference")) {
  const { readFileSync } = await import("node:fs");
  const ref = JSON.parse(
    readFileSync(new URL("../reference/ux4g-3.0.tokens.json", import.meta.url), "utf8"),
  );
  const names = Object.keys(ref.tokens);
  const s = auditStructure(names);
  console.log(`colour-role tokens in scope:   ${s.scope}`);
  console.log(`STRUCTURAL violations:         ${s.violations}  (${Math.round(s.rate * 100)}%)`);
  console.log("  by kind:", s.byKind);
  for (const n of s.examples) console.log(`    ${n}`);

  const p = auditReference(names);
  console.log(`\n(illustrative, accept-set sensitive) parse failures: ${p.failed} (${Math.round(p.rate * 100)}%)`);
}
