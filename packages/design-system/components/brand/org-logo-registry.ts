/*
 * NO "use client" HERE, AND THAT IS THE WHOLE POINT OF THE SPLIT.
 *
 * These are plain data and pure functions, and SERVER code needs them — page
 * metadata, an og:image, a server-rendered directory. When they lived in the
 * `"use client"` component file, a server component importing `ORG_LOGOS` got a
 * client-reference proxy rather than the object: `Object.keys()` returned an
 * empty array and the documentation page's own catalogue of all sixteen marks
 * rendered as nothing, with no error anywhere. Found by counting tiles on the
 * page, not by reading the code.
 *
 * `org-logo.tsx` imports from here and re-exports, so a consumer never has to
 * know which of the two files a name came from.
 */

/**
 * Every organisation and scheme mark the estate ships, by slug.
 *
 * THIS IS THE ONLY PLACE A MARK'S PATH IS WRITTEN. Before it existed the same 16
 * files sat in TWO byte-identical directories — `/design-system/org-logos/` and
 * `/website/images/org-logos/` — and `organisation-details.ts` reached into
 * THREE different roots for the same class of asset, including a third
 * `/website/images/organisations/` for NCSC alone. Nothing reconciled them, so a
 * mark replaced in one place stayed stale in the others.
 *
 * `/design-system/org-logos/` is the canonical root: these are design-system
 * assets, and the website is one consumer of them rather than their owner.
 *
 * TO ADD A MARK: drop the file in `apps/hub/public/design-system/org-logos/`,
 * add a line here, and nothing else. A consumer that writes its own path is a
 * defect, not a shortcut — `npm run check:org-logos` fails the build on one.
 */
export const ORG_LOGOS = {
  daf: "/design-system/org-logos/daf.png",
  daic: "/design-system/org-logos/daic.png",
  dwbdnc: "/design-system/org-logos/dwbdnc.png",
  jrf: "/design-system/org-logos/jrf.png",
  nbcfdc: "/design-system/org-logos/nbcfdc.png",
  ncbc: "/design-system/org-logos/ncbc.png",
  ncsc: "/design-system/org-logos/ncsc.png",
  ncsk: "/design-system/org-logos/ncsk.png",
  nisd: "/design-system/org-logos/nisd.png",
  nmba: "/design-system/org-logos/nmba.png",
  nos: "/design-system/org-logos/nos.png",
  "pm-ajay": "/design-system/org-logos/pm-ajay.png",
  nsfdc: "/design-system/org-logos/nsfdc.png",
  nskfdc: "/design-system/org-logos/nskfdc.png",
  sambal: "/design-system/org-logos/sambal.png",
  scw: "/design-system/org-logos/scw.png",
  smile: "/design-system/org-logos/smile.png",
} as const;

export type OrgSlug = keyof typeof ORG_LOGOS;

/**
 * THE MARKS THAT DO NOT CARRY THEIR OWN GROUND.
 *
 * Most organisation marks are self-contained seals — a coloured disc, a badge,
 * a roundel — and they sit on a brand-blue band exactly as the handoff draws
 * them: bare, edge to edge, with no plate behind. `Logo` in the Organisation
 * Details header (3751:10135) is a 100x100 frame with no fill, no stroke and no
 * radius, and NMBA's own frame (51586:22013) puts its green seal straight on the
 * blue.
 *
 * The six below cannot. Rendered at 100px on the band's own gradient and looked
 * at rather than calculated:
 *
 *   nbcfdc  a pale blue mark on a blue band — it all but disappears
 *   smile   thin, pale artwork with no enclosing shape
 *   daf     the State Emblem in near-black line art. The ratio is fine (4.3:1)
 *   dwbdnc  and the LEGIBILITY is not: at 2% coverage the fine strokes and the
 *   ncsk    "सत्यमेव जयते" beneath them read as a smudge on a mid-blue ground.
 *   scw     A number cannot see that; the contact sheet can.
 *
 * SO THE PLATE IS THE EXCEPTION, NOT THE RULE. It used to be applied to all
 * seventeen, which put a white ring around eleven marks that already had their
 * own edge — the "thick stroke" that is in no design. A mark listed here is a
 * statement about that organisation's ARTWORK, and the right long-term fix is
 * artwork that holds the band; until then this keeps it readable.
 *
 * The State Emblem fallback needs one for the same reason `daf` does.
 */
