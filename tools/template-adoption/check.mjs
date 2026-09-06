#!/usr/bin/env node
/**
 * EVERY PORTAL SCREEN IS COMPOSED FROM A TEMPLATE — a shrink-only ratchet.
 *
 * This gate exists because the estate has already run the experiment. Measured
 * on 2026-09-06, across 265 built portal pages:
 *
 *   · `SidebarNav`  — gated by check:sidebar-adoption — 100% adoption, 407 files
 *   · `AppShell`    — no gate                         —   0% adoption, 265 pages
 *
 * `AppShell` shipped, was documented, had a Storybook story and a props table,
 * and not one portal page imported it. Sixteen hand-rolled shells were written
 * instead. The difference between those two numbers is a gate, and nothing else.
 *
 * The same measurement found 236 of the 265 pages handling none of loading,
 * empty or error — a mandatory rule broken by 89% of the estate, because
 * obeying it by hand cost four extra branches per page. A template supplies
 * those branches, so adoption and that rule are the same problem.
 *
 * ## What conformance means
 *
 * A **shell** — a file whose job is portal chrome — renders `PortalPage`.
 * A **page** — any `page.tsx` under `apps/hub/src/app/portals` — renders one Tier-B
 * template (`<SomethingScreen`), or `PortalLoginTemplate` for a login screen.
 *
 * A page that only *delegates* — one that renders a portal component and nothing
 * else — is judged by THAT COMPONENT, not by itself. Twelve e-anudaan pages are
 * seven lines each and render `<ActionQueue />`; the screen is in `action-queue.tsx`.
 * Counting the page as conformant because it is short would let anyone satisfy
 * this gate by moving a hand-assembled screen one file sideways, so the delegate
 * is resolved through its import and checked instead. Where it cannot be
 * resolved — a dynamic import, a component outside the hub — the page is left
 * uncounted rather than blamed for something unreadable.
 *
 * ## The ratchet, in the shape the estate uses everywhere else
 *
 *   · a NEW page or shell that uses no template FAILS
 *   · a file listed in the baseline is known debt and passes
 *   · a baselined file that NOW conforms also FAILS, telling you to re-baseline
 *     in the same change — so one page's migration cannot be spent silently on
 *     another page's regression
 *
 * The baseline only ever shrinks. Never add an entry to make a build green.
 *
 *   npm run check:template-adoption            the gate
 *   npm run check:template-adoption:baseline   re-freeze after migrating
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const BASELINE = join(ROOT, "tools/template-adoption/baseline.json");
const WRITE = process.argv.includes("--baseline");

const PAGES_ROOT = "apps/hub/src/app/portals";
const SHELLS_ROOT = "apps/hub/src/components";
const SKIP = new Set(["node_modules", ".next", "website", "design-system", "i18n"]);

/** Tier-B templates. A page rendering any one of these is composed, not assembled. */
const SCREENS = /<(?:Worklist|Record|Wizard|Overview|Form|Checklist|Review|Chooser|Decision|Catalogue|Gallery|Search|Inbox|Settings|Report|Confirmation|Status|Auth)Screen\b/;
/** The login screen is a template too — it just predates the others. */
const LOGIN = /<PortalLogin(?:Template|Shell)\b/;
const CHROME = /<PortalPage\b/;

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.tsx$/.test(e)) yield p;
  }
}

/**
 * A page that renders one component and nothing else is delegating, not
 * assembling. Counting it as debt would send someone to a file with nothing in
 * it to fix.
 */
function delegateOf(src) {
  const body = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const elements = [...new Set((body.match(/<([A-Z][A-Za-z0-9]*)/g) ?? []).map((m) => m.slice(1)))];
  const short = body.split("\n").filter((l) => l.trim()).length < 25;
  if (!short || elements.length !== 1) return null;
  const name = elements[0];
  // The import that supplied it. `@/` is apps/hub/src.
  const imp = new RegExp(`import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from\\s*"([^"]+)"`).exec(body);
  if (!imp) return { name, file: null };
  const spec = imp[1];
  if (!spec.startsWith("@/")) return { name, file: null };
  for (const ext of [".tsx", "/index.tsx"]) {
    const candidate = join(ROOT, "apps/hub/src", spec.slice(2) + ext);
    if (existsSync(candidate)) return { name, file: candidate };
  }
  return { name, file: null };
}

