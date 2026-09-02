import * as React from "react";
import { SiteFooter } from "@mosje/design-system";

const POLICY = [
  { label: "Website Policy", href: "#" },
  { label: "Help", href: "#" },
  { label: "Feedback", href: "#" },
  { label: "Sitemap", href: "#" },
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
      relatedLinks={RELATED}
      copyright="© 2026 Department of Social Justice & Empowerment. All rights reserved."
      lastUpdated="27 August 2026"
    />
  );
}
