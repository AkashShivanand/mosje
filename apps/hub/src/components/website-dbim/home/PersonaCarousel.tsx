"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Icon, IconButton } from "@mosje/design-system";

import type { DbimPersonaSlide } from "@/lib/website-dbim/home-mid";

/**
 * Explore User Personas: one persona at a time, stepped by the reader (no autoplay,
 * so there is nothing to pause). Controls sit below the slide in the reference's
 * order — ‹ · dots · › — and every one is a design-system button with a name.
 */
export function PersonaCarousel({ slides }: { slides: DbimPersonaSlide[] }) {
  const [index, setIndex] = useState(0);
  const go = (i: number) => setIndex((i + slides.length) % slides.length);
  const slide = slides[index];
  if (!slide) return null;

  return (
    <div className="db-hm-persona" role="group" aria-roledescription="carousel" aria-label="User Personas">
      <div className="db-hm-persona__slide" aria-live="polite" aria-atomic="true">
        <Link key={slide.slug} href={slide.href} className="db-hm-persona__link" aria-label={`${slide.label}, ${index + 1} of ${slides.length}`}>
          <Image src={slide.art} alt={slide.alt} width={260} height={260} className="db-hm-persona__img" />
          <span className="db-hm-persona__name">{slide.label}</span>
        </Link>
      </div>
      {slides.length > 1 && (
        <div className="db-hm-persona__controls">
          <IconButton
            appearance="text"
            className="db-hm-persona__arrow"
            aria-label="Previous persona"
            icon={<Icon name="chevron_left" size={24} weight={400} />}
            onClick={() => go(index - 1)}
          />
          <div className="db-hm-persona__dots">
            {slides.map((s, i) => (
              <Button
                key={s.slug}
                appearance="text"
                className="db-hm-persona__dot"
                aria-label={`Show ${s.label}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <IconButton
            appearance="text"
            className="db-hm-persona__arrow"
            aria-label="Next persona"
            icon={<Icon name="chevron_right" size={24} weight={400} />}
            onClick={() => go(index + 1)}
          />
        </div>
      )}
    </div>
  );
}
