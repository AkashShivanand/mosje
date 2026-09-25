/**
 * Images the DBIM reference build carries that the estate did not have.
 *
 * FETCHED on 25 Sep 2026 from master-socialjustice.digifootprint.gov.in — the
 * Department's own DBIM build, which the DBIM review team named as the target —
 * and kept at apps/hub/public/website/dbim/. They are the Department's and the
 * Government's own campaign artwork, portraits and partner marks, not stock. They
 * live in `public/website/` so every design of the website can use them, not only
 * the DBIM one.
 */

const D = "/website/dbim";

export interface DbimImage {
  src: string;
  alt: string;
  /** Intrinsic size, so the page reserves the space before the image arrives. */
  width: number;
  height: number;
}

/**
 * The home banner carousel. The reference's order, except that the Mann Ki Baat
 * campaign (from the central campaign pool, ccps.digifootprint.gov.in) leads — the
 * Department's instruction of 25 Sep 2026.
 */
export const DBIM_BANNERS: (DbimImage & { href?: string })[] = [
  { src: `${D}/banners/banner-03.jpg`, alt: "Share your ideas and suggestions with the Prime Minister for Mann Ki Baat", width: 1920, height: 640, href: "https://www.mygov.in/" },
  { src: `${D}/banners/banner-01.jpg`, alt: "Launch of the Senior Citizen Welfare Portal by the Hon'ble President of India, Smt. Droupadi Murmu, on 2 May 2025", width: 1920, height: 640, href: "https://scw.dosje.gov.in/" },
  { src: `${D}/banners/banner-02.jpg`, alt: "8 Rules for Respecting the Elderly — Elder Line, National Helpline for Senior Citizens, Toll Free 14567", width: 1920, height: 640 },
  { src: `${D}/banners/banner-04.jpg`, alt: "National Helpline Against Atrocities on Scheduled Castes and Scheduled Tribes, 14566", width: 1920, height: 640 },
  { src: `${D}/banners/banner-05.jpg`, alt: "Nasha Mukt Bharat Abhiyaan", width: 1920, height: 640, href: "https://nmba.dosje.gov.in/" },
  { src: `${D}/banners/banner-06.jpg`, alt: "Swachhotsav — Swachhata Hi Seva 2025, a Swachh Bharat Mission initiative, 17 September to 2 October 2025", width: 1920, height: 640 },
];

/** The partner-logo carousel above the footer, in the reference's order. */
export const DBIM_PARTNERS: { src: string; label: string; href?: string }[] = [
  { src: `${D}/partners/partner-01.png`, label: "Pradhan Mantri Matru Vandana Yojana", href: "https://pmmvy.wcd.gov.in/" },
  { src: `${D}/partners/partner-02.png`, label: "Child Marriage Free Bharat", href: "https://stopchildmarriage.wcd.gov.in/" },
  { src: `${D}/partners/partner-03.png`, label: "Right to Information", href: "https://rtionline.gov.in/" },
  { src: `${D}/partners/partner-04.png`, label: "e-SamikSha", href: "https://esamiksha.gov.in/" },
  { src: `${D}/partners/partner-05.png`, label: "National Commission for Women Helpline, 7827170170", href: "https://ncw.nic.in/" },
  { src: `${D}/partners/partner-06.jpg`, label: "National Helpdesk for Prevention of Atrocities, 14566", href: "https://nhapoa.gov.in/" },
  { src: `${D}/partners/partner-07.png`, label: "Open Government Data Platform India", href: "https://data.gov.in/" },
  { src: `${D}/partners/partner-08.png`, label: "Digital India", href: "https://www.digitalindia.gov.in/" },
  { src: `${D}/partners/partner-09.png`, label: "Elder Line, National Helpline for Senior Citizens, 14567", href: "https://elderline.dosje.gov.in/" },
  { src: `${D}/partners/partner-10.png`, label: "Department of Empowerment of Persons with Disabilities", href: "https://depwd.gov.in/" },
  { src: `${D}/partners/partner-11.png`, label: "SEED — Scheme for Economic Empowerment of DNTs", href: "https://seed.dosje.gov.in/" },
  { src: `${D}/partners/partner-12.png`, label: "e-Anudaan", href: "https://grants-msje.gov.in/" },
  { src: `${D}/partners/partner-13.png`, label: "Emergency Response Support System, 112", href: "https://112.gov.in/" },
  { src: `${D}/partners/partner-14.png`, label: "Childline, 1098" },
  { src: `${D}/partners/partner-15.png`, label: "Women Helpline, 181" },
  { src: `${D}/partners/partner-16.png`, label: "Sakhi One Stop Centre" },
  { src: `${D}/partners/partner-17.png`, label: "Shakti Sadans" },
  { src: `${D}/partners/partner-18.png`, label: "National Toll free Deaddiction Helpline (NMBA)", href: "https://nmba.dosje.gov.in/" },
  { src: `${D}/partners/partner-19.png`, label: "india gov in", href: "https://www.india.gov.in/" },
  { src: `${D}/partners/partner-20.png`, label: "Pradhan Mantri Adarsh Gram Yojana" },
  { src: `${D}/partners/partner-21.png`, label: "CPGRAMS", href: "https://pgportal.gov.in/" },
  { src: `${D}/partners/partner-22.png`, label: "MY Gov", href: "https://www.mygov.in/" },
];

