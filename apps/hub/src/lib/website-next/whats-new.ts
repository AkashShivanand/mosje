import { getAllDocuments, getUpdates, routeSlug } from "@/lib/website/content";
import { organisationName } from "@/components/website-next/media/org-name";
import { dateValue, isArchived, tidyTitle } from "@/components/website-next/ui/records";

export interface NewsItem { key: string; kind: string; title: string; href: string; date?: string; org?: string }

export const newestFirst = <T extends { date?: string }>(rows: T[]) => [...rows].sort((a, b) => dateValue(b.date) - dateValue(a.date));

/**
 * What's New, as the live home page composes it: updates, circulars, notices,
 * results and announcements in one feed, newest first (issue X-FR-02). Only the
 * last twelve months: the update register also holds 2020–2024 news clippings,
 * which are archive, not news (GIGW archival policy; `isArchived`).
 */
const NEWS_TYPES: Record<string, string> = {
  "Circulars & Notifications": "Circular",
  Notice: "Notice",
  Results: "Result",
  Announcement: "Announcement",
};

export function whatsNew(): NewsItem[] {
  const updates: NewsItem[] = getUpdates()
    .filter((u) => !isArchived(u.date))
    .map((u) => ({ key: `u-${u.slug}`, kind: "Update", title: tidyTitle(u.title), href: `/website/updates/${u.slug}`, date: u.date }));
  const docs: NewsItem[] = getAllDocuments()
    .filter((d) => d.category && d.category in NEWS_TYPES && !isArchived(d.date))
    .map((d) => ({
      key: `d-${d.slug}`,
      kind: NEWS_TYPES[d.category as string] ?? "Notice",
      title: tidyTitle(d.title),
      href: `/website/documents/${routeSlug(d.slug)}`,
      date: d.date,
      // Who issued it: "FAQs" from NHAA says nothing without its issuer.
      org: d.organisation && d.organisation !== "MoSJE" ? organisationName(d.organisation) : undefined,
    }));
  // One notice posted twice under two headings (an Announcement and a
  // Circular, one with typos) is one item: kept once, the newer post.
  const kept: { words: Set<string> }[] = [];
  return newestFirst([...updates, ...docs]).filter((i) => {
    const words = new Set(i.title.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []);
    const dup = kept.some((k) => {
      let shared = 0;
      words.forEach((w) => k.words.has(w) && shared++);
      return shared / Math.max(1, new Set([...words, ...k.words]).size) >= 0.7;
    });
    if (dup) return false;
    kept.push({ words });
    return true;
  });
}

