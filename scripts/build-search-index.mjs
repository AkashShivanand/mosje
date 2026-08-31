#!/usr/bin/env node
/**
 * Generates the website search index's STATIC-PAGE half, and gates it.
 *
 * THE TRAP THIS EXISTS FOR. A search that confidently returns nothing for a page
 * that exists is worse than no search, because the reader concludes the
 * Department does not do that thing. Every hand-maintained index in this estate
 * has drifted — four organisation lists, a rail of division links that had
 * silently lost nine entries — so this one is not hand-maintained.
 *
 * HOW IT CANNOT DRIFT. The generator walks `app/website/**\/page.tsx` and reads
 * each page's OWN exported `metadata`. The title and description in the index are
 * therefore the same strings the page puts in its `<title>`; they cannot disagree,
 * because there is only one of them. Run with `--check` (wired into `npm run
 * check`) it regenerates in memory and fails if the committed file differs — so
 * adding a route without regenerating breaks the build, by name.
 *
 * WHAT IT DOES NOT COVER, deliberately: dynamic routes. `/schemes-services/[slug]`
 * is 141 schemes and `/organisation/[...slug]` is 175 bodies; those are indexed
 * from the content layer at runtime by `build.ts`, which is where their real
 * titles live. A dynamic segment here is skipped, not missed.
 *
 *   node scripts/build-search-index.mjs            # write
 *   node scripts/build-search-index.mjs --check    # fail on drift
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PAGES = join(ROOT, "apps/hub/src/app/website");
const OUT = join(ROOT, "apps/hub/src/lib/website/search/static-pages.generated.ts");
const CHECK = process.argv.includes("--check");

/**
 * Routes that exist but are not public content, with the reason. Anything listed
 * here is deliberately absent from search; anything NOT listed here and missing
 * an entry fails the gate.
 */
const EXCLUDED = {
  "/nmba-options": "internal design-option preview — variants of one page, not content",
  "/nmba-placement-preview": "internal design-option preview — a layout sandbox, not content",
  "/search": "the results page itself — a search result pointing at the search page is a loop",
  "/samavesh-citizen-portals":
    "retired — redirects to /portals, which is the same directory with search and filters. " +
    "A redirect has no title of its own and must not appear as a result: indexing it would " +
    "put two entries in search for one destination.",
};

/**
 * The pages that carry no static `metadata` export, and what search should say
 * about them.
 *
 * Both entries here are `"use client"` pages, and Next forbids a client component
 * from exporting `metadata` — so neither declares a `<title>` of its own and both
 * inherit the layout's. That is a real defect and this is not its fix: the fix is
 * a `layout.tsx` beside each page carrying the metadata, which also repairs the
 * browser tab, the bookmark label and what a screen reader announces on load.
 * Until someone does that, search would otherwise have nothing to show, so the
 * copy lives here and is flagged rather than invented silently.
 *
 * Keep this list SHORT. For a server page the right fix is always to give the
 * page real metadata, not to describe it twice.
 */
const OVERRIDES = {
  "/": {
    title: "Home — Department of Social Justice & Empowerment",
    description:
      "The official website of the Department of Social Justice & Empowerment, Government of India — schemes, organisations, documents and services.",
  },
  "/about-us": {
    title: "About Us — Department of Social Justice & Empowerment",
    description:
      "Formation and history of the Ministry, its mandate, target groups, divisions and leadership.",
  },
};

/** Route → the facet section it is filed under. First matching prefix wins. */
const SECTIONS = [
  [/^\/(about-us|about-the-division|welfare-of-the-other-backward-classes|drug-division|organisation-under-division)/, "The Department"],
  [/^\/(whos-who|chairpersons-office|directory|mosje-directory|mosje-contact|contact-us|contact-person)/, "Contact & Directory"],
  [/-directory$/, "Contact & Directory"],
  [/^\/(schemes-services|dashboard|de-addiction-centres|events|gallery)/, "Offerings"],
  [/^\/(for-beneficiary|for-student|for-researcher|for-government-official)/, "For You"],
  [/^\/(acts-rules|policies|circulars|notices|advices|annual-reports|publications|forms-templates|miscellaneous|mou|resources|assurances|official-language|list-of-research)/, "Documents"],
  [/^\/(tenders|vacancies)/, "Opportunities"],
  [/(ngo|grant|voluntary|blacklisted|screening|inspection|penalt|prioritization|cessation)/, "NGOs & Grants"],
  [/^\/(rti|suo-moto)/, "Right to Information"],
  [/^\/(privacy-policy|copyright|terms-conditions|hyperlinking-policy|accessibility|sitemap)/, "Site Policies"],
  [/^\/(samavesh-|admin)/, "Portals"],
];

