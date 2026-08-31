"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SiteHeader, buttonClasses, type NavItem } from "@mosje/design-system";

import { LanguageDialog } from "@/components/i18n/language-dialog";
import { useTranslation } from "@/components/i18n/translation-provider";
import { languageLabel } from "@/lib/bhashini/languages";
import { useSearchSuggestions } from "@/components/website/search/use-search-suggestions";

// The website mounts natively in the hub at /website, and its public assets live
// at apps/hub/public/website/…, so they serve under this prefix. (It was the app's
// basePath before the native mount — same value, now a literal folder path.)
const BP = "/website";

/**
 * SEVEN ENTRIES IS THE CEILING ON A 1280px SCREEN — read this before adding one.
 *
 * Measured 2026-08-26 against the live masthead. Once the page scrolls, the
 * header condenses to a single bar and the content column is 1200px; after its
 * 24px padding a side, the emblem, the search button and the CTA, the nav has
 * **880px**. These seven entries measure **837**. That is 43px of slack, and an
 * eighth entry needs about 96.
 *
 * Nothing breaks if you add one: `SiteHeader` measures itself and hands the nav
 * to the sheet rather than letting the items overlap, so a 1280px laptop loses
 * the inline row to the hamburger. At 1440 and above an eighth entry still fits.
 * That is a design decision to make deliberately, not a bug to discover.
 *
 * If you need the row back at 1280, the cheapest 96px is a shorter label:
 * "Associated Organisations" is 206px on its own — a quarter of the whole nav and
 * more than double the average entry. Kept as it stands by decision (2026-08-27),
 * to be revisited when Schemes moves out of Offerings and becomes the eighth.
 *
 * The arithmetic and the fallback live in `site-header.tsx` (the overflow
 * measurement) and `header.css` (the condensed bar).
 */
