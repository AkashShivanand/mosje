/**
 * GENERATED FILE — do not edit by hand.
 *
 * Every static page under `app/website` and the title and description that page
 * itself declares. Regenerate with:
 *
 *     node scripts/build-search-index.mjs
 *
 * `npm run check:search-index` fails the build when this file and the routes
 * disagree, which is how the index is kept from going stale. Citizen-language
 * keywords are attached at read time in `build.ts` — they belong to the concept,
 * not to the route, so they are not baked in here.
 *
 * 4 route(s) are deliberately absent:
 *   /nmba-options — internal design-option preview — variants of one page, not content
 *   /nmba-placement-preview — internal design-option preview — a layout sandbox, not content
 *   /search — the results page itself — a search result pointing at the search page is a loop
 *   /samavesh-citizen-portals — retired — redirects to /portals, which is the same directory with search and filters. A redirect has no title of its own and must not appear as a result: indexing it would put two entries in search for one destination.
 */

export interface StaticPageEntry {
  title: string;
  description: string;
  href: string;
  section: string;
  iconName: string;
}

export const STATIC_PAGES: StaticPageEntry[] = [
  {
    "title": "Home",
    "description": "The official website of the Department of Social Justice & Empowerment, Government of India — schemes, organisations, documents and services.",
    "href": "/website",
    "section": "Pages",
    "iconName": "home"
  },
  {
    "title": "About the Division — Welfare of Scheduled Castes",
    "description": "Mandate, target group, key schemes and objectives of the Scheduled Castes Development Division under the Department of Social Justice & Empowerment.",
    "href": "/website/about-the-division",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "About the Division — Administration & Coordination",
    "description": "The Administration & Coordination Division of DoSJE handles establishment, personnel, coordination, vigilance and general administration functions of the Department.",
    "href": "/website/about-the-division-2",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "About the Division — Social Defence",
    "description": "Mandate and functions of the Social Defence Division of DoSJE — covering senior citizens, victims of substance abuse, transgender persons and the prevention of beggary.",
    "href": "/website/about-the-division-social-defence",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "About the Division — Statistics",
    "description": "The Statistics Division of DoSJE is responsible for data collection, monitoring, evaluation and the publication of statistical material on the Department's schemes and target groups.",
    "href": "/website/about-the-division-statistics-division",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "About the Division — Welfare of OBC",
    "description": "Structure, functions and working of the Backward Classes Division within the Department of Social Justice & Empowerment.",
    "href": "/website/about-the-division-welfare-of-the-other-backward-classes",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "About Us",
    "description": "Formation and history of the Ministry, its mandate, target groups, divisions and leadership.",
    "href": "/website/about-us",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Accessibility Statement",
    "description": "Accessibility Statement for the website of the Department of Social Justice & Empowerment (DoSJE), Government of India — built to WCAG 2.1 Level AA and GIGW 3.0.",
    "href": "/website/accessibility",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Official Language Activities of the Ministry",
    "description": "Activities undertaken by the Ministry to promote the use of Hindi — Hindi Pakhwada, Rajbhasha committees, training and incentive schemes.",
    "href": "/website/activities-of-the-ministry-official-language",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Acts & Rules",
    "description": "Acts of Parliament, rules and statutory instruments administered by the Department of Social Justice & Empowerment.",
    "href": "/website/acts-rules",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Admin Login",
    "description": "Authorised administrator access for the DoSJE content management system.",
    "href": "/website/admin",
    "section": "Portals",
    "iconName": "apps"
  },
  {
    "title": "Advertisement",
    "description": "Expressions of interest, circulars and public advertisements issued by the Department and its associated organisations.",
    "href": "/website/advertisement",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Advices",
    "description": "Advices tendered by the National Commission for Backward Classes and other advisory bodies of the Department.",
    "href": "/website/advices",
    "section": "Documents",
    "iconName": "campaign"
  },
  {
    "title": "Annual Reports",
    "description": "Annual reports of the Department of Social Justice & Empowerment and of the commissions, corporations and autonomous bodies under it.",
    "href": "/website/annual-reports",
    "section": "Documents",
    "iconName": "menu_book"
  },
  {
    "title": "Parliamentary Assurances",
    "description": "Information on Parliamentary Assurances given by the Department of Social Justice & Empowerment — what they are and how they are tracked and fulfilled.",
    "href": "/website/assurances",
    "section": "Documents",
    "iconName": "campaign"
  },
  {
    "title": "BJRNF Directory",
    "description": "Telephone directory of the Babu Jagjivan Ram National Foundation (BJRNF) — officers with intercom and contact details.",
    "href": "/website/bjrnf-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Venue Booking",
    "description": "Halls, conference rooms and open spaces at the Dr. Ambedkar International Centre that may be booked by Government departments, public sector undertakings, voluntary organisations and private bodies.",
    "href": "/website/booking",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Cessation of Voluntary Organisation Activities",
    "description": "Procedure where a grant-aided voluntary organisation closes, withdraws from a project, or has its assistance discontinued by the Department.",
    "href": "/website/cessation-of-voluntary-organisation-activities",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "Chairperson's Office",
    "description": "Directory of the National Commission for Scheduled Castes — the Chairperson, Members and supporting secretariat officers, with contact details.",
    "href": "/website/chairpersons-office",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Circulars & Notifications",
    "description": "Circulars, office memoranda and notifications issued by the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/circulars-notifications",
    "section": "Documents",
    "iconName": "campaign"
  },
  {
    "title": "Citizen Charter",
    "description": "The Citizen Charter of the Ministry of Social Justice & Empowerment.",
    "href": "/website/citizen-charter",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Contact Person — Grant-in-Aid",
    "description": "Contact points in the Department of Social Justice & Empowerment for queries relating to grant-in-aid to NGOs and voluntary organisations.",
    "href": "/website/contact-person",
    "section": "Contact & Directory",
    "iconName": "call"
  },
  {
    "title": "Contact Us",
    "description": "Get in touch with the Department of Social Justice & Empowerment — office address, phone, email and key officers.",
    "href": "/website/contact-us",
    "section": "Contact & Directory",
    "iconName": "call"
  },
  {
    "title": "Cookies",
    "description": "The cookies this website sets, what each one is for, and how to withdraw the acknowledgement stored in your browser.",
    "href": "/website/cookies",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Copyright Policy",
    "description": "Copyright Policy for the material published on the official website of the Department of Social Justice & Empowerment (DoSJE), Government of India.",
    "href": "/website/copyright",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "CPIO",
    "description": "Central Public Information Officers and First Appellate Authorities designated under the Right to Information Act, 2005 by the Department and its associated organisations.",
    "href": "/website/cpio",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "DAF Directory",
    "description": "Telephone directory of the Dr. Ambedkar Foundation (DAF) — officers with intercom and contact details.",
    "href": "/website/daf-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "DAIC Directory",
    "description": "Telephone directory of the Dr. Ambedkar International Centre (DAIC) — officers with intercom and contact details.",
    "href": "/website/daic-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Dashboard",
    "description": "Key welfare metrics and scheme performance at a glance.",
    "href": "/website/dashboard",
    "section": "Offerings",
    "iconName": "monitoring"
  },
  {
    "title": "Find a De-addiction Centre (Nasha Mukti Kendra)",
    "description": "Locate Nasha Mukti Kendras — de-addiction centres under the Nasha Mukt Bharat Abhiyaan — across India. Search by name, state, district or centre type, or use your location to find the nearest centre. No login required.",
    "href": "/website/de-addiction-centres",
    "section": "Offerings",
    "iconName": "health_and_safety"
  },
  {
    "title": "Detailed Demand for Grant",
    "description": "The Detailed Demands for Grants of the Department of Social Justice & Empowerment, laid before Parliament, by financial year.",
    "href": "/website/detailed-demand-for-grant",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "Staff Directory",
    "description": "Officers of the Department of Social Justice & Empowerment and of every commission, corporation and autonomous body under it, with intercom and contact details.",
    "href": "/website/directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Drug De-Addiction Division",
    "description": "The Drug De-Addiction Division of DoSJE leads drug demand reduction through NAPDDR, the Nasha Mukt Bharat Abhiyaan and a national network of de-addiction centres.",
    "href": "/website/drug-division",
    "section": "The Department",
    "iconName": "health_and_safety"
  },
  {
    "title": "DWBDNC Directory",
    "description": "Telephone directory of the Development and Welfare Board for De-Notified, Nomadic and Semi-Nomadic Communities (DWBDNC) — officers with intercom and contact details.",
    "href": "/website/dwbdnc-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Events",
    "description": "Conclaves, conferences and commemorative events organised by the Department of Social Justice & Empowerment, Government of India.",
    "href": "/website/events",
    "section": "Offerings",
    "iconName": "photo_library"
  },
  {
    "title": "For Beneficiary",
    "description": "Find schemes, acts, reports and the right office to help citizens access the Ministry's welfare and social justice services.",
    "href": "/website/for-beneficiary",
    "section": "For You",
    "iconName": "person"
  },
  {
    "title": "For Government Official",
    "description": "Circulars, acts, RTI resources and the officer directory — tools and references for government officials.",
    "href": "/website/for-government-official",
    "section": "For You",
    "iconName": "person"
  },
  {
    "title": "For Researcher",
    "description": "Annual reports, publications, evaluation studies and statistical handbooks to support evidence-based research.",
    "href": "/website/for-researcher",
    "section": "For You",
    "iconName": "person"
  },
  {
    "title": "For Student",
    "description": "Scholarships, application forms, notices and how-to-apply guidance to help students learn, grow and access support.",
    "href": "/website/for-student",
    "section": "For You",
    "iconName": "person"
  },
  {
    "title": "Forms & Templates",
    "description": "Application forms, proformas and templates published for the schemes and services of the Department of Social Justice & Empowerment.",
    "href": "/website/forms-templates",
    "section": "Documents",
    "iconName": "description"
  },
  {
    "title": "Gallery",
    "description": "Photographs, videos and news coverage of the programmes of the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/gallery",
    "section": "Offerings",
    "iconName": "photo_library"
  },
  {
    "title": "Grants-in-Aid to NGOs — FAQs",
    "description": "Frequently asked questions on eligibility, application and compliance for grant-in-aid to NGOs and voluntary organisations from the Department of Social Justice & Empowerment.",
    "href": "/website/grants-in-aid-to-ngos-faqs",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "Grants Suspended List / Blacklisted NGOs",
    "description": "The Department's register of voluntary organisations that have been blacklisted, had grant-in-aid stopped, or are subject to recovery proceedings.",
    "href": "/website/grants-suspended-list-blacklisted-ngos",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "Guidelines for Assisting NGOs / Voluntary Organisations",
    "description": "Eligibility conditions and terms under which the Department of Social Justice & Empowerment assists NGOs and voluntary organisations through grant-in-aid.",
    "href": "/website/guidelines-for-assisting-ngos-voluntary-organisations",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "Handbook on Social Welfare Statistics",
    "description": "The Handbook on Social Welfare Statistics, compiled by the Statistics Division of the Department of Social Justice & Empowerment.",
    "href": "/website/handbook-on-social-welfare-statistics",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Help",
    "description": "How to view the file formats published on this website, and the screen readers with which its content has been made accessible.",
    "href": "/website/help",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Homepage Options for Review",
    "description": "",
    "href": "/website/home-options",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Hyperlinking Policy",
    "description": "Hyperlinking Policy covering links from this website to external sites and permission to link to this website of the Department of Social Justice & Empowerment (DoSJE), Government of India.",
    "href": "/website/hyperlinking-policy",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Inspection and Monitoring Procedure",
    "description": "How the Department of Social Justice & Empowerment inspects and monitors projects funded through grant-in-aid to voluntary organisations.",
    "href": "/website/inspection-and-monitoring-procedure",
    "section": "NGOs & Grants",
    "iconName": "article"
  },
  {
    "title": "List of De-Blacklisted NGOs",
    "description": "Orders by which the Department has removed voluntary organisations from the blacklist, restoring their eligibility for grant-in-aid.",
    "href": "/website/list-of-de-blacklisted-ngos",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "List of Research & Evaluation Studies",
    "description": "A list of research and evaluation studies commissioned by the Department of Social Justice & Empowerment on its schemes and target groups.",
    "href": "/website/list-of-research-evaluation-studies",
    "section": "Documents",
    "iconName": "menu_book"
  },
  {
    "title": "List of Scheduled Castes",
    "description": "State-wise and Union Territory-wise lists of Scheduled Castes, as notified under Article 341 of the Constitution and published by the National Commission for Scheduled Castes.",
    "href": "/website/list-of-scheduled-castes",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Lok Sabha Question & Answer",
    "description": "Questions raised in Parliament on subjects administered by the Department, with the replies laid on the table of the House.",
    "href": "/website/lok-sabha-question-answer",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Meta Data",
    "description": "Scheme metadata published by the Department under the Open Government Data policy.",
    "href": "/website/meta-data",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Minutes of Screening Committees",
    "description": "Minutes of the Screening Committee meetings that consider new project proposals from voluntary organisations under the Department's grant-in-aid schemes.",
    "href": "/website/minutes-of-screening-committees",
    "section": "NGOs & Grants",
    "iconName": "article"
  },
  {
    "title": "Miscellaneous",
    "description": "Documents published by the Department of Social Justice & Empowerment and its associated organisations that do not fall under any of the headings above — hearings and proceedings, tour reports, results, announcements and committee records.",
    "href": "/website/miscellaneous",
    "section": "Documents",
    "iconName": "campaign"
  },
  {
    "title": "MoSJE Contact",
    "description": "Office address, telephone and the officer to contact at the Department of Social Justice & Empowerment.",
    "href": "/website/mosje-contact",
    "section": "Contact & Directory",
    "iconName": "call"
  },
  {
    "title": "MoSJE Directory",
    "description": "Telephone directory of the Ministry of Social Justice & Empowerment — Ministers, secretariat officers and section officers, with intercom and contact details.",
    "href": "/website/mosje-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Memoranda of Understanding",
    "description": "Memoranda of Understanding entered into by the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/mou",
    "section": "Documents",
    "iconName": "article"
  },
  {
    "title": "NBCFDC Directory",
    "description": "Telephone directory of the National Backward Classes Finance & Development Corporation (NBCFDC) — officers with intercom and contact details.",
    "href": "/website/nbcfdc-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "NCBC Directory",
    "description": "Telephone directory of the National Commission for Backward Classes (NCBC) — officers with intercom and contact details.",
    "href": "/website/ncbc-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "NCSK Directory",
    "description": "Telephone directory of the National Commission for Safai Karamcharis (NCSK) — officers with intercom and contact details.",
    "href": "/website/ncsk-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Newsletter",
    "description": "Newsletters published by the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/newsletter",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "NHAA Directory",
    "description": "Telephone directory of the National Helpline Against Atrocities (NHAA) — officers with intercom and contact details.",
    "href": "/website/nhaa-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "NISD Directory",
    "description": "Telephone directory of the National Institute of Social Defence (NISD) — officers with intercom and contact details.",
    "href": "/website/nisd-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Public Notices",
    "description": "Public notices and administrative announcements issued by the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/notices",
    "section": "Documents",
    "iconName": "campaign"
  },
  {
    "title": "NSFDC Directory",
    "description": "Telephone directory of the National Scheduled Castes Finance & Development Corporation (NSFDC) — officers with intercom and contact details.",
    "href": "/website/nsfdc-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "NSKFDC Directory",
    "description": "Telephone directory of the National Safai Karamcharis Finance & Development Corporation (NSKFDC) — officers with intercom and contact details.",
    "href": "/website/nskfdc-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "The Official Languages Act, 1963",
    "description": "An overview of the Official Languages Act, 1963 — its key sections, scope and the rules framed under it for the official use of Hindi and English.",
    "href": "/website/official-language-act",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Official Language — Background",
    "description": "Constitutional and statutory background of the Official Language policy, including Articles 343 to 351 and the Official Languages Act, 1963, and its role in the Ministry.",
    "href": "/website/official-language-background",
    "section": "Documents",
    "iconName": "article"
  },
  {
    "title": "Organisations under Social Defence Division",
    "description": "Autonomous bodies, institutes and organisations functioning under the Social Defence Division of the Department of Social Justice & Empowerment.",
    "href": "/website/organisation-under-division-social-division",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Penalties in Case of Misutilisation of Grants",
    "description": "Consequences, recovery and blacklisting provisions where grant-in-aid released to voluntary organisations is mis-utilised.",
    "href": "/website/penalties-in-case-of-misutilisation-of-grants",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "PM-AJAY Directory",
    "description": "Telephone directory of the Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) — officers with intercom and contact details.",
    "href": "/website/pm-ajay-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Policies",
    "description": "Policies adopted by the Department of Social Justice & Empowerment and by the corporations and commissions under it.",
    "href": "/website/policies",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Policies, Acts, Rules & Circulars (SC Division)",
    "description": "Key Acts, rules, policies and circulars administered by the Scheduled Castes Development Division of the Department of Social Justice & Empowerment.",
    "href": "/website/policies-acts-rules-circular",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Policies, Acts, Rules, Codes & Circulars (OBC Division)",
    "description": "Key Acts, rules, codes, policies and circulars administered by the Backward Classes Division of the Department of Social Justice & Empowerment.",
    "href": "/website/policies-acts-rules-codes-circular",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Policies, Acts, Rules & Circulars — Social Defence",
    "description": "Legislation, rules, policies and circulars relevant to the Social Defence Division, including the Senior Citizens Act 2007 and the Transgender Persons (Protection of Rights) Act 2019.",
    "href": "/website/policies-acts-rules-codes-circular-social-defence",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Prioritization Guidelines for Funding Projects by Voluntary Organisations",
    "description": "Criteria and priorities applied by the Department of Social Justice & Empowerment when funding projects of voluntary organisations through grant-in-aid.",
    "href": "/website/prioritization-guidelines-for-funding-projects-by-voluntary-organisations",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "Privacy Policy",
    "description": "Privacy Policy describing how the Department of Social Justice & Empowerment (DoSJE), Government of India, handles information collected through this website.",
    "href": "/website/privacy-policy",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Procedure for Processing Grant-in-Aid Cases",
    "description": "Step-by-step procedure followed by the Department of Social Justice & Empowerment for processing grant-in-aid cases of voluntary organisations.",
    "href": "/website/procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "Publications",
    "description": "Publications, journals and thematic documents issued by the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/publications",
    "section": "Documents",
    "iconName": "menu_book"
  },
  {
    "title": "Resources",
    "description": "Toolkits, manuals and reference material published to support the implementation and outreach of the Department's schemes.",
    "href": "/website/resources",
    "section": "Documents",
    "iconName": "article"
  },
  {
    "title": "Right to Information (RTI)",
    "description": "Proactive disclosures, annual returns and reports published under the Right to Information Act, 2005 by the Department and its associated organisations.",
    "href": "/website/rti",
    "section": "Right to Information",
    "iconName": "info"
  },
  {
    "title": "SAMAVESH — Admin Portals",
    "description": "Administrative consoles for MoSJE schemes and organisations (authorised access).",
    "href": "/website/samavesh-admin-portals",
    "section": "Portals",
    "iconName": "apps"
  },
  {
    "title": "Scheme Documents",
    "description": "Guidelines, performance statements and circulars published against a scheme of the Department and its organisations.",
    "href": "/website/scheme-documents",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Schemes & Services",
    "description": "Flagship welfare schemes and scholarships offered by the Department of Social Justice & Empowerment for SC, OBC, EBC and DNT communities.",
    "href": "/website/schemes-services",
    "section": "Offerings",
    "iconName": "volunteer_activism"
  },
  {
    "title": "SCW Directory",
    "description": "Telephone directory of the Scheduled Caste Welfare division — officers with intercom and contact details.",
    "href": "/website/scw-directory",
    "section": "Contact & Directory",
    "iconName": "contacts"
  },
  {
    "title": "Sitemap",
    "description": "A structured map of the website of the Department of Social Justice & Empowerment (DoSJE), Government of India, grouping all major sections and pages.",
    "href": "/website/sitemap",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Social Defence — FAQs",
    "description": "Frequently asked questions about the Social Defence Division of DoSJE — senior citizens, drug demand reduction, transgender welfare and related schemes.",
    "href": "/website/social-defence-faqs",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Special Mention / Matters Raised Under Rule 377",
    "description": "Special Mentions made in the Rajya Sabha and matters raised under Rule 377 in the Lok Sabha on subjects administered by the Department, and the monitoring of replies to them.",
    "href": "/website/special-mention-matters-raised-under-377",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Suo Moto Disclosure",
    "description": "Proactive disclosures under Section 4 of the Right to Information Act, 2005 by the Department of Social Justice & Empowerment.",
    "href": "/website/suo-moto-disclosure",
    "section": "Right to Information",
    "iconName": "info"
  },
  {
    "title": "Supreme Court Judgement",
    "description": "Judgments of the Hon'ble Supreme Court of India published by the National Commission for Safai Karamcharis.",
    "href": "/website/supreme-court-judgement",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Tenders & RFPs",
    "description": "Active tenders, e-procurement notices, and requests for proposals (RFPs) issued by the Department of Social Justice & Empowerment.",
    "href": "/website/tenders",
    "section": "Opportunities",
    "iconName": "receipt_long"
  },
  {
    "title": "Terms & Conditions",
    "description": "Terms of Use governing access to and use of the official website of the Department of Social Justice & Empowerment (DoSJE), Government of India.",
    "href": "/website/terms-conditions",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Updates",
    "description": "Announcements, results and awareness material published by the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/updates",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Vacancies & Recruitments",
    "description": "Current recruitment notifications, deputation circulars, and job openings under the Department of Social Justice & Empowerment.",
    "href": "/website/vacancies",
    "section": "Opportunities",
    "iconName": "work"
  },
  {
    "title": "Visitor Analytics",
    "description": "Visitors to the website of the Department of Social Justice & Empowerment, by language and month.",
    "href": "/website/visitor-analytics",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Welfare of Other Backward Classes",
    "description": "Mandate, schemes and institutional framework for the welfare and empowerment of Other Backward Classes (OBCs) under the Department of Social Justice & Empowerment.",
    "href": "/website/welfare-of-the-other-backward-classes",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Who's Who",
    "description": "Directory of Ministers, Commissions, and Senior Administrative Officers under the Ministry of Social Justice & Empowerment.",
    "href": "/website/whos-who",
    "section": "Contact & Directory",
    "iconName": "contacts"
  }
];

