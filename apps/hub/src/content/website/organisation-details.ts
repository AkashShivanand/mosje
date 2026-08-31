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

export interface OrgHighlightCard {
  title: string;
  description: string;
  icon?: string;
  href?: string;
  ctaLabel?: string;
}

export interface OrgLeader {
  name: string;
  designation: string;
  roleTag?: string;
  image?: string;
  phone?: string;
  email?: string;
}

export interface OrgInitiativeCard {
  title: string;
  description: string;
  image?: string;
  emblem?: boolean;
  icon?: string;
  slug?: string;
  href?: string;
  actionLabel?: string;
}

export interface OrgLinkPill {
  label: string;
  href: string;
  count?: string | number;
  external?: boolean;
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
  viewAllHref?: string;
}

export interface OrgGalleryItem {
  date: string;
  caption: string;
  image: string;
}

export interface OrgHeroAction {
  label: string;
  href: string;
  icon?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
  external?: boolean;
}

export interface OrganisationDetail {
  /**
   * Overrides the scraped `logo` in the banner or header.
   */
  logo?: string;
  /**
   * Featured banner image displayed on the right of the hero.
   */
  featuredImage?: string;
  /** Sentence under the H1 in the blue banner. */
  lead?: string;
  /** Hero quick action buttons strip displayed under description. */
  quickActions?: OrgHeroAction[];
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
  aboutHighlights?: OrgHighlightCard[];
  leadership?: {
    heading: string;
    description?: string;
    action?: { label: string; href: string };
    items: OrgLeader[];
  };
  initiatives?: {
    heading: string;
    description?: string;
    action?: { label: string; href: string };
    items: OrgInitiativeCard[];
  };
  components?: {
    heading: string;
    description?: string;
    action?: { label: string; href: string };
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
  /**
   * Report indexes the organisation publishes. Groups of LINKS, not files:
   * each opens a live, query-driven report on dosje.gov.in. They are linked
   * rather than mirrored for the same reason the downloads are — the figures
   * behind them are generated on request from a database this estate does not
   * hold, and a mirrored copy would be a snapshot presented as a live report.
   */
  reports?: {
    heading: string;
    description?: string;
    groups: { heading: string; items: OrgLinkPill[] }[];
  };
  featuredLinks?: {
    heading?: string;
    items: OrgLinkPill[];
  };
  gallery?: {
    heading: string;
    items: OrgGalleryItem[];
    viewAllHref?: string;
  };
  majorActivities?: {
    heading: string;
    description?: string;
    action?: { label: string; href: string };
    items: {
      title: string;
      icon?: string;
      image?: string;
      href?: string;
      actionLabel?: string;
    }[];
  };
  resourcesBookshelf?: {
    heading: string;
    description?: string;
    action?: { label: string; href: string };
    items: {
      title: string;
      image: string;
      href?: string;
    }[];
  };
  stateOfficesMap?: {
    heading: string;
    description?: string;
    action?: { label: string; href: string };
    offices: {
      name: string;
      stateCode: string;
      address?: string;
      phone?: string;
      email?: string;
    }[];
  };
  activityCorner?: {
    heading: string;
    description?: string;
    action?: { label: string; href: string };
    items: {
      day: string;
      monthYear: string;
      title: string;
      description: string;
      href?: string;
    }[];
  };
  socialFeed?: {
    heading: string;
    handles?: { platform: "facebook" | "x" | "youtube"; url: string; handle: string }[];
    posts?: {
      platform: "facebook" | "x" | "youtube";
      author: string;
      handle: string;
      date: string;
      content: string;
      image?: string;
      likes?: string;
      shares?: string;
    }[];
  };
  contact?: {
    heading: string;
    action?: { label: string; href: string };
    supportPhone?: string;
    supportHours?: string;
    supportEmail?: string;
    address?: string;
    regionalOffices?: string;
    officialWebsite?: string;
    blocks?: OrgContactBlock[];
  };
}

const PM_AJAY = "pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay";
/** The scheme on the source site. The reports below are generated there, not here. */
const PM_AJAY_SRC = `https://www.dosje.gov.in/organisation/${PM_AJAY}`;

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
        label: "ABOUT US",
        items: [{ label: "About the Scheme", href: "#about-the-scheme" }],
      },
      {
        label: "OUR WORK & IMPACT",
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
          { label: "Reports (PM-AGY)", href: "#reports" },
        ],
      },
      {
        label: "CONNECT & ENGAGE",
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

    // The "Reports PM-AGY" band the source page carries, in the source's own
    // three groups and its own labels. Every one is a live report generated on
    // request at dosje.gov.in, so each is linked out rather than mirrored — for
    // a stronger reason than the downloads above: a mirrored copy of a live
    // report is a snapshot wearing a live report's clothes.
    reports: {
      heading: "Reports (PM-AGY)",
      description:
        "Village, Adarsh Gram and VDP reports published for the scheme. Each opens on dosje.gov.in.",
      groups: [
        {
          heading: "Villages",
          items: [
            { label: "Covered Villages", href: `${PM_AJAY_SRC}/villages-covered-under-pmagy/`, external: true },
            { label: "Covered Villages Mission Utkarsh", href: `${PM_AJAY_SRC}/villages-covered-under-mission-utkarsh/`, external: true },
            { label: "Covered Villages (40% SC Population)", href: `${PM_AJAY_SRC}/covered-villages-40-sc-population/`, external: true },
            { label: "All Villages Score", href: `${PM_AJAY_SRC}/all-villages-score-in-descending-order/`, external: true },
            { label: "Villages between scores", href: `${PM_AJAY_SRC}/villages-between-scores/`, external: true },
            { label: "Village At Glance", href: `${PM_AJAY_SRC}/village-summary-at-glance/`, external: true },
            { label: "Phase one villages", href: `${PM_AJAY_SRC}/phase-one-villages/`, external: true },
            { label: "Pilot phase villages", href: `${PM_AJAY_SRC}/pilot-phase-villages/`, external: true },
          ],
        },
        {
          heading: "Adarsh Gram",
          items: [
            { label: "Adarsh Gram Declaration Status", href: `${PM_AJAY_SRC}/adarsh-gram-report/`, external: true },
          ],
        },
        {
          heading: "VDP",
          items: [
            { label: "Selection Year Wise VDP", href: `${PM_AJAY_SRC}/number-of-villages-selected-and-vdp-generated/`, external: true },
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

  "national-commission-for-safai-karamcharis": {
    logo: "/design-system/org-logos/ncsk.png",
    featuredImage: "/website/images/organisations/banner-ncsk.png",
    lead: "The National Commission for Safai Karamcharis (NCSK) was constituted on 12th August, 1994 as a statutory body by an Act of Parliament viz. ‘National Commission for Safai Karamcharis Act, 1993’, for a period of three years i.e. up to 31st March, 1997. As per sub-section (4) of Section 1 of the Act, it was to cease to exist after 31.3.1997. However, validity of the Act was extended up to March, 2002, and then up to February, 2004 vide Amendment Acts passed in 1997 and 2001 respectively.",
    quickActions: [
      {
        label: "Lodge Complaint",
        href: "https://ncsk.nic.in/complaints/lodge-complaint",
        icon: "support_agent",
        variant: "primary",
        external: true,
      },
      {
        label: "Track Complaints",
        href: "https://ncsk.nic.in/complaints/track-complaints",
        icon: "track_changes",
        variant: "outline",
        external: true,
      },
      {
        label: "Total No. Of Deaths / Compensation",
        href: "/website/organisation/national-commission-for-safai-karamcharis/main-sewer-death",
        icon: "payments",
        variant: "outline",
      },
    ],
    aboutHeading: "About NCSK",
    aboutAction: { label: "Know More →", href: "/website/organisation/national-commission-for-safai-karamcharis/about-us" },
    aboutHtml: `<p>The National Commission for Safai Karamcharis (NCSK) was constituted on 12th August, 1994 as a statutory body by an Act of Parliament viz. ‘National Commission for Safai Karamcharis Act, 1993’, for a period of three years i.e. up to 31st March, 1997. As per sub-section (4) of Section 1 of the Act, it was to cease to exist after 31.3.1997. However, validity of the Act was extended up to March, 2002, and then up to February, 2004 vide Amendment Acts passed in 1997 and 2001 respectively.</p><p>With the lapse of the ‘National Commission for Safai Karamcharis Act, 1993’ with effect from 1st March, 2004, the Commission is functioning as a Non-Statutory body of the Ministry of Social Justice and Empowerment, whose tenure is extended from time to time through Government Resolutions.</p><p>With the enactment of “The Prohibition of Employment as Manual Scavengers and Their Rehabilitation Act, 2013”, the mandate and scope of the Commission has also been enlarged under Section 31(1) of the said Act to monitor the implementation of the Act, enquire into complaints, and advise Central and State Governments.</p>`,
    aboutHighlights: [
      {
        title: "Manual Scavengers Act",
        description: "An Act to provide for the prohibition of employment as manual scavengers, rehabilitation of manual scavengers and their families, etc.",
        icon: "gavel",
        href: "/website/organisation/national-commission-for-safai-karamcharis/about-us",
        ctaLabel: "Read More",
      },
      {
        title: "Suo-motu Cognizance by the Commission",
        description: "Suo Motu cognizance taken by the Commission in the cases of reported sewer deaths to make compensation payment as per Hon’ble Supreme Court Judgement 2014.",
        icon: "verified",
        href: "/website/organisation/national-commission-for-safai-karamcharis/suo-motu-cognizance-by-the-commission",
        ctaLabel: "Read More",
      },
      {
        title: "Key Initiative / Achievement",
        description: "Initiatives taken by the Commission as per the mandate & achievements made.",
        icon: "task_alt",
        href: "/website/organisation/national-commission-for-safai-karamcharis/impact-of-commission-intervention",
        ctaLabel: "Read More",
      },
      {
        title: "Successful Intervention Of NCSK",
        description: "Impact of Commission’s Intervention.",
        icon: "handshake",
        href: "/website/organisation/national-commission-for-safai-karamcharis/impact-of-commission-intervention",
        ctaLabel: "Read More",
      },
    ],
    facts: [
      { icon: "calendar_today", value: "1994", label: "Established Year" },
      { icon: "location_city", value: "New Delhi", label: "Headquarters" },
      { icon: "description", value: "20+", label: "Reports Since 1994" },
    ],
    nav: [
      {
        label: "ABOUT US",
        items: [
          { label: "About NCSK", href: "#about-the-scheme" },
          { label: "Current Commission", href: "#leadership" },
          { label: "Details of Previous Commissions", href: "/website/organisation/national-commission-for-safai-karamcharis/details-of-previous-commissions" },
          { label: "NCSK Secretariat", href: "/website/organisation/national-commission-for-safai-karamcharis/ncsk-secretariat" },
          { label: "State Allocation", href: "/website/organisation/national-commission-for-safai-karamcharis/state-allocation" },
          { label: "Citizen Charter", href: "/website/organisation/national-commission-for-safai-karamcharis/citizen-charter" },
          { label: "Right to Information", href: "/website/organisation/national-commission-for-safai-karamcharis/right-to-information" },
        ],
      },
      {
        label: "OUR WORK & IMPACT",
        items: [
          { label: "Major Activities", href: "#major-activities" },
          { label: "National Initiatives & Schemes", href: "#national-initiatives" },
          { label: "Key Oversight Functions", href: "#components" },
          { label: "Total No. Of Deaths / Compensation", href: "/website/organisation/national-commission-for-safai-karamcharis/main-sewer-death" },
          { label: "Sewer/Septic Tank Death in Last 10 Yrs", href: "/website/organisation/national-commission-for-safai-karamcharis/sewer-septic-tank-death-in-last-10-yrs" },
          { label: "Cases in Which Legal Heir Not Traceable", href: "/website/organisation/national-commission-for-safai-karamcharis/case-which-legal-heir-not-traceable" },
          { label: "Suo-motu Cognizance by the Commission", href: "/website/organisation/national-commission-for-safai-karamcharis/suo-motu-cognizance-by-the-commission" },
          { label: "Tour by the Commission", href: "/website/organisation/national-commission-for-safai-karamcharis/tour-by-the-commission" },
          { label: "State Commissions/Designated Agencies", href: "/website/organisation/national-commission-for-safai-karamcharis/state-commissions-designated-agencies" },
          { label: "Monitoring Committees", href: "/website/organisation/national-commission-for-safai-karamcharis/monitoring-committees" },
          { label: "Vigilance Committees", href: "/website/organisation/national-commission-for-safai-karamcharis/vigilance-committees" },
          { label: "Sanitary Insanitary Latrines", href: "/website/organisation/national-commission-for-safai-karamcharis/sanitary-insanitary-latrines" },
          { label: "Impact of Commission Intervention", href: "/website/organisation/national-commission-for-safai-karamcharis/impact-of-commission-intervention" },
        ],
      },
      {
        label: "PUBLICATIONS & REPORTS",
        items: [
          { label: "Annual Reports", href: "#annual-reports" },
          { label: "SOP and Advisory", href: "#sop-and-advisories" },
          { label: "Act/Rules", href: "#acts-and-rules" },
          { label: "Notifications", href: "#circulars-notifications" },
          { label: "Rules & Procedure", href: "#rules-of-procedure" },
          { label: "Rajya Sabha Questions", href: "/website/organisation/national-commission-for-safai-karamcharis/rajya-sabha-questions" },
          { label: "Meetings", href: "/website/organisation/national-commission-for-safai-karamcharis/meetings" },
          { label: "FAQ", href: "/website/organisation/national-commission-for-safai-karamcharis/faq" },
        ],
      },
      {
        label: "CITIZEN HELP & CONNECT",
        items: [
          { label: "Activity Corner", href: "#activity-corner" },
          { label: "Social Media", href: "#social-feed" },
          { label: "Lodge Complaint", href: "https://ncsk.nic.in/complaints/lodge-complaint", external: true },
          { label: "Track Complaints", href: "https://ncsk.nic.in/complaints/track-complaints", external: true },
          { label: "Grievances", href: "/website/organisation/national-commission-for-safai-karamcharis/ncsk-grievances" },
          { label: "Featured Links", href: "#featured-links" },
          { label: "Gallery", href: "#gallery" },
          { label: "Contact Us", href: "#contact" },
        ],
      },
    ],
    leadership: {
      heading: "Leadership & Organisation",
      description: "The Commission comprises a Chairperson, Vice-Chairperson and five Members, supported by a Secretariat which includes the Administration and Research & Development section.",
      action: { label: "Know More →", href: "/website/organisation/national-commission-for-safai-karamcharis/current-commission" },
      items: [
        {
          name: "Shri Hardeep Singh Gill",
          designation: "Hon'ble Vice-Chairperson",
          roleTag: "Hon'ble Vice-Chairperson",
          image: "/website/images/organisations/hardeep_singh_gill.jpg",
        },
        {
          name: "Shri Karam Singh Karma",
          designation: "Hon'ble Member",
          roleTag: "Hon'ble Member",
          image: "/website/images/organisations/whatsapp-image-2026-05-20-at-2.56.31-pm-1024x887.jpeg",
        },
        {
          name: "Shri Rahul Kashyap",
          designation: "Secretary to Commission",
          roleTag: "Secretary",
          image: "/website/images/organisations/whatsapp-image-2026-06-02-at-1.13.17-pm.jpeg",
        },
      ],
    },
    majorActivities: {
      heading: "Major Activities",
      items: [
        {
          title: "Suo-motu Cognizance by Commission",
          icon: "gavel",
          href: "/website/organisation/national-commission-for-safai-karamcharis/suo-motu-cognizance-by-the-commission",
          actionLabel: "View Details",
        },
        {
          title: "State & District Field Visits",
          icon: "travel_explore",
          href: "/website/organisation/national-commission-for-safai-karamcharis/tour-by-the-commission",
          actionLabel: "View Details",
        },
        {
          title: "Sewer Death & Compensation Review",
          icon: "health_and_safety",
          href: "/website/organisation/national-commission-for-safai-karamcharis/main-sewer-death",
          actionLabel: "View Details",
        },
        {
          title: "Grievance Hearings & Redressal",
          icon: "support_agent",
          href: "/website/organisation/national-commission-for-safai-karamcharis/ncsk-grievances",
          actionLabel: "View Details",
        },
      ],
    },
    initiatives: {
      heading: "National Initiatives & Schemes",
      description: "Key national interventions and mobile applications spearheaded to eliminate manual scavenging and ensure dignity for sanitation workers.",
      action: { label: "View All →", href: "/website/schemes-services?org=ncsk" },
      items: [
        {
          title: "Revised Scheme Guidelines For inclusion of Waste Pickers Component under NAMASTE",
          description: "Comprehensive guidelines for inclusion, skilling, and capital subsidy assistance for waste pickers.",
          image: "/website/images/organisations/schemes-768x768.jpg",
          href: "/website/documents/sample/advisory-sop-sample.pdf",
          actionLabel: "Download Guidelines",
        },
        {
          title: "Revised Scheme Guidelines of National Action for Mechanised Sanitation Ecosystem (NAMASTE)",
          description: "Joint initiative of MoSJE and MoHUA to ensure zero fatalities in sanitation work and 100% mechanization.",
          image: "/website/images/organisations/schemes-768x768.jpg",
          href: "/website/documents/sample/advisory-sop-sample.pdf",
          actionLabel: "Download Guidelines",
        },
        {
          title: "SRMS — Self Employment Scheme for Rehabilitation of Manual Scavengers",
          description: "Capital subsidy, concessional loans, and skill development training for comprehensive rehabilitation.",
          href: "/website/documents/sample/parliament-qa-sample.pdf",
          actionLabel: "Download Scheme",
        },
        {
          title: "Pre-Matric Scholarship for Children of Scavengers & Hazardous Occupations",
          description: "Financial assistance to support educational access for children of sanitation workers and manual scavengers.",
          href: "/website/documents/sample/parliament-qa-sample.pdf",
          actionLabel: "Download Scheme",
        },
        {
          title: "Swachhata Abhiyan Mobile App",
          description: "Mobile application developed by Ministry of Social Justice & Empowerment to identify and geotag insanitary latrines across India.",
          href: "https://swachhataapp.dosje.gov.in/",
          actionLabel: "Open Portal",
        },
      ],
    },
    components: {
      heading: "Key Oversight Functions",
      description: "Core statutory monitoring mechanisms, compliance registries, and service commitments established by the Commission.",
      items: [
        {
          title: "Total No. Of Deaths / Compensation",
          description: "Statutory monitoring of ₹10 Lakhs and ₹30 Lakhs compensation disbursement to bereaved families across all States/UTs.",
          icon: "payments",
          slug: "national-commission-for-safai-karamcharis/main-sewer-death",
        },
        {
          title: "Monitoring Committees",
          description: "Tracking establishment and meetings of State and District Level Monitoring Committees under Section 26 of MS Act, 2013.",
          icon: "domain_verification",
          slug: "national-commission-for-safai-karamcharis/monitoring-committees",
        },
        {
          title: "Citizen Charter",
          description: "Service standards, grievance redressal timeframes, and institutional commitments of the Commission.",
          icon: "menu_book",
          slug: "national-commission-for-safai-karamcharis/citizen-charter",
        },
        {
          title: "Grievances",
          description: "Online complaint lodging (e-GMP), status tracking, and procedure guidelines for Safai Karamcharis.",
          icon: "support_agent",
          slug: "national-commission-for-safai-karamcharis/ncsk-grievances",
        },
      ],
    },
    downloads: {
      heading: "Statutory Publications & Guidelines",
      description: "Official statutory guidelines, acts, rules, and annual reports published by the Commission.",
      groups: [
        {
          id: "annual-reports",
          heading: "Annual Reports",
          viewAllHref: "/website/annual-reports?org=ncsk",
          items: [
            {
              href: "/website/documents/sample/annual-report-sample.pdf",
              label: "NCSK Annual Report 2021–2022 (English)",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/annual-report-sample.pdf",
              label: "NCSK Annual Report 2018–2019",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              label: "NCSK Annual Report 2017–2018",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/annual-report-sample.pdf",
              label: "NCSK Annual Report 2016–2017",
              kind: "pdf",
            },
          ],
        },
        {
          id: "sop-and-advisories",
          heading: "SOP and Advisory",
          viewAllHref: "/website/advices?org=ncsk",
          items: [
            {
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              label: "Advisory on Emergency Response Sanitation Unit (ERSU)",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              label: "SOP for Cleaning of Sewers and Septic Tanks",
              kind: "pdf",
            },
          ],
        },
        {
          id: "acts-and-rules",
          heading: "Acts & Rules",
          viewAllHref: "/website/acts-rules?org=ncsk",
          items: [
            {
              href: "/website/documents/sample/acts-rules-sample.pdf",
              label: "The Prohibition of Employment as Manual Scavengers and their Rehabilitation Act, 2013",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/acts-rules-sample.pdf",
              label: "The Prohibition of Employment as Manual Scavengers and their Rehabilitation Rules, 2013 (Hindi & English)",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/acts-rules-sample.pdf",
              label: "Notification for Enforcement of the MS Act, 2013",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/acts-rules-sample.pdf",
              label: "Supreme Court Landmark Judgment in Dr. Balram Singh Case (2023)",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/acts-rules-sample.pdf",
              label: "Supreme Court Landmark Judgment in WP Civil No. 583/2003 (2014)",
              kind: "pdf",
            },
          ],
        },
        {
          id: "circulars-notifications",
          heading: "Circulars & Notifications",
          viewAllHref: "/website/circulars-notifications?org=ncsk",
          items: [
            {
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              label: "Operational Guidelines for Identification and Rehabilitation of Manual Scavengers",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              label: "Advisory on Mandatory Provision of PPE Kits and Safety Devices to Sanitation Workers",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              label: "Notice for Convening Meeting of Central Monitoring Committee under Section 29 of MS Act",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              label: "Notification regarding payment of Enhanced Ex-gratia Compensation to Sewer Death Victims",
              kind: "pdf",
            },
          ],
        },
        {
          id: "rules-of-procedure",
          heading: "Rules & Procedure",
          viewAllHref: "/website/publications?org=ncsk",
          items: [
            {
              href: "/website/documents/sample/parliament-qa-sample.pdf",
              label: "Hand Book 2019 NCSK (English)",
              kind: "pdf",
            },
            {
              href: "/website/documents/sample/parliament-qa-sample.pdf",
              label: "Hand Book 2019 NCSK (Hindi)",
              kind: "pdf",
            },
          ],
        },
      ],
    },
    featuredLinks: {
      heading: "Featured Links",
      items: [
        { label: "Lodge Online Grievance (e-GMP)", href: "https://ncsk.nic.in/complaints/lodge-complaint", external: true },
        { label: "Track Grievance Status", href: "https://ncsk.nic.in/complaints/track-complaints", external: true },
        { label: "NCSK Grievance Redressal Guidelines", href: "/website/organisation/national-commission-for-safai-karamcharis/ncsk-grievances" },
        { label: "Main Sewer Death", href: "/website/organisation/national-commission-for-safai-karamcharis/main-sewer-death" },
        { label: "Total No. of Deaths Compensation", href: "/website/organisation/national-commission-for-safai-karamcharis/total-no-of-deaths-compensation" },
        { label: "State Commissions Designated Agencies", href: "/website/organisation/national-commission-for-safai-karamcharis/state-commissions-designated-agencies" },
        { label: "Untraceable Legal Heirs Guidelines", href: "/website/organisation/national-commission-for-safai-karamcharis/case-which-legal-heir-not-traceable" },
        { label: "State Monitoring Committees", href: "/website/organisation/national-commission-for-safai-karamcharis/monitoring-committees" },
        { label: "Vigilance Committees", href: "/website/organisation/national-commission-for-safai-karamcharis/vigilance-committees" },
        { label: "Impact of Commission Intervention", href: "/website/organisation/national-commission-for-safai-karamcharis/impact-of-commission-intervention" },
      ],
    },
    gallery: {
      heading: "Gallery",
      viewAllHref: "/website/gallery?org=ncsk",
      items: [
        {
          image: "/website/images/organisations/whatsapp-image-2026-06-28-at-12.47.56-pm-2-768x1024.jpeg",
          caption: "माननीय सदस्य श्री कर्म सिंह कर्मा जी का मुंडका सेप्टिक टैंक दुर्घटना पीड़ित परिजनों से मुलाकात एवं समीक्षा",
          date: "27 Jun 2026",
        },
        {
          image: "/website/images/organisations/whatsapp-image-2026-06-28-at-7.08.02-am-1024x682.jpeg",
          caption: "सफाई कर्मचारी राहत एवं पुनर्वास समन्वय बैठक",
          date: "28 Jun 2026",
        },
        {
          image: "/website/images/organisations/whatsapp-image-2026-06-27-at-6.32.41-pm-1-1024x768.jpeg",
          caption: "राष्ट्रीय सफाई कर्मचारी आयोग द्वारा सुरक्षा मानकों की समीक्षा",
          date: "27 Jun 2026",
        },
      ],
    },
    activityCorner: {
      heading: "Activity Corner",
      items: [
        {
          day: "28",
          monthYear: "Aug 2026",
          title: "NCSK Review on ₹30 Lakh Sewer Death Compensation Compliance",
          description: "Special review meeting convened with State Principal Secretaries on the implementation of Hon'ble Supreme Court directions for enhanced compensation.",
          href: "/website/organisation/national-commission-for-safai-karamcharis/main-sewer-death",
        },
        {
          day: "15",
          monthYear: "Aug 2026",
          title: "Nationwide Welfare Drive for Sanitation Workers under NAMASTE",
          description: "Distribution of PPE kits, mechanised cleaning equipment, and Ayushman Bharat health cards to core sanitation workers across municipal bodies.",
          href: "/website/schemes-services?org=ncsk",
        },
        {
          day: "04",
          monthYear: "Aug 2026",
          title: "State Monitoring Committee Meeting on Insanitary Latrines Elimination",
          description: "Review of municipal compliance reports under Section 26 of the Prohibition of Employment as Manual Scavengers Act 2013.",
          href: "/website/organisation/national-commission-for-safai-karamcharis/monitoring-committees",
        },
        {
          day: "22",
          monthYear: "Jul 2026",
          title: "National Consultation on Modernisation of Sewer & Septic Cleaning",
          description: "Collaborative symposium on robotics, desilting machinery, and zero-fatality standards in urban local bodies.",
          href: "/website/organisation/national-commission-for-safai-karamcharis/meetings",
        },
      ],
    },
    socialFeed: {
      heading: "Social Media Stream",
      handles: [
        { platform: "facebook", url: "https://www.facebook.com/NCSKIndia", handle: "@NCSKIndia" },
        { platform: "x", url: "https://x.com/ncsk_india", handle: "@ncsk_india" },
        { platform: "youtube", url: "https://www.youtube.com/@ncsk_india", handle: "NCSK India Official" },
      ],
      posts: [
        {
          platform: "x",
          author: "National Commission for Safai Karamcharis",
          handle: "@ncsk_india",
          date: "28 Aug 2026",
          content: "Hon'ble Vice-Chairperson Shri Hardeep Singh Gill chaired a high-level review on welfare measures and the disbursement of ₹30 Lakh compensation under Supreme Court directions in New Delhi.",
          likes: "142",
          shares: "38",
        },
        {
          platform: "facebook",
          author: "National Commission for Safai Karamcharis",
          handle: "NCSK Official",
          date: "20 Aug 2026",
          content: "NCSK conducted on-ground inspection of mechanised cleaning units and distributed safety gear under the NAMASTE scheme to ensure zero human entry in hazardous cleaning.",
          likes: "320",
          shares: "64",
        },
        {
          platform: "youtube",
          author: "National Commission for Safai Karamcharis",
          handle: "NCSK Official Channel",
          date: "12 Aug 2026",
          content: "Glimpses of the 32nd Foundation Day of NCSK and awareness campaign on rehabilitation of sanitation workers and their dependents.",
          likes: "512",
          shares: "91",
        },
      ],
    },
    contact: {
      heading: "Contact",
      action: { label: "View Directory", href: "/website/ncsk-directory" },
      address: "‘B’ Wing, 4th Floor, Lok Nayak Bhawan, Khan Market, New Delhi - 110003",
      supportPhone: "011-24648924",
      supportHours: "Monday to Friday · 9:30 AM – 6:00 PM IST",
      supportEmail: "secy-ncsk@nic.in",
    },
  },

  "national-commission-for-scheduled-castes": {
    logo: "/website/images/organisations/ncsc-logo.png",
    featuredImage: "/website/images/organisations/ncsc-2.png",
    lead: "The National Commission for Scheduled Castes (NCSC) is a constitutional body established under Article 338 of the Constitution of India to safeguard the rights and interests of the Scheduled Castes and the Anglo-Indian community against exploitation and discrimination.",
    aboutHeading: "About the Commission",
    aboutAction: { label: "Know More →", href: "/website/organisation/national-commission-for-scheduled-castes/about-the-commission" },
    aboutHtml: `<p><strong>The National Commission for Scheduled Castes (NCSC)</strong> is a constitutional body established under <strong>Article 338</strong> of the Constitution of India with the objective of safeguarding the rights and interests of the Scheduled Castes and the Anglo-Indian community.</p><p>Its creation reflects the commitment of the framers of the Constitution to ensure social justice, equality, and protection against any form of exploitation or discrimination faced by historically marginalized communities.</p>`,
    aboutHighlights: [
      {
        title: "Constitutional Safeguards",
        description: "Investigating and monitoring all matters relating to safeguards provided for Scheduled Castes under the Constitution.",
        icon: "gavel",
        href: "/website/organisation/national-commission-for-scheduled-castes/about-the-commission",
        ctaLabel: "Learn More",
      },
      {
        title: "Grievance Redressal",
        description: "Inquiring into specific complaints with civil court powers regarding deprivation of rights and safeguards.",
        icon: "support_agent",
        href: "/website/organisation/national-commission-for-scheduled-castes/about-the-commission",
        ctaLabel: "Learn More",
      },
      {
        title: "Socio-Economic Development",
        description: "Participating and advising on the planning process of socio-economic development of Scheduled Castes.",
        icon: "trending_up",
        href: "/website/organisation/national-commission-for-scheduled-castes/state-reviews",
        ctaLabel: "Learn More",
      },
      {
        title: "Annual Presidential Reports",
        description: "Submitting annual reports to the Hon'ble President of India on the working and effectiveness of constitutional safeguards.",
        icon: "description",
        href: "/website/organisation/national-commission-for-scheduled-castes/about-the-commission",
        ctaLabel: "Learn More",
      },
    ],
    facts: [
      { icon: "gavel", value: "Article 338", label: "Constitutional Status" },
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "domain", value: "12 State Offices", label: "Pan-India Reach" },
      { icon: "groups", value: "Scheduled Castes", label: "Who it serves" },
    ],
    nav: [
      {
        label: "ABOUT US",
        items: [
          { label: "About the Commission", href: "#about-the-scheme" },
          { label: "Leadership & Organisation", href: "#leadership" },
          { label: "Functions & History", href: "/website/organisation/national-commission-for-scheduled-castes/about-the-commission" },
          { label: "Right to Information (RTI)", href: "/website/organisation/national-commission-for-scheduled-castes/rti" },
        ],
      },
      {
        label: "OUR WORK & IMPACT",
        items: [
          { label: "Major Activities", href: "#national-initiatives" },
          { label: "Annual Reports", href: "#annual-reports" },
          { label: "State Offices", href: "/website/organisation/national-commission-for-scheduled-castes/state-office-ahmedabad" },
          { label: "Spot Visits by Commission", href: "/website/organisation/national-commission-for-scheduled-castes/spot-visits-by-the-commission" },
          { label: "PSU / PSB Reviews", href: "/website/organisation/national-commission-for-scheduled-castes/psu-psb-reviews" },
        ],
      },
      {
        label: "CONNECT & ENGAGE",
        items: [
          { label: "Contact", href: "#contact" },
          { label: "Official NCSC Portal", href: "https://ncsc.nic.in", external: true },
        ],
      },
    ],
    leadership: {
      heading: "Leadership & Organisation",
      description: "The Commission comprises a Chairperson, Vice-Chairperson, and Members appointed by the Hon'ble President of India under Article 338.",
      action: { label: "Know More →", href: "/website/whos-who" },
      items: [
        {
          name: "Shri Kishor Makwana",
          designation: "Hon'ble Chairperson",
          roleTag: "Hon'ble Chairperson",
          image: "/website/images/organisations/shri-kishor-makwana.png",
        },
        {
          name: "Shri Love Kush Kumar",
          designation: "Hon'ble Member",
          roleTag: "Hon'ble Member",
          image: "/website/images/organisations/shri-love-kush-kumar.png",
        },
        {
          name: "Shri Vaddepalli Ramchander",
          designation: "Hon'ble Member",
          roleTag: "Hon'ble Member",
          image: "/website/images/organisations/shri-vaddepalli-ramchander.png",
        },
        {
          name: "Dr. Partha Biswas",
          designation: "Joint Secretary to Commission",
          roleTag: "Joint Secretary",
          image: "/website/images/organisations/dr-partha-biswas.jpg",
        },
      ],
    },
    initiatives: {
      heading: "Major Activities",
      description: "On-ground investigations, institutional state reviews, and public enterprise oversight conducted by the Commission.",
      action: { label: "View All →", href: "/website/schemes-services" },
      items: [
        {
          title: "Spot Visits by the Commission",
          description: "On-site inquiry and fact-finding visits conducted across various states to investigate atrocities and deprivation of rights.",
          image: "/website/images/organisations/spot.png",
          href: "/website/organisation/national-commission-for-scheduled-castes/spot-visits-by-the-commission",
          actionLabel: "View Details",
        },
        {
          title: "PSU / PSB Reservation Policy Reviews",
          description: "Review meetings undertaken to assess and monitor implementation of reservation policy and employee safeguards in Public Sector Undertakings and Banks.",
          image: "/website/images/organisations/activity-img-2.png",
          href: "/website/organisation/national-commission-for-scheduled-castes/psu-psb-reviews",
          actionLabel: "View Details",
        },
        {
          title: "State Development & Safeguard Reviews",
          description: "State-level comprehensive reviews evaluating progress of welfare schemes and implementation of constitutional safeguards.",
          image: "/website/images/organisations/activity-img-3.png",
          href: "/website/organisation/national-commission-for-scheduled-castes/state-reviews",
          actionLabel: "View Details",
        },
      ],
    },
    downloads: {
      heading: "Reports & Documentation",
      groups: [
        {
          id: "annual-reports",
          heading: "Annual Reports",
          viewAllHref: "/website/publications",
          items: [
            {
              href: "https://ncsc.nic.in/files/13th_Annual_Report_2021-22.pdf",
              label: "Thirteenth Annual Report of NCSC (2021–22)",
              kind: "pdf",
            },
            {
              href: "https://ncsc.nic.in/files/13th_Annual_Report_2020-21.pdf",
              label: "Thirteenth Annual Report of NCSC (2020–21)",
              kind: "pdf",
            },
            {
              href: "https://ncsc.nic.in/files/12th_Annual_Report_2019-20.pdf",
              label: "Twelfth Annual Report of NCSC (2019–20)",
              kind: "pdf",
            },
            {
              href: "https://ncsc.nic.in/files/12th_Annual_Report_2018-19.pdf",
              label: "Twelfth Annual Report of NCSC (2018–19)",
              kind: "pdf",
            },
          ],
        },
      ],
    },
    contact: {
      heading: "Contact & Headquarters",
      address: "5th Floor, Lok Nayak Bhawan, Khan Market, New Delhi - 110003",
      regionalOffices: "12 State Offices located across Agartala, Ahmedabad, Bengaluru, Chandigarh, Chennai, Guwahati, Hyderabad, Kolkata, Lucknow, Patna, Pune, and Thiruvananthapuram.",
      supportPhone: "011-24632249",
      supportHours: "Monday to Friday · 9:30 AM – 6:00 PM IST",
      supportEmail: "feedback-ncsc@nic.in",
    },
  },

  "national-commission-for-backward-classes-ncbc": {
    logo: "/website/images/org-logos/ncbc.png",
    lead: "The National Commission for Backward Classes (NCBC) is a constitutional body established under Article 338B of the Constitution of India (102nd Constitutional Amendment Act, 2018) to investigate grievances, examine requests for inclusion and exclusion in the Central List of Other Backward Classes, and advise the Union on socio-economic development policies for socially and educationally backward classes.",
    aboutHeading: "About the Commission",
    aboutAction: { label: "Know More →", href: "/website/organisation/national-commission-for-backward-classes-ncbc/about-us" },
    aboutHtml: `<p><strong>The National Commission for Backward Classes (NCBC)</strong> was initially constituted as a statutory body under the National Commission for Backward Classes Act, 1993. By the 102nd Constitutional Amendment Act, 2018, Article 338B was inserted into the Constitution of India, conferring constitutional status on the Commission.</p><p>Under Article 338B, the Commission is empowered to investigate and monitor all matters relating to the safeguards provided for socially and educationally backward classes under the Constitution or under any other law, participate and advise on the planning process of socio-economic development, and evaluate the progress of their development under the Union and any State.</p>`,
    facts: [
      { icon: "account_balance", value: "Article 338B", label: "Constitutional status" },
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "list_alt", value: "Pan-India OBC List", label: "Central list" },
      { icon: "groups", value: "Backward Classes", label: "Who it serves" },
    ],
    nav: [
      {
        label: "ABOUT US",
        items: [
          { label: "About the Commission", href: "#about-the-scheme" },
          { label: "Rules of Procedure", href: "/website/organisation/national-commission-for-backward-classes-ncbc/rules-of-procedure-in-ncbc-copy-2" },
        ],
      },
      {
        label: "OUR WORK & IMPACT",
        items: [
          { label: "Constitutional Functions", href: "#components" },
          { label: "Central List of OBCs", href: "/website/organisation/national-commission-for-backward-classes-ncbc/central-list-of-obcs" },
          { label: "Gazette Notifications", href: "/website/organisation/national-commission-for-backward-classes-ncbc/gazette-notifications" },
          { label: "Tour Reports & State Reviews", href: "/website/organisation/national-commission-for-backward-classes-ncbc/tour-reports" },
          { label: "Formal Commission Advices", href: "/website/organisation/national-commission-for-backward-classes-ncbc/advices-2" },
        ],
      },
      {
        label: "CONNECT & ENGAGE",
        items: [
          { label: "Commission Office & Contact", href: "#contact" },
          { label: "Official NCBC Legacy Portal", href: "https://ncbc.nic.in", external: true },
        ],
      },
    ],
    components: {
      heading: "Constitutional Functions & Repositories",
      items: [
        {
          title: "Central List of OBCs",
          description: "Official state-wise repository of notified Other Backward Classes in India.",
          icon: "menu_book",
          slug: "national-commission-for-backward-classes-ncbc/central-list-of-obcs",
        },
        {
          title: "Tour Reports & State Reviews",
          description: "67 inspection reports reviewing OBC reservation compliance in public employment and education.",
          icon: "travel_explore",
          slug: "national-commission-for-backward-classes-ncbc/tour-reports",
        },
        {
          title: "Rules of Procedure",
          description: "Statutory regulations governing inquiries, sittings, and formal advice tendering.",
          icon: "gavel",
          slug: "national-commission-for-backward-classes-ncbc/rules-of-procedure-in-ncbc-copy-2",
        },
      ],
    },
    contact: {
      heading: "Head Office & Contact Details",
      supportPhone: "011-26185897",
      supportHours: "Monday to Friday · 9:30 AM – 6:00 PM IST",
      supportEmail: "ncbc-sec@nic.in",
      blocks: [
        {
          heading: "Commission Office",
          people: [
            {
              name: "Secretary, NCBC",
              designation: "Secretary to the Commission (Rank of Secretary to GoI)",
              phone: "011-26185897",
              email: "ncbc-sec@nic.in",
            },
          ],
        },
      ],
    },
  },

  "national-institute-of-social-defence": {
    logo: "/website/images/org-logos/nisd.png",
    lead: "National Institute of Social Defence (NISD) is an autonomous body and the nodal training and research institute of the Ministry of Social Justice and Empowerment, delivering capacity building, policy research, and intervention programmes in Social Defence across Senior Citizens welfare, Drug De-addiction, and Transgender rehabilitation.",
    aboutHeading: "About the Institute",
    aboutAction: { label: "Know More →", href: "/website/organisation/national-institute-of-social-defence/about-us" },
    aboutHtml: `<p><strong>National Institute of Social Defence (NISD)</strong> is an autonomous body under the Ministry of Social Justice and Empowerment, Government of India. It is the central advisory body for the Ministry on matters relating to the prevention of social defence issues, drug demand reduction, welfare of senior citizens, and transgender persons.</p><p>NISD conducts human resource development programmes in the field of social defence, undertakes research and evaluation surveys, and assists in the formulation of policies and guidelines for government and non-governmental organisations.</p>`,
    facts: [
      { icon: "location_on", value: "Dwarka, New Delhi", label: "Headquarters" },
      { icon: "school", value: "Apex Training Institute", label: "Institutional role" },
      { icon: "support_agent", value: "Elderline 14567", label: "National helpline" },
      { icon: "groups", value: "Social Defence", label: "Focus sector" },
    ],
    nav: [
      {
        label: "ABOUT US",
        items: [
          { label: "About the Institute", href: "#about-the-scheme" },
        ],
      },
      {
        label: "OUR WORK & IMPACT",
        items: [
          { label: "Flagship Facilities & Services", href: "#components" },
          { label: "Elderline 14567 (Senior Citizens)", href: "/website/organisation/national-institute-of-social-defence/elderline-14567" },
          { label: "Experience Showcase", href: "/website/organisation/national-institute-of-social-defence/experience-showcase" },
          { label: "Studio & Auditorium Rental Services", href: "/website/organisation/national-institute-of-social-defence/rental-services" },
        ],
      },
      {
        label: "CONNECT & ENGAGE",
        items: [
          { label: "Contact & Location", href: "#contact" },
          { label: "Official NISD Portal", href: "https://nisd.gov.in", external: true },
        ],
      },
    ],
    components: {
      heading: "Flagship Facilities & Services",
      items: [
        {
          title: "Elderline 14567",
          description: "National toll-free helpline providing information, guidance, emotional support, and field rescue for senior citizens.",
          icon: "call",
          slug: "national-institute-of-social-defence/elderline-14567",
        },
        {
          title: "Studio & Auditorium Rentals",
          description: "State-of-the-art auditorium and media studio facilities available for official events and training.",
          icon: "stadium",
          slug: "national-institute-of-social-defence/rental-services",
        },
        {
          title: "Experience Showcase",
          description: "Compendium of senior citizens' contributions, active ageing initiatives, and mentorship.",
          icon: "psychology",
          slug: "national-institute-of-social-defence/experience-showcase",
        },
      ],
    },
    contact: {
      heading: "Campus & Contact Details",
      supportPhone: "011-20892011",
      supportHours: "Monday to Friday · 9:30 AM – 6:00 PM IST",
      supportEmail: "support-nisd@gov.in",
    },
  },

  "support-for-marginalized-individuals-for-livelihood-and-enterprise-smile": {
    logo: "/website/images/org-logos/smile.png",
    lead: "Support for Marginalized Individuals for Livelihood and Enterprise (SMILE) is a comprehensive umbrella scheme providing welfare and rehabilitation for transgender persons and persons engaged in the act of begging, encompassing shelter, healthcare, education, skilling, and enterprise support.",
    aboutHeading: "About the SMILE Scheme",
    aboutAction: { label: "Know More →", href: "/website/organisation/support-for-marginalized-individuals-for-livelihood-and-enterprise-smile/about-us" },
    aboutHtml: `<p><strong>Support for Marginalized Individuals for Livelihood and Enterprise (SMILE)</strong> is a comprehensive umbrella scheme formulated by the Ministry of Social Justice and Empowerment. It incorporates two sub-schemes: <em>Comprehensive Rehabilitation for Welfare of Transgender Persons</em> and <em>Comprehensive Rehabilitation of persons engaged in the act of Begging</em>.</p><p>The scheme focuses extensively on rehabilitation, provision of medical facilities, counselling, basic education, skill development, economic linkages, and shelter with the support of State Governments, UTs, Local Urban Bodies, and Non-Governmental Organisations.</p>`,
    facts: [
      { icon: "groups", value: "Transgender & Destitute", label: "Target beneficiaries" },
      { icon: "location_city", value: "30 Pilot Cities", label: "Begging eradication" },
      { icon: "handshake", value: "Shelter & Livelihood", label: "Scheme pillars" },
      { icon: "account_balance", value: "Social Justice & Empowerment", label: "Implementing ministry" },
    ],
    nav: [
      {
        label: "ABOUT US",
        items: [
          { label: "About the Scheme", href: "#about-the-scheme" },
          { label: "Core Implementation Areas", href: "#components" },
        ],
      },
      {
        label: "OUR WORK & IMPACT",
        items: [
          { label: "List of 30 Pilot Cities", href: "/website/organisation/support-for-marginalized-individuals-for-livelihood-and-enterprise-smile/list-of-cities" },
          { label: "Consent & Verification Forms", href: "/website/organisation/support-for-marginalized-individuals-for-livelihood-and-enterprise-smile/consent-form" },
        ],
      },
      {
        label: "CONNECT & ENGAGE",
        items: [
          { label: "Scheme Nodal Desk", href: "#contact" },
          { label: "Official SMILE Portal", href: "https://smile.dosje.gov.in", external: true },
        ],
      },
    ],
    components: {
      heading: "Core Implementation Areas",
      items: [
        {
          title: "30 Pilot Cities Survey & Rehabilitation",
          description: "Targeted action plans and hotspot mapping across 30 major municipal corporations.",
          icon: "location_city",
          slug: "support-for-marginalized-individuals-for-livelihood-and-enterprise-smile/list-of-cities",
        },
        {
          title: "Beneficiary Consent & Enrolment",
          description: "Standard operating procedures and consent framework for rehabilitation pathways.",
          icon: "assignment",
          slug: "support-for-marginalized-individuals-for-livelihood-and-enterprise-smile/consent-form",
        },
      ],
    },
    contact: {
      heading: "Scheme Nodal Desk",
      supportPhone: "011-23381643",
      supportHours: "Monday to Friday · 9:30 AM – 6:00 PM IST",
      supportEmail: "smile-support@gov.in",
    },
  },

  "national-portal-for-transgender-persons": {
    logo: "/website/images/org-logos/dwbdnc.png",
    lead: "The National Portal for Transgender Persons is a dedicated end-to-end digital platform developed under the Transgender Persons (Protection of Rights) Act, 2019, enabling transgender individuals to apply for, track, and download Certificates of Identity and Identity Cards without physical interface.",
    aboutHeading: "About the Portal",
    aboutAction: { label: "Know More →", href: "/website/organisation/national-portal-for-transgender-persons/about-us" },
    facts: [
      { icon: "verified_user", value: "TG Persons Act 2019", label: "Governing legislation" },
      { icon: "devices", value: "Paperless Digital", label: "Portal mode" },
      { icon: "diversity_1", value: "Transgender Persons", label: "Who it serves" },
      { icon: "badge", value: "National ID Card", label: "Statutory outcome" },
    ],
    nav: [
      {
        label: "About Portal",
        items: [
          { label: "About National Portal", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/national-portal-for-transgender-persons/about-us" },
        ],
      },
      {
        label: "Statutory Documents",
        items: [
          { label: "Affidavit Formats & Downloads", href: "/website/organisation/national-portal-for-transgender-persons/downloads" },
        ],
      },
    ],
    components: {
      heading: "Downloads & Statutory Resources",
      items: [
        {
          title: "Affidavit Formats & Statutory Downloads",
          description: "Download official Form-1 affidavits, Section 6/7 certificates, and medical verification templates.",
          icon: "download",
          slug: "national-portal-for-transgender-persons/downloads",
        },
      ],
    },
  },

  "e-utthaan": {
    logo: "/website/images/org-logos/pm-ajay.png",
    lead: "e-Utthaan is the dedicated national monitoring portal for the Allocation for Welfare of Scheduled Castes (AWSC) / Scheduled Caste Sub-Plan (SCSP), tracking financial sanctions, expenditure, physical progress, and scheme outcomes across all Union Ministries and Departments in alignment with NITI Aayog guidelines.",
    aboutHeading: "About e-Utthaan",
    aboutAction: { label: "Know More →", href: "/website/organisation/e-utthaan/about-us" },
    facts: [
      { icon: "account_balance", value: "All Central Ministries", label: "Coverage scope" },
      { icon: "insights", value: "NITI Aayog Framework", label: "Governance model" },
      { icon: "payments", value: "AWSC / SCSP", label: "Fund allocation" },
      { icon: "query_stats", value: "Real-time Monitoring", label: "Data system" },
    ],
    nav: [
      {
        label: "About e-Utthaan",
        items: [
          { label: "Platform Overview", href: "#about-the-scheme" },
          { label: "About DAPSC", href: "/website/organisation/e-utthaan/about-us" },
        ],
      },
      {
        label: "Financial & Progress Reports",
        items: [
          { label: "Financial Summary", href: "/website/organisation/e-utthaan/e-utthan-financial-summary" },
          { label: "Ministry Sanction Details", href: "/website/organisation/e-utthaan/e-utthan-ministry-sanction-details" },
          { label: "State-wise Financial Report", href: "/website/organisation/e-utthaan/e-utthan-ministry-scheme-state-wise-financial-report" },
          { label: "Physical Progress Report", href: "/website/organisation/e-utthaan/e-utthan-physical-progress" },
          { label: "Outcome Management", href: "/website/organisation/e-utthaan/e-utthan-manage-outcome" },
          { label: "Statement 10A Report", href: "/website/organisation/e-utthaan/e-utthan-statement-10a" },
          { label: "NITI Aayog Mandate Report", href: "/website/organisation/e-utthaan/e-utthan-niti-ayog-mandate-report" },
        ],
      },
    ],
    components: {
      heading: "Reporting Modules & Query Interfaces",
      items: [
        {
          title: "Financial Summary Module",
          description: "Track budget estimates, revised estimates, releases, and expenditure under AWSC.",
          icon: "account_balance_wallet",
          slug: "e-utthaan/e-utthan-financial-summary",
        },
        {
          title: "Ministry Sanction Details",
          description: "Detailed scheme-wise sanction orders and fund disbarments across Ministries.",
          icon: "receipt_long",
          slug: "e-utthaan/e-utthan-ministry-sanction-details",
        },
        {
          title: "Physical Progress & Outcomes",
          description: "Monitor beneficiary coverage, infrastructure milestones, and Output-Outcome indicators.",
          icon: "insights",
          slug: "e-utthaan/e-utthan-physical-progress",
        },
      ],
    },
  },

  "senior-citizens-welfarescw": {
    logo: "/website/images/org-logos/scw.png",
    lead: "Senior Citizens Welfare Division of the Ministry of Social Justice & Empowerment develops and administers national policies, programs, and support schemes for the welfare, healthcare, active ageing, and security of older persons across India.",
    aboutHeading: "About Senior Citizens Welfare",
    aboutAction: { label: "Know More →", href: "/website/organisation/senior-citizens-welfarescw/about-us" },
    facts: [
      { icon: "elderly", value: "Senior Citizens (60+)", label: "Target group" },
      { icon: "account_balance", value: "Social Justice & Empowerment", label: "Ministry" },
      { icon: "volunteer_activism", value: "Elderline & SAGE", label: "Flagship initiatives" },
      { icon: "favorite", value: "Active Ageing", label: "Focus area" },
    ],
    nav: [
      {
        label: "ABOUT US",
        items: [
          { label: "About Senior Citizens Welfare", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/senior-citizens-welfarescw/about-us" },
          { label: "Community & Welfare Initiatives", href: "#components" },
        ],
      },
      {
        label: "OUR WORK & IMPACT",
        items: [
          { label: "Anubhav Bolta Hai Workshops", href: "/website/organisation/senior-citizens-welfarescw/anubhav-bolta-hai-events" },
          { label: "Pearls of Wisdom", href: "/website/organisation/senior-citizens-welfarescw/pearls-of-wisdom" },
        ],
      },
      {
        label: "CONNECT & ENGAGE",
        items: [
          { label: "Contact Division", href: "#contact" },
        ],
      },
    ],
    components: {
      heading: "Community & Welfare Initiatives",
      items: [
        {
          title: "Anubhav Bolta Hai",
          description: "Interactive dialogue workshops and intergenerational bonding camps.",
          icon: "record_voice_over",
          slug: "senior-citizens-welfarescw/anubhav-bolta-hai-events",
        },
        {
          title: "Pearls of Wisdom",
          description: "Compendium of life experiences, community wisdom, and active ageing reflections.",
          icon: "auto_stories",
          slug: "senior-citizens-welfarescw/pearls-of-wisdom",
        },
      ],
    },
  },

  "national-scheduled-castes-finance-and-development-corporation": {
    logo: "/website/images/org-logos/nsfdc.png",
    lead: "National Scheduled Castes Finance and Development Corporation (NSCFDC) is a Central Public Sector Enterprise under the Ministry of Social Justice & Empowerment, dedicated to financing economic empowerment schemes, concessional credit, and skill development programs for Scheduled Castes.",
    aboutHeading: "About NSCFDC",
    aboutAction: { label: "Know More →", href: "/website/organisation/national-scheduled-castes-finance-and-development-corporation/about-us" },
    facts: [
      { icon: "account_balance", value: "CPSE (Schedule 'C')", label: "Corporate entity" },
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "currency_rupee", value: "Concessional Loans", label: "Credit facility" },
      { icon: "groups", value: "Scheduled Castes", label: "Target group" },
    ],
    nav: [
      {
        label: "About NSCFDC",
        items: [
          { label: "About Corporation", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/national-scheduled-castes-finance-and-development-corporation/about-us" },
          { label: "Quick Links & Portals", href: "/website/organisation/national-scheduled-castes-finance-and-development-corporation/quick-links" },
        ],
      },
    ],
    components: {
      heading: "Services & Channels",
      items: [
        {
          title: "Quick Links & State Channelizing Agencies",
          description: "Access portals for skilling schemes, loan applications, and State Channelizing Agencies.",
          icon: "link",
          slug: "national-scheduled-castes-finance-and-development-corporation/quick-links",
        },
      ],
    },
  },

  "national-safai-karamcharis-finance-development-corporation": {
    logo: "/website/images/org-logos/nskfdc.png",
    lead: "National Safai Karamcharis Finance & Development Corporation (NSKFDC) is an apex corporation under the Ministry of Social Justice & Empowerment, providing concessional financial assistance, skilling, and mechanised cleaning equipment loans for the socio-economic upliftment of Safai Karamcharis, Manual Scavengers, and their dependants.",
    aboutHeading: "About NSKFDC",
    aboutAction: { label: "Know More →", href: "/website/organisation/national-safai-karamcharis-finance-development-corporation/about-us" },
    facts: [
      { icon: "account_balance", value: "Apex Corporation", label: "Entity type" },
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "handyman", value: "NAMASTE Scheme", label: "Mechanization" },
      { icon: "groups", value: "Safai Karamcharis", label: "Who it serves" },
    ],
    nav: [
      {
        label: "About NSKFDC",
        items: [
          { label: "About Corporation", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/national-safai-karamcharis-finance-development-corporation/about-us" },
        ],
      },
    ],
  },

  "national-backward-classes-financeand-development-corporationnbcfdc": {
    logo: "/website/images/org-logos/nbcfdc.png",
    lead: "National Backward Classes Finance & Development Corporation (NBCFDC) is a Government of India undertaking under the Ministry of Social Justice & Empowerment, promoting economic empowerment and self-employment ventures for backward classes living below double the poverty line.",
    aboutHeading: "About NBCFDC",
    aboutAction: { label: "Know More →", href: "/website/organisation/national-backward-classes-financeand-development-corporationnbcfdc/about-us" },
    facts: [
      { icon: "account_balance", value: "Govt of India Undertaking", label: "Entity type" },
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "trending_up", value: "Microfinance & Term Loans", label: "Financial assistance" },
      { icon: "groups", value: "Backward Classes", label: "Who it serves" },
    ],
    nav: [
      {
        label: "About NBCFDC",
        items: [
          { label: "About Corporation", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/national-backward-classes-financeand-development-corporationnbcfdc/about-us" },
        ],
      },
    ],
  },

  "dr-ambedkar-foundation": {
    logo: "/website/images/org-logos/daf.png",
    lead: "Dr. Ambedkar Foundation (DAF) was established to implement programs and activities for furthering the ideology, philosophy, and message of Babasaheb Dr. B. R. Ambedkar, promoting social justice, equality, and national integration.",
    aboutHeading: "About Dr. Ambedkar Foundation",
    aboutAction: { label: "Know More →", href: "/website/organisation/dr-ambedkar-foundation/about-us" },
    facts: [
      { icon: "history_edu", value: "Babasaheb Ideology", label: "Core mandate" },
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "school", value: "Chairs & Awards", label: "Academic programs" },
      { icon: "account_balance", value: "Social Justice & Empowerment", label: "Ministry" },
    ],
    nav: [
      {
        label: "About Foundation",
        items: [
          { label: "About DAF", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/dr-ambedkar-foundation/about-us" },
        ],
      },
    ],
  },

  "dr-ambedkar-international-centre": {
    logo: "/website/images/org-logos/daic.png",
    lead: "Dr. Ambedkar International Centre (DAIC) is a premier autonomous institution under the Ministry of Social Justice & Empowerment, established as a centre of excellence for socio-economic research, policy analysis, and national dialogue on inclusive development.",
    aboutHeading: "About DAIC",
    aboutAction: { label: "Know More →", href: "/website/organisation/dr-ambedkar-international-centre/about-us" },
    facts: [
      { icon: "domain", value: "Janpath, New Delhi", label: "Location" },
      { icon: "menu_book", value: "Centre of Excellence", label: "Research institute" },
      { icon: "groups", value: "Policy & Academia", label: "Stakeholders" },
      { icon: "stadium", value: "Convention Facilities", label: "Infrastructure" },
    ],
    nav: [
      {
        label: "About Centre",
        items: [
          { label: "About DAIC", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/dr-ambedkar-international-centre/about-us" },
        ],
      },
    ],
  },

  "babu-jagjivan-ram-national-foundation-jrf": {
    logo: "/website/images/org-logos/jrf.png",
    lead: "Babu Jagjivan Ram National Foundation (BJRNF) was established to propagate the ideals and philosophy of Babu Jagjivan Ram, working towards social justice, equality, eradication of untouchability, and the empowerment of disadvantaged sections of society.",
    aboutHeading: "About BJRNF",
    aboutAction: { label: "Know More →", href: "/website/organisation/babu-jagjivan-ram-national-foundation-jrf/about-bjrnf" },
    facts: [
      { icon: "history_edu", value: "Social Justice Legacy", label: "Core mission" },
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "hotel", value: "Hostel Schemes", label: "Key initiative" },
      { icon: "account_balance", value: "Social Justice & Empowerment", label: "Ministry" },
    ],
    nav: [
      {
        label: "About Foundation",
        items: [
          { label: "About BJRNF", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/babu-jagjivan-ram-national-foundation-jrf/about-bjrnf" },
        ],
      },
    ],
  },

  "nasha-mukt-bharat-abhiyaan": {
    logo: "/website/images/org-logos/nmba.png",
    lead: "Nasha Mukt Bharat Abhiyaan (NMBA) is a flagship nationwide movement launched by the Ministry of Social Justice & Empowerment to curb drug demand and build drug-free communities across 372 vulnerable districts through youth mobilization, educational institutions, and community outreach.",
    aboutHeading: "About the Movement",
    aboutAction: { label: "Know More →", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/about-us" },
    facts: [
      { icon: "location_city", value: "372 Districts", label: "Nationwide coverage" },
      { icon: "groups", value: "Youth & Women Led", label: "Mobilization" },
      { icon: "volunteer_activism", value: "Demand Reduction", label: "Primary strategy" },
      { icon: "account_balance", value: "Social Justice & Empowerment", label: "Ministry" },
    ],
    nav: [
      {
        label: "About NMBA",
        items: [
          { label: "About the Movement", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/about-us" },
        ],
      },
    ],
  },
};

export function getOrganisationDetail(slug?: string): OrganisationDetail | undefined {
  if (!slug) return undefined;
  const exact = ORGANISATION_DETAILS[slug];
  if (exact) return exact;
  const parts = slug.split("/");
  const root = parts[0];
  if (root && root in ORGANISATION_DETAILS) {
    return ORGANISATION_DETAILS[root];
  }
  return undefined;
}

