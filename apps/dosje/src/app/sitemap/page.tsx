import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Sitemap — Department of Social Justice & Empowerment",
  description:
    "A structured map of the website of the Department of Social Justice & Empowerment (DoSJE), Government of India, grouping all major sections and pages.",
};

interface SitemapLink {
  label: string;
  href: string;
}

interface SitemapSection {
  heading: string;
  links: SitemapLink[];
}

const SECTIONS: SitemapSection[] = [
  {
    heading: "Department",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Who's Who", href: "/whos-who" },
      { label: "Directory", href: "/mosje-directory" },
    ],
  },
  {
    heading: "Associated Organisations",
    links: [
      { label: "NCSC", href: "/organisation/national-commission-for-scheduled-castes" },
      { label: "NCBC", href: "/organisation/national-commission-for-backward-classes-ncbc" },
      { label: "NSFDC", href: "/organisation/nsfdc" },
      { label: "Dr. Ambedkar Foundation", href: "/organisation/dr-ambedkar-foundation" },
    ],
  },
  {
    heading: "Offerings",
    links: [
      { label: "Schemes & Services", href: "/schemes-services" },
      { label: "Vacancies", href: "/vacancies" },
      { label: "Tenders", href: "/tenders" },
    ],
  },
  {
    heading: "Documents",
    links: [
      { label: "Annual Reports", href: "/annual-reports" },
      { label: "Acts & Rules", href: "/acts-rules" },
      { label: "Policies", href: "/policies" },
      { label: "Circulars", href: "/circulars-notifications" },
      { label: "Notices", href: "/notices" },
      { label: "Right to Information (RTI)", href: "/rti" },
    ],
  },
  {
    heading: "Events & Gallery",
    links: [
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    heading: "Connect",
    links: [{ label: "Contact Us", href: "/contact-us" }],
  },
  {
    heading: "Policies",
    links: [
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Copyright Policy", href: "/copyright" },
      { label: "Hyperlinking Policy", href: "/hyperlinking-policy" },
      { label: "Accessibility Statement", href: "/accessibility" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <ContentPage
      title="Sitemap"
      breadcrumb={[{ label: "Sitemap" }]}
      description="An overview of the structure of this website, with links to all the major sections and pages of the Department of Social Justice & Empowerment."
      lastUpdated="06 Jun 2026"
    >
      <p>
        This sitemap lists the major sections and pages of the website of the Department of Social Justice
        &amp; Empowerment (DoSJE), Government of India, to help you find the information you need quickly.
      </p>
      {SECTIONS.map((section) => (
        <div key={section.heading}>
          <h2>{section.heading}</h2>
          <ul>
            {section.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </ContentPage>
  );
}