/**
 * A shell is chrome: it WRAPS the page, and either draws the chrome itself or is
 * named as the thing that does.
 *
 * Both clauses are needed, and each was added after watching the other miss.
 * Matching on the filename alone pulled in nine files that live under a `shell/`
 * directory and are parts OF a shell rather than shells — smile-admin's
 * `breadcrumbs`, `footer`, `page-header`, `scope-banner`, `access-bar`,
 * `mobile-nav` and `sidebar`, and pm-ajay's `navbar`. Telling someone to render
 * `PortalPage` inside a breadcrumb is advice they cannot act on.
 *
 * But matching on drawn chrome alone missed five of the sixteen real shells —
 * scw's admin and user shells, tg's citizen shell and e-anudaan's review shell
 * all delegate their masthead to a local `gov-chrome`, and eutthan's renders its
 * children through a variable rather than inline. A gate that cannot see the
 * files it exists to move is worse than none.
 */
function isShell(rel, src) {
  if (!/\bchildren\b/.test(src)) return false;
  const namedShell = /[a-z-]*shell\.tsx$/.test(rel);
  const drawsChrome = /<SiteHeader\b|<SidebarNav\b|<AppShell\b/.test(src);
  return namedShell || drawsChrome;
}

const pages = [];
const shells = [];

for (const f of walk(join(ROOT, PAGES_ROOT))) {
  if (!/\/page\.tsx$/.test(f)) continue;
  const rel = relative(ROOT, f);
  const src = readFileSync(f, "utf8");
  if (SCREENS.test(src) || LOGIN.test(src)) {
    pages.push({ rel, ok: true });
    continue;
  }
  const delegate = delegateOf(src);
  if (delegate) {
    // Judged by the component it hands the screen to. A page that delegates to
    // something unreadable from here is not counted either way.
    if (!delegate.file) continue;
    const target = readFileSync(delegate.file, "utf8");
    pages.push({ rel, ok: SCREENS.test(target) || LOGIN.test(target) });
    continue;
  }
  pages.push({ rel, ok: false });
}

for (const f of walk(join(ROOT, SHELLS_ROOT))) {
  const rel = relative(ROOT, f);
  const src = readFileSync(f, "utf8");
  if (!isShell(rel, src)) continue;
  shells.push({ rel, ok: CHROME.test(src) || LOGIN.test(src) });
}

const offenders = [...pages, ...shells].filter((e) => !e.ok).map((e) => e.rel).sort();

if (WRITE) {
  const payload = {
    /* Written into the file because the count JUMPED once for a reason that is
       not backsliding, and the next reader deserves to know which kind of change
       they are looking at. On 2026-09-06 it went 212 -> 270 when the gate learned
       to follow a DELEGATING page to the component holding its screen: twelve
       e-anudaan pages are seven lines each and render <ActionQueue />, and 59
       pages across e-anudaan and nhapoa had been passing because their screens
       lived one file sideways. The estate did not get worse; the measurement got
       honest. Every later move of this number should be downward. */
    $note:
      "Shrink-only. A jump means the gate's scope widened — say why here when it does.",
    unmigrated: offenders,
  };
  writeFileSync(BASELINE, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `✔ template adoption: baseline recorded — ${offenders.length} file(s) not yet on a template ` +
      `(${pages.length} page(s) and ${shells.length} shell(s) scanned).`,
  );
  process.exit(0);
}

const baseline = existsSync(BASELINE)
  ? JSON.parse(readFileSync(BASELINE, "utf8")).unmigrated ?? []
  : [];
const known = new Set(baseline);
const current = new Set(offenders);

const regressed = offenders.filter((f) => !known.has(f));
const improved = baseline.filter((f) => !current.has(f));

if (regressed.length) {
  console.error(
    `✖ template adoption: ${regressed.length} portal file(s) assemble a screen by hand instead of composing one:`,
  );
  for (const f of regressed) console.error(`   · ${f}`);
  console.error(
    "\n   Pick a template from the data you are showing — the decision table is in\n" +
      "   docs/design-system/screen-templates.md §2 — and render it inside PortalPage.\n" +
      "   A screen assembled by hand is a screen that has to remember the seven states,\n" +
      "   and 236 of 265 pages did not.",
  );
  process.exit(1);
}

if (improved.length) {
  console.error(
    `✖ template adoption: ${improved.length} baselined file(s) now use a template — re-record the baseline in this change:`,
  );
  for (const f of improved) console.error(`   · ${f}`);
  console.error("\n   npm run check:template-adoption:baseline");
  process.exit(1);
}

const total = pages.length + shells.length;
const migrated = total - offenders.length;
console.log(
  `✔ template adoption: ${migrated}/${total} portal file(s) composed from a template — ` +
    `${offenders.length} known, declared in the baseline.`,
);
