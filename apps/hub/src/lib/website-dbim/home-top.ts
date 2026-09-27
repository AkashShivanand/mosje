/**
 * Content for the top of the DBIM home page — the PM quote and the About Us band.
 * Content is the Department's; the layout is the DBIM reference build's.
 */

/**
 * The Prime Minister's quotation, the same one the 2026 redesign carries
 * (components/website-next/home/PmQuote.tsx), so every design of the website shows one quote.
 *
 * SOURCE: PIB's English text of the Address to the Nation on the 79th Independence Day,
 * Red Fort, 15 August 2025 (PRID 2156749). Verbatim.
 */
export const DBIM_PM_QUOTE = {
  quote:
    "We emphasize saturation, because if there is any true execution of social justice, it is in saturation where no eligible person is left out, where the government goes to the eligible person’s home, and ensures they get what is rightfully theirs.",
  attribution: "Shri Narendra Modi, Prime Minister of India",
  event: "Address to the Nation on the 79th Independence Day, Red Fort",
  /** In the reference's dd.mm.yyyy form. */
  date: "15.08.2025",
  dateTime: "2025-08-15",
  href: "https://pib.gov.in/PressReleasePage.aspx?PRID=2156749",
} as const;

/**
 * SOURCE: the sub-line is the DBIM reference build's own (home page, About Us); the
 * introduction is the Department's, from the About page of the same build
 * (master-socialjustice.digifootprint.gov.in/ministry, fetched 25 Sep 2026), and is the
 * description the estate's own About page carries.
 */
export const DBIM_ABOUT = {
  subline: "Sector overview at a glance",
  intro:
    "The Department of Social Justice & Empowerment is entrusted with the empowerment of the disadvantaged and marginalized sections of society.",
} as const;

/**
 * The three tiles under About Us. The reference build shows Our Team / Our Division /
 * Our Organisation; the DBIM review team ruled on 25 Sep 2026 that they are Our Team,
 * Our Organisation and Our Performance. The icons keep the reference's order.
 */
export const DBIM_ABOUT_TILES = [
  { label: "Our Team", path: "/ministry/our-team", icon: "team" },
  { label: "Our Organisation", path: "/ministry/our-organisation", icon: "division" },
  { label: "Our Performance", path: "/ministry/our-performance", icon: "organisation" },
] as const;
