"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge, buttonClasses } from "@mosje/design-system";
import type { UpdateItem } from "@/types";

const UPDATES: UpdateItem[] = [
  { category: "Documents", title: "Acceptance of Transgender Identity Certificate/Card for Change Name and Gender in EPFO Records.", href: "/notices" },
  { category: "Vacancies", title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAF and BJRNF", href: "/vacancies" },
  { category: "Documents", title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAIC", href: "/notices" },
  { category: "Documents", title: "Annual Report 2025-26 (English)", href: "/notices" },
  { category: "Documents", title: "Annual Report 2025-26 (Hindi)", href: "/notices" },
  { category: "Documents", title: "Fighting Against The Stigma & Stereotype Attached To Recovered Drug Dependents", href: "/notices" },
  { category: "Documents", title: "Result of National Overseas Scholarship (NOS) for SC etc. candidates for the Selection Year 2025-26 (2nd Round)", href: "/notices" },
  { category: "Documents", title: "Result of NOS for the Selection Year 2023-24 (1st list)", href: "/notices" },
];

export function LatestUpdates() {
  const [index, setIndex] = useState(0);
  const count = UPDATES.length;
  const go = (next: number) => setIndex((next + count) % count);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => clearInterval(id);
  }, [count]);

  const item = UPDATES[index];
  if (!item) return null;

  return (
    <section className="bg-gov-blue text-white">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center gap-4 px-4">
        {/* Label pill */}
        <div className="flex shrink-0 items-center gap-2 rounded-md bg-white px-3 py-2 text-ink">
          <Image src="/images/updates.png" alt="" width={20} height={20} className="h-5 w-5" />
          <span className="whitespace-nowrap text-[15px] font-semibold">Latest Updates</span>
        </div>

        {/* Cycling item */}
        <Link href={item.href} className="flex min-w-0 flex-1 items-center gap-3 text-[15px] hover:underline">
          <Badge status="primary" size="sm" className="shrink-0 uppercase">
            {item.category}
          </Badge>
          <span className="truncate">{item.title}</span>
        </Link>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => go(index - 1)} aria-label="Previous update" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => go(index + 1)} aria-label="Next update" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15">
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link href="/notices" className={buttonClasses("primary", "outlined", "sm", "ml-1 whitespace-nowrap")}>
            View All Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
