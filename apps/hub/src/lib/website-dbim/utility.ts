/**
 * Content for the DBIM design's utility pages — policies, related and important links,
 * help, cookies, personas, the sitemap's extra entries and the search address map.
 *
 * Every text here is the ESTATE'S, transcribed from the pages that already publish it
 * (each block names its source file). It is held as data rather than imported because
 * those pages keep their text inside JSX, and the DBIM design re-points every link at a
 * DBIM address: a `/website/…` path from the redesign is served from the DBIM tree
 * while the DBIM design is chosen, and most redesign paths do not exist there.
 */
import { DIVISIONS } from "@/data/website";
import { DBIM_PERSONA_ICONS } from "./assets";
import { DBIM_POLICY_TABS, type DbimLink } from "./nav";

/* ── Rich text ──────────────────────────────────────────────────────────── */

/** An inline run: plain text, bold text, or a link (a DBIM `path` or an external `href`). */
export type DbimInline = string | { strong: string } | { text: string; path: string } | { text: string; href: string };

export type DbimBlock =
  | { kind: "p"; text: DbimInline[] }
  | { kind: "h2"; text: string; id?: string }
  | { kind: "ul"; items: DbimInline[][] };

/* ── Website policies ───────────────────────────────────────────────────── */

export interface DbimPolicy {
  /** Path inside the DBIM tree — one of DBIM_POLICY_TABS. */
  path: string;
  title: string;
  description: string;
  blocks: DbimBlock[];
}

const p = (...text: DbimInline[]): DbimBlock => ({ kind: "p", text });
const h2 = (text: string, id?: string): DbimBlock => ({ kind: "h2", text, id });
const ul = (...items: DbimInline[][]): DbimBlock => ({ kind: "ul", items });

/** Titles come from DBIM_POLICY_TABS so the tab, the h1 and the <title> can never disagree. */
const tab = (path: string) => DBIM_POLICY_TABS.find((t) => t.path === path)?.label ?? "";

