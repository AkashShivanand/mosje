import { writeFile, mkdir, readFile } from "node:fs/promises";
import { z } from "zod";
import { fetchAllRecords, fetchSitemapUrls } from "./wp-client.mjs";
import { resolveTermNames } from "./taxonomy.mjs";
import { transformRecord, transformFileRecord } from "./transform.mjs";
import { dedupeRecords, canonicalizeSlug } from "./dedup.mjs";
import { deriveCollectionSlug } from "./slug.mjs";
import { processCollectionAssets } from "./assets.mjs";
import { buildReport, formatReport } from "./verify.mjs";
import { collectionFileSchema, fileCollectionFileSchema } from "./schema.mjs";
import { COLLECTIONS } from "./collections.mjs";
import { KINDS } from "./kinds.mjs";
import { fetchRankMathSitemapUrls } from "./wp-client.mjs";
import { loadTermMap, namesFromMap } from "./taxonomy.mjs";
import { resolveMedia } from "./media.mjs";
import { fetchRecordPages, fetchDocumentListing } from "./record-pages.mjs";
import { parseDocumentListing } from "./detail-extract.mjs";

// Namespaced under src/content/website/ now that the website is a native route
// group in the hub rather than its own app.
const CONTENT_DIR = new URL("../../src/content/website", import.meta.url).pathname;
const argv = new Set(process.argv.slice(2));
const ASSETS_ONLY = argv.has("--assets-only");
const VERIFY_ONLY = argv.has("--verify-only");
const onlyArg = process.argv.slice(2).find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").map((s) => s.trim()).filter(Boolean)) : null;

