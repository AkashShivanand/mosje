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
    // A QUOTED key may hold anything — `"Comment (yes)"` is a real Figma variant value,
    // and the old `[\w .-]+` class could not see a parenthesis, so the gate reported a
    // mapped variant as unmapped. Quoted keys are read whole; bare keys stay identifiers.
    const keys = [...m[2].matchAll(/["']([^"']+)["']\s*:|([A-Za-z_$][\w$]*)\s*:/g)]
      .map((k) => (k[1] ?? k[2] ?? "").trim())
      .filter(Boolean);
    if (keys.length === 0) fail(rel, `getEnum("${m[1]}") has an empty mapping — every variant value must be listed`);
  }

  // 4 — props emitted must exist on the Props interface.
  const example = (src.match(/example:\s*figma\.code`([\s\S]*?)`,\s*$/m) || src.match(/example:\s*figma\.code`([\s\S]*?)`/))?.[1] ?? "";
  // `\s{2}` only ever matched a prop indented EXACTLY two spaces, and no template
  // in this repo indents that shallowly — so check 4 was passing vacuously on all 19.
  // A template emits EITHER JSX attributes or an object literal, and until 16 Sep 2026 this
  // read only the first — so the two templates whose example IS an object (`TabDef`,
  // `AccountMenuItem`, both entries in an array a page passes) had nothing compared against
  // their shape. Resolving their shape without reading their keys would have removed the
  // "NOT verified" note while still verifying nothing, which is the failure this file's own
  // comments record twice already.
  const emittedJsx = [...example.matchAll(/^\s+([a-zA-Z][\w]*)=/gm)].map((m) => m[1]);
  // `Tab` goes one hop further: its example is the bare interpolation `${def}`, with the
  // object assembled in a const above. Follow that one hop rather than leaving the only
  // template whose keys live in a variable as the one nothing checks.
  const bare = example.trim().match(/^\$\{(\w+)\}$/);
  const keySource = bare
    ? (src.match(new RegExp(`const\\s+${bare[1]}\\s*=([\\s\\S]*?);\\n`)) || [, ""])[1]
    : example;
  // Line-anchored on an example, because an example's own nested objects (`Legend`'s items
  // carry `swatch`, `color`, `value`) are NOT props and matching them anywhere reports three
  // false failures. The const behind a bare interpolation is one flat object, so there the
  // anchor would match nothing and the scan is unanchored.
  const emittedKeys = emittedJsx.length
    ? []
    : bare
      ? [...keySource.matchAll(/([a-zA-Z][\w]*)\s*:/g)].map((m) => m[1])
      : [...example.matchAll(/^\s*([a-zA-Z][\w]*)\s*:/gm)].map((m) => m[1]);
  const emitted = [...new Set([...emittedJsx, ...emittedKeys])];
  const componentSrc = readFileSync(join(ROOT, sourcePath), "utf8");
  // `[^{]*` steps over an `extends ...` clause, which may sit on its own line.
  // Without it any interface that extends something was silently unverified —
  // Chatbot, Button and TabDef all were.
  const iface = propsShapes(componentSrc, componentName);
  if (!iface) {
    notes.push(`${rel}: no \`${componentName}Props\` interface, \`${componentName}Props\` union or \`${componentName}\` shape found in ${sourcePath} — prop names NOT verified`);
  } else {
    const declared = declaredProps(componentSrc, componentName, sourcePath);
    for (const p of emitted) {
      if (!declared.has(p)) fail(rel, `example emits \`${p}\` but \`${iface.as}\` does not declare it`);
    }
  }

  // 6 — Figma properties, against the recorded snapshot.
  // `getInstanceSwap` WAS MISSING, and its absence inverted the check it feeds:
  // an INSTANCE_SWAP property that a template maps correctly was counted as unread,
  // so check 6 would report a mapped property as "silently dropped". Button maps two
  // (`Left Icon`, `Right Icon`); adding its fixture is what surfaced this.
  // `getSlot` was missing for the same reason, found 2026-09-16 when the first templates to
  // READ a SLOT property were written (FormPanel, FormSection, ReviewSection). Every earlier
  // SLOT had been listed in `deliberatelyOmitted`, so nothing exercised the omission; a
  // template that maps its slot correctly was reported as dropping it.
  const read = new Set([
    ...[...src.matchAll(/get(?:String|Boolean|InstanceSwap|Slot)\(\s*["']([^"']+)["']/g)].map((m) => m[1]),
    ...[...src.matchAll(/getEnum\(\s*["']([^"']+)["']/g)].map((m) => m[1]),
  ]);
  // A fixture is keyed by component name, but ONE code component can be served by TWO
  // Figma sets (Radio has a set of its own and shares `Selection Card` with Checkbox), so
  // the node id in the template's `// url=` header is tried first and the name is the
  // fallback. Without this the card template was checked against the Radio set's fixture
  // and reported four properties the master "does not have".
  const urlNode = (src.match(/^\/\/\s*url=.*?node-id=(\d+)-(\d+)/m) ?? []).slice(1).join(":");
  const fx = Object.values(fixtures).find((f) => f && f.nodeId === urlNode) ?? fixtures[componentName];
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
      // Same quoted-key rule as check 5 — see the comment there.
      const mapped = new Set(
        [...m[1].matchAll(/["']([^"']+)["']\s*:|([A-Za-z_$][\w$]*)\s*:/g)].map((k) => (k[1] ?? k[2] ?? "").trim()),
      );
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
/**
 * The shape a template's props must exist on — as a LIST, because one of the three forms
 * this repo actually uses is a union and a prop only has to exist on one of its members.
 *
 * Three forms, tried in order. All three were in the library before this function existed,
 * and the check simply skipped the last two with a note nobody acted on for weeks:
 *
 *   1. `interface <Name>Props` — the ordinary case.
 *   2. `type <Name>Props = A | B` — a UNION, which `design-system.md` documents as
 *      deliberate for `BarChart` (`{data}` or `{labels, series}`, never both). A template
 *      emits one branch, so a prop is declared if ANY member declares it.
 *   3. `interface <Name>` — a DATA SHAPE rather than a component's props. `TabDef` and
 *      `AccountMenuItem` are objects a page passes in an array; there is no `<Name>Props`
 *      and there should not be one, but the names still have to be verified.
 */
function propsShapes(srcText, name) {
  const iface = (n) => srcText.match(new RegExp(`interface\\s+${n}\\b([^{]*)\\{([\\s\\S]*?)\\n\\}`));

  const own = iface(`${name}Props`);
  if (own) return Object.assign([{ extendsClause: own[1], body: own[2] }], { as: `${name}Props` });

  const alias = srcText.match(new RegExp(`type\\s+${name}Props\\s*=\\s*([^;]+);`));
  if (alias) {
    const members = [...alias[1].matchAll(/[A-Za-z_$][\w$]*/g)].map((m) => m[0]);
    const shapes = members.map(iface).filter(Boolean).map((m) => ({ extendsClause: m[1], body: m[2] }));
    if (shapes.length) return Object.assign(shapes, { as: `${name}Props` });
  }

  const shape = iface(name);
  if (shape) return Object.assign([{ extendsClause: shape[1], body: shape[2] }], { as: name });

  return null;
}

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

  const shapes = propsShapes(srcText, componentName);
  if (!shapes) return new Set();
  const props = new Set(shapes.flatMap((sh) => ownProps(sh.body)));
  const extendsClause = shapes.map((sh) => sh.extendsClause).join(" ");

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
