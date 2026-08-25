// A client component because `linkAs` takes the Link COMPONENT, and a function
// cannot cross the server/client boundary as a prop. The data below is static,
// so nothing is lost by rendering this on the client.
"use client";

import Link from "next/link";
import { Ticker, buttonClasses } from "@mosje/design-system";
import type { UpdateItem } from "@/types/website";

const UPDATES: UpdateItem[] = [
  { category: "Notice", date: "2026-08-18", title: "Acceptance of Transgender Identity Certificate/Card for Change Name and Gender in EPFO Records.", href: "/website/notices" },
  { category: "Vacancy", date: "2026-08-14", title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAF and BJRNF", href: "/website/vacancies" },
  { category: "Vacancy", date: "2026-08-12", title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAIC", href: "/website/vacancies" },
  { category: "Annual Report", date: "2026-08-05", title: "Annual Report 2025-26 (English)", href: "/website/notices" },
  { category: "Annual Report", date: "2026-08-05", title: "Annual Report 2025-26 (Hindi)", href: "/website/notices" },
  { category: "Campaign", date: "2026-07-29", title: "Fighting Against The Stigma & Stereotype Attached To Recovered Drug Dependents", href: "/website/notices" },
  { category: "Result", date: "2026-07-22", title: "Result of National Overseas Scholarship (NOS) for SC etc. candidates for the Selection Year 2025-26 (2nd Round)", href: "/website/notices" },
  { category: "Result", date: "2026-07-11", title: "Result of NOS for the Selection Year 2023-24 (1st list)", href: "/website/notices" },
];

/**
 * The date, formatted for display — "18 Aug 2026".
 *
 * `en-IN` in IST, stated EXPLICITLY rather than left to the visitor's locale:
 * a server-rendered page and its hydration disagree whenever the two sit on
 * different sides of a day boundary, and React then replaces the text after
 * paint. It is also simply the right reading for this audience.
 *
 * The component takes the kind and the date as separate fields and owns the
 * separator between them, so a notice without a date does not trail a dangling
 * middot — and this file no longer builds the subtitle by pasting strings.
 */
function displayDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  return new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * The website's Latest Updates panel.
 *
 * ALL BEHAVIOUR — the scroll, the pause control, hover-to-stop, the mobile
 * fallback — lives in `<Ticker>` in the design system. This file is the DoSJE
 * *content*: which notices run, and where "View All" goes.
 *
 * IT IS THE PANEL, NOT THE BAR, AND IT SITS IN A COLUMN. It ran as a full-bleed
 * strip under the hero until 2026-08-25. That put a third full-width coloured
 * band directly beneath the saffron SAMAVESH bar and the hero, and a second
 * pause control 65px below the carousel's own — two things on one screen that
 * both stop something, neither of which says what. As a rail beside Our
 * Offerings it reads as one panel among the page's content, and it can show
 * four notices at once instead of one.
 *
 * EACH ROW IS A TITLE OVER A SUBTITLE, which is the structure the live site
 * uses and the one the bar already had. The notice is the title; its kind and
 * date are the subtitle.
 *
 * The kind is worth showing NOW and was not before. It first went in as a bold
 * lead-in on the same line, where seven "Documents" out of eight read as the
 * same word repeated four times down the rail in bold. As a quieter second line
 * beside a date it is scannable rather than shouty, and repeating is what a
 * subtitle is allowed to do. The categories are also narrower now — Notice,
 * Vacancy, Annual Report, Campaign, Result — so they say something.
 *
 * `rows` is 6 rather than 4 so the rail is a reasonable proportion of the card
 * column beside it, and 6 still leaves the 8-item list something to scroll past.
 */
export function LatestUpdates() {
  return (
    <Ticker
      orientation="vertical"
      // It shares the Offerings row with the scheme cards, so it takes the
      // row's height rather than standing at its own — `rows` is the floor.
      height="fill"
      rows={6}
      items={UPDATES.map((update, i) => ({
        id: `${update.href}-${i}`,
        title: update.title,
        description: update.category,
        date: displayDate(update.date),
        dateTime: update.date,
        href: update.href,
      }))}
      linkAs={Link}
      action={
        <Link href="/website/notices" className={buttonClasses("primary", "inverseOutlined", "sm")}>
          View All
        </Link>
      }
    />
  );
}
