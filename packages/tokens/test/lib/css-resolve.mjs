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
 * Build the resolved contract for every selector context in the sheet.
 *
 * A non-root context is `:root` overlaid by that selector's own declarations, which
 * is how the cascade actually applies them — so `[data-theme="dark"]` resolves a
 * chain through its own overrides even when only the far end of the chain is
 * redeclared.
 *
 * @returns {Record<string, Record<string, string>>} selector -> property -> literal
 */
export function resolveContract(css) {
  const blocks = parseBlocks(css);

  const root = new Map();
  for (const block of blocks) {
    if (block.selector === ":root") {
      for (const [prop, value] of block.decls) root.set(prop, value);
    }
  }

  const contract = {};
  for (const selector of [...new Set(blocks.map((b) => b.selector))]) {
    const effective = new Map(root);
    if (selector !== ":root") {
      for (const block of blocks) {
        if (block.selector !== selector) continue;
        for (const [prop, value] of block.decls) effective.set(prop, value);
      }
    }

    const resolved = {};
    for (const prop of [...effective.keys()].sort()) {
      resolved[prop] = normalise(resolveValue(effective.get(prop), effective, new Set([prop])));
    }
    contract[selector] = resolved;
  }
  return contract;
}
