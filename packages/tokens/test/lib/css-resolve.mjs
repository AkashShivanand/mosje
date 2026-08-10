/**
 * Resolve a generated CSS custom-property sheet down to literal values.
 *
 * The visual contract of this package is NOT the token names — those are allowed to
 * move. It is what each custom property finally *computes to*, in every selector
 * context a page can be in. This module turns the flat generated sheet into exactly
 * that: `{ selector -> { property -> literal } }`, with every `var()` chain followed
 * to the end.
 *
 * Two failure modes it is built to catch, both of which have bitten this package:
 *   - a `var()` chain that gets flattened to a literal and so stops responding to
 *     `[data-theme]` (the literal shows up identically in every context, so a token
 *     that USED to differ per context and no longer does is a diff);
 *   - a chain that silently dead-ends, which surfaces as `<unresolved:--name>`
 *     rather than quietly rendering as nothing.
 */

/** Strip comments and split the sheet into `{ selector, decls }` in document order. */
function parseBlocks(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [];
  const blockRe = /([^{}]+)\{([^{}]*)\}/g;
  let match;

  while ((match = blockRe.exec(stripped)) !== null) {
    const decls = new Map();
    for (const line of match[2].split(";")) {
      const colon = line.indexOf(":");
      if (colon === -1) continue;
      const prop = line.slice(0, colon).trim();
      if (!prop.startsWith("--")) continue;
      decls.set(prop, line.slice(colon + 1).trim());
    }
    blocks.push({ selector: normalise(match[1]), decls });
  }
  return blocks;
}

/** Index of the `)` matching the `(` at `open`. */
function matchParen(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")" && --depth === 0) return i;
  }
  return -1;
}

/** Split `--name, fallback` on the first top-level comma. */
function splitArgs(inner) {
  let depth = 0;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      return [inner.slice(0, i).trim(), inner.slice(i + 1).trim()];
    }
  }
  return [inner.trim(), null];
}

function resolveValue(value, decls, seen) {
  let out = "";
  let i = 0;

  while (i < value.length) {
    const start = value.indexOf("var(", i);
    if (start === -1) {
      out += value.slice(i);
      break;
    }
    out += value.slice(i, start);

    const end = matchParen(value, start + 3);
    if (end === -1) {
      // Unbalanced parens: emit verbatim rather than guessing.
      out += value.slice(start);
      break;
    }

    const [name, fallback] = splitArgs(value.slice(start + 4, end));
    out += resolveName(name, fallback, decls, seen);
    i = end + 1;
  }
  return out;
}

function resolveName(name, fallback, decls, seen) {
  if (seen.has(name)) return `<cycle:${name}>`;
  if (decls.has(name)) {
    return resolveValue(decls.get(name), decls, new Set(seen).add(name));
  }
  if (fallback !== null) return resolveValue(fallback, decls, seen);
  return `<unresolved:${name}>`;
}

const normalise = (value) => value.replace(/\s+/g, " ").trim();

/**
 * Which theming axis a selector belongs to. Axes are independent switches that a real
 * page sets TOGETHER — a portal in dark mode is `data-brand` and `data-theme` and
 * `data-surface` all at once — so they have to be enumerated as a product, not a list.
 */
function axisOf(selector) {
  if (selector === ":root") return "root";
  if (/data-theme/.test(selector)) return "theme";
  if (/data-brand|data-color-mode/.test(selector)) return "brand";
  if (/data-density/.test(selector)) return "density";
  if (/data-surface/.test(selector)) return "surface";
  return "other";
}

/** Resolve one context: `:root` overlaid by `active` selectors, in DOCUMENT order. */
function resolveContext(blocks, root, active) {
  const effective = new Map(root);

  // Document order, not the order we happened to assemble the combination in — the
  // sheet decides which block wins when two declare the same property, not us.
  for (const block of blocks) {
    if (!active.has(block.selector)) continue;
    for (const [prop, value] of block.decls) effective.set(prop, value);
  }

  const resolved = {};
  for (const prop of [...effective.keys()].sort()) {
    resolved[prop] = normalise(resolveValue(effective.get(prop), effective, new Set([prop])));
  }
  return resolved;
}

function rootDecls(blocks) {
  const root = new Map();
  for (const block of blocks) {
    if (block.selector !== ":root") continue;
    for (const [prop, value] of block.decls) root.set(prop, value);
  }
  return root;
}

/**
 * Build the resolved contract for every single selector context in the sheet.
 *
 * This is what gets PINNED to the fixture. Combinations are covered separately, by an
 * invariant rather than by 4.5x more pinned values — see resolveAxisCombinations.
 *
 * @returns {Record<string, Record<string, string>>} selector -> property -> literal
 */
export function resolveContract(css) {
  const blocks = parseBlocks(css);
  const root = rootDecls(blocks);

  const contract = {};
  for (const selector of [...new Set(blocks.map((b) => b.selector))]) {
    contract[selector] = resolveContext(blocks, root, new Set(selector === ":root" ? [] : [selector]));
  }
  return contract;
}

/**
 * Resolve every COMBINATION of theming axes a real page can be in — a portal renders
 * `data-brand` and `data-theme` and `data-surface` at once, not one at a time.
 *
 * This exists because 41 properties in this sheet are declared by both the brand axis
 * and the theme axis (including tokens the 2026-08-10 rename touched), so "dark" and
 * "navy" both have an opinion about them. Today the axes layer cleanly: every combined
 * value equals the value from one of its own active axes. That is an invariant worth
 * asserting rather than a table worth pinning — pinning it would add ~30,000 values
 * that are all duplicates of single-axis values, and would go stale as noise.
 *
 * @returns {Array<{key: string, active: string[], resolved: Record<string, string>}>}
 */
export function resolveAxisCombinations(css) {
  const blocks = parseBlocks(css);
  const root = rootDecls(blocks);

  const axes = new Map();
  for (const block of blocks) {
    const axis = axisOf(block.selector);
    if (axis === "root") continue;
    if (!axes.has(axis)) axes.set(axis, []);
    if (!axes.get(axis).includes(block.selector)) axes.get(axis).push(block.selector);
  }

  let combos = [[]];
  for (const [, selectors] of axes) {
    combos = combos.flatMap((combo) => [combo, ...selectors.map((s) => [...combo, s])]);
  }

  return combos
    .filter((combo) => combo.length > 1) // singles and :root are already pinned
    .map((combo) => ({
      key: combo.join(" + "),
      active: combo,
      resolved: resolveContext(blocks, root, new Set(combo)),
    }));
}
