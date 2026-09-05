/**
 * Every portal rail is the design system's SidebarNav — no hand-rolled version.
 *
 * On 2026-09-05 the estate had one rail component and six portals drawing their own:
 * NMBA's admin, public and treatment-centre shells, Eutthan, PM-AJAY and SMILE's
 * mobile drawer each carried a private list of links with its own active state,
 * hover, indent and (sometimes) a collapse control. Each one had already drifted
 * from the others and from Figma. They were replaced in one pass; this keeps it so.
 *
 * The rule: a file under the portal code that renders an `<aside>` which navigates,
 * or a `<nav>` named "navigation" or classed as a side rail, must render SidebarNav
 * from the design system. Breadcrumbs, pagination and tab strips are `<nav>`s too,
 * but they are not named "navigation"; a login page's hero `<aside>` has no links
 * to be current — both pass. The allowlist names the files that are neither
 * a rail nor a drawer, with the reason beside each — a new entry needs one.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCOPES = ["apps/hub/src/components", "apps/hub/src/app/portals"];
const SKIP = new Set(["node_modules", ".next", "website", "design-system"]);
const ALLOW = new Map([
  ["apps/hub/src/components/smile-admin/dashboard/system-users-rail.tsx", "a card listing users on the dashboard, not navigation"],
  ["apps/hub/src/components/tg/citizen-shell.tsx", "its <aside> is the sign-in hero panel; the shell has no rail"],
  ["apps/hub/src/components/scw/admin/user-management/add-user-drawer.tsx", "a form drawer"],
  ["apps/hub/src/app/portals/scw/admin/user-management/add-user-drawer.tsx", "a form drawer"],
]);

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.tsx$/.test(e)) yield p;
  }
}

const offenders = [];
let scanned = 0;
for (const scope of SCOPES) {
  for (const f of walk(join(ROOT, scope))) {
    scanned++;
    const rel = relative(ROOT, f);
    const src = readFileSync(f, "utf8");
    // A rail or drawer: an <aside> that navigates (carries a <nav> or link current
    // state), or a <nav> named "navigation" or classed as a side/rail. A login
    // page's hero <aside> and a breadcrumb <nav> are neither.
    const navigatingAside = /<aside[\s>]/.test(src) && /<nav\b|aria-current|usePathname/.test(src);
    const namedNav = /<nav\b[^>]*aria-label=(?:"[^"]*navigation[^"]*"|\{[^}]*navigation[^}]*\})/i.test(src);
    const sideNav = /<nav\b[^>]*className="[^"]*\b(side|sidebar|rail)\b/i.test(src);
    const rail = navigatingAside || namedNav || sideNav;
    if (!rail) continue;
    if (/SidebarNav\b[^]*from "@mosje\/design-system"/.test(src) && /<SidebarNav\b/.test(src)) continue;
    if (ALLOW.has(rel)) continue;
    offenders.push(rel);
  }
}

if (offenders.length) {
  console.error(`✖ sidebar adoption: ${offenders.length} file(s) draw a rail or drawer without the design system's SidebarNav:`);
  for (const o of offenders) console.error(`  · ${o}`);
  console.error("  Render <SidebarNav groups pathname /> from @mosje/design-system, or add the file to the allowlist in tools/sidebar-adoption/check.mjs with the reason it is not navigation.");
  process.exit(1);
}
console.log(`✔ sidebar adoption: ${scanned} portal file(s) scanned — every rail and drawer is the design system's SidebarNav.`);
