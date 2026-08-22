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

const columns: SiteFooterColumn[] = [
  {
    heading: "Department",
    id: "footer-department",
    links: [
      { label: "About Ministry", href: "/website/about-us" },
      { label: "Vision & Mission", href: "/website/about-us" },
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
      { label: "Help & Support", href: "/website/contact-us" },
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
  { label: "Sitemap", href: "/website/sitemap" },
];

const social: SiteFooterSocial[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/goimsje",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.022 1.792-4.69 4.533-4.69 1.312 0 2.686.235 2.686.235v2.969h-1.514c-1.491 0-1.956.93-1.956 1.886v2.243h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.099 24 12.073z",
  },
  {
    label: "X (formerly Twitter)",
    href: "https://x.com/msjegoi",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/msjegoi",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@ministryofsocialjustice511",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029Vb7GfwH6mYPMHOvTd51W",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.8 11.8 0 0 0 20.465 3.49",
  },
];

/** [DBIM 5.6] "Hyperlinked logos" — the maintainer and the platform. */
const credits: SiteFooterCredit[] = [
  {
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
 * [DBIM 5.6] The lineage sentence, in the mandated Central-Government-Department
 * form. The live site's "Contents owned and managed by…" states ownership but is
 * not this sentence, so both are carried: lineage here, ownership in the credits.
 */
const LINEAGE =
  "This website belongs to the Department of Social Justice & Empowerment, " +
  "Ministry of Social Justice & Empowerment, Government of India. Developed and " +
  "maintained by Digital India Corporation, MeitY.";

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
      <Band spacing="l" className="bg-white">
        <ActionBanner
          title="Need Support?"
          description="Reach out to our 24x7 citizen helpline or connect directly with our key officers."
          action={
            <Link
              href="/website/contact-us"
              className={`${buttonClasses("primary", "filled", "md")} whitespace-nowrap px-6 py-3`}
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
      address="8th Floor, GPOA-3, Netaji Nagar, New Delhi - 110023"
      cta={{ label: "Get in Touch", href: "/website/contact-us" }}
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
