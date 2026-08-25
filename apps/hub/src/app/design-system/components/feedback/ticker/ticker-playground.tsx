"use client";
import * as React from "react";
import { Ticker, buttonClasses } from "@mosje/design-system";

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

  const controlStyle: React.CSSProperties = {
    display: "flex",
    gap: "var(--sa-inline-8)",
    alignItems: "center",
    fontSize: "var(--sa-type-body-2-size)",
    color: "var(--sa-text-neutral-base)",
  };

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
        <label style={controlStyle}>
          <input type="checkbox" checked={twoLine} onChange={(e) => setTwoLine(e.target.checked)} />
          <strong>Two-line items</strong>
        </label>
        <label style={controlStyle}>
          <input type="checkbox" checked={withAction} onChange={(e) => setWithAction(e.target.checked)} />
          <strong>View All action</strong>
        </label>
        <label style={controlStyle}>
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
          <strong>Autoplay</strong>
        </label>
        <label style={controlStyle}>
          <input type="checkbox" checked={vertical} onChange={(e) => setVertical(e.target.checked)} />
          <strong>Panel (vertical scroll)</strong>
        </label>
        <label style={controlStyle}>
          <input type="checkbox" checked={singleItem} onChange={(e) => setSingleItem(e.target.checked)} />
          <strong>Too short to move (controls go)</strong>
        </label>
        <label style={controlStyle}>
          <input type="checkbox" checked={withDates} onChange={(e) => setWithDates(e.target.checked)} />
          <strong>Dates</strong>
        </label>
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
