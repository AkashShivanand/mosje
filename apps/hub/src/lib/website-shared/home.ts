/**
 * CONTENT THE THREE DESIGNS OF THE WEBSITE SHARE — kept here once, read by all.
 *
 * The website is served in three designs (New, Classic, DBIM — see
 * lib/website-design/constants.ts). They differ in layout; they must not differ
 * in what they say. Where a section appears in more than one design, its content
 * lives in this folder and every design imports it. A design never carries its
 * own copy, and a copy is never "synced" by hand — that is how the DBIM home page
 * came to show six banners the live site does not, and an About Us paragraph the
 * live site does not carry. Rule: .claude/rules/website-shared-content.md.
 *
 * SOURCE for everything below: the live home page, https://dosje.gov.in/, as read
 * on HOME_CONTENT_AS_ON. Where the live site changes, change it HERE and all
 * three designs follow. A design may depart from it only on an explicit
 * instruction, and the departure is written beside the design's own code.
 */

/** The date the live home page was last read for this file. */
export const HOME_CONTENT_AS_ON = "2026-09-28";

/* ------------------------------------------------------------------ banners */

export interface HomeBanner {
  src: string;
  /** The live site's slides carry `alt=""`; each here says what it shows (WCAG 1.1.1). */
  alt: string;
  /** Intrinsic size, so the page reserves the space before the image arrives. */
  width: number;
  height: number;
  /** External destination, where the slide is a link. The live banners are not. */
  href?: string;
}

/**
 * THE FIRST SLIDE IN EVERY DESIGN IS THE CCPS BANNER (DBIM 3.0 §7.4.1 i; the
 * Department's instruction of 28 Sep 2026). This is the mirrored copy of it, kept
 * locally, used wherever the CCPS feed is not configured or does not answer
 * (lib/website-next/ccps.ts). It is byte-identical to the image the CCPS feed
 * served on CCPS_AS_ON — post 2826, `image_1`, at
 * master-socialjustice.digifootprint.gov.in/ccms/wp-json/post-page/top_banner —
 * with the feed's own link. When the feed moves on, replace the file and this entry.
 */
export const CCPS_AS_ON = "2026-09-28";
export const CCPS_SNAPSHOT: readonly HomeBanner[] = [
  {
    src: "/website/images/banners/ccps-mann-ki-baat.jpg",
    alt: "Mann Ki Baat on 27 September 2026. Share your ideas and suggestions with the Prime Minister: click here or dial 1800 11 7800 (toll-free). The phone lines remain open from 7 to 25 September 2026.",
    width: 1800,
    height: 600,
    href: "https://www.mygov.in/group-issue/inviting-ideas-mann-ki-baat-prime-minister-narendra-modi-27th-september-2026/?target=inapp&type=group_issue&nid=5850",
  },
];

/**
 * The Department's own banners, after the CCPS slide, in the live order. The
 * files are byte-identical to the ones dosje.gov.in serves from its CDN
 * (`wp-content/uploads/2026/06/banner-*.jpg`), checked by hash on
 * HOME_CONTENT_AS_ON.
 */
export const HOME_BANNERS: readonly HomeBanner[] = [
  {
    src: "/website/images/banners/banner-1a.jpg",
    alt: "The Prime Minister with Ministers and senior officials at a public event",
    width: 1800,
    height: 600,
  },
  {
    src: "/website/images/banners/banner-2a.jpg",
    alt: "A group photograph before a statue of Dr. B. R. Ambedkar",
    width: 1800,
    height: 600,
  },
  {
    src: "/website/images/banners/banner-3a.jpg",
    alt: "An award presentation at a Nasha Mukt Bharat Abhiyaan event",
    width: 1800,
    height: 600,
  },
  {
    src: "/website/images/banners/banner-5a.jpg",
    alt: "The 29th meeting of the Coordination Committee on the Protection of Civil Rights Act, 1955 and the SC/ST (Prevention of Atrocities) Act, 1989",
    width: 1800,
    height: 600,
  },
];

/**
 * The whole carousel from mirrored copies — for a client-only page that cannot
 * call the server-side `getHomeBanners()` (lib/website-shared/home-banners.ts).
 */
export const HOME_CAROUSEL_SNAPSHOT: readonly HomeBanner[] = [...CCPS_SNAPSHOT, ...HOME_BANNERS];

/* ---------------------------------------------------------------- pm quote */