export const DBIM_POLICIES: DbimPolicy[] = [
  {
    // SOURCE: app/website/terms-conditions/page.tsx (the Department's own Terms & Conditions).
    path: "/policies",
    title: tab("/policies"),
    description: "The terms on which this website of the Department of Social Justice & Empowerment may be used.",
    blocks: [
      p("This website is designed, developed and maintained by Ministry of Social Justice and Empowerment, Government of India."),
      h2("Accuracy and Liability", "accuracy"),
      p(
        "Though all efforts have been made to ensure the accuracy and currency of the content on this website, the same should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity or doubts, users are advised to verify / check with the Department and / or other source, and to obtain appropriate professional advice.",
      ),
      p(
        "Under no circumstances will this Department be liable for any expense, loss or damage including, without limitation, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising from use, or loss of use, of data, arising out of or in connection with the use of this website.",
      ),
      h2("Governing Law", "law"),
      p(
        "These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any dispute arising under these terms and conditions shall be subject to the jurisdiction of the courts of India.",
      ),
      h2("Links to Other Websites", "links"),
      p(
        "The information posted on this website could include hypertext links or pointers to information created and maintained by non-Government / private organisations. Ministry of Social Justice and Empowerment is providing these links and pointers solely for your information and convenience. When you select a link to an outside website, you are leaving the Ministry of Social Justice and Empowerment website and are subject to the privacy and security policies of the owners / sponsors of the outside website.",
      ),
      p("Ministry of Social Justice and Empowerment does not guarantee the availability of such linked pages at all times."),
    ],
  },
  {
    // SOURCE: app/website/privacy-policy/page.tsx.
    path: "/policies/privacy-policy",
    title: tab("/policies/privacy-policy"),
    description: "What information this website collects when you visit it, and how the Department uses it.",
    blocks: [
      p(
        "We do not collect personal information, like names or addresses, when you visit our website. If you choose to provide that information to us, it is only used to fulfil your request for information.",
      ),
      p(
        "We do collect some technical information when you visit to make your visit seamless. The section below explains how we handle and collect technical information when you visit our website.",
      ),
      h2("Information Collected and Stored Automatically", "automatic"),
      p(
        "When you browse, read pages, or download information on the website of the Department of Social Justice & Empowerment, we automatically gather and store certain technical information about your visit. This information never identifies who you are. The information we collect and store about your visit is listed below:",
      ),
      ul(
        ["The IP address (a number that is automatically assigned to your computer whenever you are surfing the web) from which you access our website;"],
        ["The type of browser and operating system used to access our site;"],
        ["The date and time you accessed our site;"],
        ["The pages you have visited."],
      ),
      p(
        "This information is only used to help us make the site more useful for you. With this data, we learn about the number of visitors to our site and the types of technology our visitors use. We never track or record information about individuals and their visits.",
      ),
      h2("Cookies", "cookies"),
      p(
        "This website sets no cookie that identifies you, and none for advertising or for tracking your visits. It keeps the choices you make in your own browser: that you have seen the cookie notice, the language you have chosen, and the display settings you choose from the accessibility button. What each one is and how long it is kept is set out in the ",
        { text: "Cookie Policy", path: "/cookies" },
        ".",
      ),
      h2("If You Send Us Personal Information", "personal-information"),
      p(
        "We do not collect personal information for any purpose other than to respond to you (for example, to respond to your questions or provide subscriptions you have chosen). If you choose to provide us with personal information, like filling out a Contact Us form with an e-mail address and pin code and submitting it to us through the website, we use that information to respond to your message, and to help get you the information you have requested. We only share the information you give us with another government agency if your question relates to that agency, or as otherwise required by law.",
      ),
      p(
        "Our website never collects information or creates individual profiles for commercial marketing. While you must provide an e-mail address for a localised response to any incoming questions or comments to us, we recommend that you do not include any other personal information.",
      ),
      h2("Questions About This Policy", "contact"),
      p(
        "Questions about this policy, or about information you have provided through this website, can be sent through the ",
        { text: "Feedback", path: "/feedback" },
        " page. The Department’s postal address and telephone numbers are on the ",
        { text: "Contact Us", path: "/connect" },
        " page.",
      ),
    ],
  },
  {
    // SOURCE: app/website/hyperlinking-policy/page.tsx.
    path: "/policies/hyperlink-policy",
    title: tab("/policies/hyperlink-policy"),
    description: "Links from this website to other websites, and from other websites to this one.",
    blocks: [
      h2("Links to External Websites and Portals", "external"),
      p(
        "At many places in Department of Social Justice and Empowerment (DoSJE) website, you shall find links to other Websites / Portals / Web applications / Mobile apps. These links have been placed for your convenience. DoSJE is not responsible for the contents and reliability of the linked destinations and does not necessarily endorse the views expressed in them. Mere presence of the link or its listing on Department of Social Justice and Empowerment website should not be assumed as endorsement of any kind. We cannot guarantee that these links will work all the time and we have no control over availability of linked destinations.",
      ),
      p(
        "The DoSJE website can have links to various non-government websites also such as Facebook, twitter etc. We do not undertake any responsibility for the contents and do not support any views expressed in these hyperlinks.",
      ),
      h2("Links to This Website from Other Websites", "inbound"),
      p(
        "We do not object to you linking directly to the information that is hosted on this site and no prior permission is required for the same. However, we would like you to inform us about any links provided to this website so that you can be informed of any changes or updations therein. Also, we do not permit our pages to be loaded into frames on your site. The pages belonging to this site must load into a newly opened browser window of the User.",
      ),
    ],
  },
  {
    // SOURCE: app/website/copyright/page.tsx.
    path: "/policies/copyright-policy",
    title: tab("/policies/copyright-policy"),
    description: "The terms on which material on this website may be reproduced.",
    blocks: [
      h2("Reproduction of Material", "reproduction"),
      p(
        "Material featured on Ministry of Social Justice and Empowerment (MSJE) site may be reproduced free of charge in any format or media without requiring specific permission. This is subject to the material being reproduced accurately and not being used in a derogatory manner or in a misleading context. Where the material is being published or issued to others, the source must be prominently acknowledged. However, the permission to reproduce this material does not extend to any material on this site, which is identified as being the copyright of a third party. Authorization to reproduce such material must be obtained from the copyright holders concerned.",
      ),
      h2("Governing Law", "law"),
      p(
        "These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any dispute arising under these terms and conditions shall be subject to the exclusive jurisdiction of the courts of India.",
      ),
      h2("Content from Third Parties", "third-party"),
      p(
        "While adding the contents by content contributor, there is a mechanism which checks if the content is indigenous or taken from a third party source. If the content is indigenous, it automatically gets added and published on the website after reviewed by content publisher or administrator. If it is from a third party source, a disclaimer has to be provided by the content contributor that the required copyright has been obtained from the said third party source for publishing the respective content.",
      ),
    ],
  },
  {
    // SOURCE: app/website/accessibility-statement/page.tsx. Two sentences are left out
    // because they point at things this design does not have: the Screen Reader Access
    // page, and the footer's "Report a problem with this page" link.
    path: "/policies/accessibility-statement",
    title: tab("/policies/accessibility-statement"),
    description: "The accessibility standard this website is built to, its known limitations, and how to report a barrier.",
    blocks: [
      p(
        "The Department of Social Justice & Empowerment is committed to making this website usable by everyone, including persons with disabilities, whatever device, browser or assistive technology they use.",
      ),
      h2("Conformance Standard", "standard"),
      p(
        "This website is built to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. WCAG 2.2 contains every success criterion of WCAG 2.1, which the Guidelines for Indian Government Websites and Apps (GIGW) 3.0 require, so a page that meets WCAG 2.2 Level AA also meets the accessibility requirement of GIGW 3.0.",
      ),
      p(
        { strong: "Conformance status:" },
        " partially conformant. The pages of this website are built to the standard, but some published content does not yet meet it. That content is listed under Known Limitations.",
      ),
      h2("How the Website Is Built", "features"),
      ul(
        ["Every function can be used with a keyboard alone, and the item in focus is always visibly marked."],
        ["A link that skips straight to the main content is the first item on every page."],
        ["Each page has one main heading, and its sections are marked with headings in order, so that a screen reader user can move through a page by its headings."],
        ["Pages are divided into landmark regions: the header, the navigation, the main content and the footer."],
        ["Images that carry information have a text description; decorative images are hidden from screen readers."],
        ["Links within text are underlined, and each link’s text says where it leads."],
        ["Text and controls meet the WCAG colour contrast ratios, and no information is given by colour alone."],
        ["Text can be enlarged to 200% without loss of content, and pages reflow to a width of 320 pixels without scrolling sideways."],
        ["Tables have header cells, and a wide table scrolls within its own region on a small screen."],
        ["Nothing on a page moves, scrolls or changes by itself."],
        ["Buttons and links are large enough to be selected easily on a touch screen."],
        ["Links that open a new window say so."],
      ),
      h2("Display and Language Options", "controls"),
      p(
        "The accessibility button on every page opens options to change the text size, the contrast and other display settings. The language button in the header offers the website in Indian languages other than English.",
      ),
      p("The software needed to open documents in each file format is on the ", { text: "Help", path: "/help" }, " page."),
      h2("How the Website Is Checked", "testing"),
      p("Each page template of this website is checked before it is published:"),
      ul(
        ["with automated accessibility testing tools;"],
        ["by operating every control with the keyboard alone;"],
        ["at 200% zoom and at a screen width of 320 pixels;"],
        ["against the WCAG 2.2 colour contrast ratios; and"],
        ["for the order and structure of its headings and landmarks."],
      ),
      h2("Known Limitations", "limitations"),
      p("The following content on this website does not yet fully meet the standard."),
      ul(
        [
          { strong: "Documents in PDF format." },
          " Many documents were published as scanned images or without the structure a screen reader needs, so their text may not be read out, searched or enlarged. Where the text of such a document is available, it is being published as a web page, with the PDF as a secondary download.",
        ],
        [
          { strong: "Hindi edition." },
          " A separately maintained Hindi edition of this website is not yet available. Pages in Hindi and other Indian languages are machine translations of the English pages, and may render names, scheme titles and technical terms inaccurately.",
        ],
        [
          { strong: "Other websites." },
          " This website links to portals and websites maintained by other organisations. Their accessibility is the responsibility of the organisations that maintain them.",
        ],
      ),
      h2("Report an Accessibility Problem", "report"),
      p(
        "If you find part of this website that you cannot use, or you need a document in an accessible format, please tell the Department through the ",
        { text: "Feedback", path: "/feedback" },
        " page. Name the page and describe the problem.",
      ),
      p("The Department’s postal address and telephone numbers are on the ", { text: "Contact Us", path: "/connect" }, " page."),
    ],
  },
];

