"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Icon } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";
import {
  ORGANISATIONS,
  organisationCategoryTabs,
  type OrganisationCategory,
} from "@/data/website";

/**
 * The 17 organisations and the category tabs both come from the data layer now.
 *
 * This file used to own the registry, and three other surfaces kept their own copies of it
 * — LogoStrip, samavesh-citizen-portals and whos-who — which had already drifted apart on
 * logos, names and hrefs.
 *
 * Two defects went with it. The tab counts were hand-written and one was simply wrong
 * (foundations said 3; there are 4), so they are derived now and cannot go stale. And six
 * organisations carried `category: "all"` — a filter sentinel written into the data — which
 * meant the comparison below could never match them and no tab could reach them. They are
 * `"schemes"`, and the tab list picks them up on its own.
 */

export function Organisations() {
  const [activeCategory, setActiveCategory] = useState<OrganisationCategory | "all">("all");

  const filtered =
    activeCategory === "all"
      ? ORGANISATIONS
      : ORGANISATIONS.filter((org) => org.category === activeCategory);

  return (
    <section className="bg-surface-muted">
      <div className="sa-container py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-[32px] font-semibold leading-tight text-primary-dark">
            Our Organisations
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-[16px] text-ink-muted">
            The Ministry of Social Justice and Empowerment works through key
            organisations that drive social inclusion, economic empowerment, and
            equal opportunity across India.
          </p>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {organisationCategoryTabs().map((cat) => {
            const isActive = cat.key === activeCategory;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "rounded-full px-5 py-2 text-[14px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white border border-gray-200 text-ink-muted hover:border-primary/40 hover:text-primary"
                )}
              >
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((org) => (
            <li key={org.id}>
              <Link href={org.profileHref} className="group block h-full">
                <Card className="flex h-full flex-col justify-between p-5 transition hover:shadow-md hover:border-primary/40">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-block rounded bg-primary px-2 py-0.5 text-[11px] font-bold text-white uppercase">
                        {org.abbr}
                      </span>
                      {org.logoSrc && (
                        <Image
                          src={org.logoSrc}
                          alt={org.abbr}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                        />
                      )}
                    </div>
                    <h3 className="mt-4 text-[15px] font-medium leading-snug text-ink group-hover:text-primary transition-colors">
                      {org.name}
                    </h3>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Icon name="arrow_outward" size={16} className="text-gray-400 transition-colors group-hover:text-primary" />
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
