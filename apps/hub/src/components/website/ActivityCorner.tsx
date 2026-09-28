import { eventDate } from "@/components/website-next/media/EventCard";
import { tidyTitle } from "@/components/website-next/media/albums";
import { getEvents, getGalleryItemsByType, routeSlug } from "@/lib/website/content";
import { ActivityCornerTabs, type ActivityItem, type ActivityTab } from "./ActivityCornerTabs";

/**
 * Activity Corner — the four newest events, news coverage and photographs.
 *
 * WHAT THIS REPLACED: four events written into the component ("Chintan Shivir
 * 2026 — Strengthening Social Justice Delivery", …) that are not in the register,
 * shown under all three tabs alike. Each tab now reads its own register, newest
 * first, and links to the record's own page.
 */
const COUNT = 4;

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function item(title: string, date: string | undefined, href: string): ActivityItem | null {
  const m = date && /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!m) return null;
  return { day: String(Number(m[3])), monthYear: `${MONTHS[Number(m[2]) - 1]} ${m[1]}`, title: tidyTitle(title), href };
}

const newest = <T,>(rows: T[], dateOf: (r: T) => string | undefined) =>
  [...rows].sort((a, b) => (dateOf(b) ?? "").localeCompare(dateOf(a) ?? ""));

export function ActivityCorner() {
  const items: Record<ActivityTab, ActivityItem[]> = {
    events: newest(getEvents(), eventDate)
      .map((e) => item(e.title, eventDate(e), `/website/events/${routeSlug(e.slug)}`))
      .filter((i): i is ActivityItem => i != null)
      .slice(0, COUNT),
    press: newest(getGalleryItemsByType("News"), (g) => g.date)
      .map((g) => item(g.title, g.date, `/website/gallery/${routeSlug(g.slug)}`))
      .filter((i): i is ActivityItem => i != null)
      .slice(0, COUNT),
    gallery: newest(getGalleryItemsByType("Photos"), (g) => g.date)
      .map((g) => item(g.title, g.date, `/website/gallery/${routeSlug(g.slug)}`))
      .filter((i): i is ActivityItem => i != null)
      .slice(0, COUNT),
  };
  return <ActivityCornerTabs items={items} />;
}
