import Image from "next/image";
import Link from "next/link";
import {
  SiteFooter as DsSiteFooter,
  VisitorCounter,
  type SiteFooterColumn,
  type SiteFooterCredit,
  type SiteFooterLink,
  type SiteFooterSocial,
  ActionBanner,
  buttonClasses,
  Band,
} from "@mosje/design-system";
import { getContentSyncedDate } from "@/lib/website/content";
import { VISITOR_ANALYTICS } from "@/lib/website/visitor-analytics";

/*
 * DS Audit — website SiteFooter
 *   SiteFooter      ➕ ADDED to the DS  · packages/design-system/components/navigation/site-footer
 *   VisitorCounter  ➕ ADDED to the DS  · packages/design-system/components/data-display/visitor-counter
 *   Icon            ✅ existing         · used inside the DS component
 *   Link / Image    ✅ existing         · injected here so the DS stays framework-agnostic
 *
 * This file is now CONTENT ONLY. Every structural and visual decision lives in
 * the DS component; what remains here is the MoSJE link graph, the addresses,
 * the brand marks and the statutory sentences. That split is the point: a
 * second site in the estate gets the same footer by passing its own content.
 *
 * COLOUR — nothing here sets one. The DS component binds to
 * `--sa-color-primaryScale-*`, so the footer follows `data-brand` across blue,
 * navy, dbim and the five DBIM hues. The previous version painted `bg-navy`,
 * a literal that could not answer to the brand mode at all.
 *
 * LINK COVERAGE — every link in the dosje.gov.in footer is here (checked
 * 2026-09-17), and the only additions are what DBIM 3.0 §5.6 or GIGW 3.0
 * requires and the live footer lacks:
 *   Feedback              DBIM 5.6 required element; GIGW 3.0 homepage minimum (g)
 *   Related Links         DBIM 5.6 required element — the National Portal of
 *                         India (GIGW 3.0 requires it), CPGRAMS, MyGov and
 *                         Open Government Data
 *   lineage sentence      DBIM 5.6 prescribed wording
 * Digital India left Related Links on 2026-09-17: its credit logo already links
 * it. (The other three were removed the same day and restored — a Related Links
 * row with one entry read as content that had failed to load.) "Help & Support" left the Support column for the
 * live site's Help link in the policy row, which now opens a real Help page.
 * The Accessibility Statement link left the footer the same day: neither
 * standard asks for it there, and DBIM 5.6 defines Help as the home of
 * "accessibility help", so the Help page links to it.
 *
 * "Archives" is DBIM-optional (§5.6: "may also be included") and the live
 * footer has none, so there is none here.
 *
 * DBIM COVERAGE HOLDS ON BOTH VARIANTS. variant="portal" renders no columns, so
 * Sitemap and Help render in its statutory bar instead — see design.md → SiteFooter.
 */

const columns: SiteFooterColumn[] = [
  {
    heading: "Department",
    id: "footer-department",
    links: [
      { label: "About Ministry", href: "/website/about-us" },
      // The live footer points "Vision & Mission" at the About page too; it is
      // kept so no live link is missing. The Department publishes no separate
      // vision statement to give it a page of its own.
      { label: "Vision & Mission", href: "/website/about-us" },
      { label: "Organisational Chart", href: "/website/whos-who" },
      { label: "Ministers & Officials", href: "/website/mosje-directory" },
      { label: "Citizen Charter", href: "/website/citizen-charter" },
    ],
  },
  {
    heading: "Services",
    id: "footer-services",
    links: [
      { label: "Schemes", href: "/website/schemes-services" },
      { label: "Tenders", href: "/website/tenders" },
      { label: "Vacancies", href: "/website/vacancies" },
    ],
  },
  {
    heading: "Support",
    id: "footer-support",
    links: [
      { label: "Contact Us", href: "/website/contact-us" },
      { label: "RTI", href: "/website/rti" },
      { label: "Sitemap", href: "/website/sitemap" },
    ],
  },
  {
    heading: "Resources",
    id: "footer-resources",
    links: [
      { label: "Notices", href: "/website/notices" },
      { label: "Acts & Rules", href: "/website/acts-rules" },
      { label: "Reports", href: "/website/annual-reports" },
      { label: "Publications", href: "/website/publications" },
      { label: "Statistics", href: "/website/dashboard" },
    ],
  },
];

