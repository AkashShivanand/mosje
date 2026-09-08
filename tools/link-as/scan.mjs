/**
 * Finding a JSX opening tag, and reading the props off it.
 *
 * Split out of `check.mjs` so the scan can be unit-tested on its own. The gate
 * itself is a file walk and a report; THIS is the part that can be quietly
 * wrong, and was.
 *
 * ── WHY THIS IS NOT A ONE-LINE SCAN ─────────────────────────────────────────
 *
 * The first version found a tag's end with "the first `>` at brace depth zero".
 * That is correct for the tags people usually write and wrong for the ones that
 * carry an explanation, because a `>` inside a comment or a string ends the
 * scan early and everything after it — including `linkAs={Link}` — becomes
 * invisible to the gate.
 *
 * Both directions are defects and only one of them is loud:
 *
 *   FALSE POSITIVE — a tag that passes `linkAs` after the comment is reported
 *   as a bare anchor. Annoying, and self-announcing; somebody investigates.
 *
 *   FALSE NEGATIVE — a tag that is MISSING `linkAs` after the comment passes
 *   the gate, because the scan stopped before the place the prop was not. That
 *   is silent, and it is exactly the full-page-reload defect this gate exists
 *   to catch. `OrganisationUpdates.tsx` carried a note telling maintainers to
 *   keep `>` out of its comments to stay on the right side of this.
 *
 * So the scan skips what a tokenizer would skip: block comments, line comments,
 * and single-, double- and backtick-quoted strings (template holes included,
 * since `${}` can nest a whole expression). It also ends on `/>`, which the
 * depth-zero `>` rule got right only by accident.
 */

/** Index of the closing quote of the string starting at `i`, or the last index scanned. */
function endOfString(src, i) {
  const quote = src[i];
  for (let j = i + 1; j < src.length; j++) {
    const c = src[j];
    if (c === "\\") {
      j++;
      continue;
    }
    if (c === quote) return j;
    if (quote === "`" && c === "$" && src[j + 1] === "{") {
      j = endOfHole(src, j + 1);
      continue;
    }
    // A quoted string cannot span a newline. Treating an unterminated one as
    // running to end of file would hide the rest of the estate from the gate.
    if (quote !== "`" && c === "\n") return j - 1;
  }
  return src.length;
}

/** Index of the `}` closing the `${` hole (or brace expression) opening at `i`. */
function endOfHole(src, i) {
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    const skipped = skipTrivia(src, j);
    if (skipped !== j) {
      j = skipped;
      continue;
    }
    const c = src[j];
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return j;
  }
  return src.length;
}

/**
 * If a comment or string starts at `j`, the last index it occupies; otherwise `j`.
 * Callers compare the result against `j` to know whether anything was skipped.
 */
function skipTrivia(src, j) {
  const c = src[j];
  if (c === "/" && src[j + 1] === "*") {
    const end = src.indexOf("*/", j + 2);
    return end === -1 ? src.length : end + 1;
  }
  if (c === "/" && src[j + 1] === "/") {
    const end = src.indexOf("\n", j + 2);
    return end === -1 ? src.length : end;
  }
  if (c === '"' || c === "'" || c === "`") return endOfString(src, j);
  return j;
}

/**
 * The opening tag starting at `i`.
 *
 * Ends at `/>` or at a `>` outside braces, comments and strings — see the
 * header. A tag that never closes returns the rest of the source, which fails
 * loudly rather than silently passing.
 */
export function openingTag(src, i) {
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    const skipped = skipTrivia(src, j);
    if (skipped !== j) {
      j = skipped;
      continue;
    }
    const c = src[j];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (depth === 0 && c === "/" && src[j + 1] === ">") return src.slice(i, j + 2);
    else if (depth === 0 && c === ">") return src.slice(i, j + 1);
  }
  return src.slice(i);
}

/**
 * The tag with its comments removed, for reading props off.
 *
 * A comment is prose about the tag, not part of its API: now that comments no
 * longer cut the scan short, a sentence mentioning `linkAs={Link}` inside one
 * would otherwise satisfy the gate for a tag that never passes the prop.
 */
export function tagWithoutComments(tag) {
  let out = "";
  for (let j = 0; j < tag.length; j++) {
    const c = tag[j];
    if (c === "/" && (tag[j + 1] === "*" || tag[j + 1] === "/")) {
      j = skipTrivia(tag, j);
      // A newline in the comment's place, so removing it cannot weld the token
      // before it onto the token after.
      out += "\n";
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const end = endOfString(tag, j);
      out += tag.slice(j, end + 1);
      j = end;
      continue;
    }
    out += c;
  }
  return out;
}

/** Categories an inline exemption may declare are validated by the caller. */
export const EXEMPT_RE = /linkAs-exempt\(([a-z-]+)\)\s*:\s*(.+)/;

/**
 * Every call site of `components` in one file's source, and whether each passes
 * the prop. Returns positions only — the caller attaches the file path.
 */
export function scanSource(src, components) {
  const sites = [];
  const lines = src.split("\n");
  for (const name of components) {
    const re = new RegExp(`<${name}(?=[\\s/>])`, "g");
    for (const m of src.matchAll(re)) {
      const tag = openingTag(src, m.index);
      const props = tagWithoutComments(tag);
      const line = src.slice(0, m.index).split("\n").length;
      // An exemption is declared on the tag itself or in the three lines above it.
      const near = [tag, ...lines.slice(Math.max(0, line - 4), line - 1)].join("\n");
      const ex = near.match(EXEMPT_RE);
      sites.push({
        line,
        name,
        passes: /\blinkAs\s*=/.test(props),
        spread: /\{\s*\.\.\./.test(props),
        exemption: ex ? { category: ex[1], reason: ex[2].trim() } : null,
      });
    }
  }
  return sites;
}
