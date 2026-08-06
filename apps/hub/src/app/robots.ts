import type { MetadataRoute } from "next";

/**
 * Crawling is OFF by default across the estate.
 *
 * Everything deployed today is a work-in-progress prototype seeded with
 * illustrative data and demo credentials — none of it should surface in search
 * results. Set `ALLOW_INDEXING=true` on the environment that eventually serves
 * the real public site to opt back in.
 */
export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.ALLOW_INDEXING === "true";

  return allowIndexing
    ? { rules: [{ userAgent: "*", allow: "/" }] }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
