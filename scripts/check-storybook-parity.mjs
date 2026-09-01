#!/usr/bin/env node
/**
 * Storybook parity gate — the story must still describe the component.
 *
 * `check-storybook-coverage.mjs` asks one question: does a story exist? That
 * catches a component added without documentation, and nothing else. It cannot
 * see the three ways Storybook goes stale AFTER a story is written:
 *
 *   1. A prop is added and no story mentions it. The gate stays green while the
 *      documentation silently stops being complete.
 *   2. A component is renamed or deleted and its story lingers, documenting
 *      something that no longer exists. Worse than a missing story: a reviewer
 *      reads it and believes it.
 *   3. A story renders but is broken — covered separately by
 *      scripts/smoke-storybook.mjs, which mounts every story in a browser.
 *
 * This file closes (1) and (2).
 *
 *   node scripts/check-storybook-parity.mjs
 *   node scripts/check-storybook-parity.mjs --json     # machine-readable
 *
 * Both checks read the design-system SOURCE, not a build artifact: this package
 * ships TypeScript directly (`"exports": { ".": "./index.ts" }`), so there are
 * no .d.ts files to parse and adding a build step just to run a lint gate would
 * be the tail wagging the dog.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { blankComments } from "../tools/ds-linkage/regions.mjs";

const DS_ROOT = process.env.DS_ROOT ?? "packages/design-system";
const BARREL = process.env.DS_BARREL ?? path.join(DS_ROOT, "index.ts");
const STORIES_DIR = process.env.STORIES_DIR ?? "apps/storybook/stories";
const JSON_OUT = process.argv.includes("--json");

/**
 * Props every component has and no story should be forced to demonstrate.
 * Each entry is plumbing, not API: documenting `className` 69 times would train
 * people to ignore this gate, which is the only way it fails for real.
 */
const UNIVERSAL_PROPS = new Set([
  "className", // every component takes one; never the point of a story
  "style",     // ditto
  "key",       // React's, not the component's
  "ref",       // forwarded, not configured
]);

/**
 * Components whose props are declared inline rather than as an exported
 * interface, or which take no props worth exercising. Listed so the gate says
 * "deliberately skipped" instead of silently finding nothing.
 */
const NO_PROPS_INTERFACE = {
  PieChart: "props are declared inline as `{ data, title }` — no exported interface to read",
  Legend: "props are declared inline on the function signature",
  ChartTooltip: "takes a single `tip` object from useChartTooltip",
  Tabs: "TabsProps is exported; TabPanel's props are inline",
};

function fail(message) {
  console.error(`\n✖ storybook parity: ${message}\n`);
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Reading the barrel
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Every name the barrel re-exports, mapped to the module it came from.
 * Type-only exports are kept: a story may legitimately import a type.
 */
function barrelExports(file, seen = new Set()) {
  const abs = path.resolve(file);
  if (seen.has(abs) || !existsSync(abs)) return new Map();
  seen.add(abs);

  const src = readFileSync(abs, "utf8");
  const dir = path.dirname(abs);
  const exports = new Map();

  for (const match of src.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["']([^"']+)["']/gms)) {
    const [, names, from] = match;
    const target = resolveModule(dir, from);
    for (let name of names.split(",")) {
      name = name.trim().replace(/^type\s+/, "");
      if (!name) continue;
      const exported = name.split(/\s+as\s+/).pop().trim();
      const local = name.split(/\s+as\s+/)[0].trim();
      exports.set(exported, { module: target, local });
    }
  }

  // `export * from "./x"` — follow it so re-exported names are not reported stale.
  for (const match of src.matchAll(/export\s+\*\s+from\s+["']([^"']+)["']/g)) {
    const target = resolveModule(dir, match[1]);
    if (!target) continue;
    for (const [name, meta] of barrelExports(target, seen)) {
      if (!exports.has(name)) exports.set(name, meta);
    }
    // A leaf module's own declarations count too.
    for (const name of ownDeclarations(target)) {
      if (!exports.has(name)) exports.set(name, { module: target, local: name });
    }
  }

  // Names declared and exported in this file directly.
  for (const name of ownDeclarations(abs)) {
    if (!exports.has(name)) exports.set(name, { module: abs, local: name });
  }

  return exports;
}

