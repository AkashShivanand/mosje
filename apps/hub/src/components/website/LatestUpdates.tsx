// A client component because `linkAs` takes the Link COMPONENT, and a function
// cannot cross the server/client boundary as a prop. The data below is static,
// so nothing is lost by rendering this on the client.
"use client";

import Link from "next/link";
import { Ticker, buttonClasses } from "@mosje/design-system";
import type { UpdateItem } from "@/types/website";

const UPDATES: UpdateItem[] = [
  { category: "Documents", title: "Acceptance of Transgender Identity Certificate/Card for Change Name and Gender in EPFO Records.", href: "/website/notices" },
  { category: "Vacancies", title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAF and BJRNF", href: "/website/vacancies" },
  { category: "Documents", title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAIC", href: "/website/notices" },
  { category: "Documents", title: "Annual Report 2025-26 (English)", href: "/website/notices" },
  { category: "Documents", title: "Annual Report 2025-26 (Hindi)", href: "/website/notices" },
  { category: "Documents", title: "Fighting Against The Stigma & Stereotype Attached To Recovered Drug Dependents", href: "/website/notices" },
  { category: "Documents", title: "Result of National Overseas Scholarship (NOS) for SC etc. candidates for the Selection Year 2025-26 (2nd Round)", href: "/website/notices" },
  { category: "Documents", title: "Result of NOS for the Selection Year 2023-24 (1st list)", href: "/website/notices" },
];

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
 * THE CATEGORY IS DELIBERATELY NOT SHOWN. The panel's row can carry a bold
 * lead-in before the sentence, and mapping `category` onto it looked right
 * until it was rendered against the real list: seven of the eight notices are
 * "Documents", so the rail read "Documents:" four times down its length in
 * bold, carrying no information and crowding out the words that did. The notice
 * titles are self-describing — "Annual Report 2025-26 (English)" needs no label
 * — so each row is the notice, and the lead-in is left for data that has a
 * genuinely varying kind.
 *
 * `rows` is 6 rather than 4 so the rail is a reasonable proportion of the card
 * column beside it, and 6 still leaves the 8-item list something to scroll past.
 */
export function LatestUpdates() {
  return (
    <Ticker
      orientation="vertical"
      rows={6}
      items={UPDATES.map((update, i) => ({
        id: `${update.href}-${i}`,
        title: update.title,
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
