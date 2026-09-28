/**
 * Central Content Publishing System (CCPS) — DBIM 3.0 §7.4.
 *
 * DBIM makes the CCPS full-width banner the FIRST slide of a Ministry home
 * page's top carousel (§7.4.1 i, §A.4.1 ii), and every design of this website
 * leads with it — the Department's instruction of 28 Sep 2026. The banners are
 * published by MyGov through an API that a Department subscribes to on the DBIM
 * Toolkit (§7.4.4): its CIO, WIM or Tech SPOC logs in, subscribes this website,
 * and receives an endpoint and a key.
 *
 * This prototype is not subscribed, so it reads the feed where one is
 * configured (CCPS_BANNERS_URL, CCPS_API_KEY) and otherwise shows a MIRRORED
 * SNAPSHOT, CCPS_SNAPSHOT in lib/website-shared/home.ts, kept locally
 * (live-data-fallback.md — live first, snapshot second, never an empty slot).
 *
 * Server-side, short timeout, cached, never throws.
 */
import { CCPS_SNAPSHOT, type HomeBanner } from "@/lib/website-shared/home";

export type CcpsBanner = HomeBanner;

/** The CCPS images are 1800×600, as the feed's own metadata states. */
const SIZE = { width: 1800, height: 600 } as const;

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

/**
 * Reads either shape: the CCPS WordPress feed a DBIM build consumes —
 * `{ posts: [{ acf_data: { image_1: { url, alt }, image_url_1, … image_5 } }] }`,
 * as served at master-socialjustice.digifootprint.gov.in/ccms/wp-json/post-page/top_banner —
 * or a flat `[{ image | src, alt | title, link | href }]` list.
 */
function parse(data: unknown): CcpsBanner[] {
  const root = data as { posts?: unknown; data?: unknown } | null;
  const rows: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(root?.posts)
      ? root.posts
      : Array.isArray(root?.data)
        ? root.data
        : [];
  return rows.flatMap((raw): CcpsBanner[] => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const acf = r.acf_data as Record<string, unknown> | undefined;
    if (acf) {
      return [1, 2, 3, 4, 5].flatMap((n) => {
        const img = acf[`image_${n}`] as Record<string, unknown> | false | undefined;
        const src = img ? str(img.url) : undefined;
        if (!img || !src) return [];
        return [{ src, alt: str(img.alt) ?? "", href: str(acf[`image_url_${n}`]), ...SIZE }];
      });
    }
    const src = str(r.image) ?? str(r.src);
    if (!src) return [];
    return [{ src, alt: str(r.alt) ?? str(r.title) ?? "", href: str(r.link) ?? str(r.href), ...SIZE }];
  });
}

export async function getCcpsBanners(): Promise<CcpsBanner[]> {
  const url = process.env.CCPS_BANNERS_URL;
  if (!url) return [...CCPS_SNAPSHOT];
  try {
    const res = await fetch(url, {
      headers: process.env.CCPS_API_KEY
        ? { "x-api-key": process.env.CCPS_API_KEY }
        : undefined,
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [...CCPS_SNAPSHOT];
    const live = parse(await res.json());
    return live.length > 0 ? live : [...CCPS_SNAPSHOT];
  } catch {
    return [...CCPS_SNAPSHOT];
  }
}
