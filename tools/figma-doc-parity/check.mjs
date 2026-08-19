/**
 * Figma documentation ↔ code parity.
 *
 * The Figma library carries a `<Topic> — Documentation` page for each component, and
 * that page states FACTS about the code: the type role and its px, the tokens the
 * stylesheet references, the focus treatment, the WCAG level, the hit-area sizes. Every
 * one of those is a claim that can rot the moment the code moves, and nothing noticed
 * when it did.
 *
 * On 2026-08-19 the AccessibilityBar page was audited against the code it documents.
 * TEN claims were wrong. The bar's label had moved to `body-2` (14/20) — a change the
 * designer made in Figma and asked to be synced INTO the code — and the master's own
 * description was updated, but the documentation page still said `Label/label-2 (12/16)`
 * in two places. The Tokens section still listed `inline/s · inline/m · inline/l ·
 * padding/m · padding/2xl` and `shape/xxs · shape/xs`, names that CEASED TO EXIST in the
 * value-naming migrations. It still said the divider was `Inverse` after the bar had
 * standardised on `Inverse subtle`. It claimed WCAG 2.1 when the estate targets 2.2. And
 * §08 said focus "uses focus/ring" while §04, four sections above, correctly explained
 * that focus/ring measures 1.37:1 on this bar and must never be used — the page
 * contradicted itself.
 *
 * None of that is visible to a reader, which is the whole problem: a documentation page
 * is believed precisely because it looks authoritative.
 *
 * HOW THIS GATE WORKS. `claims.json` records, per Figma text node, the text it holds and
 * the code-derived facts that text asserts. This checker re-derives each fact FROM THE
 * CODE and fails when the recorded text no longer agrees.
 *
 *   • `token`   — resolve a `--sa-*` custom property from the generated tokens.css,
 *                 convert rem → px, and require the number to appear in the text.
 *   • `text`    — require (or forbid) a substring, for claims that are prose rather
 *                 than numbers: "WCAG 2.2", "Inverse subtle", "body-2".
 *   • `source`  — require (or forbid) a pattern in a source file, so a claim about
 *                 BEHAVIOUR is tied to the line that implements it.
 *
 * WHICH DIRECTION IT CATCHES. Offline, on every PR, it catches the common case: the code
 * moves and Figma is left behind. The reverse — someone edits the Figma page and this
 * snapshot goes stale — needs the Figma API, so `--verify-figma` re-fetches the live
 * text and diffs it against the snapshot. That needs FIGMA_ACCESS_TOKEN and therefore
 * cannot run on every PR; it is the same secret-guarded shape `ds-quality.yml` already
 * uses for the Code Connect publish dry-run.
 *
 * A CLAIM IS NOT A TEST OF FIGMA'S PIXELS. It cannot be — this reads text, not layout.
 * It gates the factual assertions, which is where the rot was.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const MANIFEST = join(ROOT, "tools/figma-doc-parity/claims.json");
const TOKENS = join(ROOT, "packages/design-system/tokens.css");

const args = new Set(process.argv.slice(2));
const VERIFY_FIGMA = args.has("--verify-figma");
const SYNC = args.has("--sync");

if (!existsSync(MANIFEST)) {
  console.error(`✖ figma-doc-parity: manifest missing: ${relative(ROOT, MANIFEST)}`);
  process.exit(2);
}
if (!existsSync(TOKENS)) {
  console.error(`✖ figma-doc-parity: tokens.css missing — run \`npm run build -w @mosje/tokens\`.`);
  process.exit(2);
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
if (!Array.isArray(manifest.claims) || manifest.claims.length === 0) {
  console.error("✖ figma-doc-parity: manifest declares no claims — the gate cannot pass vacuously.");
  process.exit(2);
}

// ── Token resolution ────────────────────────────────────────────────────────
// Read the :root block only. A token redefined under a theme or brand block is a
// different value in a different context, and a documentation page states the default.
const cssSrc = readFileSync(TOKENS, "utf8");
const rootBlock = cssSrc.slice(0, cssSrc.indexOf("}"));
const DECL = new Map(
  [...rootBlock.matchAll(/(--sa-[A-Za-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
);

function resolve(name, depth = 0) {
  if (depth > 12) return null;
  const raw = DECL.get(name);
  if (raw === undefined) return null;
  const alias = /^var\(\s*(--sa-[A-Za-z0-9-]+)\s*\)$/.exec(raw);
  return alias ? resolve(alias[1], depth + 1) : raw;
}

/** A documentation page states px. Tokens are authored in rem; clamp() states its cap. */
function toPx(value) {
  if (value == null) return null;
  const clamp = /clamp\([^,]+,[^,]+,\s*([0-9.]+)rem\s*\)/.exec(value);
  if (clamp) return Math.round(parseFloat(clamp[1]) * 16 * 1000) / 1000;
  const rem = /^([0-9.]+)rem$/.exec(value);
  if (rem) return Math.round(parseFloat(rem[1]) * 16 * 1000) / 1000;
  const px = /^([0-9.]+)px$/.exec(value);
  if (px) return parseFloat(px[1]);
  return null;
}