export function dbimPolicy(path: string): DbimPolicy | undefined {
  return DBIM_POLICIES.find((x) => x.path === path);
}

/* ── Link lists ─────────────────────────────────────────────────────────── */

export interface DbimLinkRow {
  label: string;
  /** A DBIM path for a page of this website… */
  path?: string;
  /** …or the address of another website. */
  href?: string;
}

/**
 * SOURCE: the redesign footer's Related Links (components/website-next/chrome/Footer.tsx),
 * DBIM 5.6's required element — the National Portal of India, which GIGW 3.0 requires, and
 * the national platforms a citizen of this Department most often needs next.
 */
export const DBIM_RELATED_LINKS: DbimLinkRow[] = [
  { label: "National Portal of India", href: "https://www.india.gov.in/" },
  { label: "myScheme", href: "https://www.myscheme.gov.in/" },
  { label: "CPGRAMS", href: "https://pgportal.gov.in/" },
  { label: "MyGov", href: "https://www.mygov.in/" },
  { label: "Open Government Data", href: "https://data.gov.in/" },
];

/**
 * The Department's Important Links: one row per Division, as the classic design's
 * Important Links rail groups them (components/website/ImportantLinks.tsx, reading
 * `DIVISIONS` from data/website/divisions.ts). A division opens its DBIM page under
 * Ministry → Our Division; a division whose only destination is another website opens
 * that website. The home page's Important Links section reads this same list — its
 * first four rows — so the three the DBIM reference leads with (Scheduled Caste
 * Welfare, Social Defence, Grants-in-Aid to NGOs) come first; the rest keep the
 * order of `DIVISIONS`.
 */
