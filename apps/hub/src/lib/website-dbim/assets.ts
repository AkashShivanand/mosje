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

/*
 * The home banner carousel is NOT here. It shows the live site's banners, shared by
 * every design — lib/website-shared/home.ts. The reference build's six are still at
 * public/website/dbim/banners/ and are no longer shown.
 */

/*
 * The partner-logo carousel is NOT here. It shows the live site's carousel, shared by
 * every design — lib/website-shared/partners.ts. The reference build's 22 marks are
 * still at public/website/dbim/partners/ and are no longer shown.
 */

/*
 * The Ministers are NOT here. Every design — this one's home page and its Our Team
 * chart included — reads them from lib/website-shared/home.ts. The reference build's
 * portraits are still at public/website/dbim/people/ and are no longer shown.
 */

/** A footer social account, drawn with the DBIM Visual Library's own mark for the platform. */
export interface DbimSocialLink {
  label: string;
  href: string;
  /** A `DbimIcon` name — the library's line mark, painted in the footer's white. */
  icon: "facebook" | "x" | "youtube" | "instagram" | "whatsapp";
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
   *
   * org-logo-exempt(portal-local): the SAMAVESH roundel is the design system's OWN mark, not an
   * organisation mark, so the OrgLogo registry holds no entry to resolve it through.
   *
   * A 174px PNG (8 KB), 3× the 58px it is drawn at, rendered from the estate's canonical
   * vector (design-system/samavesh-logo.svg). The vector is 761 KB of traced curves — no
   * precision short of redrawing it gets under DBIM 3.0 §5.5 iv's 100 KB — and this design is
   * held to that limit. The other surfaces keep the vector.
   */
  samavesh: { src: `${D}/brand/samavesh-logo.png`, alt: "SAMAVESH", width: 58, height: 58 },
  indiaGovIn: { src: `${D}/brand/india-gov-in.svg`, alt: "National Portal of India", href: "https://www.india.gov.in/" },
  myGov: { src: `${D}/brand/mygov-meri-sarkar.png`, alt: "MyGov — Meri Sarkar", href: "https://www.mygov.in/" },
  social: [
    { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/goimsje" },
    { label: "X", icon: "x", href: "https://x.com/msjegoi" },
    { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@ministryofsocialjustice511" },
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/msjegoi/" },
    // Allowed by the DBIM review team on 25 Sep 2026; the channel is the Department's own
    // (components/website-next/chrome/Footer.tsx).
    { label: "WhatsApp Channel", icon: "whatsapp", href: "https://whatsapp.com/channel/0029Vb7GfwH6mYPMHOvTd51W" },
  ] satisfies readonly DbimSocialLink[] as readonly DbimSocialLink[],
} as const;

/**
 * The Department's Social Audit MIS portal: its poster on Ministry › Our Performance,
 * and a row of Important Links. It sat in the home page's posts row until 28 Sep 2026.
 */
export const DBIM_SOCIAL_AUDIT = {
  src: `${D}/home/social-audit-mis.png`,
  alt: "Social Audit MIS Portal of the Department of Social Justice and Empowerment",
  label: "Social Audit MIS Portal",
  href: "https://socialaudit.dosje.gov.in/",
} as const;

/** The two CCPS central posts of the home page's posts row; the infographic beside them comes from lib/website/infographics.ts. */
export const DBIM_CAMPAIGNS = {
  myGovDpdp: { src: `${D}/home/mygov-dpdp-rules-2025.png`, alt: "MyGov — inviting feedback on the Digital Personal Data Protection Rules 2025", href: "https://www.mygov.in/" },
  scholarshipVideo: {
    // Streamed from the Government's own media host, as the reference does; never bundled.
    src: "https://playhls.media.nic.in/igot_vod/MyGov/NOV24/video/studentmustknow.mp4",
    title: "The Scholarship Every Indian Student Must Know",
  },
} as const;

/** The three persona illustrations of "Explore User Personas", in carousel order. */
export const DBIM_PERSONA_ART = [`${D}/personas/persona-1.png`, `${D}/personas/persona-2.png`, `${D}/personas/persona-3.png`] as const;

/**
 * The four tile icons of a persona page — DBIM Visual Library icons (`DbimIcon` names),
 * the same four drawings the reference shipped as purple PNGs, now in the key colour.
 */
export const DBIM_PERSONA_ICONS = ["schemes", "tenders", "publications", "job-opportunity"] as const;


export const DBIM_PARLIAMENT = {
  lokSabha: { src: `${D}/parliament/lok-sabha.png`, alt: "Lok Sabha chamber", href: "https://sansad.in/ls/questions/questions-and-answers" },
  rajyaSabha: { src: `${D}/parliament/rajya-sabha.png`, alt: "Rajya Sabha chamber", href: "https://sansad.in/rs/questions/questions-and-answers" },
} as const;
