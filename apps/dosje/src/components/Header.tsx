"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SiteHeader, buttonClasses, type NavItem } from "@mosje/design-system";

// dosje is mounted under basePath "/website"; plain <img> in the shared DS does
// not auto-prepend it, so public-asset srcs are prefixed explicitly.
const BP = "/website";

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Department",
    href: "#",
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "Who’s Who", href: "/whos-who" },
      { label: "Directory", href: "/mosje-directory" },
    ],
  },
  {
    label: "Associated Organisations",
    href: "#",
    columns: [
      {
        heading: "Commissions",
        items: [
          { abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "/organisation/national-commission-for-scheduled-castes", iconSrc: `${BP}/images/org-logos/ncsc.png` },
          { abbr: "NCSK", name: "National Commission for Safai Karamcharis", href: "/organisation/national-commission-for-safai-karamcharis", iconSrc: `${BP}/images/org-logos/ncsk.png` },
          { abbr: "NCBC", name: "National Commission for Backward Classes", href: "/organisation/national-commission-for-backward-classes-ncbc", iconSrc: `${BP}/images/org-logos/ncbc.png` },
        ],
      },
      {
        heading: "Corporations",
        items: [
          { abbr: "NSFDC", name: "National Scheduled Castes Finance and Development Corporation", href: "/organisation/national-scheduled-castes-finance-and-development-corporation", iconSrc: `${BP}/images/org-logos/nsfdc.png` },
          { abbr: "NSKFDC", name: "National Safai Karamcharis Finance and Development Corporation", href: "/organisation/national-safai-karamcharis-finance-development-corporation", iconSrc: `${BP}/images/org-logos/nskfdc.png` },
          { abbr: "NBCFDC", name: "National Backward Classes Finance and Development Corporation", href: "/organisation/national-backward-classes-financeand-development-corporationnbcfdc", iconSrc: `${BP}/images/org-logos/nbcfdc.png` },
        ],
      },
      {
        heading: "Foundation / Autonomous Bodies",
        items: [
          { abbr: "DAF", name: "Dr. Ambedkar Foundation", href: "/organisation/dr-ambedkar-foundation", iconSrc: `${BP}/images/org-logos/daf.png` },
          { abbr: "JRF", name: "Jagjivan Ram Foundation", href: "/organisation/jagjivan-ram-foundation", iconSrc: `${BP}/images/org-logos/jrf.png` },
          { abbr: "DAIC", name: "Dr Ambedkar International Centre", href: "/organisation/dr-ambedkar-international-centre", iconSrc: `${BP}/images/org-logos/daic.png` },
          { abbr: "NISD", name: "National Institute of Social Defence", href: "/organisation/national-institute-of-social-defence", iconSrc: `${BP}/images/org-logos/nisd.png` },
        ],
      },
    ],
  },
  {
    label: "Offerings",
    href: "#",
    children: [
      { label: "Schemes & Services", href: "/schemes-services" },
      { label: "Vacancies", href: "/vacancies" },
      { label: "Tenders", href: "/tenders" },
    ],
  },
  {
    label: "Documents",
    href: "#",
    children: [
      { label: "Annual Reports", href: "/annual-reports" },
      { label: "Acts & Rules", href: "/acts-rules" },
      { label: "Policies", href: "/policies" },
      { label: "Resources", href: "/resources" },
      { label: "Circulars & Notifications", href: "/circulars-notifications" },
      { label: "Forms & Templates", href: "/forms-templates" },
      { label: "Publications", href: "/publications" },
      { label: "Notices", href: "/notices" },
      { label: "RTI", href: "/rti" },
      { label: "MOU", href: "/mou" },
      { label: "Advices", href: "/advices" },
      { label: "Miscellaneous", href: "/miscellaneous" },
    ],
  },
  {
    label: "Events & Gallery",
    href: "#",
    children: [
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "Connect",
    href: "#",
    children: [
      { label: "CPIO", href: "/contact-us" },
      { label: "Directory", href: "/mosje-directory" },
      { label: "Contact Us", href: "/contact-us" },
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
      variant="website"
      emblemSrc={`${BP}/images/National-Emblem-logo.svg`}
      brandLines={{
        org: "Government of India",
        ministry: "Ministry of Social Justice & Empowerment",
        department: "Department of Social Justice & Empowerment",
      }}
      beta
      tone="blue"
      govLink={{
        href: "https://india.gov.in/",
        label: "Government of India",
        flagSrc: `${BP}/images/Indian-Flag.svg`,
      }}
      language={{ label: "English" }}
      search={{
        placeholder: "Search Schemes, Services, Documents",
        onSearch: () => router.push("/search"),
      }}
      cobranding={[
        { src: `${BP}/images/digital-india-logo.svg`, alt: "Digital India — Power To Empower", height: 40 },
      ]}
      nav={nav}
      actions={
        <Link href="/admin" className={buttonClasses("primary", "filled", "sm", "whitespace-nowrap")}>
          Admin Login
        </Link>
      }
    />
  );
}
