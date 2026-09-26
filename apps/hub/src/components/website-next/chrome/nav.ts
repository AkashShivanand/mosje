import type { NavItem } from "@mosje/design-system";
import { getOrganisationByAbbr } from "@/data/website";

/**
 * The redesign's primary navigation — THE LIVE SITE'S MENU, restored 22 Sep 2026.
 *
 * The first redesign pass replaced it with a task-first menu (About · Schemes ·
 * Organisations · Documents · Tenders & Vacancies · Media · Contact). That was
 * withdrawn: the menu is the Ministry's to change, and the brief is to keep the
 * live structure unless a change adds great value. The task-first menu stays on
 * record as a proposal (docs/website-redesign/PLAN.md, D1).
 *
 * ONE CHANGE FROM THE LIVE MENU, AND IT IS THE MINISTRY'S: the scheme portals
 * leave "Associated Organisations" for "Offerings" — option M2, finalised after
 * the 14 September review (Figma: [AI R&D] MoSJE [WIP] › Scheme Discovery ›
 * "M2 · Offerings Menu with Scheme Portals"). Each row names the portal and the
 * scheme it opens, no row shows a count, "View All Schemes" is a full-width
 * outlined button under the portals, and Vacancies, Tenders and the PMU form keep
 * a column of their own. Associated Organisations keeps its three columns.
 *
 * Organisation marks are READ FROM THE REGISTRY (data/website/organisations.ts),
 * never retyped, so the menu cannot drift from the organisation pages.
 */
const mark = (abbr: string) => getOrganisationByAbbr(abbr)?.logoSrc;

export const NAV: NavItem[] = [
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
          { abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "/website/organisation/national-commission-for-scheduled-castes", iconSrc: mark("NCSC") },
          { abbr: "NCSK", name: "National Commission for Safai Karamcharis", href: "/website/organisation/national-commission-for-safai-karamcharis", iconSrc: mark("NCSK") },
          { abbr: "NCBC", name: "National Commission for Backward Classes", href: "/website/organisation/national-commission-for-backward-classes-ncbc", iconSrc: mark("NCBC") },
        ],
      },
      {
        heading: "Corporations",
        items: [
          { abbr: "NSFDC", name: "National Scheduled Castes Finance and Development Corporation", href: "/website/organisation/national-scheduled-castes-finance-and-development-corporation", iconSrc: mark("NSFDC") },
          { abbr: "NSKFDC", name: "National Safai Karamcharis Finance and Development Corporation", href: "/website/organisation/national-safai-karamcharis-finance-development-corporation", iconSrc: mark("NSKFDC") },
          { abbr: "NBCFDC", name: "National Backward Classes Finance and Development Corporation", href: "/website/organisation/national-backward-classes-financeand-development-corporationnbcfdc", iconSrc: mark("NBCFDC") },
        ],
      },
      {
        heading: "Foundation / Autonomous Bodies",
        items: [
          { abbr: "DAF", name: "Dr. Ambedkar Foundation", href: "/website/organisation/dr-ambedkar-foundation", iconSrc: mark("DAF") },
          { abbr: "DAIC", name: "Dr. Ambedkar International Centre", href: "/website/organisation/dr-ambedkar-international-centre", iconSrc: mark("DAIC") },
          { abbr: "BJRNF", name: "Babu Jagjivan Ram National Foundation", href: "/website/organisation/babu-jagjivan-ram-national-foundation-jrf", iconSrc: mark("BJRNF") },
          { abbr: "DWBDNC", name: "Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities", href: "/website/organisation/development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic", iconSrc: mark("DWBDNC") },
          { abbr: "NISD", name: "National Institute of Social Defence", href: "/website/organisation/national-institute-of-social-defence", iconSrc: mark("NISD") },
        ],
      },
    ],
  },
  {
    label: "Offerings",
    href: "#",
    columns: [
      {
        /* Option M2. A row opens the scheme's portal where this estate runs one;
           NOS lives off the site and is marked so; the begging strand of SMILE has
           no portal, so it opens its scheme page. */
        heading: "Scheme Portals",
        wide: true,
        items: [
          { abbr: "PM-AJAY", name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana", href: "/portals/pm-ajay", iconSrc: mark("PM-AJAY") },
          { abbr: "National Overseas Scholarship", name: "For Scheduled Castes and Others", href: "https://nosmsje.gov.in", external: true, iconSrc: mark("NOS") },
          { abbr: "SMILE — Transgender Persons", name: "Comprehensive Rehabilitation for Welfare of Transgender Persons", href: "/portals/tg", iconSrc: mark("SMILE") },
          { abbr: "SMILE — Persons Engaged in Begging", name: "Comprehensive Rehabilitation of Persons Engaged in Begging", href: "/website/schemes-services/support-for-marginalized-individuals-for-livelihood-and-enterprise-smile", iconSrc: mark("SMILE") },
          { abbr: "Senior Citizens Welfare", name: "Atal Vayo Abhyuday Yojana", href: "/portals/scw", iconSrc: mark("SCW") },
          { abbr: "Nasha Mukt Bharat Abhiyaan", name: "National Action Plan for Drug Demand Reduction", href: "/portals/nmba", iconSrc: mark("NMBA") },
          { abbr: "National Helpline Against Atrocities", name: "Helpline 14566", href: "/portals/nhapoa", iconSrc: mark("NHAA") },
        ],
        action: { label: "View All Schemes", href: "/website/schemes-services" },
      },
      {
        heading: "Opportunities",
        links: [
          { label: "Vacancies", href: "/website/vacancies" },
          { label: "Tenders", href: "/website/tenders" },
          // The live site's own link: the PMU recruitment form, hosted by the recruiter.
          { label: "Apply Online for PMU", href: "https://cdn.digialm.com/EForms/configuredHtml/1258/96176/Index.html", external: true },
        ],
      },
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
      { label: "CPIO", href: "/website/cpio" },
      { label: "Directory", href: "/website/mosje-directory" },
      { label: "Contact Us", href: "/website/contact-us" },
      { label: "Ministry Contact", href: "/website/mosje-contact" },
    ],
  },
];
