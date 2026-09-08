"use client";

import * as React from "react";
import { Carousel } from "@mosje/design-system";
import type { OrgMessage } from "@/content/website/organisation-details";

/**
 * THE SIGNED STATEMENTS, ONE AT A TIME.
 *
 * The source publishes these in a carousel and this estate rendered them as a
 * grid: five statements in a two-column layout is three rows, a lone card on the
 * last one, and — because the grid equalises row heights — a 200px well of empty
 * card beside the shortest statement. Roughly 900px of page for five paragraphs
 * nobody reads end to end.
 *
 * As a carousel it is the source's own arrangement and one row, and the quote
 * gets a readable measure instead of running the full 1,272px of the band, where
 * a 16px line would carry about 150 characters.
 *
 * AUTO-ROTATION IS OFF, and it must stay off. `Carousel`'s own contract says so:
 * a strip that advances on its own takes the sentence a citizen is reading away
 * mid-sentence, and it does that most to the slowest readers. These are five
 * paragraphs of ministerial prose — precisely the content a timer ruins.
 *
 * NOTHING ESSENTIAL IS HIDDEN BY THIS. `Carousel` warns that slides two onwards
 * are, in practice, unread. That is an argument against putting a scheme's
 * eligibility rules in one; it is not an argument against a set of endorsements,
 * where the second is the same KIND of thing as the first and no reader needs
 * all five.
 */
export function OrganisationMessages({
  items,
  label,
}: {
  items: OrgMessage[];
  /** Names the carousel — "Messages about Nasha Mukt Bharat Abhiyaan". */
  label: string;
}): React.JSX.Element {
  return (
    <Carousel label={label} className="orgd__message-carousel">
      {items.map((m) => (
        <article key={m.name} className="orgd__message orgd__message--slide">
          <blockquote className="orgd__message-quote">
            <p>{m.quote}</p>
          </blockquote>
          <footer className="orgd__message-by">
            <cite className="orgd__message-name">{m.name}</cite>
            <span className="orgd__message-role">{m.designation}</span>
          </footer>
        </article>
      ))}
    </Carousel>
  );
}
