"use client";
import * as React from "react";
import { Ticker, buttonClasses, Checkbox } from "@mosje/design-system";

const ITEMS = [
  {
    id: "funding",
    title: "New Funding Alert!",
    description: "Government announces fresh grants for the food processing sector.",
    href: "#funding",
    linkLabel: "Learn More",
  },
  {
    id: "skill-india",
    title: "New Opportunity!",
    description:
      "Ministry launches ‘Skill India Connect’ to train marginalised youth for digital and green jobs.",
    href: "#skill-india",
    linkLabel: "Learn More",
  },
  {
    id: "nos",
    title: "National Overseas Scholarship",
    description: "Second-round results for the 2025-26 selection year are now published.",
    href: "#nos",
    linkLabel: "Learn More",
  },
  { id: "vacancy", title: "Vacancies", description: "Financial Adviser at DAF and BJRNF — application window extended.", href: "#vacancy" },
  { id: "tender", title: "Tender", description: "Supply and installation of assistive devices, Phase III.", href: "#tender" },
  { id: "report", title: "Documents", description: "Annual Report 2025-26 is now available in English and Hindi.", href: "#report" },
];

export function TickerPlayground(): React.JSX.Element {
  const [twoLine, setTwoLine] = React.useState(true);
  const [withAction, setWithAction] = React.useState(true);
  const [autoplay, setAutoplay] = React.useState(true);
  const [vertical, setVertical] = React.useState(false);
  const [singleItem, setSingleItem] = React.useState(false);
  const [withDates, setWithDates] = React.useState(true);

  return (
    <div
      style={{
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "var(--sa-inline-24)",
          flexWrap: "wrap",
          padding: "var(--sa-padding-24) var(--sa-padding-24) 0",
        }}
      >
        <Checkbox label="Two-line items" size="sm" checked={twoLine} onCheckedChange={setTwoLine} />
        <Checkbox label="View All action" size="sm" checked={withAction} onCheckedChange={setWithAction} />
        <Checkbox label="Autoplay" size="sm" checked={autoplay} onCheckedChange={setAutoplay} />
        <Checkbox label="Panel (vertical scroll)" size="sm" checked={vertical} onCheckedChange={setVertical} />
        <Checkbox label="Too short to move (controls go)" size="sm" checked={singleItem} onCheckedChange={setSingleItem} />
        <Checkbox label="Dates" size="sm" checked={withDates} onCheckedChange={setWithDates} />
      </div>

      <Ticker
        key={`${autoplay}-${vertical}-${singleItem}`}
        items={(singleItem ? ITEMS.slice(0, vertical ? 4 : 1) : ITEMS).map((i, n) => {
          const base = twoLine ? i : { id: i.id, title: i.title, href: i.href };
          if (!withDates || !vertical) return base;
          const iso = `2026-08-${String(18 - n).padStart(2, "0")}`;
          return {
            ...base,
            date: new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "Asia/Kolkata",
            }),
            dateTime: iso,
          };
        })}
        orientation={vertical ? "vertical" : "horizontal"}
        autoplay={autoplay}
        action={
          withAction ? (
            <a href="#all" className={buttonClasses("primary", "inverseOutlined", "sm")}>
              View All Updates
            </a>
          ) : undefined
        }
      />
    </div>
  );
}
