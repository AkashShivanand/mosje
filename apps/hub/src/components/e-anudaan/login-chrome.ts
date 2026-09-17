/**
 * E-Anudaan's sign-in chrome, in one place.
 *
 * The login page and every screen of the NGO-DARPAN flow draw the same masthead, hero and
 * Signing Into strip. A reader who leaves for NGO-DARPAN and returns must land on the page they
 * left, not on a lookalike whose photograph or emblem path has drifted.
 */

const BASE = "/portals/e-anudaan";

export const EANUDAAN_LOGIN_CHROME = {
  portalId: "e-anudaan",
  portalName: "E-Anudaan",
  changeHref: "/portals",
  brandAssets: {
    emblemSrc: `${BASE}/brand/national-emblem.svg`,
    digitalIndiaSrc: `${BASE}/brand/digital-india.svg`,
    // org-logo-exempt(portal-local): E-Anudaan serves its own copies of the three chrome marks from
    // `public/portals/e-anudaan/brand/`, as its forgot- and reset-password pages do. Moved here
    // from the login page unchanged, so the sign-in screens share one set of paths.
    samaveshLogoSrc: `${BASE}/brand/samavesh-logo.svg`,
    /* The handoff's Portal Hero photograph (52380:187201), exported from the design at its native
       1254 square — the source's ceiling, so it is shipped whole rather than upscaled. Served from
       the shared login-hero directory beside SMILE's, because a hero photograph belongs to the
       SCHEME and any portal's login may want it. */
    heroImageSrc: "/portals/login-hero/e-anudaan.jpg",
  },
} as const;
