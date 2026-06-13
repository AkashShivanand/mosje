import { fetchJson } from "./wp-client.mjs";

const BASE = "https://www.dosje.gov.in/wp-json/wp/v2";

const cache = new Map();

// WP returns taxonomy term names HTML-encoded (e.g. "Notices &amp; Tenders").
// Decode the common entities so downstream records hold clean display strings.
function decodeTermName(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&#038;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘").replace(/&nbsp;/g, " ").trim();
}

export async function resolveTermNames(taxonomy, ids, opts = {}) {
  if (!ids || ids.length === 0) return [];
  const key = taxonomy + "|" + [...ids].sort((a, b) => a - b).join(",");
  if (cache.has(key)) return cache.get(key);
  const url = `${BASE}/${taxonomy}?include=${ids.join(",")}&per_page=100&_fields=id,name`;
  const { body } = await fetchJson(url, opts);
  const byId = new Map(body.map((t) => [t.id, decodeTermName(t.name)]));
  const names = ids.map((id) => byId.get(id)).filter(Boolean);
  cache.set(key, names);
  return names;
}
