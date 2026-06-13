import { mkdir, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { collectImageUrls } from "./html-extract.mjs";

const PUBLIC_DIR = new URL("../../public", import.meta.url).pathname;

export function localAssetPath(collection, url) {
  const name = basename(new URL(url).pathname);
  return `/content/${collection}/${name}`;
}

export function rewriteImageRefs(html, urlMap) {
  let out = html;
  for (const [remote, local] of urlMap) out = out.split(`"${remote}"`).join(`"${local}"`);
  return out;
}

async function downloadBinary(url, destPath, fetchImpl = fetch) {
  const res = await fetchImpl(url, { headers: { "User-Agent": "mosje-ingest/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(join(destPath, ".."), { recursive: true });
  await writeFile(destPath, buf);
}

// Downloads every image referenced in a collection's records into
// public/content/<collection>/ and rewrites the section HTML in place.
export async function processCollectionAssets(collection, records, { fetchImpl = fetch } = {}) {
  const urlMap = new Map();
  for (const rec of records) {
    for (const s of rec.sections) {
      for (const url of collectImageUrls(s.html)) {
        if (urlMap.has(url)) continue;
        const local = localAssetPath(collection, url);
        try {
          await downloadBinary(url, join(PUBLIC_DIR, local.replace(/^\//, "")), fetchImpl);
          urlMap.set(url, local);
        } catch (err) {
          console.warn(`  ! asset failed (${url}): ${err.message} — leaving hotlink`);
        }
      }
    }
  }
  for (const rec of records) {
    rec.sections = rec.sections.map((s) => ({ ...s, html: rewriteImageRefs(s.html, urlMap) }));
    if (rec.featuredImageUrl && urlMap.has(rec.featuredImageUrl)) {
      rec.featuredImage = urlMap.get(rec.featuredImageUrl);
    }
  }
  return { records, downloaded: urlMap.size };
}
