"use client";

import * as React from "react";
import Image from "next/image";
import { Icon, IconButton } from "@mosje/design-system";
import "./logo-strip.css";
import { ORGANISATIONS } from "@/data/website";
import { SCHEME_MARKS } from "@/components/website/home-options/schemes";

/**
 * The homepage logo strip: the Department's scheme portals FIRST, then Government of India
 * platforms, then the Ministry's other bodies. Schemes lead on the Secretary's review of
 * 2026-09-17 — they are what a citizen comes to use, and each mark opens its portal.
 *
 * The two halves are kept apart because they are different things. The platforms below are
 * not our organisations and have no entry in the registry; the Ministry's bodies are read
 * from it, so their names cannot drift out of step with the rest of the site — which had
 * already happened here, this file spelling DAIC "Dr. Ambedkar International Centre" while
 * the registry said "Dr Ambedkar".
 *
 * Their links were also all `href: "#"` — every external partner logo was clickable and
 * not one of the Ministry's own was. They resolve to the organisation's profile now.
 */

interface EcosystemLogo {
  src: string;
  alt: string;
  href: string;
  width: number;
}

const GOVERNMENT_PLATFORMS: EcosystemLogo[] = [
  {
    src: "/website/images/data-gov.png",
    alt: "Open Government Data (OGD) Platform India",
    href: "https://data.gov.in/",
    width: 130,
  },
  {
    src: "/website/images/india-gov.png",
    alt: "National Portal of India",
    href: "https://www.india.gov.in/",
    width: 130,
  },
  {
    src: "/website/images/make-in-india.png",
    alt: "Make in India",
    href: "https://www.makeinindia.com/",
    width: 90,
  },
  {
    src: "/website/images/my-gov.png",
    alt: "MyGov India",
    href: "https://www.mygov.in/",
    width: 130,
  },
  {
    /* THE COLOUR MARK, AND IT HAS TO BE THE COLOUR ONE. `NeGD-Logo.svg` stacks an
       all-white layer over the colour artwork — drawn for a dark ground — so on
       this light strip the logo rendered white on white and was invisible. Same
       vector as the footer's reversed mark, in NeGD's own blue and green. */
    src: "/website/images/NeGD-Logo-Colour.svg",
    alt: "National e-Governance Division (NeGD)",
    href: "https://negd.gov.in/",
    /* 132 = the mark's own 143:52 at the strip's 48px height. The raster it
       replaces was 120 at that height; a stale width makes Next compare the
       drawn box against the wrong ratio and warn. */
    width: 132,
  },
];

/** Scheme marks, each opening the scheme's own portal. */
const SCHEME_LOGOS: EcosystemLogo[] = SCHEME_MARKS.map((scheme) => ({
  src: scheme.stripSrc,
  alt: `${scheme.name} (${scheme.abbr})`,
  href: scheme.portalHref,
  width: 120,
}));

const SCHEME_ABBRS = new Set(SCHEME_MARKS.map((scheme) => scheme.abbr));

/** The other organisations that publish a horizontal wordmark, in registry order. */
const ORGANISATION_LOGOS: EcosystemLogo[] = ORGANISATIONS.filter(
  (org) => org.wordmarkSrc && !SCHEME_ABBRS.has(org.abbr)
).map((org) => ({
  src: org.wordmarkSrc!,
  alt: `${org.name} (${org.abbr})`,
  href: org.profileHref,
  width: 120,
}));

const logos: EcosystemLogo[] = [...SCHEME_LOGOS, ...GOVERNMENT_PLATFORMS, ...ORGANISATION_LOGOS];

/**
 * A CAROUSEL, per the finalised homepage design (Figma 51610:18831): one line of
 * marks drifting sideways, clipped at both edges, rather than a wrapped grid.
 *
 * The list is rendered twice and the track moves by exactly half its width, so the
 * loop has no seam. The second copy is presentation only — hidden from assistive
 * technology and out of the tab order — so each organisation is announced and
 * reached once.
 *
 * WCAG 2.2.2: anything that moves for more than five seconds must be pausable, so
 * the row carries a pause button, and it also holds still while pointed at or while
 * a mark has keyboard focus. Under `prefers-reduced-motion` it does not move at all
 * and scrolls sideways by hand instead (logo-strip.css).
 */
export function LogoStrip() {
  const [playing, setPlaying] = React.useState(true);

  const renderList = (copy: boolean) => (
    <ul className="sa-logo-strip__list" aria-hidden={copy || undefined}>
      {logos.map((logo) => {
        const isExternal = logo.href.startsWith("http");
        return (
          <li key={`${copy ? "copy-" : ""}${logo.src}`} className="sa-logo-strip__item">
            <a
              href={logo.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              tabIndex={copy ? -1 : undefined}
              /* No blanket dimming: the palest marks (NeGD) were barely visible at
                 80% opacity [WEB-F-08]. Official marks are neither recoloured nor dimmed. */
              className="sa-logo-strip__link"
            >
              <Image
                src={logo.src}
                alt={copy ? "" : logo.alt}
                width={logo.width}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    /* `data-sa-rail-clear`: the pause control sits at this band's right edge, which is
       exactly where the corner rail's transient occupants float. Measured at 375 —
       the assistant's launcher covered it outright, and a WCAG 2.2.2 control that
       cannot be reached is the same as no control. The launcher yields while the two
       overlap and comes straight back (floating-element-placement.md). */
    <section
      className="sa-logo-strip bg-surface"
      aria-label="Schemes, Organisations and Government Platforms"
      data-sa-rail-clear=""
    >
      <div className="sa-logo-strip__viewport" data-playing={playing ? "true" : "false"}>
        <div
          className="sa-logo-strip__track"
          style={{ "--sa-logo-strip-count": logos.length } as React.CSSProperties}
        >
          {renderList(false)}
          {renderList(true)}
        </div>
      </div>
      <div className="sa-container sa-logo-strip__controls">
        <IconButton
          variant="primary"
          appearance="text"
          size="sm"
          icon={<Icon name={playing ? "pause" : "play_arrow"} size={20} />}
          aria-label={playing ? "Pause logo carousel" : "Play logo carousel"}
          aria-pressed={!playing}
          onClick={() => setPlaying((p) => !p)}
        />
      </div>
    </section>
  );
}