/** Route → Material Symbols icon. First matching prefix wins. */
const ICONS = [
  [/^\/(schemes-services)/, "volunteer_activism"],
  [/-directory$|^\/(directory|whos-who|mosje-directory|chairpersons-office)/, "contacts"],
  [/^\/(contact|mosje-contact)/, "call"],
  [/^\/(acts-rules|policies|official-language-act)/, "gavel"],
  [/^\/(annual-reports|publications|list-of-research)/, "menu_book"],
  [/^\/(circulars|notices|advices|assurances|miscellaneous)/, "campaign"],
  [/^\/(forms-templates)/, "description"],
  [/^\/tenders/, "receipt_long"],
  [/^\/vacancies/, "work"],
  [/^\/(rti|suo-moto)/, "info"],
  [/^\/(gallery|events)/, "photo_library"],
  [/^\/(de-addiction-centres|drug-division)/, "health_and_safety"],
  [/^\/dashboard/, "monitoring"],
  [/^\/(samavesh-|admin)/, "apps"],
  [/(ngo|grant|voluntary|blacklisted)/, "handshake"],
  [/^\/(for-)/, "person"],
  [/^\/(privacy|copyright|terms|hyperlinking|accessibility|sitemap)/, "policy"],
  [/^\/$/, "home"],
];

function firstMatch(table, route, fallback) {
  for (const [re, value] of table) if (re.test(route)) return value;
  return fallback;
}

/**
 * Strip the site suffix a `<title>` needs but a result row does not.
 * "Acts & Rules | DoSJE" is the right page title and the wrong result label.
 */
function cleanTitle(title) {
  return title
    .replace(/\s*[|—–-]\s*(Department|Ministry) of Social Justice & Empowerment\s*$/i, "")
    .replace(/\s*\|\s*DoSJE\s*$/i, "")
    .replace(/\s*—\s*DoSJE\s*$/i, "")
    .trim();
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name === "page.tsx") out.push(full);
  }
  return out;
}

/**
 * Pull `title` and `description` out of an exported `metadata` object.
 *
 * Deliberately a regex and not a TS parse: the alternative is compiling the app
 * to read five string literals, and every page in this tree writes the same
 * two-field shape. A page whose metadata this cannot read is REPORTED, never
 * silently skipped — that is the difference between a gate and a decoration.
 */
