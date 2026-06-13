import { fetchJson } from "./wp-client.mjs";

const BASE = "https://www.dosje.gov.in/wp-json/wp/v2";

const cache = new Map();

export async function resolveTermNames(taxonomy, ids, opts = {}) {
  if (!ids || ids.length === 0) return [];
  const key = taxonomy + "|" + [...ids].sort((a, b) => a - b).join(",");
  if (cache.has(key)) return cache.get(key);
  const url = `${BASE}/${taxonomy}?include=${ids.join(",")}&per_page=100&_fields=id,name`;
  const { body } = await fetchJson(url, opts);
  const byId = new Map(body.map((t) => [t.id, t.name]));
  const names = ids.map((id) => byId.get(id)).filter(Boolean);
  cache.set(key, names);
  return names;
}
