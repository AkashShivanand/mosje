import type { NavItem } from "@mosje/design-system";
import { getOrganisationByAbbr } from "@/data/website";

/**
 * The redesign's primary navigation — task and audience first, institution second.
 *
 * WHY THESE SEVEN (docs/website-redesign/PLAN.md, decision D1):
 *  - The live menu named things the Ministry HAS (Department, Offerings,
 *    Documents, Connect). Six of seven entries were artefact-shaped and none was
 *    a task (issue X-IA-02). A citizen arrives with a need, so the scheme entry
 *    comes straight after About and owns its own menu (the Ministry's option M2b).
 *  - "Associated Organisations" becomes "Organisations" here and "Organisations &
 *    Scheme Portals" as the menu's own heading (option M1b). The full label is
 *    30 characters and does not fit a seven-entry row at 1280px; the menu it
 *    opens carries it in full. Recorded in the plan as a fit decision, pending
 *    the Ministry's choice of menu option.
 *  - Tenders and vacancies get their own entry: they are the most-visited
 *    records after schemes, and under "Offerings" they were two levels deep.
 *
 * The emblem is Home. A Home entry would be an eighth item doing the emblem's job.
 *
 * Organisation marks are READ FROM THE REGISTRY (data/website/organisations.ts),
 * never retyped, so the menu cannot drift from the organisation pages.
 */
const mark = (abbr: string) => getOrganisationByAbbr(abbr)?.logoSrc;

export const NAV: NavItem[] = [
  {
    label: "About",
    href: "#",
    children: [
      { label: "About the Department", href: "/website/about-us" },
      { label: "Who’s Who", href: "/website/whos-who" },
      { label: "Divisions", href: "/website/about-the-division" },
      { label: "Citizen’s Charter", href: "/website/citizen-charter" },
      { label: "Official Language", href: "/website/official-language-act" },
      { label: "Directory", href: "/website/mosje-directory" },
    ],
  },
  {
    label: "Schemes & Services",
    href: "#",
    children: [
      { label: "Find a Scheme", href: "/website/schemes-services" },
      { label: "For Students", href: "/website/for-student" },
      { label: "For Beneficiaries", href: "/website/for-beneficiary" },
      { label: "For Researchers", href: "/website/for-researcher" },
      { label: "For Government Officials", href: "/website/for-government-official" },
      { label: "Apply and Track on Citizen Portals", href: "/portals" },
      { label: "Dashboard", href: "/website/dashboard" },
    ],
  },
  {
    label: "Organisations",
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
        heading: "Finance and Development Corporations",
        items: [
          { abbr: "NSFDC", name: "National Scheduled Castes Finance and Development Corporation", href: "/website/organisation/national-scheduled-castes-finance-and-development-corporation", iconSrc: mark("NSFDC") },
          { abbr: "NSKFDC", name: "National Safai Karamcharis Finance and Development Corporation", href: "/website/organisation/national-safai-karamcharis-finance-development-corporation", iconSrc: mark("NSKFDC") },
          { abbr: "NBCFDC", name: "National Backward Classes Finance and Development Corporation", href: "/website/organisation/national-backward-classes-financeand-development-corporationnbcfdc", iconSrc: mark("NBCFDC") },
        ],
      },
      {
        heading: "Foundations and Autonomous Bodies",
        items: [
          { abbr: "DAF", name: "Dr. Ambedkar Foundation", href: "/website/organisation/dr-ambedkar-foundation", iconSrc: mark("DAF") },
          { abbr: "DAIC", name: "Dr. Ambedkar International Centre", href: "/website/organisation/dr-ambedkar-international-centre", iconSrc: mark("DAIC") },
          { abbr: "BJRNF", name: "Babu Jagjivan Ram National Foundation", href: "/website/organisation/babu-jagjivan-ram-national-foundation-jrf", iconSrc: mark("BJRNF") },
          { abbr: "DWBDNC", name: "Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities", href: "/website/organisation/development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic", iconSrc: mark("DWBDNC") },
          { abbr: "NISD", name: "National Institute of Social Defence", href: "/website/organisation/national-institute-of-social-defence", iconSrc: mark("NISD") },
        ],
      },
      {
        heading: "Scheme Portals",
        items: [
          { abbr: "SCW", name: "Senior Citizens Welfare", href: "/website/organisation/senior-citizens-welfarescw" },
          { abbr: "PM-AJAY", name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana", href: "/website/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay" },
          { abbr: "SMILE", name: "National Portal for Transgender Persons", href: "/website/organisation/national-portal-for-transgender-persons" },
          { abbr: "NOS", name: "National Overseas Scholarship", href: "/website/organisation/national-overseas-scholarship" },
          { abbr: "NMBA", name: "Nasha Mukt Bharat Abhiyaan", href: "/website/organisation/nasha-mukt-bharat-abhiyaan" },
          { abbr: "NHAA", name: "National Helpline Against Atrocities", href: "/portals/nhapoa" },
        ],
      },
    ],
  },
  {
    label: "Documents",
    href: "#",
    columns: [
      {
        heading: "Reports and Publications",
        links: [
          { label: "Annual Reports", href: "/website/annual-reports" },
          { label: "Publications", href: "/website/publications" },
          { label: "Newsletter", href: "/website/newsletter" },
          { label: "Research and Evaluation Studies", href: "/website/list-of-research-evaluation-studies" },
        ],
      },
      {
        heading: "Acts, Rules and Policies",
        links: [
          { label: "Acts and Rules", href: "/website/acts-rules" },
          { label: "Policies", href: "/website/policies" },
          { label: "Circulars and Notifications", href: "/website/circulars-notifications" },
          { label: "Notices", href: "/website/notices" },
        ],
      },
      {
        heading: "Forms and Resources",
        links: [
          { label: "Forms and Templates", href: "/website/forms-templates" },
          { label: "Resources", href: "/website/resources" },
          { label: "MoU", href: "/website/mou" },
          { label: "Advices", href: "/website/advices" },
        ],
      },
      {
        heading: "Right to Information",
        links: [
          { label: "RTI", href: "/website/rti" },
          { label: "Suo Motu Disclosure", href: "/website/suo-moto-disclosure" },
          { label: "Parliament Questions", href: "/website/lok-sabha-question-answer" },
          { label: "Miscellaneous", href: "/website/miscellaneous" },
        ],
      },
    ],
  },
  {
    label: "Tenders & Vacancies",
    href: "#",
    children: [
      { label: "Tenders", href: "/website/tenders" },
      { label: "Vacancies", href: "/website/vacancies" },
      { label: "Grants to Voluntary Organisations", href: "/website/grants-in-aid-to-ngos-faqs" },
    ],
  },
  {
    label: "Media",
    href: "#",
    children: [
      { label: "Latest Updates", href: "/website/updates" },
      { label: "Events", href: "/website/events" },
      { label: "Photo Gallery", href: "/website/gallery" },
    ],
  },
  {
    label: "Contact",
    href: "#",
    children: [
      { label: "Contact Us", href: "/website/contact-us" },
      { label: "Directory", href: "/website/mosje-directory" },
      { label: "Public Information Officers", href: "/website/cpio" },
      { label: "Feedback", href: "/website/feedback" },
      { label: "Help", href: "/website/help" },
    ],
  },
];
