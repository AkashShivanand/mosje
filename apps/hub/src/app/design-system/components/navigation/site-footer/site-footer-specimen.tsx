import * as React from "react";
import { SiteFooter } from "@mosje/design-system";

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

const RELATED = [
  { label: "india.gov.in", href: "#", external: true },
  { label: "MyGov", href: "#", external: true },
  { label: "Digital India", href: "#", external: true },
];

const LINEAGE =
  "This portal is designed, developed and hosted by the Department of Social Justice and Empowerment, Ministry of Social Justice and Empowerment, Government of India.";

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
      policyLinks={POLICY}
      sitemap={{ label: "Sitemap", href: "#" }}
      help={{ label: "Help & Support", href: "#" }}
      relatedLinks={RELATED}
      copyright="© 2026 Department of Social Justice & Empowerment. All rights reserved."
      lastUpdated="27 August 2026"
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
      policyLinks={POLICY}
      sitemap={{ label: "Sitemap", href: "#" }}
      help={{ label: "Help & Support", href: "#" }}
      relatedLinks={RELATED}
      copyright="© 2026 Department of Social Justice & Empowerment. All rights reserved."
      lastUpdated="27 August 2026"
    />
  );
}
