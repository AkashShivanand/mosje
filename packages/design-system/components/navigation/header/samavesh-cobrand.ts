import type { BrandMark } from "./types";

/**
 * The SAMAVESH cobrand for the masthead's trailing cluster — the mark, the name and
 * the department's expansion of the acronym, as ONE piece of artwork.
 *
 * It is exported from the Figma Navbar's `Cobranding › SAMAVESH` with the two lines
 * OUTLINED (2026-09-05): a lockup is a logo, not UI text, so it is not asked to meet
 * the 12px floor and is not read as text — `alt` carries the words instead. One value,
 * so seven portals stop each pasting their own `{ src, alt: "SAMAVESH" }` at a
 * different height and dropping the expansion.
 *
 * Shipped as a PNG at 3× the 40px it renders at (563 × 121, 23 KB), per the mark
 * resolution rule. The SVG export of the same frame is 821 KB, because the seal inside
 * it is the traced 80-path emblem the registry already refuses to load as a vector.
 * The asset lives at the estate's single origin; every zone can reach it.
 */
export const SAMAVESH_COBRAND: BrandMark = {
  src: "/design-system/samavesh-lockup.png",
  alt: "SAMAVESH — Single Access Mechanism for All Verticals of Empowerment & Social Harmony",
  height: 40,
};
