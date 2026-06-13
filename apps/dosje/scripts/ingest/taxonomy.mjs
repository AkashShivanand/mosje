import { fetchJson } from "./wp-client.mjs";

const BASE = "https://www.dosje.gov.in/wp-json/wp/v2";

export async function resolveTermNames(taxonomy, ids, opts = {}) {
  if (!ids || ids.length === 0) return [];
  const url = `${BASE}/${taxonomy}?include=${ids.join(",")}&per_page=100&_fields=id,name`;
  const { body } = await fetchJson(url, opts);
  const byId = new Map(body.map((t) => [t.id, t.name]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}
