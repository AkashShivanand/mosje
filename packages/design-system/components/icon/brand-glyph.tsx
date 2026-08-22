import * as React from "react";

export type BrandGlyphName = "facebook" | "x" | "instagram" | "youtube" | "whatsapp";

interface BrandGlyphDef {
  /** Human name, for the story and the docs table. Never an accessible name. */
  title: string;
  /** The vendor's own artwork box. Marks are NOT redrawn — only placed. */
  viewBox: string;
  path: string;
  /** Measured bounding box of `path` inside `viewBox`: [x, y, w, h]. */
  box: [number, number, number, number];
  /**
   * Optical correction, hand-tuned. 1 = the mark's longest side lands exactly
   * on OPTICAL_SIZE. Below 1 pulls a visually heavy mark back; above 1 pushes
   * a light one forward. See OPTICAL NORMALISATION below for how these were
   * derived and how to re-derive them.
   */
  optical: number;
}

/**
 * The optical square, inside the 24-unit box every glyph is emitted in.
 *
 * 20 rather than 24: vendor artwork is drawn to the edge of its own box, so
 * five full-bleed marks touch their container and the rail reads as crowded.
 * Four units of air puts the mark at ~50% of a 40px chip, which is the
 * proportion a glyph-in-a-circle wants. At 55% the chip stops reading as a
 * frame and becomes a tight collar — compared side by side before choosing.
 */
const OPTICAL_SIZE = 20;

/*
 * OPTICAL NORMALISATION — why this file does arithmetic instead of just
 * shipping five path strings.
 *
 * Brand marks are authored by five different companies to five different
 * containment rules, and dropping them into one row at one size does not make
 * them a set. Measured on the marks this estate was shipping:
 *
 *   mark              optical height   ink coverage
 *   Facebook (badge)      24.00            61.2%
 *   X                     19.50            31.5%
 *   Instagram             24.00            42.0%
 *   YouTube               16.91            62.4%
 *   WhatsApp              24.00            33.8%
 *
 * A 42% spread in height and a 2× spread in weight, in a monochrome rail where
 * nothing else distinguishes them. Two separate defects, fixed separately:
 *
 * 1. THE WRONG ASSET. Facebook was supplied as its app BADGE — the "f" already
 *    inside a filled disc — while the other four are bare marks. That is not a
 *    sizing problem and no amount of scaling fixes it: a solid disc beside four
 *    open marks is a different KIND of object. Replaced with the bare "f".
 *
 * 2. THE SIZING RULE. Each mark's longest side is normalised to OPTICAL_SIZE,
 *    then corrected by `optical`. Longest side, not bounding box and not area:
 *    YouTube is wide and short, so area-matching inflates it past the box edge
 *    (measured — the first attempt here made the spread WORSE, 2.37× → 2.51×).
 *
 * 3. A SHARED CONTAINER, which is the part scaling cannot do. Five silhouettes
 *    — a letterform, a bare X, a hollow camera, a filled slab, a bubble — will
 *    not read as a set however carefully they are sized, because the variance
 *    is in the SHAPE, not the size. Give them one repeating circle and the
 *    circle becomes what the eye reads as the unit; the marks become its
 *    contents. Both places the estate draws these marks now do this: the
 *    footer rail and the homepage social feed.
 *
 * WHY THE CORRECTIONS ARE SMALL. An earlier pass, before the container, pulled
 * hard toward equal INK — YouTube down to 0.86 — because with nothing else to
 * compare against, the eye judges a mark by how dark it is. Inside a chip that
 * reverses: the frame is constant, so the eye compares mark-to-chip and reads
 * EXTENT. The hard correction then made YouTube look undersized in its circle.
 * Rendered at 4× beside the others, the light correction below sat right, the
 * heavy one did not. The tuning belongs to the containment, not to the mark.
 *
 * TO ADD OR RE-TUNE A MARK: paste the vendor path, then measure its bbox with
 * `path.getBBox()` inside its own viewBox and record it as `box`. Start at
 * `optical: 1`, render it IN ITS CHIP beside the others at 4× and adjust in
 * steps of 0.02 until it sits in the row. Never tune a mark on its own — a
 * single mark always looks fine, and the defect only exists in a set. `box`
 * and `path` must be updated together: a stale box misplaces the mark visibly,
 * which is the intended failure mode.
 */
