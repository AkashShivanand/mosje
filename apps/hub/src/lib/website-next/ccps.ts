/**
 * Central Content Publishing System (CCPS) — DBIM 3.0 §7.4.
 *
 * DBIM makes the CCPS full-width banner the FIRST slide of a Ministry home
 * page's top carousel (§7.4.1 i, §A.4.1 ii). The banners are published by
 * MyGov through an API that a Department subscribes to on the DBIM Toolkit
 * (§7.4.4): its CIO, WIM or Tech SPOC logs in, subscribes this website, and
 * receives an endpoint and a key.
 *
 * This prototype is not subscribed, so it reads the feed where one is
 * configured (CCPS_BANNERS_URL, CCPS_API_KEY) and otherwise shows a MIRRORED
 * SNAPSHOT: the CCPS banner dosje.gov.in itself was serving on the date below,
 * taken from its home page with its own link (live-data-fallback.md — live
 * first, snapshot second, never an empty slot).
 *
 * Server-side, short timeout, cached, never throws.
 */
export interface CcpsBanner {
  src: string;
  alt: string;
  href?: string;
}

/** The banner dosje.gov.in served from ccps.digifootprint.gov.in, as on this date. */
export const CCPS_AS_ON = "2026-09-22";
export const CCPS_SNAPSHOT: CcpsBanner[] = [
  {
    src: "/website/images/banners/ccps-mann-ki-baat.jpg",
    alt: "Mann Ki Baat on 27 September 2026. Share your ideas and suggestions with the Prime Minister: click here or dial 1800 11 7800 (toll-free). The phone lines remain open from 7 to 25 September 2026.",
    href: "https://www.mygov.in/group-issue/inviting-ideas-mann-ki-baat-prime-minister-narendra-modi-27th-september-2026/?target=inapp&type=group_issue&nid=5850",
  },
];

export async function getCcpsBanners(): Promise<CcpsBanner[]> {
  const url = process.env.CCPS_BANNERS_URL;
  if (!url) return CCPS_SNAPSHOT;
  try {
    const res = await fetch(url, {
      headers: process.env.CCPS_API_KEY
        ? { "x-api-key": process.env.CCPS_API_KEY }
        : undefined,
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return CCPS_SNAPSHOT;
    const data: unknown = await res.json();
    const rows = Array.isArray(data)
      ? data
      : Array.isArray((data as { data?: unknown })?.data)
        ? (data as { data: unknown[] }).data
        : [];
    const live = rows
      .map((r) => r as Record<string, unknown>)
      .filter((r) => typeof r.image === "string" || typeof r.src === "string")
      .map((r) => ({
        src: String(r.image ?? r.src),
        alt:
          typeof r.alt === "string"
            ? r.alt
            : typeof r.title === "string"
              ? r.title
              : "",
        href:
          typeof r.link === "string"
            ? r.link
            : typeof r.href === "string"
              ? r.href
              : undefined,
      }));
    return live.length > 0 ? live : CCPS_SNAPSHOT;
  } catch {
    return CCPS_SNAPSHOT;
  }
}
