/**
 * Chrome single-source — the masthead and the accessibility bar come from the
 * design system, everywhere, or the build fails.
 *
 * WHY A GATE AND NOT A RULE IN A DOC. Both surfaces are trivially easy to retype:
 * a National Emblem, a "Government of India" line, a ministry name, a skip link,
 * an A−/A/A+ stepper. Every hand-rolled copy is a place where GIGW compliance,
 * the emblem rule, the font-size mechanism and the brand tokens can drift
 * independently — and they did. Three portals carried their own masthead beside
 * a DS accessibility bar, so half the chrome was shared and half was not.
 *
 * SCOPE: TOP-OF-PAGE CHROME ONLY. The National Emblem in a footer, an emblem on
 * an organisation card, "Government of India" in body copy or a cookie notice —
 * those are content, not chrome, and this gate does not touch them. What it
 * catches is a page drawing its own MASTHEAD.
 *
 * WHAT COUNTS AS A HAND-ROLLED MASTHEAD
 *   the National Emblem or a government identity line rendered inside a `<header>`,
 *   OR inside a component whose name says masthead (Masthead / Navbar / TopBar /
 *   GovChrome / …), in a file that gets neither from <SiteHeader> or <BrandLockup>.
 *
 * WHAT COUNTS AS A HAND-ROLLED ACCESSIBILITY BAR
 *   a skip-to-content link, or a font-size stepper, outside <AccessibilityBar>.
 *
 * EXEMPTIONS are declared here, in code, with a reason — never inline. A file that
 * needs one is making a claim the estate should be able to read.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCAN = ["apps/hub/src", "packages/design-system/components"];

/** path suffix → why it is allowed to name these things without the components. */
const EXEMPT = new Map([
  // The components themselves, and the lockup they compose.
  ["packages/design-system/components/navigation/header/brand-lockup.tsx", "IS the lockup"],
  ["packages/design-system/components/navigation/header/site-header.tsx", "IS the masthead"],
  ["packages/design-system/components/navigation/header/nav-sheet.tsx", "composes BrandLockup"],
  ["packages/design-system/components/utilities/accessibility-bar.tsx", "IS the accessibility bar"],
  [
    "packages/design-system/components/utilities/accessibility-controls.tsx",
    "IS the accessibility bar's control cluster — the stepper this gate looks for. Extracted so NavSheet can render the same three controls below breakpoint/tablet, where the bar drops them.",
  ],
  // Documentation ABOUT the chrome quotes it; that is the page's subject.
  ["apps/hub/src/app/design-system/", "design-system documentation — quoting the chrome is the subject"],
  ["apps/storybook/stories/", "stories demonstrate the components"],
]);

const EMBLEM = /National[-\s]?Emblem|national-emblem/i;
const GOV_LINE = /Government of India/;
const SKIP = /Skip to [Mm]ain [Cc]ontent|skip-to-content/;
const FONT_STEP = /aria-label=["'](?:Decrease|Increase) (?:the )?text size|A−\s*\/\s*A\s*\/\s*A\+/;

const files = [];
for (const dir of SCAN) walk(join(ROOT, dir), files);
function walk(dir, out) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const e of entries) {
    if (e === "node_modules") continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|jsx)$/.test(p)) out.push(p);
  }
}

const findings = [];
for (const file of files) {
  const rel = relative(ROOT, file);
  if ([...EXEMPT.keys()].some((k) => rel.startsWith(k) || rel === k)) continue;
  const raw = readFileSync(file, "utf8");
  // Comments are prose ABOUT the code, and prose mentions the ministry constantly.
  // Scanning them produced findings in a chatbot's naming rationale.
  const src = raw
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  // An import may be aliased — the hub's gate chrome renders <DsSiteHeader>. Trust
  // the import, not the tag name, or the gate flags the very files that comply.
  const dsImport = /import\s*\{([^}]*)\}\s*from\s*["']@mosje\/design-system["']/g;
  const imported = new Set();
  for (const m of raw.matchAll(dsImport)) {
    for (const part of m[1].split(",")) {
      const [orig, alias] = part.split(/\s+as\s+/).map((x) => x.trim());
      if (orig) imported.add(alias || orig);
      if (orig) imported.add(orig);
    }
  }
  const rendersAny = (names) =>
    names.some((n) => imported.has(n) && new RegExp(`<${[...imported].find((a) => a === n) ?? n}\\b`).test(src)) ||
    names.some((n) => new RegExp(`<\\w*${n}\\b`).test(src));

  const usesHeader = rendersAny(["SiteHeader"]);
  const usesBar = rendersAny(["AccessibilityBar"]);

  // Chrome, not content: the marks must sit in a <header>, or in a component whose
  // own name says it is the masthead. An emblem in a footer or on a card is content.
  const identity = EMBLEM.test(src) || GOV_LINE.test(src);
  const inHeaderEl = /<header\b/.test(src);
  const namedChrome = /(?:function|const)\s+\w*(?:Masthead|Navbar|NavBar|TopBar|GovChrome|GovTop|SiteHeader)\w*/.test(src);
  if (identity && (inHeaderEl || namedChrome) && !usesHeader) {
    findings.push({
      rel,
      what: "masthead",
      detail: inHeaderEl
        ? "a <header> renders the government identity without <SiteHeader>"
        : "a masthead-named component renders the government identity without <SiteHeader>",
    });
  }

  if ((SKIP.test(src) || FONT_STEP.test(src)) && !usesBar && !usesHeader) {
    findings.push({
      rel,
      what: "accessibility bar",
      detail: "renders a skip link or a font-size stepper without <AccessibilityBar>",
    });
  }
}

if (findings.length) {
  console.error(`\n✖ chrome single-source: ${findings.length} hand-rolled chrome site(s).\n`);
  for (const f of findings) {
    console.error(`   ${f.rel}`);
    console.error(`     ${f.what}: ${f.detail}\n`);
  }
  console.error("   Import the component instead:");
  console.error('     import { SiteHeader, BrandLockup, AccessibilityBar } from "@mosje/design-system";\n');
  console.error("   If a file genuinely cannot, add it to EXEMPT in this script WITH A REASON.\n");
  process.exit(1);
}
console.log(`✔ chrome single-source: ${files.length} files — every masthead and accessibility bar comes from the design system.`);