/** Portraits, square, as the reference crops them. */
export const DBIM_PEOPLE = {
  primeMinister: { src: `${D}/people/narendra-modi.jpg`, alt: "Shri Narendra Modi, Hon'ble Prime Minister", width: 520, height: 520 },
  ministers: [
    { name: "Dr. Virendra Kumar", role: "Hon'ble Union Minister", src: `${D}/people/virendra-kumar.png` },
    { name: "Shri Ramdas Athawale", role: "Hon'ble Minister of State", src: `${D}/people/ramdas-athawale.png` },
    { name: "Shri B. L. Verma", role: "Hon'ble Minister of State", src: `${D}/people/b-l-verma.png` },
  ],
} as const;

/** A footer social account: the reference's white PNG, or an inline outline glyph where it has none. */
export interface DbimSocialLink {
  label: string;
  href: string;
  /** The reference's own 24×24 white icon. */
  src?: string;
  /** An outline glyph drawn in `currentColor` (the footer's white), for accounts the reference does not carry. */
  icon?: "whatsapp";
}

/** Header and footer marks. */
export const DBIM_BRAND = {
  // The estate's vector mark (the redesign's masthead uses the same file), not the reference's
  // 150px PNG, which was soft on every high-density screen. Shown at the reference's 150px.
  digitalIndia: { src: "/website/images/digital-india-logo.svg", alt: "Digital India — Power To Empower", width: 150, height: 58 },
  /*
   * The second partner logo in DBIM Header 1, which the DBIM review team allowed on
   * 25 Sep 2026 ("either replacing Digital India or next to it"; the orange band ruled
   * out). The estate's canonical vector mark — the roundel, which carries the name in
   * both scripts. The horizontal lockup (design-system/samavesh-lockup.png, 563×121)
   * would be 270px wide at the 58px partner height with a 9px tagline: too wide for
   * the header's free space and not legible. Not linked: the estate has no public
   * SAMAVESH address inside this design.
   */
  samavesh: { src: "/design-system/samavesh-logo.svg", alt: "SAMAVESH", width: 58, height: 58 },
  indiaGovIn: { src: `${D}/brand/india-gov-in.svg`, alt: "National Portal of India", href: "https://www.india.gov.in/" },
  myGov: { src: `${D}/brand/mygov-meri-sarkar.png`, alt: "MyGov — Meri Sarkar", href: "https://www.mygov.in/" },
  social: [
    { label: "Facebook", src: `${D}/icons/facebook.png`, href: "https://www.facebook.com/goimsje" },
    { label: "X", src: `${D}/icons/x.png`, href: "https://x.com/msjegoi" },
    { label: "YouTube", src: `${D}/icons/youtube.png`, href: "https://www.youtube.com/@ministryofsocialjustice511" },
    { label: "Instagram", src: `${D}/icons/instagram.png`, href: "https://www.instagram.com/msjegoi/" },
    // Allowed by the DBIM review team on 25 Sep 2026; the channel is the Department's own
    // (components/website-next/chrome/Footer.tsx). Outline, one colour, like the four above.
    { label: "WhatsApp Channel", icon: "whatsapp", href: "https://whatsapp.com/channel/0029Vb7GfwH6mYPMHOvTd51W" },
  ] satisfies readonly DbimSocialLink[] as readonly DbimSocialLink[],
} as const;