/**
 * [DBIM 5.6] Related Links. The National Portal of India is the one GIGW 3.0
 * requires; the other three are the national platforms a citizen of this
 * Department most often needs next — grievance redressal, participation and
 * published data. Digital India is NOT here: its credit logo already links it.
 */
const relatedLinks: SiteFooterLink[] = [
  { label: "National Portal of India", href: "https://www.india.gov.in/", external: true },
  { label: "CPGRAMS", href: "https://pgportal.gov.in/", external: true },
  { label: "MyGov", href: "https://www.mygov.in/", external: true },
  { label: "Open Government Data", href: "https://data.gov.in/", external: true },
];

/**
 * [DBIM 5.6] Website Policy, Help and Feedback — in the live footer's order,
 * then Feedback, which the live footer lacks. Sitemap is NOT repeated here: it
 * is in the Support column, as it is on dosje.gov.in.
 */
const HELP: SiteFooterLink = { label: "Help", href: "/website/help" };
const policyLinks: SiteFooterLink[] = [
  { label: "Copyright Policy", href: "/website/copyright" },
  { label: "Hyperlinking Policy", href: "/website/hyperlinking-policy" },
  HELP,
  { label: "Terms & Conditions", href: "/website/terms-conditions" },
  { label: "Privacy Policy", href: "/website/privacy-policy" },
  { label: "Cookies", href: "/website/cookies" },
  { label: "Visitor Analytics", href: "/website/visitor-analytics" },
  { label: "Feedback", href: "/website/contact-us#feedback" },
];

/*
 * The marks themselves are NOT here. `icon` names one from the DS brand-glyph
 * set, which normalises all five to one optical size — see the note in
 * packages/design-system/components/icon/brand-glyph.tsx. What belongs in this
 * file is the estate's handles and the accessible names, and nothing else.
 */
const social: SiteFooterSocial[] = [
  { label: "Facebook", href: "https://www.facebook.com/goimsje", icon: "facebook" },
  { label: "X (formerly Twitter)", href: "https://x.com/msjegoi", icon: "x" },
  { label: "Instagram", href: "https://www.instagram.com/msjegoi", icon: "instagram" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@ministryofsocialjustice511",
    icon: "youtube",
  },
  {
    label: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029Vb7GfwH6mYPMHOvTd51W",
    icon: "whatsapp",
  },
];

/** [DBIM 5.6] "Hyperlinked logos" — the maintainer and the platform. */
const credits: SiteFooterCredit[] = [
  {
    // Labelled, where it previously carried nothing. One mark with a prefix and
    // one without read as "Powered by [A] [B]" — the label appeared to govern
    // both, and the attribution the prose used to carry was left unsaid.
    prefix: "Developed & maintained by",
    /* THE REVERSED MARK, AND IT IS A REAL VECTOR. `NeGD-Logo.svg` is 258 KB of
       embedded raster — a colour layer with an all-white layer painted over it —
       so the footer was drawing a photograph of a logo. This is the library's
       `NeGD/on-dark` exported: 30 KB, crisp at any density, and the colour file
       stays where it belongs, on the light LogoStrip. */
    src: "/website/images/NeGD-Logo-White.svg",
    alt: "National e-Governance Division (NeGD)",
    href: "https://negd.gov.in/",
    width: 143,
    height: 52,
  },
  {
    prefix: "Powered by",
    /* THE ESTATE'S OWN Digital India ARTWORK, REVERSED FOR THIS GROUND.
       `Digital-India-White.svg` was a bad crop of the mark — the swirl squashed
       to a 86x48 box and the blue stem of the 'i' clipped by the viewBox. This is
       `digital-india-logo.svg`, the file the masthead, the PM-AJAY navbar and the
       login templates already draw, with the wordmark in white: the swirl keeps
       its tricolour, which is the mark's identity and not ours to recolour. */
    src: "/website/images/Digital-India-Reverse.svg",
    alt: "Digital India",
    href: "https://www.digitalindia.gov.in/",
    width: 105,
    height: 41,
  },
];

