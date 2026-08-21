"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Icon, buttonClasses } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type TabKey = "events" | "press" | "gallery";

interface EventItem {
  day: string;
  monthYear: string;
  title: string;
  desc?: string;
  href: string;
}

const FEATURED_EVENT: EventItem = {
  day: "1",
  monthYear: "APR 2026",
  title: "Chintan Shivir 2026 — Strengthening Social Justice Delivery",
  desc: "National deliberation on accelerating the delivery of welfare schemes, expanding educational support for disadvantaged students, and streamlining digital verification processes across all state departments.",
  href: "/website/events",
};

const STACKED_EVENTS: EventItem[] = [
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

export function ActivityCorner() {
  const [activeTab, setActiveTab] = useState<TabKey>("events");

  return (
    <section className="bg-surface-muted py-12 md:py-16">
      <div className="sa-container">
        {/* Header with Tabs and View All Link */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-[28px] sm:text-[32px] font-semibold leading-tight text-primary-dark">
              Activity Corner
            </h2>
            <p className="mt-1 text-[15px] text-ink-muted">
              Explore our affiliated bodies
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center rounded-lg bg-gray-200/70 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("events")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-semibold transition",
                  activeTab === "events"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                Events
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("press")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-semibold transition",
                  activeTab === "press"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                Press Releases
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-semibold transition",
                  activeTab === "gallery"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                Gallery
              </button>
            </div>

            <Link
              href="/website/events"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 hidden sm:flex"
            >
              View all events <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>

        {/* 2-Column Asymmetric Layout matching Figma node 8137:48670 */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: 1 Large Featured Event Card (~50% width) */}
          <div className="lg:col-span-6 flex flex-col">
            <Card className="flex flex-1 flex-col justify-between p-6 sm:p-8 border border-gray-200 bg-white shadow-sm rounded-xl">
              <div>
                {/* Big Date Badge */}
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <span className="text-[32px] font-black leading-none">{FEATURED_EVENT.day}</span>
                  <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-primary-dark">{FEATURED_EVENT.monthYear}</span>
                </div>

                <h3 className="mt-6 text-[20px] sm:text-[22px] font-bold leading-snug text-ink">
                  {FEATURED_EVENT.title}
                </h3>

                {FEATURED_EVENT.desc && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {FEATURED_EVENT.desc}
                  </p>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-150 flex items-center justify-between">
                <Link
                  href={FEATURED_EVENT.href}
                  className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Read More <Icon name="arrow_forward" size={16} />
                </Link>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="h-2 w-5 rounded-full bg-primary" />
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                  </div>
                  <button
                    type="button"
                    aria-label="Previous event"
                    className="p-1 rounded-full hover:bg-gray-100 text-ink-muted transition"
                  >
                    <Icon name="chevron_left" size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next event"
                    className="p-1 rounded-full hover:bg-gray-100 text-ink-muted transition"
                  >
                    <Icon name="chevron_right" size={20} />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: 3 Stacked Event Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {STACKED_EVENTS.map((event) => (
              <Card
                key={event.title}
                className="flex flex-1 items-start gap-4 p-5 border border-gray-200 bg-white shadow-xs hover:shadow-md transition rounded-xl"
              >
                <div className="flex h-14 w-14 flex-none flex-col items-center justify-center rounded-lg bg-gray-100 text-ink border border-gray-200">
                  <span className="text-[20px] font-extrabold leading-none text-ink">{event.day}</span>
                  <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-muted">{event.monthYear}</span>
                </div>
                <div className="flex flex-1 flex-col justify-between h-full min-w-0">
                  <div>
                    <h3 className="text-[15px] font-semibold leading-snug text-ink line-clamp-2">
                      {event.title}
                    </h3>
                    {event.desc && (
                      <p className="mt-1 text-xs text-ink-muted line-clamp-2">
                        {event.desc}
                      </p>
                    )}
                  </div>
                  <Link
                    href={event.href}
                    className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-start"
                  >
                    Read More <Icon name="arrow_forward" size={16} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/website/events"
            className={buttonClasses("primary", "outlined", "sm")}
          >
            View All Events
            <span className="ds-btn__icon" aria-hidden="true">
              <Icon name="arrow_forward" size={16} />
            </span>
          </Link>
          <Link
            href="/website/events"
            className={buttonClasses("primary", "outlined", "sm")}
          >
            View All Press Releases
            <span className="ds-btn__icon" aria-hidden="true">
              <Icon name="arrow_forward" size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
