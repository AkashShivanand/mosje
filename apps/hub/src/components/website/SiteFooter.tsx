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
 * DBIM 5.6 element coverage, all present below:
 *   Website Policy · Sitemap · Related Links · Help · Feedback · Last Updated On
 *   Social Media Links (optional) · hyperlinked lineage logos · lineage sentence
 * "Archives" is DBIM-optional and has no page on this estate; recorded as a
 * known gap in docs/guidelines rather than linked to something it is not.
 */

/**
 * Where "Help & Support" points.
 *
 * A citizen support portal is being built — the place to raise an issue WITH
 * the website or a portal, as distinct from contacting the department about a
 * scheme. Until it ships this aliases the contact page, which is the only real
 * destination that exists today.
 *
 * IT IS A CONSTANT SO THE SWITCH IS ONE LINE. When the portal lands, change
 * this and nothing else: the footer already models Help and Contact as two
 * separate entries precisely because they are about to become two separate
 * things. Linking both to the same page in the meantime is a transitional
 * alias with a stated end, not the duplication that was removed earlier —
 * that one had no end.
 */
const SUPPORT_PORTAL_HREF = "/website/contact-us";

const columns: SiteFooterColumn[] = [
  {
    heading: "Department",
    id: "footer-department",
    links: [
      // "Vision & Mission" was here pointing at /website/about-us — the SAME
      // page as "About Ministry" above it. Two labels, one destination, is a
      // link that promises somewhere new and delivers the reader back where
      // they were. Removed rather than re-pointed: there is no vision page.
      { label: "About Ministry", href: "/website/about-us" },
      { label: "Organisational Chart", href: "/website/whos-who" },
      { label: "Ministers & Officials", href: "/website/mosje-directory" },
    ],
  },
  {
    heading: "Services",
    id: "footer-services",
    links: [
      { label: "Schemes & Benefits", href: "/website/schemes-services" },
      { label: "Tenders", href: "/website/tenders" },
      { label: "Vacancies", href: "/website/vacancies" },
    ],
  },
  {
    heading: "Support",
    id: "footer-support",
    links: [
      // TWO entries, and they are about to be two destinations. "Help &
      // Support" is where you report a problem WITH the site; "Contact Us" is
      // where you reach the department about a scheme. DBIM 5.6 names Help as
      // a required element in its own right, so it keeps its own row.
      { label: "Help & Support", href: SUPPORT_PORTAL_HREF },
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

/** [DBIM 5.6] Related Links. Also carries the GIGW-mandated india.gov.in link. */
const relatedLinks: SiteFooterLink[] = [
  { label: "National Portal of India", href: "https://www.india.gov.in/", external: true },
  { label: "MyGov", href: "https://www.mygov.in/", external: true },
  { label: "Open Government Data", href: "https://data.gov.in/", external: true },
  { label: "Digital India", href: "https://www.digitalindia.gov.in/", external: true },
  { label: "CPGRAMS", href: "https://pgportal.gov.in/", external: true },
];

/** [DBIM 5.6] Website Policy + Help + Feedback + Sitemap. */
const policyLinks: SiteFooterLink[] = [
  { label: "Terms & Conditions", href: "/website/terms-conditions" },
  { label: "Privacy Policy", href: "/website/privacy-policy" },
  { label: "Copyright", href: "/website/copyright" },
  { label: "Hyperlinking", href: "/website/hyperlinking-policy" },
  { label: "Accessibility", href: "/website/accessibility" },
  { label: "Feedback", href: "/website/contact-us#feedback" },
  // "Sitemap" is NOT repeated here — it is in the Support column, and DBIM 5.6
  // asks for the element to be present in the footer, not present twice.
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
    src: "/website/images/NeGD-Logo.svg",
    alt: "National e-Governance Division (NeGD)",
    href: "https://negd.gov.in/",
    width: 78,
    height: 34,
  },
  {
    prefix: "Powered by",
    src: "/website/images/Digital-India-White.svg",
    alt: "Digital India",
    href: "https://www.digitalindia.gov.in/",
    width: 78,
    height: 34,
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

export function SiteFooter({ lastUpdated }: SiteFooterProps = {}) {
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
          width={42}
          height={56}
          /* 56px so the emblem's optical height matches the three-line
             organisation block beside it. [DBIM 5.1] — correct proportion,
             never scaled disproportionately. */
          className="h-14 w-auto shrink-0"
        />
      }
      organisation={[
        "Government of India",
        "Ministry of Social Justice & Empowerment",
        "Department of Social Justice & Empowerment",
      ]}
      /* The Ministry's own address [WEB-F-04, in part]. This read "8th Floor,
         GPOA-3, Netaji Nagar, New Delhi - 110023", which is not the Ministry —
         `content/website/organisation.json` gives it as the address of
         subordinate offices (the NOS cell among them). The Ministry is at
         Shastri Bhawan, per /website/mosje-contact and /website/contact-person,
         and the Handoff frame's footer agrees. Every page on the estate was
         printing a subordinate office's address as the Ministry's. */
      address="Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001"
      social={social}
      colophonSlot={<VisitorCounter />}
      columns={columns}
      lineage={LINEAGE}
      credits={credits}
      policyLinks={policyLinks}
      relatedLinks={relatedLinks}
      copyright={`© ${new Date().getFullYear()} Department of Social Justice & Empowerment. All Rights Reserved.`}
      lastUpdated={lastUpdated ?? getContentSyncedDate()}
    />
    </>
  );
}