const norm = (s) => s.replace(/\s+/g, " ").trim();

// ── Evaluate ────────────────────────────────────────────────────────────────
const failures = [];
const resolvedReport = [];

for (const claim of manifest.claims) {
  const text = norm(claim.figma ?? "");
  const where = `${claim.where} (${claim.node})`;

  for (const a of claim.expect ?? []) {
    if (a.kind === "token") {
      const raw = resolve(a.token);
      if (raw === null) {
        failures.push({ where, why: `token ${a.token} is not declared — renamed or retired?` });
        continue;
      }
      const px = toPx(raw);
      if (px === null) {
        failures.push({ where, why: `token ${a.token} = "${raw}" is not a length this gate can read` });
        continue;
      }
      resolvedReport.push(`${a.token} → ${px}px`);
      // The page must state the number the token actually resolves to.
      // Excluding "." outright was wrong: "14 / 20." ends a sentence, and that period is
      // not a decimal point. Reject only a period that is FOLLOWED BY a digit.
      const stated = new RegExp(
        `(?<![0-9.])${String(px).replace(".", "\\.")}(?!\\.?[0-9])`,
      ).test(text);
      if (!stated) {
        failures.push({
          where,
          why: `${a.token} resolves to ${px}px, but the Figma text does not say ${px}`,
          text,
          hint: a.hint,
        });
      }
    } else if (a.kind === "text") {
      const present = norm(a.value).length > 0 && text.toLowerCase().includes(norm(a.value).toLowerCase());
      if (a.absent ? present : !present) {
        failures.push({
          where,
          why: a.absent
            ? `the Figma text must NOT contain "${a.value}"`
            : `the Figma text must contain "${a.value}"`,
          text,
          hint: a.hint,
        });
      }
    } else if (a.kind === "source") {
      const file = join(ROOT, a.file);
      if (!existsSync(file)) {
        failures.push({ where, why: `source file missing: ${a.file}` });
        continue;
      }
      const src = readFileSync(file, "utf8");
      const re = new RegExp(a.pattern, a.flags ?? "");
      const found = re.test(src);
      if (a.absent ? found : !found) {
        failures.push({
          where,
          why: a.absent
            ? `${a.file} must NOT match /${a.pattern}/ — the code changed under this claim`
            : `${a.file} no longer matches /${a.pattern}/ — the code changed under this claim`,
          text,
          hint: a.hint,
        });
      }
    } else {
      failures.push({ where, why: `unknown assertion kind "${a.kind}"` });
    }
  }
}

// ── Web token tables: does the page name tokens the component actually uses? ─
// Three of the four stale rows on the AccessibilityBar's WEB page were of one kind —
// the table named a token the stylesheet does NOT reference: `--sa-border-neutral-
// inverse` (the rule moved into the Divider component), `--sa-shape-full` (radii were
// unified on shape/4), and `--sa-focus-ring` (the bar rejects it at 1.37:1). Each name
// exists in tokens.css, so no dangling-var check could see it. This one can.
for (const table of manifest.tokenTables ?? []) {
  const pagePath = join(ROOT, table.page);
  const cssPath = join(ROOT, table.css);
  if (!existsSync(pagePath) || !existsSync(cssPath)) {
    failures.push({ where: table.page, why: `token-table scope missing (${table.page} / ${table.css})` });
    continue;
  }
  const pageSrc = readFileSync(pagePath, "utf8");
  const cssUsed = readFileSync(cssPath, "utf8");
  const via = table.via ?? {};

  for (const m of pageSrc.matchAll(/\btoken:\s*"([^"]+)"/g)) {
    // A row may name a pair — "--sa-type-body-2-size / -lh" or "--sa-shape-2 / --sa-shape-4".
    const names = [];
    let base = null;
    for (const part of m[1].split("/").map((x) => x.trim())) {
      if (part.startsWith("--sa-")) { names.push(part); base = part; }
      else if (part.startsWith("-") && base) names.push(base.replace(/-[A-Za-z0-9]+$/, "") + part);
    }
    for (const name of names) {
      if (cssUsed.includes(name)) continue;
      if (via[name]) {
        const viaFile = join(ROOT, via[name]);
        if (existsSync(viaFile) && readFileSync(viaFile, "utf8").includes(name)) continue;
        failures.push({ where: table.page, why: `${name} is declared as reached via ${via[name]}, but that file does not reference it either` });
        continue;
      }
      failures.push({
        where: `${table.page} › token table`,
        why: `names ${name}, which ${table.css} does not reference`,
        hint: "Either the row is stale, or the token is reached through another component — add it to `via` with the file that uses it.",
      });
    }
  }
}

