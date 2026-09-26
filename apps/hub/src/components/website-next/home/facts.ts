/**
 * Figures and words the Department publishes on its own home page
 * (dosje.gov.in, read 22 Sep 2026). Quoted, not composed: the home page carries
 * nothing the Department has not stated itself (ui-restraint-and-copy.md).
 */

/** The live home page's statistics strip (DBIM home-page component). */
export const GLANCE = [
  { icon: "payments", label: "Cumulative Disbursement", value: "₹67,977", unit: "Crore", note: "Scholarships for Scheduled Castes" },
  { icon: "groups", label: "Beneficiary Coverage", value: "19.82", unit: "Crore", note: "Cumulative across all schemes" },
  { icon: "account_balance", label: "Release of Funds, FY 2025–26", value: "₹8,731", unit: "Crore", note: "Provisional, 14.3% above the previous year" },
] as const;

/**
 * About Us, verbatim except "We implement" → "It implements": the estate speaks
 * about the Department, not as it.
 *
 * The third sentence was cut until 24 Sep 2026 and is back. It was left to the
 * About page on the reasoning that the home page wants the short form — but the
 * design draws the whole paragraph, and the clause carries the one thing in it a
 * reader could not guess: that the Department works without current demographic
 * data.
 */
export const MANDATE =
  "The Department of Social Justice & Empowerment (DoSJE) is mandated to ensure the empowerment and welfare of India’s most vulnerable groups, including Scheduled Castes, OBCs, Senior Citizens, Transgender Persons, and victims of substance abuse. It implements various targeted schemes for their social, educational, and economic development, ensuring their inclusion despite challenges like the lack of updated demographic data.";

/**
 * The line the Ministry prints under the mandate on its own home page, quoted
 * verbatim (dosje.gov.in, read 24 Sep 2026), and drawn as a pull-quote in the
 * design.
 *
 * It was left off until 24 Sep 2026 as a restatement of the mandate above it —
 * which it partly is. It is back because it is the Ministry speaking about
 * itself rather than about the Department, which is a different sentence, and
 * because the design gives it a place of its own rather than a second
 * paragraph.
 */
export const MINISTRY_LINE =
  "The Ministry of Social Justice & Empowerment works to uplift India’s most vulnerable communities through targeted initiatives, inclusive growth, and compassionate governance.";

/**
 * Helplines, tap to call (issue MAN-07). Sources, from the scheme master:
 * 14446 AR §3.15; 14567 AR §3.14; 14566 PIB 1780979 and the NHAA page.
 */
export const HELPLINES = [
  { number: "14446", name: "Nasha Mukt Bharat Abhiyaan", sub: "Drug de-addiction counselling and referral", icon: "self_improvement" },
  { number: "14567", name: "Elderline", sub: "National helpline for senior citizens", icon: "elderly" },
  { number: "14566", name: "National Helpline Against Atrocities", sub: "For Scheduled Castes and Scheduled Tribes", icon: "shield_person" },
] as const;

/** The Department's official accounts, as linked from its footer. */
export const SOCIAL = [
  { name: "Facebook", handle: "goimsje", href: "https://www.facebook.com/goimsje", glyph: "facebook" },
  { name: "X", handle: "@msjegoi", href: "https://x.com/msjegoi", glyph: "x" },
  { name: "Instagram", handle: "@msjegoi", href: "https://www.instagram.com/msjegoi", glyph: "instagram" },
  { name: "YouTube", handle: "Official channel", href: "https://www.youtube.com/@ministryofsocialjustice511", glyph: "youtube" },
  { name: "WhatsApp", handle: "Official channel", href: "https://whatsapp.com/channel/0029Vb7GfwH6mYPMHOvTd51W", glyph: "whatsapp" },
] as const;