const LEAD_DIVISIONS = ["scheduled-caste-welfare", "social-defence", "grants-in-aid-to-ngos"];
const leadRank = (id: string) => {
  const i = LEAD_DIVISIONS.indexOf(id);
  return i < 0 ? LEAD_DIVISIONS.length : i;
};

export const DBIM_IMPORTANT_LINKS: DbimLinkRow[] = [...DIVISIONS].sort((a, b) => leadRank(a.id) - leadRank(b.id)).map((d) => {
  const internal = d.links.some((l) => !l.href.startsWith("http"));
  const external = d.links.find((l) => l.href.startsWith("http"));
  return internal || !external
    ? { label: d.name, path: `/ministry/our-division/${d.id}` }
    : { label: d.name, href: external.href };
});

/* ── Help ───────────────────────────────────────────────────────────────── */

/** SOURCE: app/website/help/page.tsx — the Department's plug-in table (publisher addresses current). */
export const DBIM_HELP_PLUGINS = [
  { type: "Portable Document Format (PDF) files", label: "Adobe Acrobat Reader", href: "https://get.adobe.com/reader/" },
  { type: "Word files", label: "Microsoft Word Viewer 2016", href: "https://www.microsoft.com/en-in/microsoft-365/word" },
  { type: "Excel files", label: "Microsoft Excel Viewer 2016", href: "https://www.microsoft.com/en-in/microsoft-365/excel" },
  { type: "PowerPoint presentations", label: "Microsoft PowerPoint Viewer 2016", href: "https://www.microsoft.com/en-in/microsoft-365/powerpoint" },
] as const;

export const DBIM_HELP_INTRO =
  "The information provided by this website is available in various formats, such as Portable Document Format (PDF), Word, and also in HTML format. To view the information properly, your browser needs to have the required plug-ins or software. For example, the PDF reader software is required to view a document in PDF format. In case your system does not have this software, you can download it from the Internet for free. The table lists the plug-ins needed to view the information in various file formats.";

/** SOURCE: app/website/help/page.tsx "Accessibility and Other Help", limited to pages this design has. */
export const DBIM_HELP_MORE: { label: string; path: string; note: string }[] = [
  { label: "Accessibility Statement", path: "/policies/accessibility-statement", note: "the accessibility standard of this website and how to report a barrier." },
  { label: "Sitemap", path: "/sitemap", note: "every section of this website on one page." },
  { label: "Contact Us", path: "/connect", note: "to reach the Department about a scheme or an application." },
];

/* ── Cookies ────────────────────────────────────────────────────────────── */

