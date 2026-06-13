import { writeFile, mkdir, readFile } from "node:fs/promises";
import { fetchAllRecords, fetchSitemapUrls } from "./wp-client.mjs";
import { resolveTermNames } from "./taxonomy.mjs";
import { transformRecord, transformFileRecord } from "./transform.mjs";
import { dedupeRecords, canonicalizeSlug } from "./dedup.mjs";
import { deriveCollectionSlug } from "./slug.mjs";
import { processCollectionAssets } from "./assets.mjs";
import { buildReport, formatReport } from "./verify.mjs";
import { collectionFileSchema, fileCollectionFileSchema } from "./schema.mjs";
import { COLLECTIONS } from "./collections.mjs";

const CONTENT_DIR = new URL("../../src/content", import.meta.url).pathname;
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
    const transform = def.kind === "file" ? transformFileRecord : transformRecord;
    const rec = transform(r, { taxonomyNames, type: def.name });
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

  return { def, kept, skipped, sitemapCount: sitemapUrls.length };
}

async function main() {
  const toRun = ONLY ? COLLECTIONS.filter((c) => ONLY.has(c.name)) : COLLECTIONS;
  if (ONLY && toRun.length === 0) { console.error(`No collections match --only=${[...ONLY].join(",")}`); process.exit(1); }

  const results = [];
  for (const def of toRun) results.push(await ingestCollection(def));

  const reports = results.map((r) =>
    buildReport({ collection: r.def.name, sitemapCount: r.sitemapCount, kept: r.kept.length, skipped: r.skipped.length })
  );
  console.log(formatReport(reports));

  if (!ASSETS_ONLY && !VERIFY_ONLY) {
    let existing = [];
    try { existing = JSON.parse(await readFile(`${CONTENT_DIR}/manifest.json`, "utf8")).collections ?? []; } catch {}
    const byName = new Map(existing.map((c) => [c.name, c]));
    for (const r of results) byName.set(r.def.name, { name: r.def.name, sitemapCount: r.sitemapCount, kept: r.kept.length, skipped: r.skipped.length, skippedDetail: r.skipped });
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
