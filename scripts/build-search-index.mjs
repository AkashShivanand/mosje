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
  "/accessibility":
    "a permanent redirect to /accessibility-statement, the canonical page (GIGW names it " +
    "\"Accessibility Statement\"); indexing both would put two results on one destination.",
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
  const unescape = (s) => s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");

  /*
   * Module-level string constants, so the two shapes this tree writes read alike.
   *
   * Most pages inline the literal. The record-library pages declare `const TITLE`
   * and `const DESCRIPTION` first and spend them three times — the <title>, the
   * visible heading, and the social card — precisely so those three cannot drift
   * apart. Reading only the inline shape reported 45 such pages as having no
   * readable title, and because an unreadable page is skipped before its
   * `directoryRows()` call is collected, it ALSO reported fifteen bodies as
   * having no directory page when every one of them had one.
   */
  const consts = new Map();
  for (const m of src.matchAll(/^const ([A-Z][A-Z0-9_]*)\s*=\s*\n?\s*"((?:[^"\\]|\\.)*)";/gm)) {
    consts.set(m[1], unescape(m[2]));
  }

  /** A literal, a bare constant, or a template that interpolates constants. */
  const read = (field) => {
    const literal = body.match(new RegExp(`\\b${field}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
    if (literal) return unescape(literal[1]);

    const ident = body.match(new RegExp(`\\b${field}:\\s*([A-Z][A-Z0-9_]*)\\s*,`));
    if (ident && consts.has(ident[1])) return consts.get(ident[1]);

    const template = body.match(new RegExp("\\b" + field + ":\\s*`([^`]*)`"));
    if (template) {
      let unresolved = false;
      const filled = template[1].replace(/\$\{\s*([A-Za-z_$][\w$]*)\s*\}/g, (_, name) => {
        if (!consts.has(name)) unresolved = true;
        return consts.get(name) ?? "";
      });
      if (!unresolved) return filled;
    }
    return null;
  };

  const title = read("title");
  if (!title) return null;
  return { title, description: read("description") ?? "" };
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
   * Read out of the page's own call, which is the only derivation that is true by
   * construction — retyping the map would make a second copy of a join that has
   * already drifted. The directory pages read the ingested register by the body's
   * ABBREVIATION, `getOfficialsByOrganisation("DAF")`, so that is what is read.
   * (The older `directoryRows()` call is gone with the placeholder rows it read.)
   */
  const owner = source.match(/getOfficialsByOrganisation\("([A-Za-z0-9 -]+)"\)/);
  if (owner) directories.push({ ownerId: owner[1], href, title });
}

entries.sort((a, b) => a.href.localeCompare(b.href));
directories.sort((a, b) => a.ownerId.localeCompare(b.ownerId));

/*
 * A directory page must actually have people to show.
 *
 * The check this replaces asked the opposite question — every body in
 * `data/website/officials.ts` must have a page — and it was the right question
 * while that file was what the directories rendered. It is not any more: the
 * pages read the ingested register, every officer in it is prerendered at
 * `official/[slug]`, and the search index now points at those pages, so no person
 * in the register can be indexed pointing nowhere.
 *
 * What CAN still go wrong is the other direction: a directory page naming a body
 * code the register does not use — a typo, or a body whose officers were never
 * ingested — renders an empty table and says nothing about why. That is what is
 * asserted here.
 *
 * The hand-written secretariat that check used to read was placeholder data and
 * has been deleted; the ingested register is the only list of officers there is.
 */
{
  const officialsJson = JSON.parse(
    readFileSync(join(ROOT, "apps/hub/src/content/website/official.json"), "utf8"),
  );
  const inRegister = new Set(officialsJson.map((o) => o.organisation).filter(Boolean));
  const empty = directories.filter((d) => !inRegister.has(d.ownerId));
  if (empty.length) {
    problems.push(
      `apps/hub/src/content/website/official.json\n      ${empty.length} directory page(s) name a body the officers register does not use,\n` +
        `      so they render an empty table:\n        ${empty.map((d) => `${d.ownerId} — ${d.href}`).join("\n        ")}\n` +
        `      Fix the code on the page, or ingest that body's officers.`,
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

/** Which page shows a given body's officials — read out of its \`getOfficialsByOrganisation()\` call. */
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