function resolveModule(fromDir, spec) {
  if (!spec.startsWith(".")) return null;
  const base = path.resolve(fromDir, spec);
  for (const candidate of [
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/** `export function X` / `export const X` / `export interface X` / `export type X` in one file. */
function ownDeclarations(file) {
  if (!file || !existsSync(file)) return [];
  const src = readFileSync(file, "utf8");
  const names = [];
  for (const match of src.matchAll(
    /^export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|let|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm,
  )) {
    names.push(match[1]);
  }
  return names;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reading the stories
// ─────────────────────────────────────────────────────────────────────────────

function storyFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return storyFiles(full);
    return /\.stories\.tsx?$/.test(full) ? [full] : [];
  });
}

/**
 * What a story file says about itself: the names it imports from the barrel,
 * and the components it claims to document.
 *
 * Coverage claims use the same three signals as the coverage gate — the
 * `component:` field, an explicit `@covers`, and the filename — so the two
 * gates cannot disagree about which story documents what.
 */
function readStory(file) {
  const src = readFileSync(file, "utf8");

  const imported = new Set();
  for (const match of src.matchAll(
    /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["']@mosje\/design-system["']/gms,
  )) {
    for (let name of match[1].split(",")) {
      name = name.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
      if (name) imported.add(name);
    }
  }

  const covers = new Set();
  const declared = src.match(/component:\s*([A-Z][A-Za-z0-9_]*)/);
  if (declared) covers.add(declared[1]);
  for (const match of src.matchAll(/@covers\s+([A-Za-z0-9_,\s]+)/g)) {
    for (const name of match[1].split(",")) {
      const trimmed = name.trim();
      if (/^[A-Z][A-Za-z0-9_]*$/.test(trimmed)) covers.add(trimmed);
    }
  }

  return { file, src, imported, covers };
}

// ─────────────────────────────────────────────────────────────────────────────
// Reading a component's props
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split an interface/object-literal body into top-level members, ignoring
 * nesting.
 *
 * Angle brackets are deliberately NOT counted. `<` and `>` are ambiguous in
 * TypeScript — `>` closes a generic, but it also ends every arrow type — so
 * counting them drove the depth negative on any member holding a callback
 * (`onClick?: () => void`) and the nested properties leaked out as top-level
 * ones. Generics do not contain the `;`/newline this splits on, so ignoring
 * them costs nothing.
 */
function topLevelMembers(body) {
  const members = [];
  let depth = 0;
  let current = "";
  for (const char of body) {
    if (char === "{" || char === "(" || char === "[") depth++;
    else if (char === "}" || char === ")" || char === "]") depth--;
    if (depth === 0 && (char === ";" || char === "\n")) {
      members.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  members.push(current);
  return members;
}

/** Property names declared directly on `name` in `src`, following same-file `extends`. */
function interfaceMembers(src, name, seen = new Set()) {
  if (seen.has(name)) return [];
  seen.add(name);

  // Blank the comments FIRST. `topLevelMembers` splits on `;`, and a doc comment
  // that quotes CSS — `position: absolute; inset: 0` on Ticker — splits into a
  // fragment the property regex then reads as a prop called `inset`. The gate spent
  // its time demanding a story for a prop that does not exist, which is how a gate
  // teaches people to ignore it. Offsets and newlines are preserved, so every brace
  // walk below still lands where it did.
  src = blankComments(src);

  const decl = new RegExp(
    `(?:export\\s+)?interface\\s+${name}\\b([^{]*)\\{`,
    "m",
  ).exec(src);
  if (!decl) return [];

  // Follow `extends` only for types declared in this file. React's HTML
  // attribute interfaces are hundreds of native props that no story should be
  // asked to demonstrate.
  const props = [];
  for (const base of (decl[1].match(/extends\s+([^{]+)/)?.[1] ?? "").split(",")) {
    const baseName = base.trim().split("<")[0].trim();
    if (baseName && /^[A-Z][\w$]*$/.test(baseName) && !baseName.startsWith("React")) {
      props.push(...interfaceMembers(src, baseName, seen));
    }
  }

  // Walk from the opening brace to its match.
  const start = decl.index + decl[0].length;
  let depth = 1;
  let end = start;
  while (end < src.length && depth > 0) {
    if (src[end] === "{") depth++;
    else if (src[end] === "}") depth--;
    if (depth === 0) break;
    end++;
  }

  for (const member of topLevelMembers(src.slice(start, end))) {
    const m = /^\s*(?:readonly\s+)?(?:\[([^\]]+)\]|"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))\s*\??\s*:/.exec(
      member,
    );
    if (!m) continue;
    const prop = m[2] ?? m[3] ?? m[4];
    if (prop) props.push(prop);
  }
  return props;
}

/**
 * The props a component accepts, read from the source file it is exported from.
 * Handles the union shape several charts use (`type XProps = A | B`) by
 * collecting the members of every same-file interface in the union.
 */
function componentProps(component, moduleFile) {
  if (!moduleFile || !existsSync(moduleFile)) return null;
  let src = readFileSync(moduleFile, "utf8");

  // An index barrel re-exports; find the file that actually declares it.
  if (!new RegExp(`(?:function|const)\\s+${component}\\b`).test(src)) {
    const dir = path.dirname(moduleFile);
    for (const match of src.matchAll(/export\s+\{([^}]*)\}\s+from\s+["']([^"']+)["']/gms)) {
      if (!match[1].split(",").some((n) => n.trim().split(/\s+as\s+/).pop().trim() === component)) {
        continue;
      }
      const target = resolveModule(dir, match[2]);
      if (target) return componentProps(component, target);
    }
    return null;
  }

  const typeName = `${component}Props`;
  const alias = new RegExp(`type\\s+${typeName}\\s*=\\s*([^;]+);`, "m").exec(src);
  if (alias) {
    const props = new Set();
    for (const part of alias[1].split("|")) {
      const partName = part.trim().replace(/^Omit<|^Pick</, "").split(/[<,]/)[0].trim();
      if (/^[A-Z][\w$]*$/.test(partName)) {
        for (const p of interfaceMembers(src, partName)) props.add(p);
      }
    }
    // `type AreaChartProps = Omit<LineChartProps, "area">` — follow the import.
    if (props.size === 0) {
      const referenced = alias[1].match(/([A-Z][\w$]*Props)/)?.[1];
      if (referenced && referenced !== typeName) {
        const imp = new RegExp(
          `import\\s+(?:type\\s+)?\\{[^}]*\\b${referenced}\\b[^}]*\\}\\s+from\\s+["']([^"']+)["']`,
          "ms",
        ).exec(src);
        const target = imp ? resolveModule(path.dirname(moduleFile), imp[1]) : null;
        if (target) {
          const owner = referenced.replace(/Props$/, "");
          const inherited = componentProps(owner, target);
          if (inherited) return inherited;
        }
        for (const p of interfaceMembers(src, referenced)) props.add(p);
      }
    }
    return props.size ? [...props] : null;
  }

  const direct = interfaceMembers(src, typeName);
  return direct.length ? direct : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// The checks
// ─────────────────────────────────────────────────────────────────────────────

const exportsMap = barrelExports(BARREL);
if (exportsMap.size === 0) fail(`could not read any exports from ${BARREL}.`);

const stories = storyFiles(STORIES_DIR).map(readStory);
if (stories.length === 0) fail(`no story files found under ${STORIES_DIR}.`);

/* ── Check 1: a story must not reference an export the barrel no longer has ── */
const stale = [];
for (const story of stories) {
  const rel = path.relative(process.cwd(), story.file);
  for (const name of story.imported) {
    if (!exportsMap.has(name)) {
      stale.push({ file: rel, name, kind: "import" });
    }
  }
  for (const name of story.covers) {
    // The filename signal can name a grouping file (FormLayout, TrendCharts)
    // that is not itself an export, so only `component:` / `@covers` claims are
    // checked here — those are explicit assertions about a real component.
    if (!exportsMap.has(name)) {
      stale.push({ file: rel, name, kind: "documents" });
    }
  }
}

/* ── Check 2: every prop of a documented component must be mentioned ───────── */
const unexercised = [];
const skipped = [];

/** Which story files claim to document each component. */
const byComponent = new Map();
for (const story of stories) {
  for (const name of story.covers) {
    if (!byComponent.has(name)) byComponent.set(name, []);
    byComponent.get(name).push(story);
  }
}

for (const [component, docs] of byComponent) {
  const entry = exportsMap.get(component);
  if (!entry) continue; // already reported as stale above

  if (component in NO_PROPS_INTERFACE) {
    skipped.push({ component, reason: NO_PROPS_INTERFACE[component] });
    continue;
  }

  const props = componentProps(entry.local ?? component, entry.module);
  if (!props) {
    skipped.push({ component, reason: "no exported props interface found" });
    continue;
  }

  const text = docs.map((d) => d.src).join("\n");
  const missing = props.filter((prop) => {
    if (UNIVERSAL_PROPS.has(prop)) return false;
    if (prop.startsWith("aria-") || prop.startsWith("data-")) return false;
    // "Mentions" is the bar, deliberately: a prop explained in the doc comment
    // IS documented, even if no story sets it. What this catches is the prop
    // added to the component and nowhere else — a brand-new identifier appears
    // in no story by any spelling.
    return !new RegExp(`(?:^|[^A-Za-z0-9_$])${escapeRe(prop)}(?![A-Za-z0-9_$])`, "m").test(text);
  });

  if (missing.length) {
    unexercised.push({
      component,
      missing,
      files: docs.map((d) => path.relative(process.cwd(), d.file)),
    });
  }
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─────────────────────────────────────────────────────────────────────────────
// Reporting
// ─────────────────────────────────────────────────────────────────────────────

if (JSON_OUT) {
  console.log(JSON.stringify({ stale, unexercised, skipped }, null, 2));
  process.exit(stale.length || unexercised.length ? 1 : 0);
}

if (stale.length) {
  fail(
    `${stale.length} story reference(s) point at exports the design system no longer has:\n` +
      stale
        .map(
          (s) =>
            `    · ${s.file}\n        ${s.kind === "import" ? "imports" : "claims to document"} "${s.name}"`,
        )
        .join("\n") +
      `\n\n  The component was renamed or removed and its story was left behind. A\n` +
      `  story documenting something that no longer exists is worse than a\n` +
      `  missing one — a reviewer reads it and believes it. Update or delete it.`,
  );
}

if (unexercised.length) {
  const total = unexercised.reduce((n, u) => n + u.missing.length, 0);
  fail(
    `${total} prop(s) across ${unexercised.length} component(s) are not mentioned by any story:\n` +
      unexercised
        .map((u) => `    · ${u.component} — ${u.missing.join(", ")}\n        ${u.files.join(", ")}`)
        .join("\n") +
      `\n\n  A prop added to a component but never shown is a prop nobody knows\n` +
      `  exists. Add a story for it, or mention it in the file's doc comment if\n` +
      `  the right guidance is "here is when NOT to use this".`,
  );
}

const documented = byComponent.size;
console.log(
  `✔ storybook parity: ${documented} documented component(s) — no stale references, ` +
    `every readable prop mentioned` +
    (skipped.length ? ` (${skipped.length} without an exported props interface).` : "."),
);