const NAV: NavItem[] = [
  { label: "Home", href: "/website" },
  {
    label: "Department",
    href: "#",
    children: [
      { label: "About Us", href: "/website/about-us" },
      { label: "Who’s Who", href: "/website/whos-who" },
      { label: "Directory", href: "/website/mosje-directory" },
    ],
  },
  {
    label: "Associated Organisations",
    href: "#",
    columns: [
      {
        heading: "Commissions",
        items: [
          { abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "/website/organisation/national-commission-for-scheduled-castes", iconSrc: `${BP}/images/org-logos/ncsc.png` },
          { abbr: "NCSK", name: "National Commission for Safai Karamcharis", href: "/website/organisation/national-commission-for-safai-karamcharis", iconSrc: `${BP}/images/org-logos/ncsk.png` },
          { abbr: "NCBC", name: "National Commission for Backward Classes", href: "/website/organisation/national-commission-for-backward-classes-ncbc", iconSrc: `${BP}/images/org-logos/ncbc.png` },
        ],
      },
      {
        heading: "Corporations",
        items: [
          { abbr: "NSFDC", name: "National Scheduled Castes Finance and Development Corporation", href: "/website/organisation/national-scheduled-castes-finance-and-development-corporation", iconSrc: `${BP}/images/org-logos/nsfdc.png` },
          { abbr: "NSKFDC", name: "National Safai Karamcharis Finance and Development Corporation", href: "/website/organisation/national-safai-karamcharis-finance-development-corporation", iconSrc: `${BP}/images/org-logos/nskfdc.png` },
          { abbr: "NBCFDC", name: "National Backward Classes Finance and Development Corporation", href: "/website/organisation/national-backward-classes-financeand-development-corporationnbcfdc", iconSrc: `${BP}/images/org-logos/nbcfdc.png` },
        ],
      },
      {
        heading: "Foundation / Autonomous Bodies",
        items: [
          { abbr: "DAF", name: "Dr. Ambedkar Foundation", href: "/website/organisation/dr-ambedkar-foundation", iconSrc: `${BP}/images/org-logos/daf.png` },
          { abbr: "BJRNF", name: "Babu Jagjivan Ram National Foundation", href: "/website/organisation/babu-jagjivan-ram-national-foundation-jrf", iconSrc: `${BP}/images/org-logos/jrf.png` },
          { abbr: "DAIC", name: "Dr Ambedkar International Centre", href: "/website/organisation/dr-ambedkar-international-centre", iconSrc: `${BP}/images/org-logos/daic.png` },
        ],
      },
      {
        heading: "Training & Capacity Building",
        items: [
          { abbr: "NISD", name: "National Institute of Social Defence", href: "/website/organisation/national-institute-of-social-defence", iconSrc: `${BP}/images/org-logos/nisd.png` },
        ],
      },
      {
        heading: "Scheme Specific Thematic Portals",
        items: [
          { abbr: "DWBDNC", name: "Development and Welfare Board for De-notified, Nomadic, and Semi-Nomadic Communities", href: "/website/organisation/development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic" },
          { abbr: "SCW", name: "Senior Citizens Welfare", href: "/website/organisation/senior-citizens-welfarescw" },
          { abbr: "PM-AJAY", name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna", href: "/website/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay" },
          { abbr: "SMILE", name: "National Portal for Transgender Persons", href: "/website/organisation/national-portal-for-transgender-persons" },
          { abbr: "SMILE", name: "Support for Marginalized Individuals for Livelihood and Enterprise", href: "/website/schemes-services/support-for-marginalized-individuals-for-livelihood-and-enterprise-smile" },
          { abbr: "NOS", name: "National Overseas Scholarship", href: "/website/organisation/national-overseas-scholarship" },
          { abbr: "NMBA", name: "Nasha Mukt Bharat Abhiyaan", href: "/website/organisation/nasha-mukt-bharat-abhiyaan" },
          { abbr: "NHAA", name: "National Helpline Against Atrocities", href: "/portals/nhapoa" },
        ],
      },
    ],
  },
  {
    label: "Offerings",
    href: "#",
    children: [
      { label: "Schemes & Services", href: "/website/schemes-services" },
      /*
       * UNDER OFFERINGS, NOT AS AN EIGHTH TOP-LEVEL ITEM. The row has 43px of
       * slack and an eighth entry needs about 96 — see the capacity note above —
       * so promoting this would drop the inline nav to the hamburger at 1280.
       * The directory is a thing the department OFFERS, which is what this menu
       * already collects, so it belongs here on meaning as well as on space.
       *
       * It also closes a real wayfinding hole: /portals was reachable from the
       * hub root and from error pages, but from nowhere in the website's own
       * navigation. Until this entry existed, the SAMAVESH banner drawer's
       * footer link was the ONLY route to it from the website.
       */
      { label: "Citizen Portals", href: "/portals" },
      { label: "Vacancies", href: "/website/vacancies" },
      { label: "Tenders", href: "/website/tenders" },
    ],
  },
  {
    label: "Documents",
    href: "#",
    children: [
      { label: "Annual Reports", href: "/website/annual-reports" },
      { label: "Acts & Rules", href: "/website/acts-rules" },
      { label: "Policies", href: "/website/policies" },
      { label: "Resources", href: "/website/resources" },
      { label: "Circulars & Notifications", href: "/website/circulars-notifications" },
      { label: "Forms & Templates", href: "/website/forms-templates" },
      { label: "Publications", href: "/website/publications" },
      { label: "Notices", href: "/website/notices" },
      { label: "RTI", href: "/website/rti" },
      { label: "Suo Moto Disclosure", href: "/website/suo-moto-disclosure" },
      { label: "MOU", href: "/website/mou" },
      { label: "Advices", href: "/website/advices" },
      { label: "Miscellaneous", href: "/website/miscellaneous" },
    ],
  },
  {
    label: "Events & Gallery",
    href: "#",
    children: [
      { label: "Events", href: "/website/events" },
      { label: "Gallery", href: "/website/gallery" },
    ],
  },
  {
    label: "Connect",
    href: "#",
    children: [
      { label: "CPIO", href: "/website/contact-us" },
      { label: "Directory", href: "/website/mosje-directory" },
      { label: "Contact Us", href: "/website/contact-us" },
      // Ministry-level contact, including the Public Grievance Officer. Distinct from
      // Contact Us, which is the Department's. The page existed and nothing linked to it.
      { label: "Ministry Contact", href: "/website/mosje-contact" },
    ],
  },
];

export interface HeaderProps {
  /** Hide the Admin Login button in the header actions. Defaults to false (or auto-hidden on /portals). */
  hideAdminLogin?: boolean;
}

export function Header({ hideAdminLogin = false }: HeaderProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t } = useTranslation();
  const [langOpen, setLangOpen] = React.useState(false);

  const shouldHideAdmin = hideAdminLogin || pathname === "/portals" || pathname?.startsWith("/portals");

  /* The masthead field holds its own text; this mirrors it so the suggestions can
     be fetched for it. The field stays the source of truth for what is TYPED —
     mirroring it here rather than controlling it keeps the header's existing
     contract intact for every other consumer. */
  const [searchQuery, setSearchQuery] = React.useState("");
  const suggestions = useSearchSuggestions(searchQuery);

  /* Labels go through `t` on the way out. Only the labels: hrefs, emblem paths
     and organisation abbreviations are identifiers, not prose, and translating
     an abbreviation like NCSC would make the row unsearchable in every language
     including its own. The full organisation NAMES are translated, because those
     are the words a reader actually scans. */
  const nav: NavItem[] = NAV.map((item) => ({
    ...item,
    label: t(item.label),
    active: item.href !== "#" && item.href === pathname,
    children: item.children?.map((c) => ({ ...c, label: t(c.label) })),
    columns: item.columns?.map((col) => ({
      ...col,
      heading: col.heading ? t(col.heading) : col.heading,
      items: col.items?.map((o) => ({ ...o, name: t(o.name) })),
      links: col.links?.map((l) => ({ ...l, label: t(l.label) })),
    })),
  }));

  return (
    <>
    <SiteHeader
      homeHref="/website"
      variant="website"
      emblemSrc={`${BP}/images/National-Emblem-logo.svg`}
      brandLines={{
        org: t("Government of India"),
        ministry: t("Ministry of Social Justice & Empowerment"),
        department: t("Department of Social Justice & Empowerment"),
      }}
      beta
      govLink={{
        href: "https://india.gov.in/",
        label: "Government of India",
        flagSrc: `${BP}/images/Indian-Flag.svg`,
      }}
      language={{
        // The control has always drawn a caret. Now something opens.
        label: languageLabel(lang),
        onClick: () => setLangOpen(true),
      }}
      search={{
        /* Measured 2026-08-26: the field is 320px at desktop, 218 at tablet and 343
           on a phone, and "Search Schemes, Services, Documents" rendered as
           "Search Schemes, Services, Docu" at EVERY one of them. A truncated
           placeholder is a truncated instruction. This fits at all three. */
        placeholder: t("Search schemes and services"),
        // The masthead field is a real input now, so the query travels with the
        // navigation instead of dumping the reader on an empty results page.
        onSearch: (query) =>
          router.push(
            query.trim()
              ? `/website/search?q=${encodeURIComponent(query.trim())}`
              : "/website/search",
          ),
        onQueryChange: setSearchQuery,
        suggestions,
        // A chosen suggestion goes straight to the thing. Pressing Enter without
        // choosing one still runs the full search — the list is a shortcut, never
        // the only route. [DBIM 9.viii]
        onSuggestionSelect: (suggestion) => router.push(suggestion.id),
      }}
      cobranding={[
        { src: `${BP}/images/digital-india-logo.svg`, alt: "Digital India — Power To Empower", href: "https://www.digitalindia.gov.in/", height: 40 },
      ]}
      nav={nav}
      actions={
        shouldHideAdmin ? undefined : (
          <Link href="/website/admin" className={buttonClasses()}>
            {t("Admin Login")}
          </Link>
        )
      }
    />
    <LanguageDialog open={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}
