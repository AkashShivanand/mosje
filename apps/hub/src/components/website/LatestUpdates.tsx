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
 * The website's Latest Updates strip.
 *
 * ALL BEHAVIOUR — the auto-advance, the pause control, the live region, the
 * reflow order — lives in `<Ticker>` in the design system. This file is the
 * DoSJE *content*: which notices run, and where "View All" goes.
 *
 * The mapping is deliberate. The frame's two lines are a short lead-in over a
 * sentence, and the real notice data is a category over a title — so the
 * category becomes the headline line and the notice its sentence. Nothing here
 * is invented to fill the second line; a notice without a category would simply
 * render single-line.
 */
export function LatestUpdates() {
  return (
    <Ticker
      items={UPDATES.map((update, i) => ({
        id: `${update.href}-${i}`,
        title: update.category,
        description: update.title,
        href: update.href,
        linkLabel: "Read More",
      }))}
      linkAs={Link}
      action={
        <Link href="/website/notices" className={buttonClasses("primary", "inverseOutlined", "sm")}>
          View All Updates
        </Link>
      }
    />
  );
}
