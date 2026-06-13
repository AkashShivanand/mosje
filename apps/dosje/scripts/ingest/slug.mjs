// Derive a unique slug from a URL = the path AFTER the base segment, slash-trimmed.
// e.g. (".../organisation/org/about-us/", "organisation") -> "org/about-us"
export function deriveCollectionSlug(url, base) {
  const segments = new URL(url).pathname.split("/").filter(Boolean);
  const idx = segments.indexOf(base);
  if (idx === -1 || idx === segments.length - 1) return idx === -1 ? null : "";
  return segments.slice(idx + 1).join("/");
}
