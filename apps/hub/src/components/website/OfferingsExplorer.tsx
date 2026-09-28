"use client";

import { useState } from "react";
import type * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Card, Chip, Icon, Tabs } from "@mosje/design-system";

export interface ExplorerScheme {
  tag: string;
  title: string;
  description?: string;
  href: string;
}

export interface ExplorerGroup {
  id: string;
  label: string;
  icon: string;
  schemes: ExplorerScheme[];
}

export interface ExplorerNotice {
  title: string;
  issuer: string;
  reference?: string;
  details?: string[];
  description?: string;
  size: string;
  href: string;
}

type TabKey = "schemes" | "vacancies" | "tenders";

/** The live section's tabs and their "View all" links, in its order. */
const TABS: { key: TabKey; label: string; icon: string; viewAll: string; href: string }[] = [
  { key: "schemes", label: "Schemes", icon: "menu_book", viewAll: "View all Schemes", href: "/website/schemes-services" },
  { key: "vacancies", label: "Vacancies", icon: "group", viewAll: "View all Vacancies", href: "/website/vacancies" },
  { key: "tenders", label: "Tenders", icon: "business_center", viewAll: "View all Tenders", href: "/website/tenders" },
];

/**
 * The client half of Our Offerings: which tab, and which group, is showing.
 * Everything it renders is decided on the server (`Offerings.tsx`).
 */
export function OfferingsExplorer({
  groups,
  vacancies,
  tenders,
  rail,
}: {
  groups: ExplorerGroup[];
  vacancies: ExplorerNotice[];
  tenders: ExplorerNotice[];
  /** What's New, rendered on the server. */
  rail: React.ReactNode;
}) {
  const [tab, setTab] = useState<TabKey>("schemes");
  const [groupId, setGroupId] = useState(groups[0]?.id);
  const current = TABS.find((t) => t.key === tab) ?? TABS[0]!;
  const group = groups.find((g) => g.id === groupId) ?? groups[0];

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* The tinted track is this section's own; the tabs inside it are the design
            system's. `track="none"`: an enclosed track stretches every tab to an equal
            share, which clipped "Vacancies" to "Vacan…". */}
        <div className="inline-flex flex-wrap items-center self-start rounded-xl bg-white/70 p-1">
          <Tabs
            idBase="offerings"
            ariaLabel="Our Offerings"
            indicator="pill"
            track="none"
            size="s"
            panel
            tabs={TABS.map((t) => ({ id: t.key, label: t.label, icon: t.icon }))}
            active={Math.max(0, TABS.findIndex((t) => t.key === tab))}
            onChange={(i) => setTab(TABS[i]!.key)}
          />
        </div>

        {/* gov-blue is 4.19:1 on this section's primary-50 ground — under AA for
            14px text; primary-dark is 7.75:1. Utilities outrank the component's
            own colour because component CSS sits in @layer components. */}
        <Button
          linkAs={Link}
          appearance="outlined"
          size="sm"
          href={current.href}
          iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
          className="self-start border-primary-dark text-primary-dark sm:self-auto"
        >
          {current.viewAll}
        </Button>
      </div>

      <div
        id={`offerings-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`offerings-tab-${tab}`}
        className="mt-8"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {tab === "schemes" ? (
              group && <SchemesPanel groups={groups} group={group} onGroup={setGroupId} />
            ) : (
              <NoticeList rows={tab === "vacancies" ? vacancies : tenders} kind={tab} />
            )}
          </div>

          {/* THE RAIL IS TAKEN OUT OF FLOW AT `lg`: the left column decides the
              row's height and the rail matches it, scrolling what does not fit.
              Below `lg` it bounds its own height, or the ticker grows to fit
              every item and its pause control disappears with the overflow. */}
          <div className="relative h-[28rem] sm:h-[32rem] lg:col-span-4 lg:h-auto">
            <div className="absolute inset-0">{rail}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function SchemesPanel({
  groups,
  group,
  onGroup,
}: {
  groups: ExplorerGroup[];
  group: ExplorerGroup;
  onGroup: (id: string) => void;
}) {
  return (
    <>
      {/* The eleven groups of the Department's mandate, as the live section
          lists them. One is always chosen, so these behave as a single choice. */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Schemes for">
        {groups.map((g) => (
          <Chip
            key={g.id}
            emphasis="solid"
            selected={g.id === group.id}
            onSelectedChange={() => onGroup(g.id)}
          >
            {g.label}
          </Chip>
        ))}
      </div>

      <Card className="mt-6 overflow-hidden rounded-xl border border-primary/20 bg-white p-0">
        <div className="flex items-center gap-4 bg-primary-100 px-5 py-4">
          <Image
            src={group.icon}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full"
          />
          <h3 className="text-title-1 text-ink" aria-live="polite">
            {group.label}
          </h3>
        </div>

        <ul className="divide-y divide-border">
          {group.schemes.map((s) => (
            <li key={s.href + s.title}>
              {/* One link per row, the whole row: the live card links the title
                  and "View Details" separately to the same address, which a
                  screen reader announces twice. */}
              <Link
                href={s.href}
                className="group flex flex-col gap-1 px-5 py-4 transition hover:bg-primary-50 sm:flex-row sm:items-start sm:gap-6"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-label-3 uppercase text-primary-dark">{s.tag}</span>
                  <span className="mt-1 block text-title-2 text-ink group-hover:text-primary">
                    {s.title}
                  </span>
                  {s.description && (
                    <span className="mt-1.5 block text-body-2 text-ink-muted">{s.description}</span>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-label-2 text-primary group-hover:underline">
                  View Details
                  <Icon name="arrow_forward" size={16} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-border px-5 py-4">
          <Link
            href="/website/schemes-services"
            className="inline-flex items-center gap-1 text-label-1 text-primary hover:underline"
          >
            View All Schemes for {group.label}
            <Icon name="arrow_forward" size={16} aria-hidden />
          </Link>
        </div>
      </Card>
    </>
  );
}

function NoticeList({ rows, kind }: { rows: ExplorerNotice[]; kind: "vacancies" | "tenders" }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-white p-6 text-body-1 text-ink-muted">
        {kind === "vacancies" ? "No vacancies are open at present." : "No tenders are open at present."}
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {rows.map((n) => (
        <li key={n.href + n.title}>
          <Card className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-label-3 uppercase text-primary-dark">
              {kind === "tenders" ? `Department · ${n.issuer}` : n.issuer}
            </span>
            <h3 className="mt-1.5 text-title-2 text-ink">{n.title}</h3>
            {n.reference && (
              <p className="mt-1.5 text-body-2 text-ink-muted">Tender No. {n.reference}</p>
            )}
            {n.details?.map((d) => (
              <p key={d} className="mt-1 text-body-2 text-ink-muted">
                {d}
              </p>
            ))}
            {n.description && (
              <p className="mt-1.5 text-body-2 text-ink-muted line-clamp-3">{n.description}</p>
            )}
            <div className="mt-auto flex items-center justify-between gap-3 pt-4">
              <span className="text-body-3 text-ink-muted">{n.size}</span>
              <Link
                href={n.href}
                className="inline-flex items-center gap-1 text-label-2 text-primary hover:underline"
              >
                View PDF
                <span className="sr-only">: {n.title}</span>
                <Icon name="arrow_forward" size={16} aria-hidden />
              </Link>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