/**
 * The Prime Minister's quotation — DBIM 3.0 §7.3(iv), Annexure checklist D (8–10):
 * a quote relevant to the Department, citing its event and date, set after the
 * banner and linked to where it was delivered.
 *
 * NOT FROM THE LIVE SITE, which carries no PM quote. Moved here on the
 * Department's instruction of 28 Sep 2026 so every design shows the same one.
 * SOURCE: PIB's English text of the Address to the Nation on the 79th
 * Independence Day, Red Fort, 15 August 2025 (PRID 2156749). Verbatim, checked
 * against the published release on 17 Sep 2026. It is a month past DBIM's
 * "preferably within one year", so it is the one to replace when a newer sector
 * quote is issued — here, once, for all three designs.
 */
export const PM_QUOTE = {
  quote:
    "We emphasize saturation, because if there is any true execution of social justice, it is in saturation where no eligible person is left out, where the government goes to the eligible person’s home, and ensures they get what is rightfully theirs.",
  attribution: "Shri Narendra Modi, Prime Minister of India",
  event: "Address to the Nation on the 79th Independence Day, Red Fort",
  /** Display form; a design that prints dates differently formats `dateTime`. */
  date: "15 August 2025",
  dateTime: "2025-08-15",
  source: { href: "https://pib.gov.in/PressReleasePage.aspx?PRID=2156749", name: "pib.gov.in" },
  /**
   * The same address, opened at the quoted sentence: a text fragment
   * (`#:~:text=start,end`) scrolls to and highlights the passage in a release
   * thousands of words long. A browser that does not support it, or a page that
   * has been re-worded, simply lands at the top — the plain link.
   */
  passageHref:
    "https://pib.gov.in/PressReleasePage.aspx?PRID=2156749#:~:text=We%20emphasize%20saturation,rightfully%20theirs.",
  /** One photograph in two crops, as each layout needs. */
  image: {
    alt: "Shri Narendra Modi, Prime Minister of India",
    /** Transparent background on a saffron panel, as DBIM asks (488×409). */
    cutout: { src: "/website/images/pm-quote/prime-minister-saffron.png", width: 488, height: 409 },
    /** Square-cropped for a round frame (the DBIM reference build's). */
    portrait: { src: "/website/dbim/people/narendra-modi.jpg", width: 475, height: 410 },
  },
} as const;

/* ----------------------------------------------------------------- about us */

export interface HomeMinister {
  name: string;
  designation: string;
  /**
   * The photograph the live home page shows, byte-identical to dosje.gov.in's
   * file — the Department's original upload; it publishes nothing larger.
   */
  photo: string;
  /** The photograph's own pixel size. Every design draws it larger than this. */
  size: number;
  /** The Union Minister leads; the Ministers of State follow. */
  primary?: boolean;
}

export interface HomeStat {
  label: string;
  value: string;
  /** The line under the figure that says what it is measured against. */
  caption: string;
}

export const ABOUT_US = {
  title: "About Us",
  intro:
    "The Department of Social Justice & Empowerment (DoSJE) is mandated to ensure the empowerment and welfare of India’s most vulnerable groups, including Scheduled Castes, OBCs, Senior Citizens, Transgender Persons, and victims of substance abuse. We implement various targeted schemes for their social, educational, and economic development, ensuring their inclusion despite challenges like the lack of updated demographic data.",
  quote:
    "The Ministry of Social Justice & Empowerment works to uplift India’s most vulnerable communities through targeted initiatives, inclusive growth, and compassionate governance.",
  /** Live targets, mapped to the estate's copies of the same pages. */
  links: [
    { label: "Our Team", href: "/website/mosje-directory" },
    { label: "Our Ministry", href: "/website/about-us" },
    { label: "Our Reports", href: "/website/annual-reports" },
  ],
  ministers: [
    {
      name: "Dr. Virendra Kumar",
      designation: "Union Minister of Social Justice and Empowerment",
      photo: "/website/images/Dr.-Virendra-Kumar.png",
      size: 160,
      primary: true,
    },
    {
      name: "Shri Ramdas Athawale",
      designation: "Minister of State of Social Justice and Empowerment",
      photo: "/website/images/Shri-Ramdas-Athawale.png",
      size: 96,
    },
    {
      name: "Shri B. L. Verma",
      designation: "Minister of State of Social Justice and Empowerment",
      photo: "/website/images/sri-l-b-verma.png",
      size: 96,
    },
  ] satisfies HomeMinister[],
  stats: [
    {
      label: "Cumulative Disbursement",
      value: "₹67,977 Crore",
      caption: "Scholarships for Scheduled Castes",
    },
    {
      label: "Beneficiary Coverage",
      value: "19.82 Crore",
      caption: "Cumulative across all schemes",
    },
    {
      label: "Release of Funds, FY 2025–26",
      value: "₹8,731 Crore",
      caption: "Provisional · 14.3% above previous year",
    },
  ] satisfies HomeStat[],
  dashboard: { label: "View Dashboard", href: "/website/dashboard" },
} as const;
