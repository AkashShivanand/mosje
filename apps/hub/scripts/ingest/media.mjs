import { fetchJson } from "./wp-client.mjs";

const REST = "https://www.dosje.gov.in/wp-json/wp/v2";

/** A REST media item → the original URL and a display-size thumbnail. */
export function mediaUrls(item) {
  if (!item?.source_url) return undefined;
  const sizes = item.media_details?.sizes ?? {};
  const thumb = sizes.medium_large ?? sizes.large ?? sizes.medium ?? sizes.full;
  const out = { url: item.source_url };
  if (thumb?.source_url && thumb.source_url !== item.source_url) out.thumbnailUrl = thumb.source_url;
  if (item.mime_type) out.mimeType = item.mime_type;
  return out;
}

// Featured images / ACF image IDs → URLs, 100 IDs per request. IDs the API does
// not return (deleted or private attachments) are simply absent from the map.
export async function resolveMedia(ids, { fetch: fetchImpl = fetchJson, ...opts } = {}) {
  const unique = [...new Set((ids ?? []).filter((id) => Number.isInteger(id) && id > 0))];
  const out = new Map();
  for (let i = 0; i < unique.length; i += 100) {
    const chunk = unique.slice(i, i + 100);
    const url = `${REST}/media?include=${chunk.join(",")}&per_page=100&_fields=id,source_url,mime_type,media_details`;
    const { body } = await fetchImpl(url, opts);
    for (const item of body) {
      const urls = mediaUrls(item);
      if (urls) out.set(item.id, urls);
    }
  }
  return out;
}