export const ORG_MARKS_NEEDING_GROUND: ReadonlySet<string> = new Set([
  "nbcfdc",
  "smile",
  "daf",
  "dwbdnc",
  "ncsk",
  "scw",
]);

/** Does this mark need a plate behind it on a brand-coloured band? */
export function markNeedsGround(src: string | undefined): boolean {
  if (!src) return true; // the State Emblem fallback — see above
  const slug = src.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";
  return ORG_MARKS_NEEDING_GROUND.has(slug) || /national-emblem/i.test(slug);
}


/**
 * The State Emblem, used where an organisation has no mark of its own.
 *
 * IT IS THE CORRECT ANSWER, NOT A PLACEHOLDER. These are Government of India
 * properties; a portal without a bespoke logo is still a government portal, and
 * the emblem says so. Never substitute a grey box, an initial, or a generic icon.
 */
export const ORG_LOGO_FALLBACK = "/images/National-Emblem-logo.svg";

/**
 * The SAMAVESH mark, and the State Emblem in both inks — the estate's own marks,
 * as opposed to an organisation's.
 *
 * They live here for the same reason the org logos do: every one of them was
 * being written as a string literal at the point of use, so a mark could be
 * replaced in one place and stay stale in five others.
 *
 * `SAMAVESH_MARK` is a 13 KB raster and it is the DEFAULT ON PURPOSE. The master
 * `samavesh-logo.svg` is a traced 80-path emblem at 743 KB, which was being
 * loaded eagerly on every page of the website to render at 44px. Reach for
 * `SAMAVESH_MARK_VECTOR` only where the mark is drawn large.
 */
export const SAMAVESH_MARK = "/design-system/samavesh-logo-156.png";
export const SAMAVESH_MARK_VECTOR = "/design-system/samavesh-logo.svg";
export const NATIONAL_EMBLEM = ORG_LOGO_FALLBACK;
export const NATIONAL_EMBLEM_INVERSE = "/images/National_Emblem_logo_white.svg";

/**
 * Which mark a portal ROUTE wears.
 *
 * Kept beside the marks rather than inside the banner, because three surfaces
 * needed the same answer and two of them had their own copy of it. A route absent
 * from this map falls back to the emblem, which is correct rather than broken.
 */
export const PORTAL_ORG_LOGOS: Record<string, OrgSlug> = {
  "/portals/scw": "scw",
  "/portals/tg": "smile",
  "/portals/smile-admin": "smile",
  "/portals/nmba": "nmba",
  "/portals/pm-ajay": "pm-ajay",
  "/portals/nos": "nos",
  /*
   * SAMBAL. The registry calls this route `nhapoa`; the SCHEME is SAMBAL and it
   * has a mark of its own. It rendered as the State Emblem because the slug was
   * missing here AND the library's own variant was unusable — its device sat
   * under a 74-node, one-TEXT-node-per-character tagline inside a 56px box, so
   * nobody had ever exported it. Both are fixed; see the changelog.
   */
  "/portals/nhapoa": "sambal",
  "/portals/ncsk": "ncsk",
  "/portals/ncbc": "ncbc",
  "/portals/ncsc": "ncsc",
  "/portals/nsfdc": "nsfdc",
  "/portals/nskfdc": "nskfdc",
  "/portals/nbcfdc": "nbcfdc",
  "/portals/nisd": "nisd",
  "/portals/daic": "daic",
  "/portals/dwbdnc": "dwbdnc",
  "/portals/jrf": "jrf",
  "/portals/daf": "daf",
};

/** The mark for a slug, or the State Emblem when there is none. */
export function orgLogoSrc(org?: OrgSlug | null): string {
  return (org && ORG_LOGOS[org]) || ORG_LOGO_FALLBACK;
}

/** The mark for a portal route, or the State Emblem when the route has none. */
export function portalLogoSrc(path?: string | null): string {
  return orgLogoSrc(path ? PORTAL_ORG_LOGOS[path] : undefined);
}
