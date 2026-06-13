import { writeFile, mkdir } from "node:fs/promises";
import { fetchAllRecords, fetchSitemapUrls } from "./wp-client.mjs";
import { resolveTermNames } from "./taxonomy.mjs";
import { transformRecord } from "./transform.mjs";
import { dedupeRecords, canonicalizeSlug } from "./dedup.mjs";
import { deriveCollectionSlug } from "./slug.mjs";
import { processCollectionAssets } from "./assets.mjs";
import { buildReport, formatReport } from "./verify.mjs";
import { collectionFileSchema } from "./schema.mjs";
import { COLLECTIONS } from "./collections.mjs";

const CONTENT_DIR = new URL("../../src/content", import.meta.url).pathname;
const argv = new Set(process.argv.slice(2));
const ASSETS_ONLY = argv.has("--assets-only");
const VERIFY_ONLY = argv.has("--verify-only");

function slugFromUrl(url) {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

async function ingestCollection(def) {
  console.log(`\n→ ${def.name}`);
  const sitemapUrls = await fetchSitemapUrls(def.sitemapType);
  // When basePath is set, identity is the full path under the base segment (unique
  // per nested page); otherwise fall back to the leaf slug.
  const allowed = new Set(
    def.basePath
      ? sitemapUrls.map((u) => deriveCollectionSlug(u, def.basePath)).filter((s) => s != null && s !== "")
      : sitemapUrls.map((u) => canonicalizeSlug(slugFromUrl(u)))
  );

  const raw = await fetchAllRecords(def.restBase, { fields: def.fields });
  console.log(`  fetched ${raw.length} raw records; sitemap lists ${allowed.size}`);

  const records = [];
  for (const r of raw) {
    const identity = def.basePath
      ? deriveCollectionSlug(r.link, def.basePath)
      : canonicalizeSlug(r.slug);
    if (allowed.size && !allowed.has(identity)) continue; // restrict to canonical URL set
    const taxonomyNames = {};
    for (const [key, taxBase] of Object.entries(def.taxonomies ?? {})) {
      taxonomyNames[key] = await resolveTermNames(taxBase, r[taxBase] ?? []);
    }
    const rec = transformRecord(r, { taxonomyNames, type: def.name });
    if (def.basePath) rec.slug = deriveCollectionSlug(r.link, def.basePath); // unique path-based slug
    records.push(rec);
  }

  const { kept, skipped } = dedupeRecords(records);
  console.log(`  kept ${kept.length}, skipped ${skipped.length} duplicates`);

  if (!VERIFY_ONLY) {
    await processCollectionAssets(def.name, kept);
  }

  collectionFileSchema.parse(kept); // throws on malformed → fails build

  if (!ASSETS_ONLY && !VERIFY_ONLY) {
    await mkdir(CONTENT_DIR, { recursive: true });
    await writeFile(`${CONTENT_DIR}/${def.name}.json`, JSON.stringify(kept, null, 2) + "\n");
  }

  return { def, kept, skipped, sitemapCount: sitemapUrls.length };
}

async function main() {
  const results = [];
  for (const def of COLLECTIONS) results.push(await ingestCollection(def));

  const reports = results.map((r) =>
    buildReport({ collection: r.def.name, sitemapCount: r.sitemapCount, kept: r.kept.length, skipped: r.skipped.length })
  );
  console.log(formatReport(reports));

  if (!ASSETS_ONLY && !VERIFY_ONLY) {
    const manifest = {
      generatedAt: new Date().toISOString(),
      collections: results.map((r) => ({
        name: r.def.name,
        sitemapCount: r.sitemapCount,
        kept: r.kept.length,
        skipped: r.skipped.length,
        skippedDetail: r.skipped,
      })),
    };
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
