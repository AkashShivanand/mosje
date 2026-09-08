/* ds-exempt-start(hindi-source): organisation records hold Hindi names as DATA; the components that render them mark the run with lang="hi" */
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

import type { BrandGlyphName } from "@mosje/design-system";

/**
 * A signed statement from a named office-holder, as the source page's
 * "Messages" carousel publishes them.
 *
 * A quote is NOT a leader card. `OrgLeader` describes who somebody is — name,
 * designation, telephone; this describes something they said about the scheme.
 * Rendering the second through the first drops the quote, which is the only
 * part a reader came for, and that is precisely how five ministerial statements
 * went missing from the NMBA page.
 */
export interface OrgMessage {
  quote: string;
  name: string;
  designation: string;
}

/** A subject tag on the source site, linking into its tag index. */
export interface OrgTag {
  label: string;
  href: string;
}

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
  /**
   * A TITLE, not a file name. "Presentation" is a file name: it told a reader
   * nothing about what was inside, who it was for, or whether it was current.
   * Where the department's own name is longer or more formal, keep it in
   * `officialName` so nothing is lost.
   */
  label: string;
  href: string;
  /**
   * What the reader is about to open. Taken from the destination, never
   * guessed: `page` is a web page, the rest are files.
   */
  kind: "pdf" | "pptx" | "image" | "page";
  /**
   * The filter chip this sits under in the library band. Declared, never
   * inferred from the file type — "which shelf is this on" is an editorial
   * judgement and a `.pdf` extension does not make it.
   */
  group?: string;
  /**
   * The small line above the title: a publication date, or who the file is for.
   * It used to read "PDF", directly above a button reading "Download PDF" — the
   * card spent its most valuable line restating its own button.
   */
  meta?: string;
  /** The department's own name for the file, where `label` is a plainer one. */
  officialName?: string;
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
  /**
   * The call to action the source page places ABOVE its own title.
   *
   * NMBA opens with a green band — "Join Nasha Mukt Bharat Abhiyaan", the
   * volunteer invitation, a Register Now button and the national de-addiction
   * helpline — and it sits above the h1, not below it. It was folded into the
   * hero's quick actions, which put the campaign's front door below the fold of
   * the page it fronts and lost the invitation entirely.
   */
  joinBanner?: {
    heading: string;
    text: string;
    action: { label: string; href: string; external?: boolean };
    helplineLabel: string;
    helplineNumber: string;
    /**
     * A QR that scans to the SAME destination as `action`.
     *
     * The source band leads with one, and it is the only element of that band
     * this estate had never cloned. It is drawn decorative — the code encodes a
     * URL that is already a named link beside it, so describing the picture
     * would announce the destination twice to a reader who cannot scan it.
     *
     * Dropped below 1024, where the reader is holding the device that would
     * have scanned it.
     */
    qrSrc?: string;
  };
  /**
   * Photographs for the header's circular carousel, replacing the still
   * portrait — the landing header's second media variant.
   *
   * The source cycles four pictures of the campaign in that circle. Every slide
   * carries its own `alt`, because a carousel is not decorative the way a
   * single portrait is: a reader is told which of the four they are on.
   */
  heroSlides?: { src: string; alt: string }[];
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
  /**
   * Ingested section headings to leave OUT of the About band, because a real
   * component further down the page now renders that content properly.
   *
   * Matched case- and punctuation-insensitively against the scraped heading.
   * Use it only in that exact case — the scrape captured a section as a husk
   * and something better replaces it. NMBA's "Gallery" arrived as three dates
   * and three captions with no photographs, its "Messages" arrived empty, and
   * its "Legend" arrived as a colour key to a map that was never ingested. Each
   * is now drawn from this record instead, and listing the heading here stops
   * the husk rendering twice.
   *
   * It is NOT a way to hide content the estate would rather not show.
   */
  hideIngestedSections?: string[];
  /**
   * Heading for the highlight cards, where they are a named section of the
   * source page rather than a loose set of points. NMBA's six institution types
   * are published under "Institutions for Drug Demand Reduction Supported by
   * the Ministry"; without this the cards arrive headless and a reader has no
   * idea what the six things have in common.
   */
  aboutHighlightsHeading?: string;
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
  /**
   * THE ORGANISATION'S OWN NOTICE BOARD — the "What's New" strip.
   *
   * Requested 2026-09-07: a division uploads a notice or an advertisement about
   * its own scheme and, today, the only place it surfaces is the estate-wide
   * document index. A citizen who came to the Abhiyaan's page for the Abhiyaan's
   * notices has no reason to look there.
   *
   * SPEC, NOT A LIST. It matches the same way `circulars` and `resources` do —
   * a `documents.json` category plus case-insensitive title substrings, both of
   * which must hit — so the strip stays current through a re-ingest and nobody
   * has to re-type a notice into this file. Eighteen NMBA/NAPDDR notices are
   * already in the ingest; none of them were reachable from this page.
   *
   * THE THIN SHAPE, DELIBERATELY. `Ticker` draws two: `horizontal` is a 72px
   * bar carrying one notice at a time, `vertical` is the stacked panel. The
   * panel is what the site home is moving to, and it was explicitly ruled out
   * here — an organisation page's first fold is already carrying a campaign
   * band, a hero and a fact strip, and a second full-height panel in it would
   * cost more than the notices are worth. The bar is `limit` notices deep with
   * a route to the rest.
   */
  whatsNew?: {
    /** The plinth's name. @default "What's New" */
    label?: string;
    category: string;
    match: string[];
    viewAllHref: string;
    /** How many notices the strip carries. @default 6 */
    limit?: number;
  };
  /**
   * A TIME-LIMITED campaign ribbon, between the header band and the page's data.
   *
   * Requested 2026-09-07 for the Abhiyaan's sixth-anniversary observance: a thin
   * running strip inviting the organisations taking part to file their pre-event
   * details, sitting "between the blue section and the data section".
   *
   * TWO ROUTES, BECAUSE THE TWO AUDIENCES SIGN IN DIFFERENTLY, and that was
   * settled in the same meeting. A line Ministry or Department already holds an
   * administrative account and files through it; an autonomous body, a chamber
   * of commerce or a corporate participant holds no account at all and files on
   * the open activities register. One button for both would send half the
   * readers to a login they cannot pass.
   *
   * A BUTTON AND A LINK, NOT TWO BUTTONS. `ActionBanner`'s own contract states
   * the reason and it applies here: "a banner with two equal buttons has no call
   * to action — it has a decision", and the fix is "a text link beside the
   * button, not a second button". The button carries the majority route; the
   * link names the audience the button is wrong for, in that audience's own
   * words, so the reader who needs it recognises themselves in it.
   *
   * IT IS TEMPORARY AND IT SAYS SO. `until` is the observance's own end date,
   * printed inside the sentence rather than as a badge, and the strip is
   * dismissible — the same reasoning as the join banner's campaign half, and the
   * same in-memory state, so a reader pushes it aside for this visit and does
   * not switch off a departmental announcement for good with one click.
   *
   * DELETE THE BLOCK WHEN THE WINDOW CLOSES. Nothing here expires on its own,
   * and that is deliberate: a date comparison would silently remove a campaign
   * the Department may have extended, which is a worse failure than a strip
   * somebody has to take down.
   */
  eventRibbon?: {
    /** The occasion, above the invitation. */
    eyebrow: string;
    /** The invitation, one sentence. */
    heading: string;
    /** Displayed end of the window — "30 September 2026". */
    until?: string;
    /** The majority route. */
    action: { label: string; href: string; external?: boolean };
    /** The other audience, named in its own words. */
    altAction?: { label: string; href: string; external?: boolean };
  };
  downloads?: {
    heading: string;
    description?: string;
    /**
     * Chip order, most-wanted first — the publisher's own, where it has one.
     *
     * Omit it and the estate's default order applies, which leads with
     * Guidelines and Circulars. That is right for a body whose documents are one
     * undifferentiated pile and wrong for one that leads with something else:
     * NMBA's source page opens with IEC material, and reordering its chips to
     * put Circulars first would be the estate imposing its filing system on the
     * Department's.
     *
     * `"tabs"` KEEPS THE PUBLISHER'S ARRANGEMENT AND STOPS IT COSTING THE PAGE
     * 2,400px. A `"sections"` mode used to sit here and rendered each group as
     * its own full-width band; it was removed on 8 September because six
     * top-level headings broke the side rail's contract — the rail offered one
     * "Documents & Downloads" entry pointing at an id that mode never rendered.
     * Tabs answer both halves of that: ONE section carrying the anchor, and the
     * six headings kept as the six tabs, in the source's own order, so a reader
     * who came for the newsletter presses the word "Newsletter".
     *
     * `"library"` (the default, and what every other organisation uses) merges
     * every group into one filterable shelf with counted chips, and — since
     * `groupViewAll` — a route out that follows the selected chip.
     */
    layout?: "library" | "tabs";
    /*
     * Chip order for the `library` layout. Names are the ITEM `group` values,
     * which is what the chips are built from — not the group headings, though
     * on a well-formed record they match.
     *
     * `tabs` does NOT read this: it takes its order from `groups`, which is the
     * source's own. Two lists of the same order would be two things to keep in
     * step, and this file has already paid for that once.
     */
    groupOrder?: string[];
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
    /**
     * Every mark `BrandGlyph` draws. It used to be facebook / x / youtube only,
     * which quietly excluded the two channels NMBA leads with — the WhatsApp
     * channel and Instagram — from a page whose source lists all four.
     */
    handles?: { platform: BrandGlyphName; url: string; handle: string }[];
    posts?: {
      /** Every mark `BrandGlyph` draws — see `handles` above. */
      platform: BrandGlyphName;
      author: string;
      handle: string;
      date: string;
      content: string;
      /** Where the post's own call to action goes, as the source publishes it. */
      href?: string;
      /** Its wording — "Follow on Instagram →" on NMBA. */
      linkLabel?: string;
      image?: string;
      likes?: string;
      shares?: string;
    }[];
  };
  /**
   * The figures an organisation publishes about its own reach, as its own band.
   *
   * WHY THIS EXISTS RATHER THAN LETTING THE PROSE CARRY THEM. The ingest
   * captures NMBA's eight counters as `<h4>345,703,321</h4><div>People
   * Reached</div>` eight times over, and rendered as prose that is what you get:
   * a blue number, a paragraph, a blue number, a paragraph, 750px of vertical
   * scroll doing the work of one strip. They are facts with labels, so they
   * belong in `FactStrip` — the same component the page already uses above.
   *
   * `asOf` IS NOT OPTIONAL FURNITURE. These are live counters on the source and
   * they move daily; a figure with no date beside it claims to be current when
   * it is a snapshot. `live-data-fallback.md`: snapshot second, and the page
   * says which.
   */
  impact?: {
    heading: string;
    /** When these figures were read from the source, e.g. "7 September 2026". */
    asOf: string;
    items: OrgFact[];
  };
  messages?: {
    heading: string;
    description?: string;
    items: OrgMessage[];
  };
  tags?: {
    heading: string;
    items: OrgTag[];
  };
  contact?: {
    heading: string;
    /** Label above the address card. Defaults to "Headquarters". */
    addressLabel?: string;
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
    // The scheme's own hero photograph, as the source site publishes it — a
    // composite of the three components: a hostel block, Adarsh Gram village
    // works, and skilling. Mirrored locally rather than hot-linked from the
    // source CDN, like the gallery images beside it.
    featuredImage: "/website/images/organisations/banner-pm-ajay.png",
    lead:
      "PM-AJAY is a flagship scheme of the Ministry of Social Justice & Empowerment dedicated to the socio-economic empowerment of Scheduled Castes. The scheme promotes livelihood opportunities, strengthens village infrastructure, and enhances access to education and residential facilities for sustainable and inclusive development.",

    // THREE facts, because three is what the source actually states. The strip
    // stretches to whatever it is given; it does not need filling.
    //
    // Two were removed rather than replaced. "Implementing ministry — Social
    // Justice & Empowerment" is the same answer on every page of this estate and
    // is already in the masthead: a value constant across the estate is not a
    // fact about the thing described. And "2021–22 — Scheme launched" was mine,
    // not the department's: the About page says the three precursor schemes
    // MERGED INTO PM-AJAY from 2021–22, which is not the same claim as a launch
    // date, and turning one into the other is inventing a fact that reads as
    // sourced.
    facts: [
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "widgets", value: "3", label: "Scheme components" },
      { icon: "groups", value: "Scheduled Castes", label: "Who it serves" },
    ],

    nav: [
      // Grouped as NCSK's index is: what the body IS, what it DOES, what it
      // PUBLISHES, and how to reach it. The source's own sidebar files the
      // download lists under "OUR WORK & IMPACT", which leaves that group
      // holding six entries that mix the scheme's programme with its filing
      // cabinet. Splitting the filing cabinet out is the one place this index
      // deliberately reads better than the source's.
      {
        label: "ABOUT US",
        items: [
          // NOT the /about-us sub-page. The About band's "Know more" already
          // opens it, and NCSK — the pattern this index follows — keeps its own
          // about-us out of the sidebar for that reason. Listing both would put
          // "About the Scheme" and "About Us" side by side in one group, two
          // labels a reader cannot tell apart pointing at the same subject.
          { label: "About the Scheme", href: "#about-the-scheme" },
        ],
      },
      {
        label: "OUR WORK & IMPACT",
        items: [
          { label: "Components", href: "#components" },
          // Directly under Components, because the band is directly under it on
          // the page. An index whose order disagrees with the page's teaches the
          // reader that it cannot be trusted to find things.
          { label: "Scheme Coverage", href: "#reach" },
          // No "Circulars & Notifications" entry: the circulars are a chip inside
          // Documents & downloads now, and a second label pointing at that same
          // band is the duplicate-destination fault this index already made once.
          { label: "Illustrative List of Domain Under GIA", href: `/website/organisation/${PM_AJAY}/illustrative-list-of-projects-under-various-domains-for-development-of-scheduled-castes-families-under-the-scheme` },
          { label: "Flow Chart", href: `/website/organisation/${PM_AJAY}/flow-chart` },
        ],
      },
      {
        label: "PUBLICATIONS & REPORTS",
        items: [
          // One entry, not four. This group used to list Resources, Downloads
          // (PM-AJAY), Downloads (pmagy) and Reports — four labels for what a
          // reader experiences as "the files". Three of them are one band now.
          { label: "Documents & Downloads", href: "#documents-downloads" },
          // No separate "Guidelines" entry: the guidelines are the first chip in
          // Documents & downloads. They had their own sub-page for one pass — a
          // bare table of the same two documents, pointing at the same two
          // files — which is a second copy to keep in sync and a second place to
          // look. Same call as `contact-us`.
          { label: "Reports (PM-AGY)", href: "#reports" },
        ],
      },
      {
        label: "CONNECT & ENGAGE",
        items: [
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

    aboutAction: { label: "Know more", href: `/website/organisation/${PM_AJAY}/about-us` },

    components: {
      heading: "Components",
      description:
        "The scheme has three components. Each is administered separately under its own guidelines and reporting.",
      // TWO SENTENCES, AND NO MORE. The first is the department's own
      // description of the component, verbatim from the About text. The second
      // is the ONE stated rule a reader most often needs — the qualifying
      // threshold, the funding floors, the seat reservation — taken from the
      // component's own page, so none of it drifts the way a feed count would.
      //
      // Everything else that used to be here (the 70-out-of-100 Adarsh Gram
      // score, the ODF condition, the lady-warden requirement) is a card
      // becoming a page. It is on the component's own page, one click away,
      // which is where a reader who wants that level of detail is going.
      items: [
        {
          title: "Development of SC Dominated Villages into “Adarsh Gram”",
          description:
            "Develops Scheduled Caste dominated villages into model villages. A village qualifies with over 40% Scheduled Caste population and 500 or more residents.",
          icon: "holiday_village",
          slug: `${PM_AJAY}/development-of-sc-dominated-villages-into-adarsh-gram`,
        },
        {
          title: "Grants-in-Aid to State/Districts",
          description:
            "Livelihood, skilling and infrastructure projects for the economic betterment of Scheduled Castes. At least 15% of funds are earmarked for Scheduled Caste women and 10% for skill development.",
          icon: "payments",
          slug: `${PM_AJAY}/grants-in-aid-to-state-districts`,
        },
        {
          title: "Construction/Repair of Hostels",
          description:
            "Supports the construction and repair of hostels for Scheduled Caste students, to reduce dropout rates. Institutions receiving support reserve 70% of seats for Scheduled Caste students.",
          icon: "apartment",
          slug: `${PM_AJAY}/construction-repair-of-hostels`,
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

    // ONE library, not four bands. This used to be two "Downloads" bands beside
    // Circulars and Resources — four consecutive grids of the identical card,
    // nineteen files, split by the department's filing categories rather than by
    // anything a reader wants. They are one shelf now, filtered by chip.
    //
    // The PM-AJAY / PMAGY split in particular was a split by SCHEME ERA: PMAGY is
    // the predecessor programme folded into the Adarsh Gram component. The page
    // never said so; it put up two headings and left the reader to guess. Era is
    // now a chip, and the chip says what it means.
    //
    // Every file resolves to a sample document in this estate, per the standing
    // rule that documents are served from here rather than hot-linked. The
    // department's own name for each file is kept in `officialName`.
    downloads: {
      heading: "Documents & Downloads",
      description:
        "Guidelines, formats, presentations and manuals published for the scheme and for PMAGY, which was merged into the Adarsh Gram component.",
      groups: [
        {
          id: "documents-downloads",
          heading: "Documents & Downloads",
          viewAllHref: "/website/forms-templates",
          items: [
            // The scheme's own guidelines lead the shelf. They are the document a
            // reader is most often after and the one every other file here
            // assumes you have read, so they sit first and under their own chip
            // rather than being filed among the formats.
            {
              label: "PM-AJAY operational guidelines",
              officialName: "Guidelines of Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)",
              meta: "The scheme's governing document",
              href: "/website/documents/sample/acts-rules-sample.pdf",
              kind: "pdf",
              group: "Guidelines",
            },
            {
              label: "PM-AJAY guidelines — consolidated advisory",
              officialName: "PM-AJAY Guidelines",
              meta: "Advisory · read alongside the operational guidelines",
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              kind: "pdf",
              group: "Guidelines",
            },
            {
              label: "Utilization certificate format (GFR 12-C)",
              officialName: "Utilization Certificate",
              meta: "For State and UT implementing agencies",
              href: "/website/documents/sample/acts-rules-sample.pdf",
              kind: "pdf",
              group: "Formats",
            },
            {
              label: "Institute registration form",
              officialName: "Format for institute / university registration",
              meta: "For institutions applying under the Hostels component",
              href: "/website/documents/sample/acts-rules-sample.pdf",
              kind: "pdf",
              group: "Formats",
            },
            {
              label: "PM-AJAY scheme overview",
              officialName: "Presentation about Scheme",
              meta: "Presentation · for orientation and training",
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              kind: "pptx",
              group: "Presentations",
            },
            {
              label: "PMAGY scheme overview",
              officialName: "Presentation",
              meta: "Presentation · 24 October 2019",
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              kind: "pdf",
              group: "Presentations",
            },
            {
              label: "PMAGY Central Sanctioning Committee briefing",
              officialName: "Presentation, CSMC Meeting 12 Feb 2020",
              meta: "Presentation · 12 February 2020",
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              kind: "pdf",
              group: "Presentations",
            },
            {
              label: "Village announcement notice (Hindi)",
              officialName: "Announcement in village (Hindi)",
              meta: "For Gram Panchayats · read aloud at village level",
              href: "/website/documents/sample/citizen-charter-sample.pdf",
              kind: "pdf",
              group: "Formats",
            },
            {
              label: "Interim Village Development Plan — flow diagram",
              officialName: "Work Flow for Interim VDP",
              meta: "For district officers preparing a VDP",
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              kind: "pdf",
              group: "Manuals & guides",
            },
            {
              label: "Village Development Plan — worked example",
              officialName: "Sample VDP",
              meta: "For district officers preparing a VDP",
              href: "/website/documents/sample/annual-report-sample.pdf",
              kind: "pdf",
              group: "Manuals & guides",
            },
            {
              label: "Adarsh Gram MIS — district user manual",
              officialName: "District User Manual",
              meta: "For district users of the Adarsh Gram MIS",
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              kind: "pdf",
              group: "Manuals & guides",
            },
            {
              // The one entry here that is NOT a document. It is a live page the
              // Department updates, so it keeps its real destination: pointing a
              // "View page" card at a sample PDF would promise a page and hand
              // over a download.
              label: "Releases and utilisation — implementation status",
              officialName: "Implementation Status",
              meta: "Live page · updated by the Department",
              href: "https://www.dosje.gov.in/documents/pm-ajay-releases-and-utilization-implementation-status/",
              kind: "page",
              group: "Reports",
            },
          ],
        },
      ],
    },


    // The "Reports PM-AGY" band the source page carries, in the source's own
    // groups and its own labels. Every one is a live report generated on request
    // at dosje.gov.in, so each is linked out rather than mirrored — for a
    // stronger reason than the documents above: a mirrored copy of a live report
    // is a snapshot wearing a live report's clothes.
    //
    // "PMAGY Work Flow" appears on the source between "Announcement in village"
    // and "Work Flow for Interim VDP" and is deliberately absent everywhere here:
    // its link is empty upstream — it opens a pop-up — so there is no destination
    // to offer.
    reports: {
      heading: "Reports (PM-AGY)",
      description:
        "Village, Adarsh Gram, VDP and allocation reports published for the scheme. Each report is generated on request on the Department's portal.",
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
        {
          // These two are live reports exactly like the ten above. The source's
          // sidebar files them under its Downloads heading, so we did too — which
          // put the same kind of object in two bands and made an upstream filing
          // slip structural. They belong here.
          heading: "Allocation & approvals",
          items: [
            { label: "PACC Meeting List", href: `${PM_AJAY_SRC}/pacc-meeting-list/`, external: true },
            { label: "Notional Allocation", href: `${PM_AJAY_SRC}/notional-allocation-report/`, external: true },
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
          /*
           * ONE ENTRY, NOT FIVE — and the five it replaces all pointed at
           * nothing.
           *
           * Annual Reports, SOP and Advisory, Act/Rules, Notifications and Rules
           * & Procedure were separate sections once. They are categories inside
           * the one document shelf now, reachable as chips, and this rail was
           * never updated: every one of those five anchors resolved to no
           * element, so a fifth of the Commission's rail scrolled nowhere.
           */
          { label: "Documents & Downloads", href: "#documents-downloads" },
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
          /* "#annual-reports" resolved to nothing: the Commission's reports are
             a category inside the document shelf, not a section of their own. */
          { label: "Documents & Downloads", href: "#documents-downloads" },
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
      // Three, not four. The fourth was "Implementing ministry — Social Justice &
      // Empowerment", which every organisation on the estate answers identically
      // and the masthead already states; its stand-in was a "2 sub-schemes" tile
      // whose label ran to six words to say what the About prose says better.
      // The strip stretches to whatever it is given and does not need filling.
      { icon: "handshake", value: "Shelter & Livelihood", label: "Scheme pillars" },
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
        label: "PUBLICATIONS & REPORTS",
        items: [
          { label: "Documents & Downloads", href: "#documents-downloads" },
          { label: "SOPs", href: "/website/organisation/support-for-marginalized-individuals-for-livelihood-and-enterprise-smile/sop" },
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
    // The two guidelines the source site publishes on PM-AJAY's guidelines page.
    // They are SMILE's — the Beggary Scheme's operational guidelines and the
    // model guidelines for shelter homes — and they were filed under PM-AJAY
    // upstream, which is that site's own mistake. They belong here, and this is
    // the only place in the estate that holds them.
    downloads: {
      heading: "Documents & Downloads",
      description:
        "Guidelines and standard operating procedures published for the SMILE Beggary Scheme.",
      groups: [
        {
          id: "documents-downloads",
          heading: "Documents & Downloads",
          viewAllHref: "/website/forms-templates",
          items: [
            {
              label: "SMILE Beggary Scheme — operational guidelines",
              officialName:
                "Operational Guidelines for SMILE (Support for Marginalized Individuals for Livelihood and Enterprise) - Beggary Scheme",
              meta: "The scheme's governing document",
              href: "/website/documents/sample/acts-rules-sample.pdf",
              kind: "pdf",
              group: "Guidelines",
            },
            {
              label: "Shelter homes — model guidelines",
              officialName:
                "Model Guidelines on Care, Rehabilitation and Management of Beggars' / Shelter Homes",
              meta: "For implementing agencies running shelter homes",
              href: "/website/documents/sample/advisory-sop-sample.pdf",
              kind: "pdf",
              group: "Guidelines",
            },
          ],
        },
      ],
    },

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
          { label: "Downloads & Statutory Resources", href: "#components" },
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
          { label: "Reporting Modules & Query Interfaces", href: "#components" },
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
      /*
       * NO "CONNECT & ENGAGE" GROUP, because there is nothing to put in it.
       *
       * It held one entry, "Contact Division" → "#contact", and this record
       * carries no `contact` block — so the template renders no contact section
       * and the link resolved to nothing. The honest fix is the empty group
       * going, not a heading kept over a dead link.
       *
       * TO RESTORE IT: add a `contact` block with the Division's real address,
       * telephone and email, and put the entry back. That is content this
       * estate does not have and must not invent.
       */
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
          { label: "Services & Channels", href: "#components" },
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

  /*
   * NASHA MUKT BHARAT ABHIYAAN.
   *
   * Every value below is read off
   * https://www.dosje.gov.in/organisation/nasha-mukt-bharat-abhiyaan/ as
   * published on 07 Sep 2026, in that page's own top-to-bottom order.
   *
   * TWO THINGS THIS RECORD DELIBERATELY DOES NOT DO.
   *
   * It does not restate the eight impact counters. Those are live figures on
   * the source and they move daily — the ingested snapshot renders them in the
   * About band, and a second hand-typed copy here would be a stale number in a
   * static panel above a moving one. The same argument as the PM-AJAY "at a
   * glance" panel above, and the same defect it was written to prevent.
   *
   * It does not mirror the published PDFs. They come to 68 MB and they are
   * generated and revised by the Department; the links point at the
   * Department's own copies so a reader always opens the current file. The
   * IMAGES are mirrored, because they are small, static, and part of the page's
   * design rather than its document record.
   */
  "nasha-mukt-bharat-abhiyaan": {
    logo: "/website/images/org-logos/nmba.png",
    /*
     * The green band above the title, as the source publishes it.
     *
     * Its invitation used to be the hero's `lead`, which was the wrong home
     * twice over: it displaced the NAPDDR paragraph the source actually prints
     * under the h1, and it put the campaign's front door below the page title
     * instead of above it.
     */
    joinBanner: {
      heading: "Join Nasha Mukt Bharat Abhiyaan",
      text: "Become a Nasha Mukt Mitr and contribute towards building a healthier, safer and Nasha Mukt Bharat.",
      action: {
        label: "Register Now, Be a volunteer for change",
        href: "https://nashamukt.dosje.gov.in/nasha-mukti-mitr",
        external: true,
      },
      helplineLabel: "National De-Addiction Helpline",
      helplineNumber: "14446",
      // Scans to the same nasha-mukti-mitr form the button opens. The file is
      // already published in this record's downloads; this is the same asset,
      // not a second copy of it.
      qrSrc: "/website/content/organisation/nmba-nasha-mukti-mitr-qr.png",
    },
    /*
     * The four photographs the source cycles in its header circle, mirrored.
     *
     * Their alt text is ours: the source ships them with filenames for alt
     * ("goa", "blv", "ra", and a UUID), which describes nothing. What each
     * picture shows is read off the picture itself.
     */
    heroSlides: [
      {
        src: "/website/content/organisation/nmba-hero-1.jpg",
        alt: "A Nasha Mukt Bharat Abhiyaan event at a Government of India venue",
      },
      { src: "/website/content/organisation/nmba-hero-2-goa.png", alt: "An Abhiyaan event in Goa" },
      {
        src: "/website/content/organisation/nmba-hero-3-blv.png",
        alt: "Shri B. L. Verma, Minister of State, at an Abhiyaan event",
      },
      {
        src: "/website/content/organisation/nmba-hero-4-ra.png",
        alt: "Shri Ramdas Athawale, Minister of State, at an Abhiyaan event",
      },
    ],
    // The paragraph the source prints under its own h1.
    lead: "The Ministry of Social Justice and Empowerment (MoSJE) is the nodal Ministry for Drug Demand Reduction and, as part of its mandate, has introduced measures to curtail substance abuse in the country. MoSJE formulated and enacted the National Action Plan for Drug Demand Reduction (NAPDDR).",
    /*
     * TWO ACTIONS, NOT THREE — and the one that went was a duplicate.
     *
     * "Register as a Nasha Mukti Mitr" stood here pointing at
     * nashamukt.dosje.gov.in/nasha-mukti-mitr, which is the exact destination of
     * the green band's "Register Now, Be a volunteer for change" a few hundred
     * pixels above it. The first fold therefore carried five controls, of which
     * two were the same link under two different names — the second one styled
     * `primary`, so the page offered a reader two competing primary invitations
     * to do one thing.
     *
     * The invitation is not lost: the band above is where the source publishes
     * it, above its own title, and it is the more prominent of the two. What is
     * removed is the repetition.
     */
    /*
     * THE EMPHASIS IS THE HANDOFF'S, AND IT IS THE REVERSE OF WHAT WAS HERE.
     *
     * Read off the Figma instances' own component properties rather than by
     * eye: `Citizen Dashbaord` (51586:22056) is Type=Inverted, Sub-type=FILLED;
     * `Take the Pledge` (51586:22066) is Type=Inverted, Sub-type=OUTLINED. This
     * record had them the other way round, so the page led with the pledge in
     * solid white where the design leads with the dashboard.
     *
     * It is also the better reading of the page. The pledge is one action a
     * citizen takes once; the dashboard is where the Abhiyaan's own figures
     * live, and it is the destination a returning reader wants. The band above
     * already carries the campaign's loudest invitation.
     */
    quickActions: [
      {
        label: "Citizen Dashboard",
        href: "https://nashamukt.dosje.gov.in/",
        icon: "dashboard",
        variant: "primary",
        external: true,
      },
      {
        label: "Take the Pledge",
        href: "https://nashamukt.dosje.gov.in/epledge",
        icon: "front_hand",
        external: true,
      },
    ],
    /*
     * FOUR FACTS, ALL STATED ON THE SOURCE PAGE. "372 Districts" stood here
     * until 07 Sep 2026 and is not on this page at all — an unsourced figure on
     * a government page, which this file's own header forbids.
     *
     * THE HELPLINE WAS REMOVED ON 07 SEP AND IS BACK ON 08 SEP. It went as a
     * duplicate: the green band directly above prints "National De-Addiction
     * Helpline 14446" in 24px inside a white pill, and printing it again in grey
     * 200px below is the restatement `ui-restraint-and-copy.md` §1 forbids.
     *
     * That argument was right about the duplication and wrong about which copy
     * to keep, for a reason the audit found and the original pass did not: THE
     * BAND IS DISMISSIBLE. Press its X and the campaign half collapses, and with
     * it the only remaining instance of the number in the fold. A national
     * de-addiction helpline that a reader can remove from a page about drug
     * de-addiction by closing an advertisement is not a duplicate worth saving
     * 200px on.
     *
     * Four cells is also the count the strip is built for: at three it drew
     * 405px cells around 150px of content, 63% air, and read as three unrelated
     * statements rather than a strip.
     *
     * The Ministry fact is the weakest of the four — a reader on the
     * Department's own site is told the Department twice by the masthead
     * already. It stays only because removing it returns the strip to three,
     * which measured worse. Replace it the day the source publishes a fourth
     * figure worth the space.
     */
    facts: [
      { icon: "flag", value: "15 August 2020", label: "Abhiyaan launched" },
      { icon: "local_hospital", value: "768", label: "De-addiction and rehabilitation centres" },
      { icon: "call", value: "14446", label: "National de-addiction helpline" },
      { icon: "account_balance", value: "Social Justice & Empowerment", label: "Ministry" },
    ],
    /*
     * THE ABHIYAAN'S OWN NOTICE BOARD.
     *
     * Matched, not typed — see the `whatsNew` field's own note. The ingest holds
     * eighteen NAPDDR and de-addiction notices under Resources and Circulars &
     * Notifications, and until now not one of them was reachable from the page
     * of the campaign they belong to.
     *
     * `match` is deliberately narrow. "drug" alone drags in the Department's
     * general grants circulars; the four terms below are the Abhiyaan's own
     * vocabulary — its action plan, its centres, its institution types.
     */
    whatsNew: {
      label: "What's New",
      category: "Resources",
      match: ["napddr", "de-addiction", "deaddiction", "nasha"],
      viewAllHref: "/website/notices",
      limit: 6,
    },
    /*
     * THE SIXTH-ANNIVERSARY OBSERVANCE, as a temporary ribbon.
     *
     * Requested 07 Sep 2026. Two routes because the two audiences hold
     * different credentials — see the `eventRibbon` field's note. The first
     * opens the Abhiyaan's administrative login, which is where a line
     * Ministry's officer already files; the second opens the activities
     * register, which takes an entry without an account.
     *
     * `until` is the observance's stated window. When it closes this block is
     * deleted, not left to expire quietly — a ribbon inviting people to an event
     * that has happened is worse than no ribbon.
     */
    eventRibbon: {
      /*
       * "the Abhiyaan", not the full name. The page's own H1 sits directly
       * below this row and reads "Nasha Mukt Bharat Abhiyaan (NMBA)", so
       * spelling it out again here is the restatement `ui-restraint-and-copy.md`
       * §1 forbids — and it is the register the rest of this record already
       * uses ("About the Abhiyaan", "The Abhiyaan in Numbers").
       *
       * It also buys the row 110px, which is what lets the occasion and the
       * sentence share one line at 1440. They missed it by TWO PIXELS before
       * this cut: 311 of eyebrow plus 8 of gap plus 375 of sentence against a
       * 692px column.
       */
      eyebrow: "Six Years of the Abhiyaan",
      /*
       * SHORTENED ON 8 Sep, and only because the row is now one line: the
       * eyebrow and the sentence share it, and "in the observance" restated
       * what the eyebrow beside it already says. Cutting words that earn their
       * place to fit a layout would be the wrong trade; cutting a restatement
       * is the same rule the rest of this file follows.
       */
      heading: "Organisations taking part may file their pre-event details",
      /*
       * NO `until`, AND ITS ABSENCE IS THE POINT.
       *
       * A date stood here — "30 September 2026" — and it was INVENTED. The
       * review that asked for this ribbon never named a window, and this file's
       * own header forbids exactly that: "Do not add a founding year, a budget
       * or a beneficiary figure that the source does not state; an invented
       * statistic on a government page is a defect of a different order from a
       * layout bug." A closing date a citizen might plan around is worse than a
       * budget figure, because it is actionable.
       *
       * The field stays on the type. Put the Department's own date back the day
       * it is known, and the ribbon prints it in bold inside the sentence.
       */
      action: { label: "File Pre-Event Details", href: "/portals/nmba/admin/login" },
      altAction: {
        label: "No departmental account? File on the open register",
        href: "/portals/nmba/activities",
      },
    },
    aboutAction: { label: "Know More →", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/about-us" },
    /*
     * THE PROSE IS AUTHORED, AND THIS IS THE CASE `aboutHtml` EXISTS FOR.
     *
     * The ingest captured this page's text, but in a shape no layout can
     * rescue. Its ten sections interleave two paragraphs of departmental prose
     * with eight counters marked up as `<h4>` + `<div>`, six institution
     * definitions as twelve flat `<p>`s, a colour key to a map it could not
     * capture, and four husks — a heading with no number, two document tabs
     * with no documents, a gallery with no photographs. Rendered as prose that
     * is one 2,000px wall of text with the counters running down it in a
     * column.
     *
     * So the prose is written here, and everything that is NOT prose is handed
     * to the component built for it: `impact` for the counters,
     * `aboutHighlights` for the six institutions, the reach band for the map,
     * `downloads` for the documents, `gallery` for the photographs.
     *
     * THE COST, STATED PLAINLY: a re-ingest of dosje.gov.in will not refresh
     * these two paragraphs. They are stable departmental copy — the second is
     * the Abhiyaan's standing description — and both are reproduced verbatim.
     * The volatile part is the counters, and those carry their own `asOf`.
     */
    aboutHeading: "About the Abhiyaan",
    aboutHtml: `
      <p>Drug and alcohol addiction in India has long been a silent crisis, impacting
      individuals, families, and communities across both urban and rural landscapes.
      Recognising the urgent need for collective action, the Ministry of Social Justice
      and Empowerment launched the Nasha Mukt Bharat Abhiyaan (NMBA) on 15th August 2020
      with a vision to make India drug-sensitised and resilient against substance abuse.
      Being a campaign mode programme, the Abhiyaan has targeted and involved
      stakeholders that might be directly or indirectly affected by substance abuse and
      those who are vulnerable to it. The major stakeholders and beneficiaries of the
      NMBA are Youth, Women, Children, Educational Institutions, Civil Society, and the
      Community at large. Since its launch, a wide range of activities have been
      conducted throughout the country that have fostered participation from all
      sections of society and stakeholders. There has been a shift from an earlier
      approach of organisational involvement to community involvement in the issue of
      substance abuse. The states, districts, and other stakeholders have taken
      ownership of the Abhiyaan, which has helped transform the Abhiyaan into a jan
      andolan.</p>
    `,
    /*
     * THE SIX INSTITUTION TYPES, AS CARDS.
     *
     * TITLES ARE THE DEPARTMENT'S OWN, including "Center" spelled the American
     * way and the plurals "(IRCAs)", "Centres (ODIC)", "Agencies (SLCAs)".
     * They were briefly tidied to "Centre", singular, and a singular acronym —
     * which is not Title Case, it is rewriting a department's terminology to
     * suit a card. The only change made is Title Case on "led" → "Led", which
     * `ui-restraint-and-copy.md` does mandate.
     *
     * The source draws six icon cards. The ingest returned twelve flat
     * paragraphs — a name, then a definition, six times — and rendered as prose
     * a reader could not tell the name of one from the body of the last.
     * Definitions are verbatim; the icons are ours, chosen to separate the six
     * at a glance, and carry no meaning the text does not already state.
     */
    aboutHighlightsHeading: "Institutions for Drug Demand Reduction Supported by the Ministry",
    aboutHighlights: [
      {
        title: "Integrated Rehabilitation Center for Addicts (IRCAs)",
        icon: "local_hospital",
        description:
          "Integrated Rehabilitation Center for Addicts (IRCAs) are de-addiction centres with inpatient facilities of counselling and treatment for drug dependent persons.",
      },
      {
        title: "Community Peer Led Intervention (CPLI)",
        icon: "diversity_3",
        description:
          "Community Peer led Intervention (CPLI) work with the community with youth volunteers for early preventive education especially for vulnerable adolescents and youth in the community.",
      },
      {
        title: "Outreach and Drop in Centres (ODIC)",
        icon: "support_agent",
        description:
          "Outreach and Drop in Centres (ODIC) provides facilities of screening, assessment and counselling along with providing referral and linkage to treatment and rehabilitation services for drug dependents.",
      },
      {
        title: "District De-Addiction Centre (DDAC)",
        icon: "health_and_safety",
        description:
          "District De-addiction Centres serve as one-stop centre with a combination of IRCA, CPLI, and ODIC. The main focus of the DDAC is early prevention, education, demand reduction, identification, treatment and rehabilitation services of vulnerable individuals or individuals affected by substance use disorders.",
      },
      {
        title: "State Level Coordinating Agencies (SLCAs)",
        icon: "account_balance",
        description:
          "State Level Coordinating Agencies (SLCAs) are designated organizations responsible for coordinating, monitoring, facilitating, and strengthening the implementation of drug demand reduction programmes and capacity-building initiatives under NAPDDR at the State level.",
      },
      {
        title: "Addiction Treatment Facility (ATF)",
        icon: "monitor_heart",
        description:
          "Addiction Treatment Facility provides in patient and out patient treatment and deaddiction services to substance users in a government hospital.",
      },
    ],
    /*
     * THE EIGHT COUNTERS THE SOURCE PUBLISHES, read on 7 September 2026.
     *
     * Verbatim, including the source's own mixed formatting — "28,29,661+" is
     * written in the Indian grouping with a plus, "755+" likewise, and both are
     * reproduced as published rather than normalised into the international
     * grouping the other six use. Rewriting a department's own figure to suit a
     * layout is the one thing this file's header forbids outright.
     */
    impact: {
      heading: "The Abhiyaan in Numbers",
      asOf: "7 September 2026",
      items: [
        { icon: "groups", value: "345,703,321", label: "People reached" },
        { icon: "school", value: "137,209,589", label: "Youth reached" },
        { icon: "woman", value: "106,563,417", label: "Women reached" },
        { icon: "menu_book", value: "3,726,319", label: "Activities in educational institutes" },
        { icon: "healing", value: "28,29,661+", label: "Persons treated and rehabilitated" },
        { icon: "local_hospital", value: "755+", label: "DoSJE-supported de-addiction centres" },
        { icon: "front_hand", value: "3,361,211", label: "Total pledges" },
        { icon: "volunteer_activism", value: "164,943", label: "Nasha Mukti Mitr registered" },
      ],
    },
    nav: [
      /*
       * THE RAIL IS A LIST OF THE PAGE'S SECTIONS, SO IT IS ORDERED LIKE THEM.
       *
       * In-page entries appear in the order their sections appear in the
       * document — Numbers, About, Facilities, Documents, Gallery, then the
       * Connect group. Sub-page links have no position in the page, so they sit
       * with the subject they extend: "Overview Details" under About, the five
       * corners in their own group.
       *
       * Two things were wrong before this ordering was applied. "The Abhiyaan in
       * Numbers" was on the page and in no group, so a third of the fold was
       * unreachable from the rail; and every entry named its section except the
       * first, which said "About the Organisation" against a heading reading
       * "About the Abhiyaan". A rail whose labels do not match the headings they
       * scroll to is a rail a reader stops trusting.
       */
      {
        label: "ABOUT THE ABHIYAAN",
        items: [
          { label: "The Abhiyaan in Numbers", href: "#impact" },
          { label: "About the Abhiyaan", href: "#about-the-scheme" },
          { label: "Overview Details", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/about-us" },
        ],
      },
      {
        label: "FACILITIES & DOCUMENTS",
        items: [
          { label: "Geo-Tagged De-addiction Facilities", href: "#reach" },
          { label: "Documents & Downloads", href: "#documents-downloads" },
          { label: "Gallery", href: "#gallery" },
        ],
      },
      {
        label: "CORNERS",
        items: [
          { label: "PMU Corner", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/pmu-corners" },
          { label: "Volunteer Corner", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/volunteer-corner" },
          { label: "Intern's Corner", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/interns-corner" },
          { label: "Forum", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/forum" },
          { label: "FAQ", href: "/website/organisation/nasha-mukt-bharat-abhiyaan/faqs" },
        ],
      },
      {
        label: "CONNECT & ENGAGE",
        items: [
          { label: "Messages", href: "#messages" },
          { label: "Social Media", href: "#social-feed" },
          { label: "Contact", href: "#contact" },
        ],
      },
    ],
    downloads: {
      layout: "tabs",
      heading: "Documents & Downloads",
      description:
        "Information, education and communication material, publications, newsletters and campaign assets published for the Abhiyaan. Files open on the Department's own site, so a reader always gets the current version.",
      groups: [
        {
          id: "iec-materials",
          heading: "IEC Materials",
          viewAllHref: "https://www.dosje.gov.in/miscellaneous/?org=nmba",
          items: [
            {
              label: "Best Practices",
              meta: "24 Jan 2025",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/06/47211779688755.pdf",
              kind: "pdf",
              group: "IEC Materials",
            },
            {
              label: "User Manual for Patient Monitoring System",
              meta: "23 Jan 2025 · 3.29 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/06/71461779689125.pdf",
              kind: "pdf",
              group: "IEC Materials",
            },
            {
              label: "NMBA Impact Assessment Report 2021 by UNDP",
              meta: "22 Jan 2025 · 11.59 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/0066_NMBA_Impact_Assessment_Report_2021_by_UNDP-1.pdf",
              kind: "pdf",
              group: "IEC Materials",
            },
            {
              label: "Compendium (English)",
              meta: "21 Jan 2025 · 3.43 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/0067_Compendium_English-1.pdf",
              kind: "pdf",
              group: "IEC Materials",
            },
          ],
        },
        {
          id: "publications",
          heading: "Publications",
          viewAllHref: "https://www.dosje.gov.in/publications/?org=nmba",
          items: [
            {
              label: "Magnitude of Substance Use in India",
              officialName: "Magnitude-of-Substance-Use-in-India-DDTC-AIIMS-2019",
              meta: "05 Mar 2026 · DDTC, AIIMS 2019 · 10.62 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/Magnitude-of-Substance-Use-in-India-DDTC-AIIMS-2019.pdf",
              kind: "pdf",
              group: "Publications",
            },
          ],
        },
        {
          id: "newsletter",
          heading: "Newsletter",
          viewAllHref: "https://www.dosje.gov.in/newsletter/?org=nmba",
          items: [
            {
              label: "Nasha Mukt Bharat Abhiyaan Newsletter, August 2025",
              meta: "01 Aug 2025 · 3.21 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/0006_August_2025-1.pdf",
              kind: "pdf",
              group: "Newsletter",
            },
            {
              label: "Nasha Mukt Bharat Abhiyaan Newsletter, May 2025",
              meta: "01 May 2025 · 12.55 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/0007_May_2025-1.pdf",
              kind: "pdf",
              group: "Newsletter",
            },
            {
              label: "Nasha Mukt Bharat Abhiyaan Newsletter, April 2025",
              meta: "01 Apr 2025 · 17.25 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/0008_April_2025-1.pdf",
              kind: "pdf",
              group: "Newsletter",
            },
            {
              label: "Nasha Mukt Bharat Abhiyaan Newsletter, March 2025",
              meta: "01 Mar 2025 · 6.45 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/19261768801533-1.pdf",
              kind: "pdf",
              group: "Newsletter",
            },
          ],
        },
        {
          id: "campaign-assets",
          heading: "Downloads",
          items: [
            {
              label: "NMBA logo",
              meta: "PNG · campaign mark",
              href: "/website/content/organisation/nmba-logo-large.png",
              kind: "image",
              group: "Downloads",
            },
            {
              label: "NMBA mascot",
              meta: "PNG · campaign mascot",
              href: "/website/content/organisation/nmba-mascot.png",
              kind: "image",
              group: "Downloads",
            },
            {
              label: "NMBA e-Pledge QR code",
              meta: "PNG · opens the pledge form",
              href: "/website/content/organisation/nmba-epledge-qr.png",
              kind: "image",
              group: "Downloads",
            },
            {
              label: "Nasha Mukti Mitr registration QR code",
              meta: "PNG · opens the volunteer registration",
              href: "/website/content/organisation/nmba-nasha-mukti-mitr-qr.png",
              kind: "image",
              group: "Downloads",
            },
          ],
        },
        {
          id: "circulars",
          heading: "Circulars",
          viewAllHref: "https://www.dosje.gov.in/circulars-notifications/?org=nmba",
          items: [
            {
              label: "Committee formation — letter to all States, with enclosure",
              officialName: "Committee formation DO to all State alongwith enclosure",
              meta: "26 Jun 2026",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/07/Committee-formation-DO-to-all-State-alongwith-enclosure.pdf",
              kind: "pdf",
              group: "Circulars",
            },
          ],
        },
        {
          id: "citizen-corner",
          heading: "Citizen Corner",
          items: [
            {
              label: "Citizen Charter",
              meta: "17 Mar 2026 · 0.12 MB",
              href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/03/0003_Citizen_Charter-1.pdf",
              kind: "pdf",
              group: "Citizen Corner",
            },
          ],
        },
      ],
    },
    gallery: {
      heading: "Gallery",
      viewAllHref: "https://www.dosje.gov.in/gallery/?org=nmba",
      items: [
        {
          date: "9 May 2024",
          caption: "NMBA Youth Awareness Programme",
          image: "/website/content/organisation/nmba-gallery-youth-awareness.jpg",
        },
        {
          date: "7 Nov 2023",
          caption: "Sensitization of Students on Psychoactive Substance Uses, Imphal",
          image: "/website/content/organisation/nmba-gallery-imphal-sensitization.jpg",
        },
        {
          date: "29 Aug 2022",
          caption: "Cycle Rally, Bishnupur",
          image: "/website/content/organisation/nmba-gallery-cycle-rally-bishnupur.jpg",
        },
      ],
    },
    messages: {
      heading: "Messages",
      items: [
        {
          quote:
            "The Nasha Mukt Bharat Abhiyaan is one prime nation building initiative because it focuses on the healthy and disciplined youth. NMBA will bring together the regulatory agencies like Narcotics Bureau, State and District Government, Police, NGOs, Hospitals, etc. so that they can work together in a coordinated manner to make India drug-free.",
          name: "Dr Virendra Kumar",
          designation: "Union Minister of Social Justice and Empowerment",
        },
        {
          quote:
            "Nasha Mukt Bharat Abhiyaan is a flagship campaign to enhance the evidence based approach towards substance abuse. The approach of the Abhiyaan is contemporary to engage youth and comprehensive to converge the activities done by all the stakeholders for a common goal of making India free of substance abuse.",
          name: "Shri Ramdas Athawale",
          designation: "Minister of State for Social Justice & Empowerment",
        },
        {
          quote:
            "Nasha Mukt Bharat Abhiyaan is a national initiative focused on achieving a Drug-Free India. It actively involves youth, women, and community members, with particular emphasis on higher education institutions, youth clubs, and women's groups. The campaign aims to spread awareness about the dangers of substance abuse, reaching out to every citizen. Through early prevention and community engagement, this movement strives to foster a healthier and happier society, encouraging a collective effort towards eliminating substance abuse.",
          name: "Shri B. L. Verma",
          designation: "Minister of State for Social Justice & Empowerment",
        },
        {
          quote:
            "Nasha Mukt Bharat Abhiyaan, operational in all the districts of the country is a mass movement towards a Drug Free India. We aim to reach through this campaign, every citizen in the country and move towards a healthier and happier society.",
          name: "Sh. Sudhansh Pant",
          designation: "Secretary, Department of Social Justice & Empowerment",
        },
        {
          quote:
            "The Nasha Mukt Bharat Abhiyaan intends to reach out to the masses and spread awareness on the issue of substance abuse through active participation of the youth, women and the community. Special emphasis is laid on the institutions of Higher Education, Youth Clubs & Women Groups to reach out to those vulnerable to substance use for early age prevention.",
          name: "Dr. Sandeep R. Rathod",
          designation: "Joint Secretary, Department of Social Justice & Empowerment",
        },
      ],
    },
    socialFeed: {
      heading: "Social Media",
      /*
       * The Instagram panel, as the source publishes it. Hiding the ingested
       * Social Media section in favour of handle pills dropped its only piece
       * of actual content — the handle, the invitation and the link — and left
       * four pills where the source has three panels and a channel link.
       */
      posts: [
        {
          platform: "instagram",
          author: "Ministry of Social Justice & Empowerment",
          handle: "@our profile",
          date: "",
          content: "Follow us on Instagram to see our latest posts and reels.",
          href: "https://www.instagram.com/msjegoi",
          linkLabel: "Follow on Instagram →",
        },
      ],
      handles: [
        {
          platform: "whatsapp",
          url: "https://whatsapp.com/channel/0029Vb6s9tg1SWst8ZSHXa1f",
          handle: "WhatsApp Channel",
        },
        { platform: "facebook", url: "https://www.facebook.com/msjegoi", handle: "Facebook" },
        { platform: "x", url: "https://twitter.com/MSJEGOI", handle: "X (Twitter)" },
        { platform: "instagram", url: "https://www.instagram.com/msjegoi", handle: "Instagram" },
      ],
    },
    contact: {
      heading: "Contact",
      addressLabel: "Postal Address",
      address: "8th Floor, GPOA-3, Netaji Nagar, New Delhi-110023",
      blocks: [
        {
          heading: "Drug Prevention Division",
          people: [
            {
              name: "Arun Kumar Karn",
              designation:
                "DP-I & II, DP Division · Room No. 8206, 8th Floor, Zone-4, GPOA-3, Netaji Nagar, New Delhi-110023",
              phone: "011-24104023",
              email: "usdp1-dosje@gov.in",
            },
            {
              name: "Sushant Shukla",
              designation:
                "DP-III & IV (matters related to Transgender) · Room No. 8614, 8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi-110023",
              phone: "011-26116320",
              email: "usdp3-dosje@gov.in",
            },
          ],
        },
      ],
    },
    tags: {
      heading: "Tags",
      items: [
        { label: "Addiction", href: "https://www.dosje.gov.in/tag/addiction/" },
        { label: "De-addiction", href: "https://www.dosje.gov.in/tag/de-addiction-2/" },
        { label: "Drug Abuse", href: "https://www.dosje.gov.in/tag/drug-abuse/" },
        { label: "Drug Abuse Awareness", href: "https://www.dosje.gov.in/tag/drug-abuse-awareness/" },
        { label: "Drug Abuse Prevention", href: "https://www.dosje.gov.in/tag/drug-abuse-prevention/" },
        {
          label: "Drug Abuse Prevention Program",
          href: "https://www.dosje.gov.in/tag/drug-abuse-prevention-program/",
        },
        {
          label: "Drug De-addiction Substance",
          href: "https://www.dosje.gov.in/tag/drug-de-addiction-substance/",
        },
        { label: "Drug Free India", href: "https://www.dosje.gov.in/tag/drug-free-india/" },
        { label: "Nasha Mukti", href: "https://www.dosje.gov.in/tag/nasha-mukti/" },
        { label: "Youth Drug Abuse", href: "https://www.dosje.gov.in/tag/youth-drug-abuse/" },
      ],
    },
  },

  /*
   * TWO NMBA CHILD PAGES THE SCRAPE RETURNED EMPTY.
   *
   * `organisation.json` holds zero sections for both, so the route rendered its
   * "This page is being prepared" placeholder while the source published the
   * content below. They are keyed by their FULL slug, which
   * `getOrganisationDetail` matches before it falls back to the root record.
   *
   * This is the exception the `aboutHtml` field exists for — "use it only where
   * the scrape captured less than the source page shows" — and it is written
   * here rather than into `organisation.json` so a re-ingest cannot lose it.
   */
  "nasha-mukt-bharat-abhiyaan/contact-us": {
    aboutHeading: "Contact",
    aboutHtml: `
      <h3>Postal Address</h3>
      <p>8th Floor, GPOA-3, Netaji Nagar, New Delhi-110023</p>
      <h3>Arun Kumar Karn, DP-I &amp; II, DP Division</h3>
      <p>Room No. 8206, 8th Floor, Zone-4, GPOA-3, Netaji Nagar, New Delhi-110023</p>
      <p>Phone: <a href="tel:01124104023">011-24104023</a><br />
         Email: <a href="mailto:usdp1-dosje@gov.in">usdp1-dosje[at]gov[dot]in</a></p>
      <h3>Sushant Shukla, DP-III &amp; IV (matters related to Transgender)</h3>
      <p>Room No. 8614, 8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi-110023</p>
      <p>Phone: <a href="tel:01126116320">011-26116320</a><br />
         Email: <a href="mailto:usdp3-dosje@gov.in">usdp3-dosje[at]gov[dot]in</a></p>
    `,
  },

  "nasha-mukt-bharat-abhiyaan/pmu-corners": {
    aboutHeading: "PMU Corner",
    aboutHtml: `
      <p>Programme Management Unit officers and the States allocated to each.</p>
      <ul>
        <li><strong>Aditya Singh</strong> — Assam, Meghalaya, Arunachal Pradesh</li>
        <li><strong>Amisha Yadav</strong> — Maharashtra (West) and Goa</li>
        <li><strong>Anvesha Tiwari</strong> — Gujarat, Daman and Diu, Rajasthan</li>
        <li><strong>Dimple Yadav</strong> — Andhra (North), presently Telangana</li>
        <li><strong>Gunjan</strong> — West Bengal, Sikkim and Tripura</li>
        <li><strong>Manisha</strong> — Tamil Nadu and Puducherry</li>
        <li><strong>P. Ajay Reddy</strong> — Manipur</li>
        <li><strong>Pratima Mukherjee</strong> — Kerala and Tamil Nadu</li>
        <li><strong>Priyanka Yadav</strong> — Uttar Pradesh (East)</li>
        <li><strong>Ragini Jha</strong> — Bihar, Jharkhand, Orissa</li>
        <li><strong>Soujanya Ambali</strong> — Andhra Pradesh</li>
      </ul>
    `,
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


/* ds-exempt-end */