const GLYPHS: Record<BrandGlyphName, BrandGlyphDef> = {
  /* Meta's bare "f", not the app badge — see note 1 above. */
  facebook: {
    title: "Facebook",
    viewBox: "0 0 320 512",
    path: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
    box: [22.89, 0, 274.22, 512],
    optical: 1.0,
  },
  x: {
    title: "X",
    viewBox: "0 0 24 24",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    box: [1.254, 2.25, 21.573, 19.5],
    optical: 1.0,
  },
  instagram: {
    title: "Instagram",
    viewBox: "0 0 24 24",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    box: [0, 0, 24, 24],
    /* An outline encloses more area than it inks; pulled back a hair. */
    optical: 0.98,
  },
  youtube: {
    title: "YouTube",
    viewBox: "0 0 24 24",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    box: [0, 3.545, 24, 16.91],
    /* The one solid slab in the set, so still the heaviest even framed. */
    optical: 0.94,
  },
  whatsapp: {
    title: "WhatsApp",
    viewBox: "0 0 24 24",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.8 11.8 0 0 0 20.465 3.49",
    box: [0.057, 0, 23.886, 24],
    optical: 1.0,
  },
};

/** Every mark this estate ships, in the order the rails use. */
export const BRAND_GLYPHS = Object.keys(GLYPHS) as BrandGlyphName[];

/** The vendor's own name for a mark. For docs and stories, never as a label. */
export function brandGlyphTitle(name: BrandGlyphName): string {
  return GLYPHS[name].title;
}

export interface BrandGlyphProps extends Omit<React.SVGProps<SVGSVGElement>, "viewBox" | "name"> {
  name: BrandGlyphName;
  /** Rendered box, on the DBIM 3.7 scale (16 · 20 · 24 · 32 · 40 · 48 · 64). */
  size?: number;
  /**
   * Announce the mark itself. Omit when a wrapping link or button already
   * carries the accessible name — which is the normal case, and the default.
   */
  "aria-label"?: string;
}

/**
 * BrandGlyph — a third-party brand mark, optically normalised against its
 * siblings and inheriting `currentColor`.
 *
 * Marks are the vendors' own artwork, unredrawn. What this component adds is
 * the thing a row of five logos needs and no vendor supplies: a single optical
 * size. Sizing alone is not enough, though — five different SILHOUETTES never
 * read as a set — so both estate rails also seat the mark in one repeating
 * circle. See OPTICAL NORMALISATION above.
 *
 * COLOUR is always `currentColor` — these are monochrome marks. Set the colour
 * on the parent. Brand colours belong to the brands, not to this estate's
 * tokens, so a coloured treatment sets its own value at the call site.
 *
 * ACCESSIBILITY: decorative by default, exactly like `Icon`. The accessible
 * name belongs on the interactive element that wraps it, so an unlabelled glyph
 * is `aria-hidden`. Pass `aria-label` only for a standalone meaningful mark
 * with no control to carry the name.
 *
 * @example
 * // The normal case — the link owns the name, the glyph is silent
 * <a href={url}><BrandGlyph name="x" /><span className="sr-only">X</span></a>
 *
 * @example
 * // Larger, in the brand's own colour
 * <BrandGlyph name="facebook" size={32} style={{ color: "#1877F2" }} />
 */
export function BrandGlyph({
  name,
  size = 24,
  "aria-label": ariaLabel,
  ...rest
}: BrandGlyphProps): React.JSX.Element {
  const { path, box, optical } = GLYPHS[name];
  const [x, y, w, h] = box;

  /* Longest side onto the optical square, then centre what is left over. */
  const scale = (OPTICAL_SIZE * optical) / Math.max(w, h);
  const tx = 12 - scale * (x + w / 2);
  const ty = 12 - scale * (y + h / 2);

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      focusable="false"
      {...rest}
    >
      {/* The vendor box is mapped into ours here, so `path` stays verbatim. */}
      <g transform={`translate(${tx.toFixed(4)} ${ty.toFixed(4)}) scale(${scale.toFixed(5)})`}>
        <path d={path} />
      </g>
    </svg>
  );
}