// ── Optional: is the snapshot still what Figma holds? ───────────────────────
async function verifyFigma() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.log("  · --verify-figma skipped: FIGMA_ACCESS_TOKEN not set.");
    return [];
  }
  const ids = manifest.claims.map((c) => c.node).join(",");
  const url = `https://api.figma.com/v1/files/${manifest.file}/nodes?ids=${encodeURIComponent(ids)}`;
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw new Error(`Figma API ${res.status} ${res.statusText}`);
  const body = await res.json();
  const drift = [];
  for (const claim of manifest.claims) {
    const doc = body.nodes?.[claim.node]?.document;
    if (!doc) {
      drift.push({ where: `${claim.where} (${claim.node})`, why: "node not found in the Figma file" });
      continue;
    }
    if (norm(doc.characters ?? "") !== norm(claim.figma ?? "")) {
      drift.push({
        where: `${claim.where} (${claim.node})`,
        why: "the Figma page changed since this snapshot was taken",
        figmaNow: norm(doc.characters ?? ""),
        snapshot: norm(claim.figma ?? ""),
      });
    }
  }
  if (SYNC && drift.length) {
    for (const claim of manifest.claims) {
      const doc = body.nodes?.[claim.node]?.document;
      if (doc?.characters) claim.figma = norm(doc.characters);
    }
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
    console.log(`  · --sync rewrote ${relative(ROOT, MANIFEST)} from the live file.`);
    return [];
  }
  return drift;
}

let figmaDrift = [];
if (VERIFY_FIGMA) {
  try {
    figmaDrift = await verifyFigma();
  } catch (err) {
    console.error(`✖ figma-doc-parity: ${err.message}`);
    process.exit(2);
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
const assertions = manifest.claims.reduce((n, c) => n + (c.expect?.length ?? 0), 0);
console.log(
  `figma-doc-parity: ${manifest.claims.length} claim(s) · ${assertions} assertion(s) · ` +
    `${manifest.file}`,
);

if (failures.length) {
  console.error(`\n✖ ${failures.length} Figma claim(s) no longer match the code:\n`);
  for (const f of failures) {
    console.error(`   ${f.where}`);
    console.error(`     ${f.why}`);
    if (f.text) console.error(`     Figma says: "${f.text}"`);
    if (f.hint) console.error(`     ${f.hint}`);
    console.error("");
  }
  console.error(
    "   Fix the Figma page, then update tools/figma-doc-parity/claims.json to match.\n" +
      "   A documentation page is believed BECAUSE it looks authoritative — a wrong one\n" +
      "   is worse than none.\n",
  );
}

if (figmaDrift.length) {
  console.error(`\n✖ ${figmaDrift.length} snapshot(s) drifted from the live Figma file:\n`);
  for (const d of figmaDrift) {
    console.error(`   ${d.where}\n     ${d.why}`);
    if (d.snapshot !== undefined) {
      console.error(`     snapshot:  "${d.snapshot}"`);
      console.error(`     figma now: "${d.figmaNow}"`);
    }
    console.error("");
  }
  console.error("   Re-run with --verify-figma --sync to adopt the live text, then re-run the gate\n" +
    "   so the code assertions are re-checked against it.\n");
}

if (failures.length || figmaDrift.length) process.exit(1);
console.log("✔ every recorded Figma claim still matches the code.");
