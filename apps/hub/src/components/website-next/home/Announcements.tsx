"use client";

import Link from "next/link";
import { Ticker, type TickerItem } from "@mosje/design-system";

/**
 * The announcements ticker (DBIM 3.0 §A.4.1 iii): the newest items of What's
 * New, one line each. The design system's `Ticker` pauses on hover and focus,
 * carries a pause control, and stands still under `prefers-reduced-motion`
 * (WCAG 2.2.2).
 */
export function Announcements({ items }: { items: TickerItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="wn-home-ticker">
      <div className="sa-container">
        <Ticker items={items} label="Announcements" linkAs={Link} />
      </div>
    </div>
  );
}
