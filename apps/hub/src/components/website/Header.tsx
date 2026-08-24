"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SiteHeader, buttonClasses, type NavItem } from "@mosje/design-system";

// The website mounts natively in the hub at /website, and its public assets live
// at apps/hub/public/website/…, so they serve under this prefix. (It was the app's
// basePath before the native mount — same value, now a literal folder path.)
const BP = "/website";

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
          { abbr: "SMILE", name: "Support for Marginalized Individuals for Livelihood and Enterprise", href: "/website/organisation/support-for-marginalized-individuals-for-livelihood-and-enterprise-smile" },
          { abbr: "NOS", name: "National Overseas Scholarship", href: "/website/organisation/national-overseas-scholarship" },
          { abbr: "NMBA", name: "Nasha Mukt Bharat Abhiyaan", href: "/website/organisation/nasha-mukt-bharat-abhiyaan" },
          { abbr: "NHAA", name: "National Helpline Against Atrocities", href: "/website/organisation/national-helpline-against-atrorocities" },
        ],
      },
    ],
  },
  {
    label: "Offerings",
    href: "#",
    children: [
      { label: "Schemes & Services", href: "/website/schemes-services" },
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

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const nav: NavItem[] = NAV.map((item) => ({
    ...item,
    active: item.href !== "#" && item.href === pathname,
  }));

  return (
    <SiteHeader
      homeHref="/website"
      variant="website"
      emblemSrc={`${BP}/images/National-Emblem-logo.svg`}
      brandLines={{
        org: "Government of India",
        ministry: "Ministry of Social Justice & Empowerment",
        department: "Department of Social Justice & Empowerment",
      }}
      beta
      govLink={{
        href: "https://india.gov.in/",
        label: "Government of India",
        flagSrc: `${BP}/images/Indian-Flag.svg`,
      }}
      language={{ label: "English" }}
      search={{
        placeholder: "Search Schemes, Services, Documents",
        // The masthead field is a real input now, so the query travels with the
        // navigation instead of dumping the reader on an empty results page.
        onSearch: (query) =>
          router.push(
            query.trim()
              ? `/website/search?q=${encodeURIComponent(query.trim())}`
              : "/website/search",
          ),
      }}
      cobranding={[
        { src: `${BP}/images/digital-india-logo.svg`, alt: "Digital India — Power To Empower", height: 40 },
      ]}
      nav={nav}
      actions={
        <Link href="/website/admin" className={buttonClasses()}>
          Admin Login
        </Link>
      }
    />
  );
}
