"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./language-switcher.css";

export interface LanguageOption {
  /** BCP-47 tag — `hi`, `en`, `bn`. Written to `lang` and `hreflang`. */
  code: string;
  /**
   * The language's name IN that language — "हिन्दी", not "Hindi". A reader who
   * cannot read the current page's language has to be able to find their own,
   * and "Hindi" written in English is unreadable to exactly the person the
   * control exists for.
   */
  label: string;
  /** Where this language's copy of the current page lives. */
  href: string;
}

export interface LanguageSwitcherProps {
  /** The languages this page is published in, in the order they are offered. */
  languages: LanguageOption[];
  /** The BCP-47 tag of the language currently being read. */
  current: string;
  /**
   * The accessible name of the group. Written in the CURRENT language, because
   * it names the control rather than any one option.
   * @default "Language"
   */
  label?: string;
  /**
   * Announced beside the language being read, for a reader who cannot see that
   * it is not a link.
   * @default "Current language"
   */
  currentLabel?: string;
  className?: string;
}

/**
 * The languages a page is published in, offered as links.
 *
 * GIGW 3.0 requires a bilingual estate, so this is not an optional nicety — it
 * is the control that makes the Hindi copy of a page reachable from the English
 * one. Two rules carry most of its value, and both are easy to get wrong:
 *
 * 1. **Each option is written in its own language and carries its own `lang`.**
 *    Without the attribute a screen reader pronounces "हिन्दी" with an English
 *    voice, which produces noise rather than a word (WCAG 3.1.2).
 * 2. **The language being read is not a link.** A link to the page you are
 *    already on is a control that does nothing, and it is the one option a
 *    reader is most likely to press by mistake. It renders as text, marked
 *    `aria-current`, with a visually hidden word saying so.
 *
 * Real links, not a select and not a menu: the Hindi page has its own address,
 * so it can be shared, bookmarked, indexed and opened in a new tab. A control
 * that switches language with script alone takes all four away.
 *
 * More than about four languages is not a switcher. Twenty-two scheduled
 * languages is a page of its own, linked from here.
 */
export function LanguageSwitcher({
  languages,
  current,
  label = "Language",
  currentLabel = "Current language",
  className,
}: LanguageSwitcherProps): React.JSX.Element {
  return (
    <nav className={cn("ds-lang", className)} aria-label={label}>
      <ul className="ds-lang__list">
        {languages.map((language) => {
          const isCurrent = language.code === current;
          return (
            <li key={language.code} className="ds-lang__item">
              {isCurrent ? (
                <span className="ds-lang__label ds-lang__label--current" lang={language.code} aria-current="true">
                  <span className="ds-lang__sr">{currentLabel}: </span>
                  {language.label}
                </span>
              ) : (
                <a
                  className="ds-lang__label"
                  href={language.href}
                  lang={language.code}
                  hrefLang={language.code}
                >
                  {language.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
