import Image from "next/image";
import Link from "next/link";
import {
  NATIONAL_EMBLEM_INVERSE,
  SiteFooter as DsSiteFooter,
  VisitorCounter,
  type SiteFooterColumn,
  type SiteFooterCredit,
  type SiteFooterLink,
  type SiteFooterSocial,
} from "@mosje/design-system";
import { getContentSyncedDate } from "@/lib/website/content";
import { VISITOR_ANALYTICS } from "@/lib/website/visitor-analytics";
import { ReportProblemLink } from "./ReportProblemLink";
import { formatDate } from "@/components/website-next/ui/format";

/**
 * The redesign's footer: the design system's `SiteFooter`, configured.
 *
 * DBIM 3.0 §5.6 requires four sections — Archives, Website Policy, Related Links
 * and Feedback — beside the lineage (issue MAN-03). The classic footer had none
 * of them as sections. Here each is a column a reader can find by its name, and
 * the Website Policy column is the hub page GIGW asks for plus every policy it
 * links (issue X-GIGW-03).
 *
 * The support call-to-action that sat above the classic footer is gone from the
 * chrome: it repeated "Contact" on every page, and the home page carries the
 * helplines where they are the answer.
 */
const HELP: SiteFooterLink = { label: "Help", href: "/website/help" };

const columns: SiteFooterColumn[] = [
  {
    heading: "About",
    id: "footer-about",
    links: [
      { label: "About the Department", href: "/website/about-us" },
      { label: "Who’s Who", href: "/website/whos-who" },
      { label: "Directory", href: "/website/directory" },
      { label: "Citizen’s Charter", href: "/website/citizen-charter" },
      { label: "Right to Information", href: "/website/rti" },
      { label: "CPIO", href: "/website/cpio" },
    ],
  },
  /* The live footer's "Services" and "Resources" columns (home audit
     2026-09-22): the eleven destinations the first pass of this footer dropped. */
  {
    heading: "Services",
    id: "footer-services",
    links: [
      { label: "Schemes", href: "/website/schemes-services" },
      { label: "Tenders", href: "/website/tenders" },
      { label: "Vacancies", href: "/website/vacancies" },
      { label: "Dashboard", href: "/website/dashboard" },
    ],
  },
  {
    heading: "Resources",
    id: "footer-resources",
    links: [
      { label: "Notices", href: "/website/notices" },
      { label: "Acts & Rules", href: "/website/acts-rules" },
      { label: "Annual Reports", href: "/website/annual-reports" },
      { label: "Publications", href: "/website/publications" },
    ],
  },
  {
    heading: "Website Policy",
    id: "footer-policy",
    links: [
      { label: "Website Policies", href: "/website/website-policies" },
      { label: "Accessibility Statement", href: "/website/accessibility-statement" },
      { label: "Screen Reader Access", href: "/website/screen-reader-access" },
      { label: "Privacy Policy", href: "/website/privacy-policy" },
      { label: "Disclaimer", href: "/website/disclaimer" },
    ],
  },
  {
    heading: "Archives",
    id: "footer-archives",
    links: [
      { label: "Archived Tenders and Vacancies", href: "/website/archives" },
      { label: "Past Events", href: "/website/events" },
    ],
  },
  {
    heading: "Feedback",
    id: "footer-feedback",
    links: [
      { label: "Give Feedback", href: "/website/feedback" },
      { label: "Contact Us", href: "/website/contact-us" },
      HELP,
      { label: "Sitemap", href: "/website/sitemap" },
    ],
  },
];

const relatedLinks: SiteFooterLink[] = [
  { label: "National Portal of India", href: "https://www.india.gov.in/", external: true },
  { label: "myScheme", href: "https://www.myscheme.gov.in/", external: true },
  { label: "CPGRAMS", href: "https://pgportal.gov.in/", external: true },
  { label: "MyGov", href: "https://www.mygov.in/", external: true },
  { label: "Open Government Data", href: "https://data.gov.in/", external: true },
];


const policyLinks: SiteFooterLink[] = [
  { label: "Copyright Policy", href: "/website/copyright" },
  { label: "Hyperlinking Policy", href: "/website/hyperlinking-policy" },
  { label: "Terms & Conditions", href: "/website/terms-conditions" },
  { label: "Cookie Policy", href: "/website/cookies" },
  { label: "Visitor Analytics", href: "/website/visitor-analytics" },
];

const social: SiteFooterSocial[] = [
  { label: "Facebook", href: "https://www.facebook.com/goimsje", icon: "facebook" },
  { label: "X (formerly Twitter)", href: "https://x.com/msjegoi", icon: "x" },
  { label: "Instagram", href: "https://www.instagram.com/msjegoi", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@ministryofsocialjustice511", icon: "youtube" },
  { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029Vb7GfwH6mYPMHOvTd51W", icon: "whatsapp" },
];

/* GIGW: say who designed, developed and hosts the site (issue MAN-10). */
const credits: SiteFooterCredit[] = [
  {
    prefix: "Designed, developed and maintained by",
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

const LINEAGE =
  "This website belongs to the Department of Social Justice & Empowerment, " +
  "Ministry of Social Justice & Empowerment, Government of India.";

export function WebsiteFooter({ lastUpdated }: { lastUpdated?: string }) {
  return (
    <DsSiteFooter
      linkAs={Link}
      emblem={
        <Image
          src={NATIONAL_EMBLEM_INVERSE}
          alt="National Emblem of India"
          width={40}
          height={65}
          className="h-14 w-auto shrink-0"
        />
      }
      organisation={[
        "Government of India",
        "Ministry of Social Justice & Empowerment",
        "Department of Social Justice & Empowerment",
      ]}
      address="8th Floor, GPOA-3, Netaji Nagar, New Delhi 110023"
      social={social}
      colophonSlot={
        <>
          <ReportProblemLink />
          <VisitorCounter
            baseline={VISITOR_ANALYTICS.total}
            since={VISITOR_ANALYTICS.asOf}
            perDay={0}
            tickSeconds={0}
          />
        </>
      }
      columns={columns}
      lineage={LINEAGE}
      credits={credits}
      policyLinks={policyLinks}
      sitemap={{ label: "Sitemap", href: "/website/sitemap" }}
      help={HELP}
      relatedLinks={relatedLinks}
      copyright={`© ${new Date().getFullYear()} Department of Social Justice & Empowerment. All Rights Reserved.`}
      lastUpdated={formatDate(lastUpdated ?? getContentSyncedDate())}
    />
  );
}
