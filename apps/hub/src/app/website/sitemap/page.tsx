import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website/templates/ContentPage";

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
      { label: "About Us", href: "/website/about-us" },
      { label: "Who's Who", href: "/website/whos-who" },
      { label: "Directory", href: "/website/mosje-directory" },
    ],
  },
  {
    heading: "Associated Organisations",
    links: [
      { label: "NCSC", href: "/website/organisation/national-commission-for-scheduled-castes" },
      { label: "NCBC", href: "/website/organisation/national-commission-for-backward-classes-ncbc" },
      { label: "NSFDC", href: "/website/organisation/national-scheduled-castes-finance-and-development-corporation" },
      { label: "Dr. Ambedkar Foundation", href: "/website/organisation/dr-ambedkar-foundation" },
    ],
  },
  {
    heading: "Offerings",
    links: [
      { label: "Schemes & Services", href: "/website/schemes-services" },
      { label: "Vacancies", href: "/website/vacancies" },
      { label: "Tenders", href: "/website/tenders" },
    ],
  },
  {
    heading: "Documents",
    links: [
      { label: "Annual Reports", href: "/website/annual-reports" },
      { label: "Acts & Rules", href: "/website/acts-rules" },
      { label: "Policies", href: "/website/policies" },
      { label: "Circulars", href: "/website/circulars-notifications" },
      { label: "Notices", href: "/website/notices" },
      { label: "Right to Information (RTI)", href: "/website/rti" },
    ],
  },
  {
    heading: "Events & Gallery",
    links: [
      { label: "Events", href: "/website/events" },
      { label: "Gallery", href: "/website/gallery" },
    ],
  },
  {
    heading: "Connect",
    links: [{ label: "Contact Us", href: "/website/contact-us" }],
  },
  {
    heading: "Policies",
    links: [
      { label: "Terms & Conditions", href: "/website/terms-conditions" },
      { label: "Privacy Policy", href: "/website/privacy-policy" },
      { label: "Copyright Policy", href: "/website/copyright" },
      { label: "Hyperlinking Policy", href: "/website/hyperlinking-policy" },
      { label: "Accessibility Statement", href: "/website/accessibility" },
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
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </ContentPage>
  );
}