/** Which page shows a given body's officials — read out of its `getOfficialsByOrganisation()` call. */
export interface DirectoryPage {
  ownerId: string;
  href: string;
  title: string;
}

export const DIRECTORY_PAGES: DirectoryPage[] = [
  {
    "ownerId": "BJRNF",
    "href": "/website/bjrnf-directory",
    "title": "BJRNF Directory"
  },
  {
    "ownerId": "DAF",
    "href": "/website/daf-directory",
    "title": "DAF Directory"
  },
  {
    "ownerId": "DAIC",
    "href": "/website/daic-directory",
    "title": "DAIC Directory"
  },
  {
    "ownerId": "DWBDNC",
    "href": "/website/dwbdnc-directory",
    "title": "DWBDNC Directory"
  },
  {
    "ownerId": "MoSJE",
    "href": "/website/mosje-directory",
    "title": "MoSJE Directory"
  },
  {
    "ownerId": "NBCFDC",
    "href": "/website/nbcfdc-directory",
    "title": "NBCFDC Directory"
  },
  {
    "ownerId": "NCBC",
    "href": "/website/ncbc-directory",
    "title": "NCBC Directory"
  },
  {
    "ownerId": "NCSC",
    "href": "/website/chairpersons-office",
    "title": "Chairperson's Office"
  },
  {
    "ownerId": "NCSK",
    "href": "/website/ncsk-directory",
    "title": "NCSK Directory"
  },
  {
    "ownerId": "NHAA",
    "href": "/website/nhaa-directory",
    "title": "NHAA Directory"
  },
  {
    "ownerId": "NISD",
    "href": "/website/nisd-directory",
    "title": "NISD Directory"
  },
  {
    "ownerId": "NSFDC",
    "href": "/website/nsfdc-directory",
    "title": "NSFDC Directory"
  },
  {
    "ownerId": "NSKFDC",
    "href": "/website/nskfdc-directory",
    "title": "NSKFDC Directory"
  },
  {
    "ownerId": "PMAJAY",
    "href": "/website/pm-ajay-directory",
    "title": "PM-AJAY Directory"
  },
  {
    "ownerId": "SCW",
    "href": "/website/scw-directory",
    "title": "SCW Directory"
  }
];