/** The three tiles of the home page's campaign row (two central campaigns, one Department item). */
export const DBIM_CAMPAIGNS = {
  myGovDpdp: { src: `${D}/home/mygov-dpdp-rules-2025.png`, alt: "MyGov — inviting feedback on the Digital Personal Data Protection Rules 2025", href: "https://www.mygov.in/" },
  scholarshipVideo: {
    // Streamed from the Government's own media host, as the reference does; never bundled.
    src: "https://playhls.media.nic.in/igot_vod/MyGov/NOV24/video/studentmustknow.mp4",
    title: "The Scholarship Every Indian Student Must Know",
  },
  socialAudit: { src: `${D}/home/social-audit-mis.png`, alt: "Social Audit MIS Portal of the Department of Social Justice and Empowerment", href: "https://socialaudit.dosje.gov.in/" },
} as const;

/** The three persona illustrations of "Explore User Personas", in carousel order. */
export const DBIM_PERSONA_ART = [`${D}/personas/persona-1.png`, `${D}/personas/persona-2.png`, `${D}/personas/persona-3.png`] as const;

/** The four tile icons of a persona page. */
export const DBIM_PERSONA_ICONS = {
  schemes: `${D}/personas/icon-schemes.png`,
  tenders: `${D}/personas/icon-tenders.png`,
  publications: `${D}/personas/icon-publications.png`,
  vacancies: `${D}/personas/icon-vacancies.png`,
} as const;

/** Scheme card photographs from the reference, keyed by a word that appears in the scheme's name. */
export const DBIM_SCHEME_ART: { match: RegExp; src: string }[] = [
  { match: /AVYAY|Vayo/i, src: `${D}/schemes/avyay.jpg` },
  { match: /Drug Demand|NAPDDR/i, src: `${D}/schemes/napddr.jpg` },
  { match: /SHRESHTA/i, src: `${D}/schemes/shreshta.jpg` },
  { match: /Top Class/i, src: `${D}/schemes/top-class-sc.png` },
  { match: /Hostel/i, src: `${D}/schemes/obc-hostels.png` },
  { match: /Interest Subsidy/i, src: `${D}/schemes/interest-subsidy.jpg` },
  { match: /Loan|NBCFDC/i, src: `${D}/schemes/nbcfdc-education-loan.png` },
];

/** Fallback card photographs, used in turn for schemes with no photograph of their own. */
export const DBIM_SCHEME_ART_FALLBACK = [`${D}/schemes/generic-a.png`, `${D}/schemes/generic-b.png`] as const;

export const DBIM_PARLIAMENT = {
  lokSabha: { src: `${D}/parliament/lok-sabha.png`, alt: "Lok Sabha chamber", href: "https://sansad.in/ls/questions/questions-and-answers" },
  rajyaSabha: { src: `${D}/parliament/rajya-sabha.png`, alt: "Rajya Sabha chamber", href: "https://sansad.in/rs/questions/questions-and-answers" },
} as const;