/**
 * [DBIM 5.6] The lineage sentence, and NOTHING ELSE.
 *
 * It used to run on: "…Government of India. Developed and maintained by Digital
 * India Corporation, MeitY." Two things were wrong with that tail. It said in
 * prose what the credit logos beside it already say in marks, so the same fact
 * was on screen twice. And it named only ONE of the two organisations the
 * footer credits — the sentence sat immediately before a Digital India logo
 * while crediting Digital India Corporation and omitting NeGD, which reads as
 * an inconsistency rather than a statement.
 *
 * DBIM 5.6 prescribes the lineage wording for a Central Government Department
 * and the prescribed sentence stops at "Government of India". Attribution is a
 * separate element, and the clause has one for it: hyperlinked logos. So the
 * sentence is now exactly the mandated one — shorter, non-duplicative, and
 * closer to the clause than the longer version was.
 */
const LINEAGE =
  "This website belongs to the Department of Social Justice & Empowerment, " +
  "Ministry of Social Justice & Empowerment, Government of India.";

export interface SiteFooterProps {
  /**
   * [DBIM 5.6] "Last Updated On" must reflect the RESPECTIVE page, so
   * `PageLayout` passes the page's own stamp down. Falls back to the
   * estate-wide content sync date on pages that carry no hero.
   */
  lastUpdated?: string;
}

/**
 * The website's statutory footer — the design system's `SiteFooter` with this
 * site's content, and the support banner that sits above it.
 *
 * It does not carry the system's name because it is not the system's component:
 * an import of `SiteFooter` on the website used to resolve to either this or the
 * component it wraps, silently.
 */
export function WebsiteSiteFooter({ lastUpdated }: SiteFooterProps = {}) {
  return (
    <>
      {/* The support CTA is an ActionBanner on a light band ABOVE the footer,
          not a strip inside it. Two reasons. It is page content — an invitation
          to act — and the footer below it is statutory chrome; they are
          different registers and the light ground says so at a glance. And
          `ActionBanner` is the estate's component for exactly this, so the
          footer does not need a second way to render a call to action.

          The copy names the situation the reader is in. "Need Support?" is a
          category; "Need help with a scheme or an application?" tells someone
          in thirty seconds whether this is for them. */}
      <Band spacing="l" className="bg-white">
        <ActionBanner
          title="Need help with a scheme or an application?"
          description="Write to the department and an officer will respond."
          action={
            <Link
              href="/website/contact-us"
              className={`${buttonClasses("primary", "filled", "md")} whitespace-nowrap`}
            >
              Get in Touch
            </Link>
          }
        />
      </Band>
      <DsSiteFooter
      linkAs={Link}
      emblem={
        <Image
          src="/website/images/National_Emblem_logo_white.svg"
          alt="National Emblem of India"
          /* THE ASSET'S OWN 40x65, not the drawn size. Next compares the
             rendered box against these two numbers and warns when CSS moves
             one and not the other — 42x56 claimed a 0.75 ratio the file does
             not have, so `w-auto` resolved to 34 and tripped it. */
          width={40}
          height={65}
          /* h-14 draws it at 56px so the emblem's optical height matches the
             three-line organisation block beside it. [DBIM 5.1] — correct
             proportion, never scaled disproportionately. */
          className="h-14 w-auto shrink-0"
        />
      }
      organisation={[
        "Government of India",
        "Ministry of Social Justice & Empowerment",
        "Department of Social Justice & Empowerment",
      ]}
      address="8th Floor, GPOA-3, Netaji Nagar, New Delhi - 110023"
      social={social}
      colophonSlot={
        // The Department's published total, frozen: the same figure the
        // Visitor Analytics page shows, never an extrapolation of it.
        <VisitorCounter
          baseline={VISITOR_ANALYTICS.total}
          since={VISITOR_ANALYTICS.asOf}
          perDay={0}
          tickSeconds={0}
        />
      }
      columns={columns}
      lineage={LINEAGE}
      credits={credits}
      policyLinks={policyLinks}
      // [DBIM 5.6] Required on both variants. The website DRAWS these itself —
      // Sitemap in Support, Help in the policy row — so the component does not
      // draw them again; the
      // props guarantee the destinations exist for the portal variant, which
      // has no columns to put them in.
      sitemap={{ label: "Sitemap", href: "/website/sitemap" }}
      help={HELP}
      relatedLinks={relatedLinks}
      copyright={`© ${new Date().getFullYear()} Department of Social Justice & Empowerment. All Rights Reserved.`}
      lastUpdated={lastUpdated ?? getContentSyncedDate()}
    />
    </>
  );
}
