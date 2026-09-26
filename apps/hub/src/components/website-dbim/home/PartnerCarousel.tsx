"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Icon, IconButton } from "@mosje/design-system";

interface Partner {
  src: string;
  label: string;
  href?: string;
}

const STEP_MS = 3000; // slick's default autoplaySpeed

function useMedia(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/**
 * A scroll-snap track stepped one card at a time, wrapping at both ends (the
 * reference's slick carousel is infinite). Touch scrolls it natively, and a focused
 * logo scrolls itself into view, so every link is reachable without the arrows —
 * which the reference hides below 992px.
 *
 * Autoplay runs only at ≥992px, where the arrows and a pause control are shown; it
 * stops while the pointer or focus is inside, and never runs under reduced motion.
 */
export function DbimPartnerCarousel({ partners }: { partners: Partner[] }) {
  const track = useRef<HTMLUListElement>(null);
  const trackId = useId();
  const wide = useMedia("(min-width: 992px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false); // hover or focus inside

  const step = useCallback(
    (dir: 1 | -1) => {
      const el = track.current;
      const slide = el?.firstElementChild as HTMLElement | null;
      if (!el || !slide) return;
      const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
      const max = el.scrollWidth - el.clientWidth;
      if (dir === 1 && el.scrollLeft >= max - 2) el.scrollTo({ left: 0, behavior });
      else if (dir === -1 && el.scrollLeft <= 2) el.scrollTo({ left: max, behavior });
      else el.scrollBy({ left: dir * slide.offsetWidth, behavior });
    },
    [reduced],
  );

  const auto = wide && !reduced && playing && !held;
  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => step(1), STEP_MS);
    return () => window.clearInterval(t);
  }, [auto, step]);

  return (
    <div
      className="db-hb-partners__slider"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <IconButton
        appearance="text"
        className="db-hb-partners__arrow db-hb-partners__arrow--prev"
        aria-label="Previous partner websites"
        aria-controls={trackId}
        icon={<Icon name="chevron_left" size={32} weight={400} />}
        onClick={() => step(-1)}
      />
      <ul id={trackId} ref={track} className="db-hb-partners__track">
        {partners.map((p) => {
          const logo = (
            <span className="db-hb-partners__logo">
              <Image src={p.src} alt={p.label} fill sizes="125px" />
            </span>
          );
          return (
            <li key={p.src} className="db-hb-partners__slide">
              {p.href ? (
                <a className="db-hb-partners__card" href={p.href} target="_blank" rel="noopener noreferrer">
                  {logo}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className="db-hb-partners__card">{logo}</span>
              )}
            </li>
          );
        })}
      </ul>
      <IconButton
        appearance="text"
        className="db-hb-partners__arrow db-hb-partners__arrow--next"
        aria-label="Next partner websites"
        aria-controls={trackId}
        icon={<Icon name="chevron_right" size={32} weight={400} />}
        onClick={() => step(1)}
      />
      <IconButton
        appearance="text"
        className="db-hb-partners__arrow db-hb-partners__arrow--pause"
        aria-label={playing ? "Pause partner websites" : "Play partner websites"}
        icon={<Icon name={playing ? "pause" : "play_arrow"} size={20} />}
        onClick={() => setPlaying((v) => !v)}
      />
    </div>
  );
}
