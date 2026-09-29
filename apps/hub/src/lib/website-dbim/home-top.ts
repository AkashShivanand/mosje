/**
 * What the top of the DBIM home page carries that no other design does — the About Us
 * tiles. Its PM quote and About Us content are shared with every design.
 */

/* The Prime Minister's quotation is shared with every design:
   lib/website-shared/home.ts (PM_QUOTE). */

/* The About Us words and Ministers are shared with every design:
   lib/website-shared/home.ts. Only the DBIM tiles, below, are this design's own. */

/**
 * The three tiles under About Us. The reference build shows Our Team / Our Division /
 * Our Organisation; the DBIM review team ruled on 25 Sep 2026 that they are Our Team,
 * Our Organisation and Our Performance. The icons keep the reference's order.
 */
export const DBIM_ABOUT_TILES = [
  { label: "Our Team", path: "/ministry/our-team", icon: "our-team" },
  { label: "Our Organisation", path: "/ministry/our-organisation", icon: "organisation" },
  { label: "Our Performance", path: "/ministry/our-performance", icon: "performance" },
] as const;
