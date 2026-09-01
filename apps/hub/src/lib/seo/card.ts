/**
 * The estate's social card, described once.
 *
 * Two consumers need to agree about this image and cannot see each other:
 * `app/opengraph-image.tsx`, which DRAWS it, and every `openGraph` block that
 * has to POINT at it. They are split because of a sharp edge in how Next
 * resolves metadata:
 *
 *   A file-convention `opengraph-image` attaches to the segment it sits in, but
 *   a page or layout that exports its own `openGraph` block REPLACES the
 *   ancestor's rather than merging into it — so it drops the inherited picture
 *   and unfurls with text only.
 *
 * That is silent, and it is exactly what happened to the schemes index, the
 * portals gateway and the gate the first time they were given their own card
 * text. The fix that holds is to stop relying on inheritance: any block that
 * declares `openGraph` also names its image, and `socialCard()` does that by
 * default so nobody has to remember.
 *
 * `/opengraph-image` is the root route Next generates from
 * `app/opengraph-image.tsx`. It is written without the cache-busting query Next
 * appends internally; the route answers either way, and a path we can write by
 * hand is worth more here than a hash we cannot.
 */
export const OG_CARD_ALT =
  "SAMAVESH — Ministry of Social Justice & Empowerment, Government of India. One unified website and 20 workflow portals across 33+ organisations.";

export const OG_CARD_SIZE = { width: 1200, height: 630 };

export const OG_CARD_IMAGE = {
  url: "/opengraph-image",
  width: OG_CARD_SIZE.width,
  height: OG_CARD_SIZE.height,
  alt: OG_CARD_ALT,
};
