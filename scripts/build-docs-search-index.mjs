#!/usr/bin/env node
/**
 * Generates the design-system search index from doc pages, and gates it against drift.
 *
 * Scans `apps/hub/src/app/design-system/** /page.tsx`, extracts titles, descriptions,
 * route sections, status badges, and heading keywords, then writes
 * `apps/hub/src/lib/design-system/search-data.generated.ts`.
 *
 * Usage:
 *   node scripts/build-docs-search-index.mjs          # write
 *   node scripts/build-docs-search-index.mjs --check  # fail on drift
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DOCS_DIR = join(ROOT, "apps/hub/src/app/design-system");
const OUT_FILE = join(ROOT, "apps/hub/src/lib/design-system/search-data.generated.ts");
const CHECK_MODE = process.argv.includes("--check");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (name === "page.tsx") {
      out.push(full);
    }
  }
  return out;
}

const pageFiles = walk(DOCS_DIR);

function extractMetadata(content) {
  let title = "";
  let description = "";

  const titleMatch = content.match(/title:\s*["'`]([^"'`]+)["'`]/);
  if (titleMatch) title = titleMatch[1].replace(/ — SAMAVESH Design System| - SAMAVESH Design System/g, "").trim();

  const descMatch = content.match(/description:\s*["'`]([^"'`]+)["'`]/);
  if (descMatch) description = descMatch[1].trim();

  return { title, description };
}

function deriveSection(route) {
  if (route.startsWith("/foundations")) return "Foundations";
  if (route.startsWith("/components/brand")) return "Brand";
  if (route.startsWith("/components/actions")) return "Actions";
  if (route.startsWith("/components/forms")) return "Forms & Inputs";
  if (route.startsWith("/components/navigation") || route.startsWith("/components/section-templates")) return "Navigation";
  if (route.startsWith("/components/feedback")) return "Feedback & Status";
  if (route.startsWith("/components/data-display")) return "Data Display";
  if (route.startsWith("/components/layout")) return "Layout";
  if (route.startsWith("/components/utilities")) return "Utilities";
  if (route.startsWith("/components/auth") || route.startsWith("/components/dashboard")) return "Auth & Dashboard";
  if (route.startsWith("/data-visualisation")) return "Data Visualisation";
  if (route.startsWith("/resources/patterns")) return "Patterns";
  if (route.startsWith("/resources")) return "Resources";
  return "Getting Started";
}

function deriveType(route) {
  if (route.startsWith("/foundations")) return "foundation";
  if (route.startsWith("/components")) return "component";
  if (route.startsWith("/resources/patterns") || route.startsWith("/data-visualisation/archetypes")) return "pattern";
  if (route.startsWith("/resources")) return "resource";
  return "page";
}

function deriveIcon(section, title) {
  const s = section.toLowerCase();
  const t = title.toLowerCase();
  if (s.includes("found")) {
    if (t.includes("color")) return "palette";
    if (t.includes("type")) return "text_fields";
    if (t.includes("space")) return "space_bar";
    if (t.includes("shape") || t.includes("radius")) return "rounded_corner";
    if (t.includes("elev") || t.includes("shadow")) return "layers";
    if (t.includes("grid")) return "grid_view";
    if (t.includes("motion")) return "animation";
    if (t.includes("icon")) return "category";
    if (t.includes("a11y") || t.includes("access")) return "accessibility";
    return "palette";
  }
  if (s.includes("form")) return "edit_note";
  if (s.includes("nav")) return "navigation";
  if (s.includes("feed")) return "notifications";
  if (s.includes("data") || t.includes("chart")) return "bar_chart";
  if (s.includes("layout")) return "view_quilt";
  if (s.includes("util")) return "build";
  if (s.includes("auth")) return "lock";
  if (s.includes("pattern")) return "dashboard_customize";
  if (s.includes("resource")) return "menu_book";
  return "widgets";
}

const entries = [];

for (const file of pageFiles) {
  const relPath = relative(DOCS_DIR, file).replace(/(^|\/)page\.tsx$/, "");
  const route = relPath === "" ? "/design-system" : `/design-system/${relPath}`;
  const content = readFileSync(file, "utf8");
  const { title: rawTitle, description } = extractMetadata(content);

  // Derive human-readable title if missing from metadata
  let title = rawTitle;
  if (!title) {
    const slug = relPath.split("/").pop() || "Overview";
    title = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const section = deriveSection(route.replace(/^\/design-system/, ""));
  const type = deriveType(route.replace(/^\/design-system/, ""));
  const iconName = deriveIcon(section, title);

  // Extract headings as additional search keywords
  const headingMatches = Array.from(content.matchAll(/<h[23][^>]*id=["']([^"']+)["'][^>]*>([^<]+)<\/h[23]>/g));
  const headingKeywords = headingMatches.map((m) => m[2].trim()).join(" ");

  // Extract props table keywords if any
  const propMatches = Array.from(content.matchAll(/name:\s*["']([^"']+)["']/g));
  const propKeywords = propMatches.map((m) => m[1]).slice(0, 15).join(" ");

  // Status badge extraction
  const badgeMatch = content.match(/<StatusBadge\s+status=["']([^"']+)["']/);
  const badge = badgeMatch ? badgeMatch[1] : (section === "Foundations" ? "Stable" : undefined);

  const keywords = `${title.toLowerCase()} ${section.toLowerCase()} ${headingKeywords.toLowerCase()} ${propKeywords} tokens wcag accessibility`.trim();

  entries.push({
    title,
    section,
    href: route,
    keywords,
    description: description || `SAMAVESH ${title} component specifications, props and usage guidelines.`,
    type,
    badge,
    iconName,
  });
}

// Sort alphabetically by title
entries.sort((a, b) => a.title.localeCompare(b.title));

const fileContent = `/**
 * Generated by scripts/build-docs-search-index.mjs.
 * DO NOT EDIT MANUALLY.
 * Run \`node scripts/build-docs-search-index.mjs\` to regenerate.
 */

export interface SearchEntry {
  title: string;
  section: string;
  href: string;
  keywords: string;
  description: string;
  type: "foundation" | "component" | "pattern" | "resource" | "page";
  badge?: "Stable" | "Beta" | "Alpha" | "New" | "Proposed" | "Deprecated";
  iconName: string;
}

export const SEARCH_DATA: SearchEntry[] = ${JSON.stringify(entries, null, 2)};
`;

if (CHECK_MODE) {
  if (!existsSync(OUT_FILE)) {
    console.error(`✖ Search index file missing: ${OUT_FILE}`);
    process.exit(1);
  }
  const currentContent = readFileSync(OUT_FILE, "utf8");
  if (currentContent !== fileContent) {
    console.error("✖ Design System search index is out of date. Run `node scripts/build-docs-search-index.mjs` to sync.");
    process.exit(1);
  }
  console.log(`✔ search index up to date (${entries.length} pages indexed).`);
} else {
  writeFileSync(OUT_FILE, fileContent, "utf8");
  console.log(`✔ Generated design system search index with ${entries.length} pages -> ${OUT_FILE}`);
}
