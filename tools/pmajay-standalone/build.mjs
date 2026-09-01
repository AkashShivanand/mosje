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
 * ── THE ICON FONT IS RENAMED, BECAUSE ITS NAME IS THE ONE THING THAT LEAKS ──
 *
 * A shadow root isolates selectors. It does NOT isolate the font registry:
 * `@font-face` is per-document, so the face has to be declared into the host's
 * `<head>` or the icons render as the literal words "chevron_right" and
 * "search". That declaration is the only style this embed adds outside itself.
 *
 * Under its real name it would be a collision waiting to happen — a host
 * already using Material Symbols would end up with two faces claiming one
 * family, and whichever won would silently change the host's own icons. Under
 * a name nothing else uses, the declaration is inert to everything but this
 * card: it defines a family no other stylesheet references.
 *
 * Renamed in the shadow CSS and in the injected face together, or the card
 * asks for a font that was never declared.
 */
css = css.split('"Material Symbols Rounded"').join('"PMAJAY Symbols"');

/*
 * And the face itself is stripped from the shadow copy — declared here it is
 * dead weight and a second, silent download of the same 5.3 MB file.
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

/*
 * ── AND THE SAME THING AGAIN AS ONE PASTE ──────────────────────────────────
 *
 * A page builder's HTML widget takes markup, not uploads. Asking someone to put
 * two files on a server, find the URL WordPress gave them and write it into a
 * script tag is three steps where the job is "paste this in". So the same
 * bundle is emitted a second time with the script and the village index inline.
 *
 * IT IS NOT THE RECOMMENDED INSTALL, and the cost is real rather than
 * theoretical:
 *
 *   · The paste carries the village index whether or not anyone searches — the
 *     exact weight the two-file split exists to avoid.
 *   · Inline script is not cached. A reader visiting three pages that carry the
 *     card downloads it three times; as a file they download it once.
 *   · It is markup stored in the post, so the builder re-serialises the whole
 *     thing on every save and the editor gets slow to work in.
 *
 * Both are built, both are documented, and the guide says which to reach for.
 */
const HTML_OUT = join(OUT_DIR, "pmajay-coverage-map.html");
const js = readFileSync(OUT, "utf8");
const villagesJson = readFileSync(VILLAGES_SRC, "utf8");

/*
 * `</script` ENDS A CLASSIC SCRIPT WHEREVER IT APPEARS — the HTML parser looks
 * for that byte sequence and does not care that it sits inside a JavaScript
 * string. One occurrence in a minified bundle truncates the page.
 *
 * Inside JS, `<\/script` is the identical string (`\/` is just `/`), and inside
 * JSON `<` is just `<`, so both escapes are invisible to the program that
 * reads them. Counted and logged rather than done silently, because a build
 * quietly rewriting its own output is worth seeing.
 */
const escapeJs = (t) => t.split("</script").join("<\\/script");
const escapeJson = (t) => t.split("<").join("\\u003c");
const closers = (js.match(/<\/script/gi) ?? []).length;

const asOn = JSON.parse(villagesJson).asOn ?? "the committed snapshot";

/*
 * The header is written for the developer who opens this file cold, six months
 * from now, with no access to this repository. It says what the three blocks
 * are, which one they may delete, and exactly what the page inherits — because
 * "does this break my theme?" is the first question anyone asks of a pasted
 * widget, and the honest answer has two named exceptions rather than a blanket
 * "no".
 */
