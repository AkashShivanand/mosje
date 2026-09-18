import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

// On-disk cache for fetched record pages, so an interrupted multi-thousand-page
// ingest resumes instead of starting over. `.cache/` is gitignored estate-wide.
// Keys include the record's `modified_gmt`, so an edited record is re-fetched.
const DEFAULT_DIR = new URL("./.cache/html", import.meta.url).pathname;

export function cacheKey(...parts) {
  return createHash("sha1").update(parts.map(String).join("|")).digest("hex");
}

export async function cached(key, produce, { dir = process.env.INGEST_CACHE_DIR || DEFAULT_DIR, maxAgeMs } = {}) {
  const file = join(dir, `${key}.html`);
  try {
    if (maxAgeMs != null) {
      const s = await stat(file);
      if (Date.now() - s.mtimeMs > maxAgeMs) throw new Error("stale");
    }
    return await readFile(file, "utf8");
  } catch {
    const body = await produce();
    await mkdir(dir, { recursive: true });
    await writeFile(file, body);
    return body;
  }
}
