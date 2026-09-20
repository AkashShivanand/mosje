import { fetchJson, fetchAllRecords } from "./wp-client.mjs";
import { decodeEntities } from "./utils.mjs";

const BASE = "https://www.dosje.gov.in/wp-json/wp/v2";

const cache = new Map();

export async function resolveTermNames(taxonomy, ids, opts = {}) {
  if (!ids || ids.length === 0) return [];
  const key = taxonomy + "|" + [...ids].sort((a, b) => a - b).join(",");
  if (cache.has(key)) return cache.get(key);
  const url = `${BASE}/${taxonomy}?include=${ids.join(",")}&per_page=100&_fields=id,name`;
  const { body } = await fetchJson(url, opts);
  const byId = new Map(body.map((t) => [t.id, decodeEntities(t.name)]));
  const names = ids.map((id) => byId.get(id)).filter(Boolean);
  cache.set(key, names);
  return names;
}

// Whole-taxonomy lookup. The rich collections (documents alone carries ~6,000
// records across 49 types) would otherwise make one `include=` request per
// distinct term combination; one paginated read per taxonomy replaces them all.
const termMaps = new Map();

export async function loadTermMap(taxonomy, { fetchAll = fetchAllRecords, ...opts } = {}) {
  if (termMaps.has(taxonomy)) return termMaps.get(taxonomy);
  const terms = await fetchAll(taxonomy, { fields: ["id", "name"], ...opts });
  const map = new Map(terms.map((t) => [t.id, decodeEntities(t.name)]));
  termMaps.set(taxonomy, map);
  return map;
}

export function namesFromMap(map, ids) {
  return (ids ?? []).map((id) => map.get(id)).filter(Boolean);
}