/**
 * SOURCE: app/website/cookies/page.tsx — what this website keeps in the browser, read
 * from the code on 21 Sep 2026. All of it is needed for a choice the reader made to
 * work, so all of it is "essential"; nothing optional is set.
 *
 * One entry differs, because the DBIM design's cookie notice differs: it records the
 * reader's answer in the `dbim-cookie-consent` cookie for a year
 * (components/website-dbim/chrome/CookieConsent.tsx), where the redesign's notice keeps
 * `mosje_cookie_consent` in local storage.
 */
export const DBIM_STORED: { name: string; purpose: string; where: string; kept: string }[] = [
  { name: "dbim-cookie-consent", purpose: "Remembers the choice you made on the cookie notice, so that it is not shown on every page.", where: "Your browser (cookie)", kept: "One year, or until you withdraw it below" },
  { name: "mosje.lang", purpose: "Remembers the language you chose from the language button.", where: "Your browser (local storage)", kept: "Until you choose another language or clear this website's data" },
  { name: "mosje.translations", purpose: "Keeps pages already translated into your chosen language, so that they open faster.", where: "Your browser (session storage)", kept: "Until you close the browser tab" },
  { name: "accessibilitySettings", purpose: "Remembers the text size, contrast and other display settings you choose from the accessibility button.", where: "Your browser (cookie)", kept: "30 days" },
  { name: "ux4g_trigger_position", purpose: "Remembers where on the screen you have moved the accessibility button.", where: "Your browser (local storage)", kept: "Until you clear this website's data" },
  { name: "ux4g_session_id", purpose: "A random identifier the accessibility controls create for the current visit. Their usage reporting is switched off on this website, so it is not sent anywhere.", where: "Your browser (session storage)", kept: "Until you close the browser tab" },
];

/* ── Personas ───────────────────────────────────────────────────────────── */

export interface DbimPersonaTile {
  icon: keyof typeof DBIM_PERSONA_ICONS;
  /** The sentence, with `{}` where the bold link word goes. */
  sentence: string;
  strong: string;
  path?: string;
  href?: string;
}

export interface DbimPersona {
  slug: string;
  /** "For Students" — the h1 and the breadcrumb. */
  title: string;
  description: string;
  tiles: [DbimPersonaTile, DbimPersonaTile, DbimPersonaTile, DbimPersonaTile];
}

/**
 * The Department's four audiences. SOURCE: app/website/for-{student,beneficiary,
 * government-official,researcher}/page.tsx — each persona's four tiles are the
 * destinations those pages lead with, where this design has a page for them.
 */
export const DBIM_PERSONAS: DbimPersona[] = [
  {
    slug: "student",
    title: "For Students",
    description: "Scholarships, fellowships, schools, hostels and coaching for students from the groups the Department serves.",
    tiles: [
      { icon: "schemes", sentence: "Learn more about the {} we provide", strong: "Scholarships", path: "/offerings" },
      { icon: "tenders", sentence: "Apply on the {}", strong: "National Scholarship Portal", href: "https://scholarships.gov.in/" },
      { icon: "publications", sentence: "View our {}", strong: "Orders and Notices", path: "/documents/orders-and-notices" },
      { icon: "vacancies", sentence: "Explore new {}", strong: "Vacancies", path: "/offerings/vacancies" },
    ],
  },
  {
    slug: "beneficiary",
    title: "For Beneficiaries",
    description: "The schemes of the Department for each of the groups it serves.",
    tiles: [
      { icon: "schemes", sentence: "Learn more about the {} we provide", strong: "Schemes and Services", path: "/offerings" },
      { icon: "publications", sentence: "Read our {}", strong: "Annual Reports", path: "/documents" },
      { icon: "tenders", sentence: "Reach the Department through {}", strong: "Contact Us", path: "/connect" },
      { icon: "vacancies", sentence: "Register a {}", strong: "Grievance", path: "/connect/grievance-redressal" },
    ],
  },
  {
    slug: "government-official",
    title: "For Government Officials",
    description: "Orders, references, forms and grant-in-aid procedures of the Department.",
    tiles: [
      { icon: "publications", sentence: "View our {}", strong: "Orders and Notices", path: "/documents/orders-and-notices" },
      { icon: "tenders", sentence: "Learn more about our {}", strong: "Tenders", path: "/offerings/tenders" },
      { icon: "vacancies", sentence: "Find officers in the {}", strong: "Directory", path: "/ministry/directory" },
      { icon: "schemes", sentence: "Apply for grants on {}", strong: "e-Anudaan", href: "https://grants-msje.gov.in/" },
    ],
  },
  {
    slug: "researcher",
    title: "For Researchers",
    description: "Publications, studies, statistics and open data of the Department.",
    tiles: [
      { icon: "publications", sentence: "View our {}", strong: "Publications", path: "/documents/publications" },
      { icon: "schemes", sentence: "Read our {}", strong: "Annual Reports", path: "/documents" },
      { icon: "tenders", sentence: "Explore the {}", strong: "Open Government Data Platform", href: "https://www.data.gov.in/" },
      { icon: "vacancies", sentence: "See our {}", strong: "Performance", path: "/ministry/our-performance" },
    ],
  },
];

