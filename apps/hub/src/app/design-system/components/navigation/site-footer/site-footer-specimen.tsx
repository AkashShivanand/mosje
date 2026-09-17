import * as React from "react";
import { SiteFooter, VisitorCounter } from "@mosje/design-system";

/*
 * The website's policy row, in the dosje.gov.in footer's order. Help is in it
 * because the website variant does not draw the `help` prop. The portal variant
 * DOES draw it, so the portal specimen passes the row without Help — listing it
 * in both would render it twice in one band.
 */
const HELP = { label: "Help", href: "#" };
const PORTAL_POLICY = [
  { label: "Copyright Policy", href: "#" },
  { label: "Hyperlinking Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Visitor Analytics", href: "#" },
  { label: "Feedback", href: "#" },
];
const WEBSITE_POLICY = [...PORTAL_POLICY.slice(0, 2), HELP, ...PORTAL_POLICY.slice(2)];

/* [DBIM 5.6] Related Links — the GIGW-mandated link to the National Portal of India. */
const RELATED = [{ label: "National Portal of India", href: "#", external: true }];

/*
 * THE SENTENCE DBIM 5.6 PRESCRIBES, which is the one the website and the Figma
 * master both carry. The specimen used to quote "This portal is designed,
 * developed and hosted by…" — the longer pre-2026-09 wording, which the estate
 * had already stopped using — so the page documenting the statutory sentence
 * showed a sentence the department does not publish.
 */
const LINEAGE =
  "This website belongs to the Department of Social Justice & Empowerment, " +
  "Ministry of Social Justice & Empowerment, Government of India.";

/*
 * DBIM 5.6 lists the hyperlinked logos among the required footer elements and
 * this page's own accessibility evidence says they render on BOTH variants —
 * but neither specimen passed `credits`, so the documentation showed a footer
 * the estate does not ship. These are the two marks the website draws, at their
 * real intrinsic sizes; the component normalises both to one optical height.
 */
const CREDITS = [
  {
    prefix: "Developed & maintained by",
    src: "/website/images/NeGD-Logo-White.svg",
    alt: "National e-Governance Division (NeGD)",
    href: "https://negd.gov.in/",
    width: 143,
    height: 52,
  },
  {
    prefix: "Powered by",
    src: "/website/images/Digital-India-Reverse.svg",
    alt: "Digital India",
    href: "https://www.digitalindia.gov.in/",
    width: 105,
    height: 41,
  },
];

/**
 * The portal variant: the statutory bar alone, which is the half that must stay
 * DBIM-compliant and identical to the website's.
 */
export function SiteFooterPortalSpecimen(): React.JSX.Element {
  return (
    <SiteFooter
      variant="portal"
      organisation={[
        "Government of India",
        "Ministry of Social Justice & Empowerment",
        "Department of Social Justice & Empowerment",
      ]}
      lineage={LINEAGE}
      credits={CREDITS}
      policyLinks={PORTAL_POLICY}
      sitemap={{ label: "Sitemap", href: "#" }}
      help={HELP}
      relatedLinks={RELATED}
      copyright="© 2026 Department of Social Justice & Empowerment. All Rights Reserved."
      lastUpdated="27 August 2026"
      colophonSlot={<VisitorCounter />}
    />
  );
}

/** The website variant: the same statutory bar, with the working footer above it. */
export function SiteFooterWebsiteSpecimen(): React.JSX.Element {
  return (
    <SiteFooter
      variant="website"
      organisation={[
        "Government of India",
        "Ministry of Social Justice & Empowerment",
        "Department of Social Justice & Empowerment",
      ]}
      address="8th Floor, GPOA-3, Netaji Nagar, New Delhi - 110023"
      social={[
        { label: "Facebook", href: "#", icon: "facebook" },
        { label: "X (formerly Twitter)", href: "#", icon: "x" },
        { label: "Instagram", href: "#", icon: "instagram" },
        { label: "YouTube", href: "#", icon: "youtube" },
        { label: "WhatsApp Channel", href: "#", icon: "whatsapp" },
      ]}
      columns={[
        {
          heading: "Department",
          id: "specimen-footer-department",
          links: [
            { label: "About Ministry", href: "#" },
            { label: "Vision & Mission", href: "#" },
            { label: "Organisational Chart", href: "#" },
            { label: "Ministers & Officials", href: "#" },
            { label: "Citizen Charter", href: "#" },
          ],
        },
        {
          heading: "Services",
          id: "specimen-footer-services",
          links: [
            { label: "Schemes", href: "#" },
            { label: "Tenders", href: "#" },
            { label: "Vacancies", href: "#" },
          ],
        },
        {
          heading: "Support",
          id: "specimen-footer-support",
          links: [
            { label: "Contact Us", href: "#" },
            { label: "RTI", href: "#" },
            { label: "Sitemap", href: "#" },
          ],
        },
        {
          heading: "Resources",
          id: "specimen-footer-resources",
          links: [
            { label: "Notices", href: "#" },
            { label: "Acts & Rules", href: "#" },
            { label: "Reports", href: "#" },
            { label: "Publications", href: "#" },
            { label: "Statistics", href: "#" },
          ],
        },
      ]}
      lineage={LINEAGE}
      credits={CREDITS}
      policyLinks={WEBSITE_POLICY}
      sitemap={{ label: "Sitemap", href: "#" }}
      help={HELP}
      relatedLinks={RELATED}
      copyright="© 2026 Department of Social Justice & Empowerment. All Rights Reserved."
      lastUpdated="27 August 2026"
      colophonSlot={<VisitorCounter />}
    />
  );
}
