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
 *   /accessibility — a permanent redirect to /accessibility-statement, the canonical page (GIGW names it "Accessibility Statement"); indexing both would put two results on one destination.
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
    "title": "Scheduled Caste Welfare Division",
    "description": "The Scheduled Castes Development (SCD) Bureau aims to promote the welfare of Scheduled Castes through their educational, economic and social empowerment.",
    "href": "/website/about-the-division",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Plan Division",
    "description": "Major activities of the Plan Division of the Department of Social Justice & Empowerment.",
    "href": "/website/about-the-division-2",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Social Defence Division",
    "description": "The Social Defence Division of the Department mainly caters to the requirements of senior citizens, victims of alcoholism and substance abuse, transgender persons, and persons engaged in beggary or destitution.",
    "href": "/website/about-the-division-social-defence",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Statistics Division",
    "description": "The Statistics Division of the Department of Social Justice & Empowerment is primarily responsible for sponsoring evaluation and research studies on the schemes for its target groups.",
    "href": "/website/about-the-division-statistics-division",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Welfare of the Other Backward Classes Division",
    "description": "Under the Backward Classes Bureau, the Department is mandated to look after the welfare of Backward Classes by implementing the schemes for Backward Classes.",
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
    "description": "The accessibility standard this website is built to, how it is checked, its known limitations and how to report a barrier.",
    "href": "/website/accessibility-statement",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Activities of the Ministry: Official Language",
    "description": "The status of implementation of the Official Language Policy in the Department of Social Justice & Empowerment.",
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
    "title": "Archives",
    "description": "Tenders and vacancies move to the Archives twelve months after the date they were published.",
    "href": "/website/archives",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Assurances",
    "description": "Guidelines and instructions on handling Parliamentary Assurances given by the Department, with frequently asked questions.",
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
    "description": "What happens to immovable assets created with the Ministry's assistance when a voluntary organisation permanently closes a project.",
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
    "title": "Contact Person",
    "description": "Contact details of the accounts officers of the Department of Social Justice & Empowerment.",
    "href": "/website/contact-person",
    "section": "Contact & Directory",
    "iconName": "call"
  },
  {
    "title": "Contact Us",
    "description": "Telephone, email and postal address of the Department of Social Justice & Empowerment, and the national helplines it runs.",
    "href": "/website/contact-us",
    "section": "Contact & Directory",
    "iconName": "call"
  },
  {
    "title": "Cookie Policy",
    "description": "What this website stores in your browser, why, and for how long.",
    "href": "/website/cookies",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Copyright Policy",
    "description": "The terms on which material on this website may be reproduced.",
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
    "description": "Progress of the Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY), as reported by the scheme's Management Information System.",
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
    "title": "Disclaimer",
    "description": "The limits of the Department's responsibility for the content of this website and of the websites it links to.",
    "href": "/website/disclaimer",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Drug Division",
    "description": "The sections of the Drug Division and the matters each handles, under the Department of Social Justice & Empowerment.",
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
    "description": "Programmes, trainings and observances held by the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/events",
    "section": "Offerings",
    "iconName": "photo_library"
  },
  {
    "title": "Feedback",
    "description": "Report a problem with this website, or suggest how it could be improved, to the Department of Social Justice & Empowerment.",
    "href": "/website/feedback",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "For Beneficiaries",
    "description": "Schemes of the Department of Social Justice & Empowerment for each of the groups it serves, with helplines, Acts and the offices to contact.",
    "href": "/website/for-beneficiary",
    "section": "For You",
    "iconName": "person"
  },
  {
    "title": "For Government Officials",
    "description": "Circulars and notifications, Acts and rules, forms, tenders, the staff directory and grant-in-aid procedures of the Department of Social Justice & Empowerment.",
    "href": "/website/for-government-official",
    "section": "For You",
    "iconName": "person"
  },
  {
    "title": "For Researchers",
    "description": "Publications, research and evaluation studies, the Handbook on Social Welfare Statistics, annual reports and open data of the Department of Social Justice & Empowerment.",
    "href": "/website/for-researcher",
    "section": "For You",
    "iconName": "person"
  },
  {
    "title": "For Students",
    "description": "Scholarships, fellowships, residential schools, hostels and coaching of the Department of Social Justice & Empowerment for students, with where to apply.",
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
    "description": "Documents published by the Department under the Guidelines for Assisting NGOs / Voluntary Organisations.",
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
    "description": "How to open the file formats in which documents on this website are published.",
    "href": "/website/help",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Hyperlinking Policy",
    "description": "Links from this website to other websites, and from other websites to this one.",
    "href": "/website/hyperlinking-policy",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Inspection and Monitoring Procedure",
    "description": "How the Department inspects and monitors the working of voluntary organisations assisted through grant-in-aid.",
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
    "title": "List of Research / Evaluation Studies",
    "description": "Executive summaries of evaluation studies conducted during 2017-18, 2018-19, 2019-20 and 2021-22.",
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
    "description": "The Official Languages Act, 1963 (as amended, 1967), which provides for the languages that may be used for the official purposes of the Union.",
    "href": "/website/official-language-act",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Official Language: Background",
    "description": "The Hindi unit's responsibility for the Official Language policy and the officers and employees who execute it in the Department of Social Justice & Empowerment.",
    "href": "/website/official-language-background",
    "section": "Documents",
    "iconName": "article"
  },
  {
    "title": "Organisations under the Social Defence Division",
    "description": "The National Institute of Social Defence, the nodal training and research institute in the field of social defence, functions under the Social Defence Division.",
    "href": "/website/organisation-under-division-social-division",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Penalties in Case of Misutilization of Grants",
    "description": "The action taken against a voluntary organisation and its managing committee where grant-in-aid is mis-utilised, and how assets created from the grant are then treated.",
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
    "title": "Policies / Acts / Rules / Circular",
    "description": "Policies, Acts, rules and circulars published by the Department of Social Justice & Empowerment.",
    "href": "/website/policies-acts-rules-circular",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Policies / Acts / Rules / Codes / Circular",
    "description": "Policies, Acts, rules, codes and circulars published by the Department of Social Justice & Empowerment.",
    "href": "/website/policies-acts-rules-codes-circular",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Policies / Acts / Rules / Codes / Circular: Social Defence",
    "description": "Policies, Acts, rules, codes and circulars relevant to the Social Defence Division of the Department of Social Justice & Empowerment.",
    "href": "/website/policies-acts-rules-codes-circular-social-defence",
    "section": "Documents",
    "iconName": "gavel"
  },
  {
    "title": "Prioritization Guidelines for Funding Projects by Voluntary Organisations",
    "description": "The criteria the Ministry applies when deciding which projects of voluntary organisations to fund, and for how long.",
    "href": "/website/prioritization-guidelines-for-funding-projects-by-voluntary-organisations",
    "section": "NGOs & Grants",
    "iconName": "handshake"
  },
  {
    "title": "Privacy Policy",
    "description": "What information this website collects when you visit it, and how the Department uses it.",
    "href": "/website/privacy-policy",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Procedure for Processing Grant-in-Aid Cases in Respect of Voluntary Organisations",
    "description": "The stages by which the Ministry receives, processes and disburses grant-in-aid to voluntary organisations, from application to release of funds.",
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
    "title": "Administrative Portals",
    "description": "Portals used by officers of the Department, its organisations and implementing agencies to manage and monitor schemes. Sign-in is for authorised users.",
    "href": "/website/samavesh-admin-portals",
    "section": "Portals",
    "iconName": "apps"
  },
  {
    "title": "Citizen Portals",
    "description": "Online portals of the Department and its organisations for applying to schemes, tracking applications and registering grievances.",
    "href": "/website/samavesh-citizen-portals",
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
    "title": "Find a Scheme",
    "description": "Schemes of the Department of Social Justice & Empowerment, by who they are for and what they provide, with where to apply for each.",
    "href": "/website/schemes-services",
    "section": "Offerings",
    "iconName": "volunteer_activism"
  },
  {
    "title": "Screen Reader Access",
    "description": "Screen readers that can be used to read this website, and where to obtain them.",
    "href": "/website/screen-reader-access",
    "section": "Pages",
    "iconName": "article"
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
    "description": "Every section of this website and the pages within it, arranged as in the main menu.",
    "href": "/website/sitemap",
    "section": "Site Policies",
    "iconName": "policy"
  },
  {
    "title": "Social Defence — FAQs",
    "description": "Frequently asked questions about the Nasha Mukt Bharat Abhiyaan, the Department's nationwide campaign against substance abuse.",
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
    "description": "Proactive disclosures under Section 4 of the Right to Information Act, 2005 by the Department of Social Justice & Empowerment and its associated organisations.",
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
    "title": "Tenders",
    "description": "Tender notices, expressions of interest and requests for proposal issued by the Department of Social Justice & Empowerment and its associated organisations.",
    "href": "/website/tenders",
    "section": "Opportunities",
    "iconName": "receipt_long"
  },
  {
    "title": "Terms & Conditions",
    "description": "The terms on which this website of the Department of Social Justice & Empowerment may be used.",
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
    "title": "Vacancies",
    "description": "Recruitment notices and deputation circulars issued by the Department of Social Justice & Empowerment and its associated organisations.",
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
    "title": "Website Policies",
    "description": "The policies that govern the use of this website, the information it collects and its accessibility.",
    "href": "/website/website-policies",
    "section": "Pages",
    "iconName": "article"
  },
  {
    "title": "Welfare of the Other Backward Classes FAQs",
    "description": "Frequently asked questions on scholarships, hostels and funding for Other Backward Classes (OBCs), published by the Department of Social Justice & Empowerment.",
    "href": "/website/welfare-of-the-other-backward-classes",
    "section": "The Department",
    "iconName": "article"
  },
  {
    "title": "Who's Who",
    "description": "The Ministers of the Department of Social Justice & Empowerment and the office-holders of its commissions, corporations and institutions, with their official contact details.",
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