export function dbimPersona(slug: string): DbimPersona | undefined {
  return DBIM_PERSONAS.find((x) => x.slug === slug);
}

/* ── Sitemap extras ─────────────────────────────────────────────────────── */

/** Pages outside the menu and the footer that the sitemap still has to list. */
export const DBIM_UTILITY_LINKS: DbimLink[] = [
  { label: "What's New", path: "/whats-new" },
  { label: "Important Links", path: "/important-links" },
  { label: "Feedback", path: "/feedback" },
  { label: "Cookie Policy", path: "/cookies" },
];

/* ── Search: a redesign address → its DBIM page ─────────────────────────── */

/**
 * The search index (lib/website/search) addresses the redesign's pages. While the DBIM
 * design is chosen those addresses are served from the DBIM tree, where most do not
 * exist, so each hit is sent to the DBIM page that holds the same thing. A hit with no
 * DBIM page returns null and is left out of the results rather than shown as a dead link.
 */
const STATIC_MAP: Record<string, string> = {
  "": "/",
  "about-us": "/ministry",
  "whos-who": "/ministry/our-team",
  "mosje-directory": "/ministry/directory",
  "dashboard": "/ministry/our-performance",
  "directory": "/connect/directory",
  "schemes-services": "/offerings",
  "vacancies": "/offerings/vacancies",
  "tenders": "/offerings/tenders",
  "annual-reports": "/documents",
  "publications": "/documents/publications",
  "notices": "/documents/orders-and-notices",
  "circulars-notifications": "/documents/orders-and-notices",
  "gallery": "/media",
  "events": "/connect/events",
  "contact-us": "/connect",
  "mosje-contact": "/connect",
  "rti": "/connect/rti",
  "cpio": "/connect/rti",
  "lok-sabha-question-answer": "/connect/parliament-questions",
  "archives": "/archives",
  "updates": "/whats-new",
  "help": "/help",
  "sitemap": "/sitemap",
  "feedback": "/feedback",
  "cookies": "/cookies",
  "website-policies": "/policies",
  "terms-conditions": "/policies",
  "privacy-policy": "/policies/privacy-policy",
  "hyperlinking-policy": "/policies/hyperlink-policy",
  "copyright": "/policies/copyright-policy",
  "accessibility-statement": "/policies/accessibility-statement",
  "for-student": "/persona/student",
  "for-beneficiary": "/persona/beneficiary",
  "for-government-official": "/persona/government-official",
  "for-researcher": "/persona/researcher",
};

/** `{ path }` for a DBIM page, `{ href }` for a file or another website, or null. */
export function dbimSearchTarget(href: string): { path: string } | { href: string } | null {
  if (/^https?:\/\//.test(href)) return { href };
  if (!href.startsWith("/website")) return null;
  const rest = href.slice("/website".length).replace(/^\//, "").split(/[?#]/)[0] ?? "";
  // A public file (it carries a dot) is the same file in every design.
  if (rest.includes(".")) return { href };
  const [head = "", sub] = rest.split("/");
  if (head === "schemes-services" && sub) return { path: `/offerings/schemes-and-services/${sub}` };
  if (head === "organisation" && sub) return { path: `/ministry/our-organisation/${sub}` };
  if (head === "official" && sub) return { path: "/ministry/our-team" };
  if (head.startsWith("about-the-division")) return { path: "/ministry/our-division" };
  if (head.endsWith("-directory")) return { path: "/connect/directory" };
  if (!sub && head in STATIC_MAP) return { path: STATIC_MAP[head] as string };
  return null;
}
