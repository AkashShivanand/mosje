/**
 * Hand-authored structure for organisation detail pages.
 *
 * WHY THIS IS NOT IN `organisation.json`. That file is the scrape of
 * dosje.gov.in — slug, title, sourceUrl and a bag of raw section HTML — and it
 * is rewritten wholesale on the next content ingest. Anything typed into it by
 * hand is lost the first time the site is re-crawled. The scrape gives us the
 * *prose*; this file gives that prose the shape the Figma "Organisation
 * Details" template asks for (facts, an index, components, contacts), keyed by
 * the same slug so the two join at render time.
 *
 * WHAT MAY GO IN HERE. Only facts that are on the source page. Every value
 * below is quoted or derived from
 * https://www.dosje.gov.in/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay/
 * — the components, the officials, the phone numbers, the counts. Do not add a
 * founding year, a budget or a beneficiary figure that the source does not
 * state; an invented statistic on a government page is a defect of a different
 * order from a layout bug.
 *
 * Documents (circulars, resources) are NOT listed here. They come from
 * `documents.json` — also ingested — filtered by the `circulars` and
 * `resources` specs below, so the lists stay current without anyone re-typing
 * them.
 */

export interface OrgFact {
  /** Material Symbols Rounded name. */
  icon: string;
  value: string;
  label: string;
}

export interface OrgNavChild {
  label: string;
  href: string;
  /** Off this site — a file or another domain. Opens in a new tab, and says so. */
  external?: boolean;
}

export interface OrgNavGroup {
  label: string;
  items: { label: string; href: string; external?: boolean; children?: OrgNavChild[] }[];
}

export interface OrgComponentCard {
  title: string;
  description: string;
  icon: string;
  /** Slug of the child organisation page this card opens. */
  slug: string;
}

export interface OrgContactPerson {
  name: string;
  designation: string;
  phone?: string;
  email?: string;
}

export interface OrgContactBlock {
  heading: string;
  people: OrgContactPerson[];
}

export interface OrgDownloadItem {
  label: string;
  href: string;
  /**
   * What the reader is about to open. Taken from the destination, never
   * guessed: `page` is a web page on dosje.gov.in, the rest are files.
   */
  kind: "pdf" | "pptx" | "page";
}

export interface OrgDownloadGroup {
  /** Anchor id — this is what the page index links to. */
  id: string;
  heading: string;
  items: OrgDownloadItem[];
}

export interface OrgGalleryItem {
  date: string;
  caption: string;
  image: string;
}

export interface OrganisationDetail {
  /**
   * Overrides the scraped `featuredImage` in the banner. The scrape often
   * points at a path that was never mirrored, which renders as an empty white
   * disc; the org-logo set under `/website/images/org-logos/` is the reliable
   * source.
   */
  logo?: string;
  /** Sentence under the H1 in the blue banner. */
  lead?: string;
  facts?: OrgFact[];
  nav?: OrgNavGroup[];
  /** Heading for the prose section. */
  aboutHeading?: string;
  /**
   * Replaces the ingested section HTML for the About band. Use it only where
   * the scrape captured less than the source page shows — PM-AJAY's ingested
   * record is missing the three objectives the live page lists — and keep the
   * wording verbatim.
   */
  aboutHtml?: string;
  /** Link rendered beside the About heading, as the source page's "Know More". */
  aboutAction?: { label: string; href: string };
  components?: {
    heading: string;
    description?: string;
    items: OrgComponentCard[];
  };
  /**
   * Which ingested documents this organisation's two document bands show.
   * `category` is the value in `documents.json`; `match` is a list of
   * case-insensitive substrings tested against the title. Both must hit, so a
   * broad word like "hostel" cannot drag in another scheme's circulars.
   */
  circulars?: { category: string; match: string[]; viewAllHref: string };
  resources?: { category: string; match: string[]; viewAllHref: string };
  downloads?: {
    heading: string;
    description?: string;
    groups: OrgDownloadGroup[];
  };
  gallery?: {
    heading: string;
    items: OrgGalleryItem[];
  };
  contact?: {
    heading: string;
    supportPhone?: string;
    supportHours?: string;
    supportEmail?: string;
    blocks?: OrgContactBlock[];
  };
}

const PM_AJAY = "pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay";

