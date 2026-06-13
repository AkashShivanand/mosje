import { createHash } from "node:crypto";

export function canonicalizeSlug(slug) {
  return slug.replace(/^home-page\//, "").replace(/-copy$/, "");
}

// Grouping key for dedup: on top of canonicalizeSlug, also collapse a trailing
// numeric sibling suffix (e.g. WordPress "-2", "-3") so "a-2" groups with "a".
function dedupKey(slug) {
  return canonicalizeSlug(slug).replace(/-\d+$/, "");
}

function contentHash(rec) {
  // Section records hash their prose; file records (no `sections`) hash their
  // identifying fields so distinct listing rows never collapse together.
  const norm = Array.isArray(rec.sections)
    ? rec.sections.map((s) => `${s.heading ?? ""}::${s.html}`).join("|").replace(/\s+/g, " ").trim()
    : `${rec.title ?? ""}::${rec.fileUrl ?? rec.sourceUrl ?? ""}`.replace(/\s+/g, " ").trim();
  return createHash("sha1").update(norm).digest("hex");
}

// Keep first occurrence per (canonical-slug + content-hash). A "-2"/"-copy"
// sibling with identical content is skipped; different content is kept (unique).
export function dedupeRecords(records) {
  const seenCanonical = new Map(); // dedupKey -> hash of kept record
  const kept = [];
  const skipped = [];
  // Process in slug-ascending order so the canonical (shorter, suffix-free) slug
  // is first-seen regardless of arbitrary REST order.
  const ordered = [...records].sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  for (const rec of ordered) {
    const canon = dedupKey(rec.slug);
    const hash = contentHash(rec);
    const priorHash = seenCanonical.get(canon);
    if (priorHash && priorHash === hash) {
      skipped.push({ slug: rec.slug, reason: `duplicate of ${canon}` });
      continue;
    }
    if (!seenCanonical.has(canon)) seenCanonical.set(canon, hash);
    kept.push(rec);
  }
  return { kept, skipped };
}
