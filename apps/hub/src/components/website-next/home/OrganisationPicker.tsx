"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Chip } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";

export interface OrgCategory {
  key: string;
  label: string;
  count: number;
}

export interface OrgCard {
  id: string;
  category: string;
  name: string;
  abbr: string;
  href: string;
  logoSrc: string;
}

/**
 * The right column of Our Organisations: the categories as chips carrying their
 * own counts, and the cards of whichever is chosen.
 *
 * The counts are derived from the registry, never typed — `organisationCategoryTabs()`
 * counts what is there, so a body added tomorrow is counted the same day.
 *
 * It opens on the first category rather than on all of them: the design shows
 * one set at a time, and three commissions read as a set where eleven bodies in
 * four kinds read as a directory. Every body is one chip away, and the whole
 * list is on Associated Organisations in the masthead.
 */
export function OrganisationPicker({
  categories,
  orgs,
}: {
  categories: OrgCategory[];
  orgs: OrgCard[];
}) {
  const [active, setActive] = React.useState(categories[0]?.key ?? "");
  const shown = orgs.filter((o) => o.category === active);

  return (
    <div className="wn-orgpick">
      <ul className="wn-orgpick__chips">
        {categories.map((c) => (
          <li key={c.key}>
            <Chip
              size="md"
              selected={c.key === active}
              onSelectedChange={() => setActive(c.key)}
            >
              <T>{c.label}</T>
              <span className="wn-orgpick__count">{c.count}</span>
            </Chip>
          </li>
        ))}
      </ul>

      <ul className="wn-orgpick__grid">
        {shown.map((o) => (
          <li key={o.id}>
            <Link href={o.href} className="wn-orgpick__card">
              <span className="wn-orgpick__mark">
                <Image src={o.logoSrc} alt="" width={40} height={40} />
              </span>
              <span className="wn-orgpick__name">
                {o.name} <span className="wn-orgpick__abbr">({o.abbr})</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