function slugFromUrl(url) {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

async function ingestCollection(def) {
  console.log(`\n→ ${def.name}`);
  // Partial collections are an intentional, type-filtered subset fetched via a REST
  // taxonomy filter. We do NOT consult the sitemap for them: the documents sitemap is
  // incomplete/huge and would wrongly drop the records we deliberately selected.
  const partial = def.partial === true;
  const sitemapUrls = partial ? [] : await fetchSitemapUrls(def.sitemapType);
  // When basePath is set, identity is the full path under the base segment (unique
  // per nested page); otherwise fall back to the leaf slug.
  const allowed = new Set(
    def.basePath
      ? sitemapUrls.map((u) => deriveCollectionSlug(u, def.basePath)).filter((s) => s != null && s !== "")
      : sitemapUrls.map((u) => canonicalizeSlug(slugFromUrl(u)))
  );

  const raw = await fetchAllRecords(def.restBase, { fields: def.fields, query: def.query });
  if (partial) {
    console.log(`  fetched ${raw.length} raw records (intentional type-filtered subset; sitemap skipped)`);
  } else {
    console.log(`  fetched ${raw.length} raw records; sitemap lists ${allowed.size}`);
  }

  const records = [];
  for (const r of raw) {
    const identity = def.basePath
      ? deriveCollectionSlug(r.link, def.basePath)
      : canonicalizeSlug(r.slug);
    if (!partial && allowed.size && !allowed.has(identity)) continue; // restrict to canonical URL set
    const taxonomyNames = {};
    for (const [key, taxBase] of Object.entries(def.taxonomies ?? {})) {
      taxonomyNames[key] = await resolveTermNames(taxBase, r[taxBase] ?? []);
    }
    const transform = def.kind === "file" ? transformFileRecord : transformRecord;
    const rec = transform(r, { taxonomyNames, type: def.name, preferCategories: def.preferCategories });
    if (def.basePath) rec.slug = deriveCollectionSlug(r.link, def.basePath); // unique path-based slug
    records.push(rec);
  }

  const { kept, skipped } = dedupeRecords(records);
  console.log(`  kept ${kept.length}, skipped ${skipped.length} duplicates`);

  // File collections are listing rows (no `sections`) → no local assets to fetch.
  if (!VERIFY_ONLY && def.kind !== "file") {
    await processCollectionAssets(def.name, kept);
  }

  const schema = def.kind === "file" ? fileCollectionFileSchema : collectionFileSchema;
  schema.parse(kept); // throws on malformed → fails build

  if (!ASSETS_ONLY && !VERIFY_ONLY) {
    await mkdir(CONTENT_DIR, { recursive: true });
    await writeFile(`${CONTENT_DIR}/${def.name}.json`, JSON.stringify(kept, null, 2) + "\n");
  }

  // For partial collections the sitemap is not the source of truth, so report
  // sitemapCount as everything we accounted for (kept+skipped) → missing=0, ok=true.
  const sitemapCount = partial ? kept.length + skipped.length : sitemapUrls.length;
  return { def, kept, skipped, sitemapCount };
}

// Record identity across REST, sitemap and listing: the path, without a trailing
// slash and percent-decoded (the sitemap and REST disagree on %-case for Hindi slugs).
function urlKey(u) {
  try { return decodeURIComponent(new URL(u).pathname).replace(/\/+$/, "").toLowerCase(); } catch { return u; }
}

async function ingestRichCollection(def) {
  console.log(`\n→ ${def.name} (${def.kind})`);
  const kind = KINDS[def.kind];
  const sitemapUrls = def.sitemapType ? await fetchRankMathSitemapUrls(def.sitemapType) : [];
  const raw = await fetchAllRecords(def.restBase, { fields: def.fields });
  console.log(`  fetched ${raw.length} REST records; sitemap lists ${def.sitemapType ? sitemapUrls.length : "n/a"}`);

  const termMaps = {};
  for (const tax of def.terms ?? []) termMaps[tax] = await loadTermMap(tax);

  // Page-derived fields, keyed by record URL.
  const details = new Map();
  if (def.detail === "listing") {
    for (const html of await fetchDocumentListing()) {
      for (const row of parseDocumentListing(html)) details.set(urlKey(row.recordUrl), row);
    }
    console.log(`  listing rows ${details.size}`);
  }
  if (kind.detail === "page") {
    const need = raw.filter((r) => !details.has(urlKey(r.link)));
    if (def.detail === "listing" && need.length) console.log(`  ${need.length} records not in listing → reading their pages`);
    const pages = await fetchRecordPages(need, { label: def.name });
    for (const r of need) {
      const html = pages.get(r.link);
      if (html != null) details.set(urlKey(r.link), kind.parsePage(html));
    }
  }

  let media = new Map();
  if (kind.media) {
    const ids = raw.flatMap((r) => [r.featured_media, ...(r.acf?.item_images ?? [])]);
    media = await resolveMedia(ids);
  }

  const records = raw.map((r) => {
    const terms = {};
    for (const [tax, map] of Object.entries(termMaps)) terms[tax] = namesFromMap(map, r[tax]);
    const detail = kind.detail === "content" ? kind.parseContent(r.content?.rendered ?? "") : details.get(urlKey(r.link));
    return kind.transform(r, { terms, detail, media, preferCategories: def.preferCategories });
  });
  const withoutDetail = raw.filter((r) => kind.detail !== "content" && !details.has(urlKey(r.link))).length;
  if (withoutDetail) console.warn(`  ! ${withoutDetail} records have no page fields (page fetch failed)`);

  const { kept, skipped } = dedupeRecords(records);
  console.log(`  kept ${kept.length}, skipped ${skipped.length} duplicates`);
  z.array(kind.schema).parse(kept); // throws on malformed → fails the ingest

  const restKeys = new Set(raw.map((r) => urlKey(r.link)));
  const sitemapKeys = new Set(sitemapUrls.map(urlKey));
  const sitemapOnly = [...sitemapKeys].filter((k) => !restKeys.has(k));
  const notInSitemap = def.sitemapType ? [...restKeys].filter((k) => !sitemapKeys.has(k)) : [];
  if (sitemapOnly.length) console.warn(`  ! ${sitemapOnly.length} sitemap URLs not returned by REST: ${sitemapOnly.slice(0, 5).join(", ")}`);
  if (notInSitemap.length) console.log(`  ${notInSitemap.length} published REST records are absent from the sitemap (kept)`);

  // A collection that would ship one very large JSON module is split by category
  // (see `splitByCategory` in collections.mjs); everything else stays in one file.
  const files = new Map([[def.name, kept]]);
  for (const [category, fileName] of Object.entries(def.splitByCategory ?? {})) {
    files.set(fileName, kept.filter((r) => r.category === category));
    files.set(def.name, files.get(def.name).filter((r) => r.category !== category));
  }
  if (!VERIFY_ONLY && !ASSETS_ONLY) {
    await mkdir(CONTENT_DIR, { recursive: true });
    for (const [fileName, rows] of files) {
      await writeFile(`${CONTENT_DIR}/${fileName}.json`, JSON.stringify(rows, null, 2) + "\n");
      if (fileName !== def.name) console.log(`  split ${rows.length} records into ${fileName}.json`);
    }
  }
  // "Missing" = sitemap URLs we hold no record for. Collections with no sitemap are
  // measured against REST, which is then the whole public set.
  const sitemapCount = def.sitemapType ? sitemapUrls.length : raw.length;
  const accountedSitemap = def.sitemapType ? sitemapUrls.length - sitemapOnly.length : raw.length;
  return {
    def, kept, skipped, sitemapCount,
    files: [...files].map(([name, rows]) => ({ name, count: rows.length })),
    extra: { restCount: raw.length, notInSitemap: notInSitemap.length, sitemapOnly: sitemapOnly.length, withoutDetail, accountedSitemap },
  };
}

async function main() {
  const toRun = ONLY ? COLLECTIONS.filter((c) => ONLY.has(c.name)) : COLLECTIONS;
  if (ONLY && toRun.length === 0) { console.error(`No collections match --only=${[...ONLY].join(",")}`); process.exit(1); }

  const results = [];
  for (const def of toRun) results.push(def.kind && KINDS[def.kind] ? await ingestRichCollection(def) : await ingestCollection(def));

  const reports = results.map((r) =>
    r.extra
      // Rich: a gap is a sitemap URL REST did not return, or a record whose page failed.
      ? { ...buildReport({ collection: r.def.name, sitemapCount: r.sitemapCount, kept: r.extra.accountedSitemap, skipped: 0 }), kept: r.kept.length, skipped: r.skipped.length, ok: r.extra.sitemapOnly === 0 && r.extra.withoutDetail === 0 }
      : buildReport({ collection: r.def.name, sitemapCount: r.sitemapCount, kept: r.kept.length, skipped: r.skipped.length })
  );
  console.log(formatReport(reports));

  if (!ASSETS_ONLY && !VERIFY_ONLY) {
    let existing = [];
    try { existing = JSON.parse(await readFile(`${CONTENT_DIR}/manifest.json`, "utf8")).collections ?? []; } catch {}
    const byName = new Map(existing.map((c) => [c.name, c]));
    for (const r of results) byName.set(r.def.name, { name: r.def.name, sitemapCount: r.sitemapCount, kept: r.kept.length, skipped: r.skipped.length, ...(r.files && r.files.length > 1 ? { files: r.files } : {}), ...(r.extra ? { restCount: r.extra.restCount, notInSitemap: r.extra.notInSitemap, sitemapOnly: r.extra.sitemapOnly, withoutPageFields: r.extra.withoutDetail } : {}), skippedDetail: r.skipped });
    const manifest = { generatedAt: new Date().toISOString(), collections: [...byName.values()].sort((a, b) => a.name.localeCompare(b.name)) };
    await writeFile(`${CONTENT_DIR}/manifest.json`, JSON.stringify(manifest, null, 2) + "\n");
  }

  const failed = reports.filter((r) => !r.ok);
  if (failed.length) {
    console.error(`\n✖ ${failed.length} collection(s) have gaps. See report above.`);
    process.exitCode = 1;
  } else {
    console.log("\n✓ all collections fully synced");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
