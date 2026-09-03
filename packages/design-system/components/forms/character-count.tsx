"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { useFieldCopy } from "./field-policy";
import "./forms.css";

/**
 * Counts what a reader would call a character, not what JavaScript calls one.
 *
 * `"नमस्ते".length` is 6 where a reader counts 3, and `"👍🏽".length` is 4 where a
 * reader counts 1. Telling a Hindi speaker their three-letter word is six
 * characters long is simply wrong. `Intl.Segmenter` walks grapheme clusters,
 * which is the unit a reader sees; where it is unavailable, code points are
 * still closer than UTF-16 units.
 *
 * This is also why `maxLength` on the element is the wrong enforcement: the
 * browser counts UTF-16 units and would cut a Devanagari word mid-cluster.
 */
export function countCharacters(value: string): number {
  if (value === "") return 0;
  const Segmenter = (
    Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (s: string) => Iterable<unknown> } }
  ).Segmenter;
  if (typeof Segmenter === "function") {
    return [...new Segmenter(undefined, { granularity: "grapheme" }).segment(value)].length;
  }
  return Array.from(value).length;
}

export interface CharacterCountProps {
  /** The current value of the field being counted. */
  value: string;
  /** The limit. */
  maxLength: number;
  /**
   * Start announcing once this many characters have been used. Below it the
   * count is on screen but silent, because a reader who has typed four
   * characters of a 500-character box does not need to hear about it.
   * @default 75% of `maxLength`
   */
  threshold?: number;
  /** Id, so `FormField` can wire the count into the field's description. */
  id?: string;
  className?: string;
}

/** Milliseconds of quiet before the count is announced. Long enough that typing does not stutter. */
const ANNOUNCE_DELAY_MS = 500;

/**
 * A live character count for a text field.
 *
 * Three things it does that most implementations do not:
 *
 * 1. **It counts grapheme clusters**, so Devanagari and emoji are counted the
 *    way the person typing counts them. See `countCharacters`.
 * 2. **It escalates politeness.** Under the limit the remaining count is
 *    announced politely, so it waits for a gap in the reader's typing. Over the
 *    limit it is announced assertively, because a reader who cannot submit
 *    needs to know before they reach the button. The two live regions are
 *    separate elements — swapping `aria-live` on one node is unreliable across
 *    screen readers, so whichever one applies holds the text and the other is
 *    empty.
 * 3. **It is debounced.** An announcement per keystroke is unusable.
 *
 * Pass it through `FormField`'s `characterCount` prop rather than rendering it
 * directly, so its id joins the field's `aria-describedby`.
 */
export function CharacterCount({
  value,
  maxLength,
  threshold,
  id,
  className,
}: CharacterCountProps): React.JSX.Element {
  const used = countCharacters(value);
  const remaining = maxLength - used;
  const over = remaining < 0;
  const announceFrom = threshold ?? Math.floor(maxLength * 0.75);
  const shouldAnnounce = used >= announceFrom;

  // Every string comes from the form's copy, so a Hindi portal translates the
  // count in the same place it translates everything else. The defaults are
  // English; see `field-copy.ts` for why these are functions and not templates.
  const copy = useFieldCopy();
  const message = over ? copy.charactersOver(Math.abs(remaining)) : copy.charactersRemaining(remaining);

  const [announced, setAnnounced] = React.useState("");

  React.useEffect(() => {
    if (!shouldAnnounce) {
      setAnnounced("");
      return;
    }
    const timer = window.setTimeout(() => setAnnounced(message), ANNOUNCE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [message, shouldAnnounce]);

  return (
    <>
      {/* The visible count, hidden from assistive tech: the elements below own
          everything a screen reader hears, so the number is never read twice. */}
      <p
        aria-hidden="true"
        className={cn("ds-field__count", over && "ds-field__count--over", className)}
        data-part="count"
        data-over={over || undefined}
      >
        {message}
      </p>

      {/* The DESCRIPTION. Static, so it is safe to sit in `aria-describedby`:
          a reader tabbing in hears the limit itself rather than a running
          total, and hears it before they have typed anything. Systems that
          point `aria-describedby` at the live count instead tell a reader with
          an empty field nothing at all. */}
      <span id={id} className="ds-sr-only">
        {copy.characterLimit(maxLength)}
      </span>

      {/* The ANNOUNCEMENTS. Two regions, because swapping `aria-live` on one
          node is unreliable; whichever applies holds the text. */}
      <span className="ds-sr-only" aria-live="polite">
        {over ? "" : announced}
      </span>
      <span className="ds-sr-only" aria-live="assertive">
        {over ? announced : ""}
      </span>
    </>
  );
}