function readMetadata(src) {
  const block = src.match(/export const metadata[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return null;
  const body = block[1];
  const title = body.match(/\btitle:\s*"((?:[^"\\]|\\.)*)"/);
  const description = body.match(/\bdescription:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
  if (!title) return null;
  const unescape = (s) => s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  return {
    title: unescape(title[1]),
    description: description ? unescape(description[1]) : "",
  };
}

const problems = [];
const entries = [];
const directories = [];

for (const file of walk(PAGES).sort()) {
  const route = "/" + relative(PAGES, file).replace(/\/?page\.tsx$/, "");
  const clean = route === "/" ? "/" : route.replace(/\/$/, "");

  if (clean.includes("[")) continue; // dynamic — indexed from the content layer
  if (clean in EXCLUDED) continue;

  const source = readFileSync(file, "utf8");
  const meta = OVERRIDES[clean] ?? readMetadata(source);
  if (!meta) {
    problems.push(
      `${relative(ROOT, file)}\n      route ${clean} has no readable \`export const metadata\` with a title.\n` +
        `      Add one (it is also the page's <title>), or list the route in EXCLUDED in this script with a reason.`,
    );
    continue;
  }

  const href = `/website${clean === "/" ? "" : clean}`;
  const title = cleanTitle(meta.title);

  entries.push({
    title,
    description: meta.description,
    href,
    section: firstMatch(SECTIONS, clean, "Pages"),
    iconName: firstMatch(ICONS, clean, "article"),
  });

  /*
   * Which directory page shows which body's officials.
   *
   * This join is made BY HAND in each page — `directoryRows("dr-ambedkar-foundation")`
   * — and it cannot be reconstructed from the data layer, because the ids in
   * `officials.ts` and `organisations.ts` disagree for five bodies (the
   * organisation ids carry legacy slug tails: `…-jrf`, `…nbcfdc`). Reading the
   * call out of the page is therefore the only derivation that is true by
   * construction. Retyping the map would make a sixth copy of a join that has
   * already drifted five times.
   */
  const owner = source.match(/directoryRows\("([a-z0-9-]+)"\)/);
  if (owner) directories.push({ ownerId: owner[1], href, title });
}

entries.sort((a, b) => a.href.localeCompare(b.href));
directories.sort((a, b) => a.ownerId.localeCompare(b.ownerId));

/*
 * Every body that HAS officials must have a page that shows them, or its people
 * are indexed pointing nowhere. Read the owner keys straight out of officials.ts
 * and check each one against the pages found above.
 */
{
  const officialsSrc = readFileSync(join(ROOT, "apps/hub/src/data/website/officials.ts"), "utf8");
  const block = officialsSrc.match(/export const OFFICIALS[^=]*=\s*\{([\s\S]*?)\n\};/);
  const owners = block ? [...block[1].matchAll(/^  "([a-z0-9-]+)":/gm)].map((m) => m[1]) : [];
  const covered = new Set(directories.map((d) => d.ownerId));
  const orphaned = owners.filter((o) => !covered.has(o));
  if (orphaned.length) {
    problems.push(
      `apps/hub/src/data/website/officials.ts\n      ${orphaned.length} body(ies) hold officials but no page under app/website calls\n` +
        `      directoryRows() for them, so their people cannot be indexed:\n        ${orphaned.join("\n        ")}\n` +
        `      Either add the directory page, or remove the officials.`,
    );
  }
}

const banner = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Every static page under \`app/website\` and the title and description that page
 * itself declares. Regenerate with:
 *
 *     node scripts/build-search-index.mjs
 *
 * \`npm run check:search-index\` fails the build when this file and the routes
 * disagree, which is how the index is kept from going stale. Citizen-language
 * keywords are attached at read time in \`build.ts\` — they belong to the concept,
 * not to the route, so they are not baked in here.
 *
 * ${Object.keys(EXCLUDED).length} route(s) are deliberately absent:
${Object.entries(EXCLUDED)
  .map(([r, why]) => ` *   ${r} — ${why}`)
  .join("\n")}
 */
`;

const body = `${banner}
export interface StaticPageEntry {
  title: string;
  description: string;
  href: string;
  section: string;
  iconName: string;
}

export const STATIC_PAGES: StaticPageEntry[] = ${JSON.stringify(entries, null, 2)};

/** Which page shows a given body's officials — read out of its \`directoryRows()\` call. */
export interface DirectoryPage {
  ownerId: string;
  href: string;
  title: string;
}

export const DIRECTORY_PAGES: DirectoryPage[] = ${JSON.stringify(directories, null, 2)};
`;

if (problems.length) {
  console.error(`\n✖ search index: ${problems.length} page(s) cannot be indexed\n`);
  for (const p of problems) console.error(`  • ${p}\n`);
  process.exit(1);
}

if (CHECK) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (current !== body) {
    console.error(
      "\n✖ search index is stale — `app/website` and static-pages.generated.ts disagree.\n" +
        "  A page that exists but is not indexed returns nothing, and the reader concludes\n" +
        "  the Department does not do that thing.\n\n" +
        "  Fix:  node scripts/build-search-index.mjs\n",
    );
    process.exit(1);
  }
  console.log(
    `✔ search index — ${entries.length} static pages and ${directories.length} directories indexed, none missing`,
  );
} else {
  writeFileSync(OUT, body);
  console.log(
    `✔ wrote ${relative(ROOT, OUT)} — ${entries.length} static pages, ${directories.length} directories`,
  );
}
