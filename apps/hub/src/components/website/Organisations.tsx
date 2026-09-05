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

/**
 * The four claims the design sets beside the list [WEB-N-02]. They are the
 * section's own copy from the Handoff frame, not a summary written here.
 */
const NARRATIVE = [
  "Promotes equality and social participation for all communities.",
  "Builds skills and education pathways for self-reliance.",
  "Enables financial inclusion and livelihood opportunities.",
  "Provides rehabilitation and welfare support for vulnerable groups.",
];

export function Organisations() {
  const [activeCategory, setActiveCategory] = useState<OrganisationCategory | "all">("all");

  const filtered =
    activeCategory === "all"
      ? ORGANISATIONS
      : ORGANISATIONS.filter((org) => org.category === activeCategory);

  return (
    <section className="bg-surface-muted">
      <div className="sa-container py-12 md:py-16">
        {/* Two columns, not one centred stack [WEB-N-01]: the narrative sits
            beside the organisations rather than above them. The right column is
            8/12 of the content box — 848px at 1440 — so its 2-up cards are
            ~410px, WIDER than the 368px the 3-up full-width grid gave. The name
            wrapping that #176 fixed stays fixed; it does not regress here. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ---- Left: heading, narrative ---- */}
          <div className="lg:col-span-4">
            <h2 className="text-headline-2 text-primary-dark">
              Our Organisations
            </h2>
            {/* This subtitle belongs here. It was rendering under Activity
                Corner, where it described the wrong section [WEB-N-03/T-04]. */}
            <p className="mt-1 text-label-1 text-ink-muted">
              Explore our affiliated bodies
            </p>
            <p className="mt-4 text-body-1 text-ink-muted">
              The Ministry of Social Justice and Empowerment works through key
              organisations that drive social inclusion, economic empowerment, and
              equal opportunity across India.
            </p>

            {/* `list-inside` puts the marker in the text flow, so a wrapped
                second line runs back under the bullet. Markers stay outside and
                the list carries the indent instead, giving a real hanging indent. */}
            <ul className="mt-6 list-disc space-y-3 border-l-2 border-primary/25 py-1 pl-9">
              {NARRATIVE.map((claim) => (
                <li
                  key={claim}
                  className="text-body-2 italic text-ink-muted marker:text-primary/60"
                >
                  {claim}
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Right: filters and the organisations ---- */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-2">
              {organisationCategoryTabs().map((cat) => {
                const isActive = cat.key === activeCategory;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(cat.key)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-label-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : // Outlined BLUE when inactive, per the design — the
                          // build had a grey hairline that read as disabled
                          // rather than as an available filter [WEB-N-04].
                          // primary-dark, not gov-blue: 7.52:1 on surface-muted
                          // against gov-blue's 4.07:1, which is under AA.
                          "border border-primary-dark/45 bg-transparent text-primary-dark hover:bg-primary/10"
                    )}
                  >
                    {cat.label}{" "}
                    {/* No opacity on the count: at 70% the white-on-gov-blue
                        active chip fell to 3.04:1. */}
                    <span className={isActive ? "" : "text-primary-dark/75"}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((org) => (
                <li key={org.id}>
                  <Link href={org.profileHref} className="group block h-full">
                    {/* Logo beside the name on a tinted ground, as designed —
                        the build stacked an abbreviation badge over the name
                        with a trailing arrow [WEB-N-05]. */}
                    <Card className="flex h-full flex-row items-center gap-3 border border-primary/20 bg-primary-50/60 p-4 transition hover:border-primary/50 hover:shadow-md">
                      {org.logoSrc && (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/15 bg-white">
                          <Image
                            src={org.logoSrc}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 object-contain"
                          />
                        </span>
                      )}
                      <h3 className="min-w-0 flex-1 text-title-2 text-ink transition-colors group-hover:text-primary">
                        {org.name}
                      </h3>
                      <Icon
                        name="arrow_outward"
                        size={16}
                        aria-hidden
                        className="shrink-0 text-gray-400 transition-colors group-hover:text-primary"
                      />
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
