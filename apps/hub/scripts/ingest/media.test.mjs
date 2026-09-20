import { test } from "node:test";
import assert from "node:assert/strict";
import { mediaUrls, resolveMedia } from "./media.mjs";

test("mediaUrls prefers a display size for the thumbnail and omits it when identical", () => {
  assert.deepEqual(
    mediaUrls({ source_url: "https://c/a.png", mime_type: "image/png", media_details: { sizes: { medium: { source_url: "https://c/a-300.png" }, large: { source_url: "https://c/a-1024.png" } } } }),
    { url: "https://c/a.png", thumbnailUrl: "https://c/a-1024.png", mimeType: "image/png" },
  );
  assert.deepEqual(mediaUrls({ source_url: "https://c/b.jpg" }), { url: "https://c/b.jpg" });
  assert.equal(mediaUrls({}), undefined);
});

test("resolveMedia batches unique positive ids 100 at a time", async () => {
  const urls = [];
  const fetch = async (url) => {
    urls.push(url);
    const ids = new URL(url).searchParams.get("include").split(",").map(Number);
    return { body: ids.map((id) => ({ id, source_url: `https://c/${id}.jpg` })) };
  };
  const ids = [0, 5, 5, ...Array.from({ length: 150 }, (_, i) => i + 1)];
  const map = await resolveMedia(ids, { fetch });
  assert.equal(urls.length, 2);
  assert.equal(map.size, 150);
  assert.deepEqual(map.get(5), { url: "https://c/5.jpg" });
});
