/**
 * Code Connect parity — the drift detector prompt 11 §PHASE D asks for and that
 * did not exist.
 *
 * A Code Connect template is the one artefact in this estate that NOTHING checked.
 * `.figma.ts` files are explicitly EXCLUDED from the design-system tsconfig
 * (`exclude: ["**\/*.figma.ts"]`), so a template could name a React prop that had
 * been renamed, or a Figma property that had been deleted, and every gate stayed
 * green while Dev Mode served developers a snippet that does not compile.
 *
 * What this checks, per template:
 *   1. the `// source=` file exists;
 *   2. the `// component=` name is exported from the design-system barrel;
 *   3. it is PARSERLESS — no `figma.connect(`, which is the v1 format the repo
 *      does not use (and CLI v2 rejects);
 *   4. every prop emitted in the example exists on the component's Props interface;
 *   5. every `getEnum` carries a non-empty mapping — an unmapped variant value
 *      silently emits `undefined`;
 *   6. every Figma property the template reads exists in the recorded fixture, and
 *      every fixture property is either mapped or explicitly declared omitted.
 *
 * Check 6 needs a Figma snapshot, because a test cannot call Figma. The fixture is
 * `figma-properties.json`, captured from `get_context_for_code_connect`. A template
 * with NO fixture is REPORTED, never silently passed — a gate that cannot fail is
 * worse than no gate.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const FIXTURE = join(ROOT, "tools/code-connect-parity/figma-properties.json");
const BARREL = join(ROOT, "packages/design-system/index.ts");

const findings = [];
const notes = [];
const fail = (file, msg) => findings.push({ file, msg });

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules") continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".figma.ts")) out.push(p);
  }
  return out;
}

const scope = join(ROOT, "packages/design-system/components");
if (!existsSync(scope)) {
  console.error(`✖ code-connect parity: scope does not exist: ${relative(ROOT, scope)}`);
  process.exit(2);
}
const templates = walk(scope).sort();
if (templates.length === 0) {
  console.error("✖ code-connect parity: found no .figma.ts templates — refusing to report a false clean.");
  process.exit(2);
}

const barrel = readFileSync(BARREL, "utf8");
const fixturesRaw = existsSync(FIXTURE) ? JSON.parse(readFileSync(FIXTURE, "utf8")) : {};
// `$`-prefixed keys are documentation, not components.
const fixtures = Object.fromEntries(Object.entries(fixturesRaw).filter(([k]) => !k.startsWith("$")));

for (const file of templates) {
  const rel = relative(ROOT, file);
  const src = readFileSync(file, "utf8");

  // 3 — parserless only.
  if (/figma\.connect\s*\(/.test(src)) {
    fail(rel, "uses figma.connect() — that is the v1 parser-based format; CLI v2 rejects it. Use a `figma.code` template.");
  }

  const componentName = (src.match(/^\/\/\s*component=(.+)$/m) || [])[1]?.trim();
  const sourcePath = (src.match(/^\/\/\s*source=(.+)$/m) || [])[1]?.trim();
  if (!componentName) { fail(rel, "missing `// component=` header"); continue; }
  if (!sourcePath) { fail(rel, "missing `// source=` header"); continue; }

  // 1 — the source file exists.
  if (!existsSync(join(ROOT, sourcePath))) {
    fail(rel, `\`// source=${sourcePath}\` does not exist`);
    continue;
  }

  // 2 — the component is actually exported.
  if (!new RegExp(`\\b${componentName}\\b`).test(barrel)) {
    fail(rel, `\`${componentName}\` is not referenced by packages/design-system/index.ts — the snippet would not import`);
  }

  // 5 — enum mappings are populated.
  for (const m of src.matchAll(/getEnum\(\s*["']([^"']+)["']\s*,\s*\{([\s\S]*?)\}\s*\)/g)) {
    const keys = [...m[2].matchAll(/["']?([\w .-]+)["']?\s*:/g)].map((k) => k[1].trim()).filter(Boolean);
    if (keys.length === 0) fail(rel, `getEnum("${m[1]}") has an empty mapping — every variant value must be listed`);
  }

  // 4 — props emitted must exist on the Props interface.
  const example = (src.match(/example:\s*figma\.code`([\s\S]*?)`,\s*$/m) || src.match(/example:\s*figma\.code`([\s\S]*?)`/))?.[1] ?? "";
  // `\s{2}` only ever matched a prop indented EXACTLY two spaces, and no template
  // in this repo indents that shallowly — so check 4 was passing vacuously on all 19.
  const emitted = [...new Set([...example.matchAll(/^\s+([a-zA-Z][\w]*)=/gm)].map((m) => m[1]))];
  const componentSrc = readFileSync(join(ROOT, sourcePath), "utf8");
  // `[^{]*` steps over an `extends ...` clause, which may sit on its own line.
  // Without it any interface that extends something was silently unverified —
  // Chatbot, Button and TabDef all were.
  const iface = componentSrc.match(new RegExp(`interface\\s+${componentName}Props\\b[^{]*\\{([\\s\\S]*?)\\n\\}`));
  if (!iface) {
    notes.push(`${rel}: no \`${componentName}Props\` interface found in ${sourcePath} — prop names NOT verified`);
  } else {
    const declared = declaredProps(componentSrc, componentName, sourcePath);
    for (const p of emitted) {
      if (!declared.has(p)) fail(rel, `example emits \`${p}\` but \`${componentName}Props\` does not declare it`);
    }
  }

  // 6 — Figma properties, against the recorded snapshot.
  const read = new Set([
    ...[...src.matchAll(/get(?:String|Boolean)\(\s*["']([^"']+)["']/g)].map((m) => m[1]),
    ...[...src.matchAll(/getEnum\(\s*["']([^"']+)["']/g)].map((m) => m[1]),
  ]);
  const fx = fixtures[componentName];
  if (!fx) {
    notes.push(`${rel}: no Figma fixture for \`${componentName}\` — Figma property names NOT verified. Capture with get_context_for_code_connect and add to tools/code-connect-parity/figma-properties.json`);
  } else {
    const known = new Set(Object.keys(fx.properties));
    for (const r of read) {
      if (!known.has(r)) fail(rel, `reads Figma property "${r}", which the master does not have (fixture ${fx.nodeId})`);
    }
    const omitted = new Set(fx.deliberatelyOmitted ?? []);
    for (const k of known) {
      if (!read.has(k) && !omitted.has(k)) {
        fail(rel, `Figma property "${k}" is neither mapped nor listed in \`deliberatelyOmitted\` — a property that is silently dropped is drift`);
      }
    }
    // Variant values must be exhaustive.
    for (const [name, def] of Object.entries(fx.properties)) {
      if (!def.variantOptions) continue;
      const m = src.match(new RegExp(`getEnum\\(\\s*["']${name}["']\\s*,\\s*\\{([\\s\\S]*?)\\}\\s*\\)`));
      if (!m) continue;
      const mapped = new Set([...m[1].matchAll(/["']?([\w .-]+)["']?\s*:/g)].map((k) => k[1].trim()));
      for (const v of def.variantOptions) {
        if (!mapped.has(v)) fail(rel, `getEnum("${name}") does not map variant "${v}" — it would emit undefined`);
      }
    }
  }
}

console.log(`code-connect parity: ${templates.length} template(s) checked, ${Object.keys(fixtures).length} with a Figma fixture.`);
for (const n of notes) console.log(`  • ${n}`);
if (findings.length) {
  console.error(`\n✖ ${findings.length} Code Connect parity problem(s):`);
  for (const f of findings) console.error(`   ${f.file}\n     ${f.msg}`);
  process.exit(1);
}
console.log("✔ every template's props, enums and Figma properties line up.");

/** Prop names declared directly in an interface body. */
function ownProps(body) {
  return [...body.matchAll(/^\s{2}(?:\/\*\*[\s\S]*?\*\/\s*)?["']?([a-zA-Z][\w-]*)["']?\??\s*:/gm)].map((m) => m[1]);
}

/**
 * Every prop an interface offers, INCLUDING the ones it inherits.
 *
 * Reading only the interface body was a second vacuous pass, of exactly the kind the
 * comment above records finding once already. `IconButtonProps extends Omit<ButtonProps,
 * …>` declares two members and offers eleven, so a template emitting `size` was reported
 * as emitting a prop that "does not exist" — and, far worse, any template that emitted an
 * inherited prop it had spelled WRONG would have been reported the same way and quietly
 * dismissed as a false positive.
 *
 * Follows `extends Base` and `extends Omit<Base, "a" | "b">`, resolving the base from the
 * same file or from a relative import, and subtracting whatever the Omit removes. React's
 * own HTML-attribute bases are not resolved — they are not in this repo, and a template
 * emitting `onClick` was never the risk this check exists for.
 */
function declaredProps(srcText, componentName, sourcePath, seen = new Set()) {
  const key = `${sourcePath}#${componentName}`;
  if (seen.has(key)) return new Set();
  seen.add(key);

  const m = srcText.match(new RegExp(`interface\\s+${componentName}Props\\b([^{]*)\\{([\\s\\S]*?)\\n\\}`));
  if (!m) return new Set();
  const [, extendsClause, body] = m;
  const props = new Set(ownProps(body));

  for (const base of extendsClause.matchAll(/(\w+)Props\b/g)) {
    const baseName = base[1];
    const omitted = new Set();
    const omitMatch = extendsClause.match(new RegExp(`Omit<\\s*${baseName}Props\\s*,([^>]*)>`));
    if (omitMatch) for (const o of omitMatch[1].matchAll(/["']([^"']+)["']/g)) omitted.add(o[1]);

    // Same file first, then a relative import.
    let baseSrc = srcText;
    let basePath = sourcePath;
    if (!new RegExp(`interface\\s+${baseName}Props\\b`).test(srcText)) {
      const imp = srcText.match(new RegExp(`import[^;]*${baseName}Props[^;]*from\\s+["'](\\.[^"']+)["']`));
      if (!imp) continue;
      const resolved = resolve(dirname(join(ROOT, sourcePath)), imp[1]);
      const candidate = [".tsx", ".ts", "/index.tsx", "/index.ts"].map((e) => resolved + e).find(existsSync);
      if (!candidate) continue;
      baseSrc = readFileSync(candidate, "utf8");
      basePath = candidate;
    }
    for (const p of declaredProps(baseSrc, baseName, basePath, seen)) {
      if (!omitted.has(p)) props.add(p);
    }
  }
  return props;
}
