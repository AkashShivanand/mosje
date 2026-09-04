"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Icon } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type TabKey = "events" | "press" | "gallery";

interface EventItem {
  day: string;
  monthYear: string;
  title: string;
  desc?: string;
  href: string;
}

const EVENTS_FEATURED_FIRST: EventItem = {
  day: "1",
  monthYear: "APR 2026",
  title: "Chintan Shivir 2026 — Strengthening Social Justice Delivery",
  desc: "National deliberation on accelerating the delivery of welfare schemes, expanding educational support for disadvantaged students, and streamlining digital verification processes across all state departments.",
  href: "/website/events",
};

const EVENTS_REST: EventItem[] = [
  {
    day: "31",
    monthYear: "MAR 2026",
    title: "National Workshop on Empowerment of Persons with Disabilities",
    desc: "Key stakeholder consultation on accessible infrastructure and assistive technology deployment.",
    href: "/website/events",
  },
  {
    day: "30",
    monthYear: "MAR 2026",
    title: "Nasha Mukt Bharat Abhiyaan — Community Outreach Drive",
    desc: "Mass sensitization campaign conducted across 272 vulnerable districts with youth ambassadors.",
    href: "/website/events",
  },
  {
    day: "29",
    monthYear: "MAR 2026",
    title: "Scholarship Disbursement Review Meeting",
    desc: "Quarterly review of DBT disbursals under PM-YASASVI and Post-Matric scholarship vertical.",
    href: "/website/events",
  },
];

/**
 * The design lays these out as an equal 2 x 2 grid, so the four are one list.
 * The build split them into a large "featured" card and a stack of three, which
 * is what left ~250px of empty space inside the featured one [WEB-T-01/T-02].
 */
const EVENTS: EventItem[] = [EVENTS_FEATURED_FIRST, ...EVENTS_REST];

export function ActivityCorner() {
  const [activeTab, setActiveTab] = useState<TabKey>("events");

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
          <div
            role="tablist"
            aria-label="Activity Corner"
            className="inline-flex items-center gap-1 self-start rounded-lg bg-surface-muted p-1"
          >
              <button
                key="events"
                type="button"
                role="tab"
                aria-selected={activeTab === "events"}
                onClick={() => setActiveTab("events")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-label-1 transition",
                  activeTab === "events"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                Events
              </button>
              <button
                key="press"
                type="button"
                role="tab"
                aria-selected={activeTab === "press"}
                onClick={() => setActiveTab("press")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-label-1 transition",
                  activeTab === "press"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                Press Releases
              </button>
              <button
                key="gallery"
                type="button"
                role="tab"
                aria-selected={activeTab === "gallery"}
                onClick={() => setActiveTab("gallery")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-label-1 transition",
                  activeTab === "gallery"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                Gallery
              </button>
          </div>

          {/* ONE view-all control. There were three: this link, plus "View All
              Events" and "View All Press Releases" stacked below the grid
              [WEB-T-05]. It is the designed outlined button [WEB-G-05]. */}
          <Button
            appearance="outlined"
            size="sm"
            href="/website/events"
            iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
            className="self-start border-primary-dark text-primary-dark sm:self-auto"
          >
            View all Events
          </Button>
        </div>

        {/* Equal 2 x 2 grid [WEB-T-01] */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {EVENTS.map((event) => (
            <Card
              key={event.title}
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
