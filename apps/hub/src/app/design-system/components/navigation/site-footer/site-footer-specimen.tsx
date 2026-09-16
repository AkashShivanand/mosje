import * as React from "react";
import { SiteFooter, VisitorCounter } from "@mosje/design-system";

/*
 * Sitemap and Help are NOT here. They are their own props since 2026-09-07, and
 * a caller that also lists them among the policies gets each of them twice on
 * the portal variant — which is what this specimen did until the change was
 * verified in a browser. DBIM 5.6 asks for the element to be present, not
 * present twice.
 */
const POLICY = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Copyright", href: "#" },
  { label: "Hyperlinking", href: "#" },
  { label: "Accessibility", href: "#" },
  { label: "Feedback", href: "#" },
];

/* The estate's own five, so the specimen wraps where the real footer wraps.
   The first of them is the GIGW-mandated india.gov.in link. */
const RELATED = [
  { label: "National Portal of India", href: "#", external: true },
  { label: "MyGov", href: "#", external: true },
  { label: "Open Government Data", href: "#", external: true },
  { label: "Digital India", href: "#", external: true },
  { label: "CPGRAMS", href: "#", external: true },
];

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
      policyLinks={POLICY}
      sitemap={{ label: "Sitemap", href: "#" }}
      help={{ label: "Help & Support", href: "#" }}
      relatedLinks={RELATED}
      copyright="© 2026 Department of Social Justice & Empowerment. All rights reserved."
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
      address="Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001"
      social={[
        { label: "Facebook", href: "#", icon: "facebook" },
        { label: "X (formerly Twitter)", href: "#", icon: "x" },
        { label: "YouTube", href: "#", icon: "youtube" },
      ]}
      columns={[
        {
          heading: "The Department",
          id: "footer-department",
          links: [
            { label: "About Us", href: "#" },
            { label: "Who’s Who", href: "#" },
            { label: "Organisation Chart", href: "#" },
          ],
        },
        {
          heading: "Schemes",
          id: "footer-schemes",
          links: [
            { label: "PM-AJAY", href: "#" },
            { label: "SMILE", href: "#" },
            { label: "National Overseas Scholarship", href: "#" },
          ],
        },
        {
          heading: "Documents",
          id: "footer-documents",
          links: [
            { label: "Annual Reports", href: "#" },
            { label: "Guidelines", href: "#" },
            { label: "Tenders", href: "#" },
          ],
        },
        {
          heading: "Citizen Services",
          id: "footer-services",
          links: [
            { label: "Grievance Redressal", href: "#" },
            { label: "Right to Information", href: "#" },
            { label: "Contact Us", href: "#" },
          ],
        },
      ]}
      lineage={LINEAGE}
      credits={CREDITS}
      policyLinks={POLICY}
      sitemap={{ label: "Sitemap", href: "#" }}
      help={{ label: "Help & Support", href: "#" }}
      relatedLinks={RELATED}
      copyright="© 2026 Department of Social Justice & Empowerment. All rights reserved."
      lastUpdated="27 August 2026"
      colophonSlot={<VisitorCounter />}
    />
  );
}