const html = `<!--
================================================================================
  PM-AJAY — Scheme Coverage
  Department of Social Justice and Empowerment, Government of India
  Figures as on ${asOn}. Generated by tools/pmajay-standalone/build.mjs.
================================================================================

  HOW TO USE IT
  -------------
  Paste this whole file into an HTML block (Elementor "HTML" widget, a
  Gutenberg "Custom HTML" block, or a raw template). Nothing else is needed:
  no upload, no file path, no plugin, no settings screen.

  WHAT IT DOES TO THE REST OF THE PAGE: NOTHING, WITH TWO NAMED EXCEPTIONS
  -----------------------------------------------------------------------
  The card renders inside a shadow root, so its ~550 KB of CSS is scoped to the
  element and cannot select anything in your page. Your theme's CSS equally
  cannot reach in and restyle a government chart. Neither direction leaks.

  Exactly two things are added outside the element, and both are listed here
  rather than discovered later:

    1. ONE @font-face, injected into <head>, for the icon glyphs. It is named
       "PMAJAY Symbols" — deliberately a name nothing else uses — so it cannot
       collide with a Material Symbols or Font Awesome face your theme already
       loads. It carries no selector and matches no element of yours.
    2. ONE custom element name, "pmajay-coverage-map", registered on the page.

  It sets no global styles, adds no classes to your markup, touches no existing
  element, and registers no global event handlers.

  WHAT IS IN HERE, AND WHAT YOU MAY REMOVE
  ----------------------------------------
  Three blocks follow, in order:

    <pmajay-coverage-map>                     the mount point. Put it wherever
                                              the card should appear; the two
                                              scripts may sit anywhere on the
                                              page, before or after it.

    <script type="application/json"           the village-name index — 10,157
      id="pmajay-villages-inline">            names behind the "find a village"
                                              search. ABOUT 420 KB.
                                              → SAFE TO DELETE. Remove this one
                                                block and everything else still
                                                works; only the village search
                                                goes quiet. See below.

    <script> … </script>                      the card itself: React, the
                                              SAMAVESH design system, the token
                                              contract, the India outlines and
                                              the coverage figures. Required.

  ABOUT THAT 420 KB
  -----------------
  Inlined, every visitor downloads the village index whether or not they search,
  and inline script is not cached across pages. If this card appears on several
  pages, or page weight is being watched, use the TWO-FILE install instead —
  same card, the index fetched only when somebody types:

      <pmajay-coverage-map></pmajay-coverage-map>
      <script src="/path/to/pmajay-coverage-map.js" defer></script>

  with pmajay-villages.json uploaded beside the .js file. The script finds its
  sibling on its own. If your host keeps media and scripts in different places,
  name it: <pmajay-coverage-map villages-src="https://…/pmajay-villages.json">

  KEEPING IT CURRENT
  ------------------
  The figures are baked in. When the department's snapshot is refreshed, this
  file is regenerated and re-pasted — otherwise this card keeps showing
  ${asOn} figures while the department's own site shows newer ones.

  ACCESSIBILITY
  -------------
  Built to WCAG 2.2 AA: keyboard-operable throughout, visible focus, 24x24
  minimum targets, no information carried by colour alone. Please do not wrap
  it in a container that sets "overflow: hidden" on a fixed height — the card
  grows with its own content and is designed to.

================================================================================
-->

<!-- 1 · MOUNT POINT — the card renders here. -->
<pmajay-coverage-map></pmajay-coverage-map>

<!-- 2 · VILLAGE INDEX (~420 KB) — safe to delete; only the village search
        depends on it. See the header above. -->
<script type="application/json" id="pmajay-villages-inline">${escapeJson(villagesJson)}</script>

<!-- 3 · THE CARD — required. -->
<script>${escapeJs(js)}</script>
`;

writeFileSync(HTML_OUT, html);

const bytes = readFileSync(OUT);
const gz = gzipSync(bytes).length;
const vBytes = readFileSync(VILLAGES_OUT);
const vGz = gzipSync(vBytes).length;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

console.log(`\n✓ ${OUT}`);
console.log(`  ${kb(bytes.length)} raw · ${kb(gz)} gzipped   (CSS inlined: ${kb(css.length)})`);
console.log(`✓ ${VILLAGES_OUT}`);
console.log(`  ${kb(vBytes.length)} raw · ${kb(vGz)} gzipped   (fetched only when someone searches)`);
const hBytes = readFileSync(HTML_OUT);
console.log(`✓ ${HTML_OUT}`);
console.log(
  `  ${kb(hBytes.length)} raw · ${kb(gzipSync(hBytes).length)} gzipped   (one paste; index inlined)` +
    (closers ? `   [escaped ${closers} "</script" in the bundle]` : ""),
);
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
