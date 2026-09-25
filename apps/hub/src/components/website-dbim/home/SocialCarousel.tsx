"use client";

import { useId, useState, type ReactNode } from "react";
import { Button, Icon, IconButton } from "@mosje/design-system";

/**
 * The four social cards. At ≥768px they are a plain grid and the controls are not
 * shown; below 768 one card is shown at a time with the reference's chevrons and
 * dots (`.socialmedia-slider`). The cards are rendered ONCE — the reference repeats
 * every embed for each breakpoint, loading each feed three times.
 *
 * No autoplay: these are live feeds a reader may be scrolling inside.
 */
export function DbimSocialCarousel({ labels, slides }: { labels: string[]; slides: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const listId = useId();
  const count = slides.length;
  const go = (i: number) => setActive((i + count) % count);

  return (
    <div className="db-hb-social__carousel">
      <ul id={listId} className="db-hb-social__cards">
        {slides.map((slide, i) => (
          <li key={labels[i]} className="db-hb-social__slide" data-active={i === active ? "" : undefined}>
            {slide}
          </li>
        ))}
      </ul>
      <div className="db-hb-social__controls">
        <IconButton
          appearance="text"
          className="db-hb-social__arrow"
          aria-label="Previous social media feed"
          aria-controls={listId}
          icon={<Icon name="chevron_left" size={24} weight={400} />}
          onClick={() => go(active - 1)}
        />
        <ul className="db-hb-social__dots">
          {labels.map((label, i) => (
            <li key={label}>
              <Button
                appearance="text"
                className="db-hb-social__dot"
                aria-label={`Show ${label}`}
                aria-controls={listId}
                aria-current={i === active ? "true" : undefined}
                onClick={() => go(i)}
              />
            </li>
          ))}
        </ul>
        <IconButton
          appearance="text"
          className="db-hb-social__arrow"
          aria-label="Next social media feed"
          aria-controls={listId}
          icon={<Icon name="chevron_right" size={24} weight={400} />}
          onClick={() => go(active + 1)}
        />
      </div>
    </div>
  );
}
