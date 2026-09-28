import { LatestUpdatesPanel } from "@/components/website/LatestUpdatesPanel";
import { whatsNew } from "@/lib/website-next/whats-new";
import type { TickerItem } from "@mosje/design-system";

/**
 * The What's New rail beside Our Offerings.
 *
 * ── ONE FEED FOR EVERY DESIGN ─────────────────────────────────────────────
 * It reads `whatsNew()` — the estate's one What's New feed, which the DBIM
 * design's What's New panel and the What's New page read too — so the three
 * designs cannot list different news. Until 28 Sep 2026 this rail assembled its
 * own list from the notice, vacancy and tender registers, and it and the DBIM
 * panel disagreed on the first item. The live site runs this rail as a feed,
 * newest first, which is what `whatsNew()` is
 * (.claude/rules/website-shared-content.md).
 *
 * ── WHY THIS IS A SERVER COMPONENT ────────────────────────────────────────
 * Because the records must NOT reach the browser. The feed reads the whole
 * content library; only the chosen handful crosses to `LatestUpdatesPanel`,
 * which exists solely so `next/link` can be passed as `linkAs`.
 */

const COUNT = 24;

/**
 * "18 Aug 2026" — `en-IN` in IST, stated EXPLICITLY rather than left to the
 * visitor's locale. This is a server component, so the format is fixed at build
 * time and cannot disagree with what the browser would have rendered; naming the
 * zone also keeps a date from sliding a day either side of midnight.
 */
function displayDate(iso: string): string {
  return new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function latestUpdates(): TickerItem[] {
  return whatsNew()
    .filter((n) => n.date)
    .slice(0, COUNT)
    .map((n) => ({
      id: n.key,
      title: n.title,
      description: n.org ? `${n.kind} · ${n.org}` : n.kind,
      date: displayDate(n.date as string),
      dateTime: n.date,
      href: n.href,
    }));
}

export function LatestUpdates() {
  return <LatestUpdatesPanel items={latestUpdates()} />;
}
