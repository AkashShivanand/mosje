"use client";

import * as React from "react";
import Image from "next/image";
import { Icon, IconButton } from "@mosje/design-system";
import "./logo-strip.css";
import { getOrganisation } from "@/data/website";
import { PARTNER_LOGOS } from "@/lib/website-shared/partners";

/**
 * The homepage logo strip: the live site's own carousel, in its order — the
 * Department's bodies, then the Government of India platforms and helplines it
 * links to — shared with every design (lib/website-shared/partners.ts). A mark for
 * one of the Department's bodies opens that body's page here; any other opens the
 * site the live carousel links it to.
 *
 * Until 28 Sep 2026 this file assembled a mix of its own: the scheme portals, five
 * platforms and the registry's wordmarks, twenty marks against the live site's 42.
 */
interface EcosystemLogo {
  src: string;
  alt: string;
  href: string;
  width: number;
}

/** Drawn 48px tall, so each mark's width follows its own proportions. */
const HEIGHT = 48;

const logos: EcosystemLogo[] = PARTNER_LOGOS.map((p) => ({
  src: p.src,
  alt: p.label,
  href: (p.organisationId && getOrganisation(p.organisationId)?.profileHref) || p.href || "/website",
  width: Math.round((HEIGHT * p.width) / p.height),
}));

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
      {logos.map((logo, i) => {
        const isExternal = logo.href.startsWith("http");
        return (
          <li key={`${copy ? "copy-" : ""}${i}-${logo.src}`} className="sa-logo-strip__item">
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
                height={HEIGHT}
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
      aria-label="Organisations and Government Platforms"
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
