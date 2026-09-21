"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NATIONAL_EMBLEM, SiteHeader, buttonClasses, type NavItem } from "@mosje/design-system";

import { LanguageDialog } from "@/components/i18n/language-dialog";
import { useTranslation } from "@/components/i18n/translation-provider";
import { languageLabel } from "@/lib/bhashini/languages";
import { useSearchSuggestions } from "@/components/website/search/use-search-suggestions";
import { NAV } from "./nav";

const norm = (href: string) => (href === "/" ? href : href.replace(/\/+$/, ""));

function destinations(item: NavItem): string[] {
  return [
    ...(item.children ?? []).map((c) => c.href),
    ...(item.columns ?? []).flatMap((col) => [
      ...(col.items ?? []).map((o) => o.href),
      ...(col.links ?? []).map((l) => l.href),
    ]),
  ];
}

/**
 * The redesign's masthead: the design system's `SiteHeader`, configured.
 *
 * Everything that makes a masthead compliant lives in the component (skip link,
 * emblem lockup, one-line nav with overflow to a sheet, collapse on scroll,
 * `aria-expanded` menu buttons, focus management). This file owns only what is
 * the website's: the navigation model (nav.ts), the search route and the
 * language dialog.
 *
 * Deliberately absent, against the classic masthead:
 *  - the BETA badge (issue BRD-09: a live Government of India site is not in beta;
 *    the Ministry decides, and the default is not to claim it);
 *  - a Home nav entry (the emblem is Home).
 */
export function Masthead() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t } = useTranslation();
  const [langOpen, setLangOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const suggestions = useSearchSuggestions(query);

  const onPath = (href?: string) => {
    if (!href || href === "#" || !pathname) return false;
    const h = norm(href);
    return pathname === h || pathname.startsWith(`${h}/`);
  };

  const nav: NavItem[] = NAV.map((item) => ({
    ...item,
    label: t(item.label),
    active: destinations(item).some(onPath),
    children: item.children?.map((c) => ({ ...c, label: t(c.label), active: onPath(c.href) })),
    columns: item.columns?.map((col) => ({
      ...col,
      heading: col.heading ? t(col.heading) : col.heading,
      items: col.items?.map((o) => ({ ...o, name: t(o.name), active: onPath(o.href) })),
      links: col.links?.map((l) => ({ ...l, label: t(l.label), active: onPath(l.href) })),
    })),
  }));

  const search = (q: string) =>
    router.push(q.trim() ? `/website/search?q=${encodeURIComponent(q.trim())}` : "/website/search");

  return (
    <>
      <SiteHeader
        linkAs={Link}
        homeHref="/website"
        variant="website"
        beta={false}
        skipTo="#content"
        emblemSrc={NATIONAL_EMBLEM}
        emblemAlt="National Emblem of India, Government of India"
        brandLines={{
          org: t("Government of India"),
          ministry: t("Ministry of Social Justice & Empowerment"),
          department: t("Department of Social Justice & Empowerment"),
        }}
        govLink={{
          href: "https://india.gov.in/",
          label: "Government of India",
          flagSrc: "/website/images/Indian-Flag.svg",
        }}
        language={{ label: languageLabel(lang), onClick: () => setLangOpen(true) }}
        search={{
          placeholder: t("Search schemes and services"),
          onSearch: search,
          onQueryChange: setQuery,
          suggestions,
          onSuggestionSelect: (s) => router.push(s.id),
        }}
        cobranding={[
          {
            src: "/website/images/digital-india-logo.svg",
            alt: "Digital India",
            href: "https://www.digitalindia.gov.in/",
            height: 40,
          },
        ]}
        nav={nav}
        actions={
          /* One door (Secretary's review, 17 Sep 2026): the portal list, where
             each portal's login opens on its citizen tab. */
          <Link href="/portals" className={buttonClasses()}>
            {t("Login")}
          </Link>
        }
      />
      <LanguageDialog open={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}
