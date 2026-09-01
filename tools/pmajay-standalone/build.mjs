/**
 * Build the PM-AJAY coverage card into one self-contained file.
 *
 * Two esbuild passes and a stitch, because a shadow root needs its CSS as a
 * STRING and esbuild emits it as a sibling file:
 *
 *   1. Bundle JS + CSS normally. esbuild walks the `import "./x.css"` side
 *      effects the design system uses and concatenates them in dependency
 *      order, which is the ordering the cascade layers depend on.
 *   2. Read the emitted CSS, rewrite it for the shadow context, and inline it
 *      into the JS through `define`.
 *
 * Run: npm run build:pmajay-standalone
 */
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const OUT_DIR = join(ROOT, "dist/pmajay-standalone");
const TMP = join(HERE, ".tmp");

/*
 * The village index ships BESIDE the script, not inside it. Bundled, it took
 * the download from 195 KB gzipped to 278 — 30% of it, for a lookup most
 * readers never run. Copied here so both files land in one directory and the
 * install is "upload these two".
 */
const VILLAGES_SRC = join(ROOT, "apps/hub/public/website/data/pmajay-villages.json");

/**
 * `@/` is the hub's own alias; the entry pulls the real components through it.
 *
 * ── AND REACT IS PINNED TO ONE COPY, WHICH IS NOT OPTIONAL ─────────────────
 *
 * This is a workspace with two installed Reacts — 19.2.7 at the root and
 * 19.2.4 under `apps/hub`. Left alone the bundler resolves each import from
 * where it sits: the entry and the design system take the root copy, and
 * everything under `apps/hub/src` takes the hub's. Two Reacts in one bundle
 * means hooks registered against one dispatcher and read through the other,
 * and it fails as `Cannot read properties of null (reading
 * 'useSyncExternalStore')` — a message that names a hook nobody wrote and no
 * file anyone edited.
 *
 * Pinned to the hub's copy because that is the version the app components are
 * built and tested against here.
 */
const alias = {
  "@": join(ROOT, "apps/hub/src"),
  react: join(ROOT, "apps/hub/node_modules/react"),
  "react-dom": join(ROOT, "apps/hub/node_modules/react-dom"),
};

const shared = {
  bundle: true,
  format: "iife",
  target: ["es2020"],
  jsx: "automatic",
  minify: true,
  legalComments: "none",
  loader: { ".json": "json", ".woff2": "dataurl", ".png": "dataurl", ".svg": "dataurl" },
  alias,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  /*
   * `process` DOES NOT EXIST IN A BROWSER, and the app reads
   * `process.env.NEXT_PUBLIC_PMAJAY_API` on the way to the module Next would
   * normally have substituted at build time. Without this shim the file throws
   * `ReferenceError: process is not defined` while evaluating, the custom
   * element never registers, and the page shows NOTHING — with the cause
   * visible only in the console. It is the loudest possible failure and the
   * quietest possible symptom.
   *
   * A banner rather than a `define`, because esbuild's define values must be
   * an entity name or valid JSON and `({})` is neither. The NODE_ENV define
   * above still substitutes directly; everything else reads through this and
   * comes back `undefined`, which is the value it would have had. Nothing in
   * this bundle contacts a MoSJE API at runtime — that is the whole point — so
   * a base URL is dead weight either way.
   */
  banner: { js: 'var process=typeof process<"u"?process:{env:{}};' },
};

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

// ── Pass 1: collect the CSS ────────────────────────────────────────────────
await build({
  ...shared,
  entryPoints: [join(HERE, "entry.tsx")],
  outfile: join(TMP, "probe.js"),
  define: { ...shared.define, __PMAJAY_CSS__: '""' },
});

const cssPath = join(TMP, "probe.css");
let css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
if (!css) {
  console.error("✗ no CSS was emitted — the component's stylesheet imports did not resolve");
  process.exitCode = 1;
}

/*
 * ── REWRITING THE CSS FOR A SHADOW ROOT ───────────────────────────────────
 *
 * `:root` matches the document element and never the shadow host, so the whole
 * token contract would resolve to nothing inside the element. `:host` is its
 * equivalent in this context.
 *
 * `html` and `body` selectors go the same way and for the same reason — there
 * is no html or body inside a shadow tree, and a rule that cannot match is a
 * rule whose absence nobody notices until a background is transparent.
 */
css = css
  .replace(/(^|[},;\s])html:root\b/g, "$1:host")
  .replace(/(^|[},;\s]):root\b/g, "$1:host")
  .replace(/(^|[},;\s])html\b(?=[\s,{:])/g, "$1:host")
  .replace(/(^|[},;\s])body\b(?=[\s,{:])/g, "$1:host");

/*
 * The @font-face is declared by the ELEMENT into the outer document, because a
 * font registry is per-document and a face inside a shadow root is ignored.
 * Left here as well it would be dead weight and a second, silent copy.
 */
css = css.replace(/@font-face\s*\{[^}]*\}/g, "");

// ── Pass 2: the real build, with the CSS inlined ───────────────────────────
mkdirSync(OUT_DIR, { recursive: true });
const OUT = join(OUT_DIR, "pmajay-coverage-map.js");

await build({
  ...shared,
  entryPoints: [join(HERE, "entry.tsx")],
  outfile: OUT,
  define: { ...shared.define, __PMAJAY_CSS__: JSON.stringify(css) },
});

rmSync(TMP, { recursive: true, force: true });

const VILLAGES_OUT = join(OUT_DIR, "pmajay-villages.json");
writeFileSync(VILLAGES_OUT, readFileSync(VILLAGES_SRC));

const bytes = readFileSync(OUT);
const gz = gzipSync(bytes).length;
const vBytes = readFileSync(VILLAGES_OUT);
const vGz = gzipSync(vBytes).length;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

console.log(`\n✓ ${OUT}`);
console.log(`  ${kb(bytes.length)} raw · ${kb(gz)} gzipped   (CSS inlined: ${kb(css.length)})`);
console.log(`✓ ${VILLAGES_OUT}`);
console.log(`  ${kb(vBytes.length)} raw · ${kb(vGz)} gzipped   (fetched only when someone searches)`);
console.log(`\n  No MoSJE origin is contacted at runtime. The only external request is`);
console.log(`  Google's Material Symbols webfont, declared by the design system.`);

/*
 * A SIZE CEILING, so this cannot grow unnoticed. A page widget that quietly
 * doubles is a performance regression nobody is watching for — and this one
 * carries a 10,157-row index that is easy to forget about.
 */
const LIMIT_GZ = 220 * 1024;
if (gz > LIMIT_GZ) {
  console.error(`\n✗ ${kb(gz)} gzipped exceeds the ${kb(LIMIT_GZ)} ceiling.`);
  console.error(`  Raise it deliberately in build.mjs, or find what grew.`);
  process.exitCode = 1;
}
