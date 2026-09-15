import type { PortalLoginShellProps } from "./portal-login-shell";
import type { PortalLoginConfig } from "./types";

/**
 * The estate's own copies of the three chrome marks, served from the hub root.
 *
 * **The defaults were `/brand/*.svg` until 2026-09-14, and nothing was ever
 * served there** — a portal that left `brandAssets` out got three broken images
 * in its masthead. These are the files every portal's `brand/` folder copies:
 * byte-identical (md5 checked) to `public/portals/<slug>/brand/`.
 */
export const DEFAULT_LOGIN_MARKS = {
  emblemSrc: "/design-system/national-emblem.svg",
  digitalIndiaSrc: "/website/images/digital-india-logo.svg",
  samaveshLogoSrc: "/design-system/samavesh-logo.svg",
} as const;

/**
 * The shell props a portal's config decides — the marks, the photograph and the
 * Signing Into strip — derived in ONE place.
 *
 * `PortalLoginTemplate` and `PortalRecoveryTemplate` both read it, so a portal's
 * sign-in and its password recovery cannot load their emblem from different
 * roots or name the portal differently. That drift is exactly what the
 * hand-built recovery pages had.
 */
export function loginShellChrome(
  config: Pick<
    PortalLoginConfig,
    "portalName" | "portalTagline" | "portalDescription" | "changeHref" | "brandAssets"
  >
): Pick<
  PortalLoginShellProps,
  | "emblemSrc"
  | "digitalIndiaSrc"
  | "samaveshLogoSrc"
  | "heroImageSrc"
  | "signingInto"
  | "portalTagline"
  | "portalDescription"
  | "changeHref"
> {
  const assets = config.brandAssets;
  return {
    emblemSrc: assets?.emblemSrc || DEFAULT_LOGIN_MARKS.emblemSrc,
    digitalIndiaSrc: assets?.digitalIndiaSrc || DEFAULT_LOGIN_MARKS.digitalIndiaSrc,
    samaveshLogoSrc: assets?.samaveshLogoSrc || DEFAULT_LOGIN_MARKS.samaveshLogoSrc,
    /* No `||` fallback, unlike the three marks: an absent photograph is a real
       state the hero draws (the solid brand column), not a missing asset. */
    heroImageSrc: assets?.heroImageSrc,
    signingInto: config.portalName,
    portalTagline: config.portalTagline,
    portalDescription: config.portalDescription,
    changeHref: config.changeHref || "/",
  };
}
