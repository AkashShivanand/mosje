"use client";

import Link from "next/link";
import { Ticker, buttonClasses, type TickerItem } from "@mosje/design-system";

export interface LatestUpdatesPanelProps {
  items: TickerItem[];
}

/**
 * The client half of Latest Updates.
 *
 * It exists only so `linkAs` can be handed a component: `next/link` is a
 * function, and a function cannot cross the server/client boundary as a prop.
 * Every decision about WHICH notices appear is made on the server in
 * `LatestUpdates` — this file knows nothing about the content and is the reason
 * the department's 2,000-odd records never reach the browser.
 */
export function LatestUpdatesPanel({ items }: LatestUpdatesPanelProps) {
  return (
    <Ticker
      orientation="vertical"
      // "Our Offerings" owns the h2 on this section, so the rail's name is an h3.
      // Without it the panel is reachable by landmark but invisible to heading
      // navigation — on a notice board, the thing people most want to jump to.
      labelAs="h3"
      // It shares the Offerings row with the scheme cards, so it takes the
      // row's height rather than standing at its own — `rows` is the floor.
      height="fill"
      rows={6}
      items={items}
      linkAs={Link}
      action={
        <Link href="/website/notices" className={buttonClasses("primary", "inverseOutlined", "sm")}>
          View All
        </Link>
      }
    />
  );
}
