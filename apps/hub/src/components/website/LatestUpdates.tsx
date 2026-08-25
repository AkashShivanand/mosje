"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge, Icon, buttonClasses } from "@mosje/design-system";
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

export function LatestUpdates() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const count = UPDATES.length;
  const go = (next: number) => setIndex((next + count) % count);

  useEffect(() => {
    if (!isPlaying) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => clearInterval(id);
  }, [count, isPlaying]);

  const item = UPDATES[index];
  if (!item) return null;

  return (
    <section className="bg-primary text-white" aria-label="Latest Updates Ticker">
      <div className="sa-container flex h-[72px] items-center gap-3 sm:gap-4">
        {/* Label pill. The words are the first thing to go: they are 120px of a
            288px content box at 320, and the section already carries the same
            name as its accessible label, so nothing is lost to a screen reader. */}
        <div className="flex shrink-0 items-center gap-2 rounded-md bg-white px-2.5 py-2 text-ink sm:px-3">
          <Image src="/website/images/updates.png" alt="" width={20} height={20} className="h-5 w-5" />
          <span className="hidden whitespace-nowrap text-[15px] font-semibold sm:inline">Latest Updates</span>
        </div>

        {/* Cycling item */}
        <Link href={item.href} className="flex min-w-0 flex-1 items-center gap-3 text-[15px] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <Badge status="primary" size="sm" className="hidden shrink-0 uppercase sm:inline-flex">
            {item.category}
          </Badge>
          <span className="truncate">{item.title}</span>
        </Link>

        {/* Controls.
            The row could not compress: `shrink-0` here plus `whitespace-nowrap` on
            the button below fixed it at ~266px, which pushed the page to 481px of
            scrollWidth on a 390px viewport — a WCAG 2.2 AA reflow failure
            (1.4.10) on a public government page, at every mobile visit.

            Things drop in order of how much they cost against what they do.
            Pause STAYS at every width: this ticker auto-advances, so removing it
            would trade a reflow failure for a 2.2.2 Pause/Stop/Hide failure.
            Prev/next go below sm — the ticker cycles on its own and the same
            items are on the linked page. The View All button goes below lg,
            where it is the single widest item in the row. */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause updates animation" : "Play updates animation"}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <Icon name={isPlaying ? "pause" : "play_arrow"} size={20} />
          </button>
          <button onClick={() => go(index - 1)} aria-label="Previous update" className="hidden h-8 w-8 sm:grid place-items-center rounded-full hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
            <Icon name="keyboard_arrow_left" size={20} />
          </button>
          <button onClick={() => go(index + 1)} aria-label="Next update" className="hidden h-8 w-8 sm:grid place-items-center rounded-full hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
            <Icon name="keyboard_arrow_right" size={20} />
          </button>
          <Link href="/website/notices" className={buttonClasses("primary", "outlined", "sm", "ml-1 hidden whitespace-nowrap lg:inline-flex")}>
            View All Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