export const ORGANISATION_DETAILS: Record<string, OrganisationDetail> = {
  [PM_AJAY]: {
    logo: "/website/images/org-logos/pm-ajay.png",
    lead:
      "PM-AJAY is a flagship scheme of the Ministry of Social Justice & Empowerment dedicated to the socio-economic empowerment of Scheduled Castes. The scheme promotes livelihood opportunities, strengthens village infrastructure, and enhances access to education and residential facilities for sustainable and inclusive development.",

    // Four facts, all stated on the source page: the headquarters line under the
    // banner, the three named components, the implementing ministry, and the
    // group the scheme is for. No year, no budget — the source gives neither.
    facts: [
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "widgets", value: "3", label: "Scheme components" },
      { icon: "account_balance", value: "Social Justice & Empowerment", label: "Implementing ministry" },
      { icon: "groups", value: "Scheduled Castes", label: "Who it serves" },
    ],

    nav: [
      {
        label: "About us",
        items: [{ label: "About the Scheme", href: "#about-the-scheme" }],
      },
      {
        label: "Our work & impact",
        items: [
          { label: "Components", href: "#components" },
          { label: "Circulars & Notifications", href: "#circulars-notifications" },
          { label: "Resources", href: "#resources" },
          // Sections, not files. The index is a table of contents: every entry
          // here is a place on this page, a sub-page, or another site. The
          // download lists these two headings used to inline are a section of
          // the page now, and these link to it.
          { label: "Downloads (PM-AJAY)", href: "#downloads-pm-ajay" },
          { label: "Downloads (pmagy)", href: "#downloads-pmagy" },
        ],
      },
      {
        label: "Connect & engage",
        items: [
          { label: "Illustrative list of domain under GIA", href: `/website/organisation/${PM_AJAY}/reports/illustrative-list-of-projects-under-various-domains-for-development-of-scheduled-castes-families-under-the-scheme` },
          { label: "Flow Chart", href: `/website/organisation/${PM_AJAY}/reports/flow-chart` },
          { label: "Find Courses", href: "https://nsdcindia.org/qp-nos-results", external: true },
          { label: "Gallery", href: "#gallery" },
          { label: "Contact", href: "#contact" },
        ],
      },
    ],

    aboutHeading: "About the Scheme",

    // Verbatim from the source page. The ingested record holds only the opening
    // paragraph and the component list; the three objectives under "PM-AJAY
    // works towards" are on the live page and were not captured.
    aboutHtml: [
      "<p>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) is a scheme of the Government of India, implemented by the Ministry of Social Justice and Empowerment, for the integrated socio-economic development of Scheduled Castes across the country.</p>",
      "<p>PM-AJAY works towards:</p>",
      "<ul>",
      "<li>Reducing poverty among Scheduled Caste communities by creating employment opportunities through skill development and income-generating initiatives.</li>",
      "<li>Improving socio-economic indicators by ensuring adequate infrastructure and essential services in Scheduled Caste dominated villages.</li>",
      "<li>Increasing literacy and encouraging enrolment of Scheduled Castes in schools and higher education institutions, including through residential facilities.</li>",
      "</ul>",
      "<p>The scheme has the components &ndash;</p>",
      "<ol>",
      "<li><strong>Adarsh Gram:</strong> Develops Scheduled Caste dominated villages into model villages;</li>",
      "<li><strong>Grants-in-Aid:</strong> Livelihood, Skilling, and Infrastructure projects for the economic betterment of Scheduled Castes;</li>",
      "<li><strong>Hostels:</strong> supports the construction and repair of hostels for Scheduled Caste students to reduce dropout rates.</li>",
      "</ol>",
    ].join(""),

    aboutAction: { label: "Know more", href: `/website/organisation/${PM_AJAY}/pmajy/about-us` },

    components: {
      heading: "Components",
      description:
        "PM-AJAY is delivered through three components. Each is administered separately, with its own guidelines and reporting.",
      items: [
        {
          title: "Development of SC dominated villages into “Adarsh Gram”",
          description:
            "Develops Scheduled Caste dominated villages into model villages, with a village development plan and gap-filling funds.",
          icon: "holiday_village",
          slug: `${PM_AJAY}/components/development-of-sc-dominated-villages-into-adarsh-gram`,
        },
        {
          title: "Grants-in-aid to State/Districts",
          description:
            "Livelihood, skilling and infrastructure projects for the economic betterment of Scheduled Castes.",
          icon: "payments",
          slug: `${PM_AJAY}/components/grants-in-aid-to-state-districts`,
        },
        {
          title: "Construction/Repair of Hostels",
          description:
            "Supports the construction and repair of hostels for Scheduled Caste students, to reduce dropout rates.",
          icon: "apartment",
          slug: `${PM_AJAY}/components/construction-repair-of-hostels`,
        },
      ],
    },

    circulars: {
      category: "Circulars & Notifications",
      match: ["pm-ajay", "pm ajay", "pmajay", "pmagy", "adarsh gram", "anusuchit jaati abhyuday"],
      viewAllHref: "/website/circulars-notifications",
    },
    // The three the source page lists under Resources. They are filed as
    // "Forms & Templates" in the document ingest, and their titles carry no
    // scheme name — so they are matched by title, narrowed by that category.
    resources: {
      category: "Forms & Templates",
      match: ["formats", "physical financial format"],
      viewAllHref: "/website/forms-templates",
    },

    // The source page offers these as two download lists. They are linked at
    // dosje.gov.in rather than mirrored here: the nine files total 28MB, one of
    // them a 22MB manual, and the document cards on this page already link out
    // to the same host.
    //
    // "PMAGY Work Flow" sits between "Announcement in village" and "Work Flow
    // for Interim VDP" on the source and is deliberately absent: its link is
    // empty there — it opens a pop-up, so there is no destination to offer.
    downloads: {
      heading: "Downloads",
      description:
        "Formats, presentations and manuals published for the scheme. Each opens on dosje.gov.in.",
      groups: [
        {
          id: "downloads-pm-ajay",
          heading: "PM-AJAY",
          items: [
            { label: "Utilization Certificate", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/UC-GFR-12-C.pdf", kind: "pdf" },
            { label: "Implementation Status", href: "https://www.dosje.gov.in/documents/pm-ajay-releases-and-utilization-implementation-status/", kind: "page" },
            { label: "Presentation about Scheme", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/PMAJAY-FINAL-PPT.pptx", kind: "pptx" },
            { label: "Institute Registration Form", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/Format_for_institute_university_registration.pdf", kind: "pdf" },
          ],
        },
        {
          id: "downloads-pmagy",
          heading: "PMAGY",
          items: [
            { label: "Presentation, CSMC Meeting 12 Feb 2020", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/PMAGY-CSMC-Meeting-12022020.pdf", kind: "pdf" },
            { label: "Presentation", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/PPT_PMAGY_24102019.pdf", kind: "pdf" },
            { label: "Announcement in village (Hindi)", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/village_announcement.pdf", kind: "pdf" },
            { label: "Work Flow for Interim VDP", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/Flow-Diagram-to-Generate-the-Interim-VDP.pdf", kind: "pdf" },
            { label: "Sample VDP", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/SampleVDP.pdf", kind: "pdf" },
            { label: "District User Manual", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/User_Manual_of_AGY.pdf", kind: "pdf" },
          ],
        },
      ],
    },

    // The three photographs the source page's gallery carries, mirrored into
    // public/website/content/organisation/ rather than hot-linked from the
    // source CDN. Captions are the source's own, verbatim — all three describe
    // the same Uttarakhand MIS training, and inventing three distinct captions
    // to avoid the repetition would be inventing content.
    gallery: {
      heading: "Gallery",
      items: [
        {
          date: "23 Sep 2022",
          caption:
            "Capacity building of state and district level officers of Uttarakhand on PM-AJAY MIS",
          image: "/website/content/organisation/pmajay-training1.jpg",
        },
        {
          date: "23 Sep 2022",
          caption:
            "Capacity building of state and district level officers of Uttarakhand on PM-AJAY MIS",
          image: "/website/content/organisation/pmajay-training5.jpg",
        },
        {
          date: "23 Sep 2022",
          caption:
            "Capacity building of state and district level officers of Uttarakhand on PM-AJAY MIS",
          image: "/website/content/organisation/pmajay-training6.jpg",
        },
      ],
    },

    contact: {
      heading: "Contact",
      supportPhone: "+91-11-24364468",
      supportHours: "Monday to Friday, 9:00 AM to 6:00 PM",
      supportEmail: "support[dot]pmagy-msje[at]gov[dot]in",
      blocks: [
        {
          heading: "Administrative support",
          people: [
            { name: "Shri Sudhansh Pant", designation: "Secretary", phone: "+91-11-26115006" },
            { name: "Shri Shailendra Kumar", designation: "Joint Secretary" },
            { name: "Amresh Bahadur Pal", designation: "Director", email: "dir-pmajay-dosje[at]gov[dot]in" },
            { name: "Shri Sewak Paul", designation: "Under Secretary", phone: "+91-11-23389368", email: "sewak.paul[at]nic.in" },
          ],
        },
        {
          heading: "NIC — Department of Social Justice and Empowerment",
          people: [
            {
              name: "Shri Bhupinder Pathak",
              designation: "Deputy Director General (IT)",
              phone: "+91-11-24360791",
              email: "hod-sje[at]nic[dot]in",
            },
          ],
        },
      ],
    },
  },
};

export function getOrganisationDetail(slug: string): OrganisationDetail | undefined {
  return ORGANISATION_DETAILS[slug];
}
