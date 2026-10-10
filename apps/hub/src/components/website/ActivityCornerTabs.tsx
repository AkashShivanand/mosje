"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Icon, Tabs } from "@mosje/design-system";

type TabKey = "events" | "press" | "gallery";

interface EventItem {
  day: string;
  monthYear: string;
  title: string;
  desc?: string;
  href: string;
}

export type ActivityTab = TabKey;
export type ActivityItem = EventItem;

const VIEW_ALL: Record<TabKey, { href: string; label: string }> = {
  events: { href: "/website/events", label: "View all Events" },
  press: { href: "/website/gallery", label: "View all Press Coverage" },
  gallery: { href: "/website/gallery", label: "View all Photographs" },
};

/**
 * The client half: the tab row and the 2 x 2 grid. The four newest records of
 * each tab are chosen on the server (`ActivityCorner`) so the registers never
 * reach the browser.
 */
export function ActivityCornerTabs({ items }: { items: Record<TabKey, EventItem[]> }) {
  const [activeTab, setActiveTab] = useState<TabKey>("events");
  const ACTIVITY_TABS: TabKey[] = ["events", "press", "gallery"];

  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="sa-container">
        {/* Heading sits on its own line; the design puts the tab row BELOW it
            rather than beside it [WEB-T-03]. It carries no subtitle — the one
            that used to be here described Our Organisations [WEB-T-04]. */}
        <h2 className="text-headline-2 text-primary-dark">
          Activity Corner
        </h2>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* The tinted track is this section's own; the tabs inside it are the design
              system's. `track="none"`: an enclosed track stretches every tab to an equal
              share, which clipped "Press Releases" and "Vacancies" to "Press R…". */}
          <div className="inline-flex items-center self-start rounded-lg bg-surface-muted p-1">
            <Tabs
              idBase="activity-corner"
              ariaLabel="Activity Corner"
              indicator="pill"
              track="none"
              size="s"
              tabs={[
                { id: "events", label: "Events" },
                { id: "press", label: "Press Coverage" },
                { id: "gallery", label: "Gallery" },
              ]}
              active={ACTIVITY_TABS.indexOf(activeTab)}
              onChange={(i) => setActiveTab(ACTIVITY_TABS[i]!)}
            />
          </div>

          {/* ONE view-all control. There were three: this link, plus "View All
              Events" and "View All Press Releases" stacked below the grid
              [WEB-T-05]. It is the designed outlined button [WEB-G-05]. */}
          <Button linkAs={Link}
            appearance="outlined"
            size="sm"
            href={VIEW_ALL[activeTab].href}
            iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
            className="self-start border-primary-dark text-primary-dark sm:self-auto"
          >
            {VIEW_ALL[activeTab].label}
          </Button>
        </div>

        {items[activeTab].length === 0 && (
          <p className="mt-8 text-body-2 text-ink-muted">Nothing has been published under this heading yet.</p>
        )}

        {/* Equal 2 x 2 grid [WEB-T-01] */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items[activeTab].map((event) => (
            <Card
              key={event.href}
              className="flex flex-row items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg border border-gray-200 bg-surface-muted">
                <span className="text-title-1 font-bold tabular-nums text-ink">
                  {event.day}
                </span>
                <span className="mt-0.5 text-label-3 uppercase text-ink-muted">
                  {event.monthYear}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="text-title-2 text-ink">
                  {event.title}
                </h3>
                {event.desc && (
                  <p className="mt-1.5 text-body-3 text-ink-muted line-clamp-3">
                    {event.desc}
                  </p>
                )}
                <Link
                  href={event.href}
                  className="mt-auto flex items-center justify-end gap-1 pt-3 text-label-2 text-primary-dark hover:underline"
                >
                  Read More <Icon name="arrow_forward" size={16} aria-hidden />
                </Link>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
