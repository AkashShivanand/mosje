import { SAMAVESH_MARK } from "../../brand/org-logo-registry";
import type { BrandMark } from "./types";

/**
 * The SAMAVESH cobrand for the masthead's trailing cluster — the mark, the name and
 * the department's expansion of the acronym, exactly as the Figma Navbar draws it
 * (`Cobranding › SAMAVESH`). One value, so seven portals stop each pasting their own
 * `{ src, alt: "SAMAVESH" }` at a different height and losing the two text lines.
 *
 * `alt` is empty on purpose: the title beside the mark is the name, and a screen
 * reader should hear "SAMAVESH" once.
 */
export const SAMAVESH_COBRAND: BrandMark = {
  src: SAMAVESH_MARK,
  alt: "",
  title: "SAMAVESH",
  subtitle: "Single Access Mechanism for All Verticals of Empowerment & Social Harmony",
  height: 40,
};
