"use client";

import * as React from "react";
import Link from "next/link";
import { IconButton, openUx4gWidget, useAccessibilityEntryClaim } from "@mosje/design-system";

import { LanguageDialog } from "@/components/i18n/language-dialog";
import { dbimHref } from "@/lib/website-dbim/nav";

/**
 * The header's controls, as the reference draws them: skip to main content,
 * language, accessibility — 32px glyphs separated by thin primary rules — and then
 * Log In or Register.
 *
 * LOG IN (DBIM 3.0 §5.4: "Login/Register – relevant for entities that have a
 * post-login workflow"; §5.4.2–5.4.3 name "a profile icon for login/register"). The
 * Department's post-login workflows are its scheme portals, each with its own sign-in,
 * so the icon opens Ministry › Our Scheme Portals, where the reader picks one. The glyph
 * is the one the DBIM Toolkit's own header uses. It comes LAST, not first as on the
 * Toolkit: "Skip to main content" must stay the first Tab stop (GIGW; WCAG 2.4.1).
 * Decided 30 Sep 2026. Where MeriPehchaan single sign-on arrives (DBIM D.1.3), this is
 * the link that changes.
 *
 * ACCESSIBILITY IS THE PAGE'S ONE DOOR, AND ON THIS DESIGN IT IS THE ONLY ONE
 * (`.claude/rules/accessibility-entry-point.md`, rule 4c). `soleDoor` keeps the UX4G
 * widget's floating button hidden at every width and scroll position — decided
 * 28 Sep 2026: the panel opens from this header icon only, as on the website's other
 * designs, and the bottom-right corner belongs to the chat launcher. Until then a phone
 * got the floating button back once the header scrolled away (rule 4a), at 285,718 —
 * the launcher's corner. The click replays on the widget's own trigger on the NEXT
 * task; opening inline loses to the widget's outside-click closer (see
 * `openUx4gWidget`).
 */
export function DbimHeaderTools({
  skipIcon,
  languageIcon,
  accessibilityIcon,
  loginIcon,
}: {
  skipIcon: React.ReactNode;
  languageIcon: React.ReactNode;
  accessibilityIcon: React.ReactNode;
  loginIcon: React.ReactNode;
}) {
  const [langOpen, setLangOpen] = React.useState(false);
  const a11yRef = React.useRef<HTMLButtonElement>(null);
  useAccessibilityEntryClaim(true, a11yRef, { soleDoor: true });

  const openAccessibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.setTimeout(() => {
      if (!openUx4gWidget()) window.location.href = dbimHref("/policies/accessibility-statement");
    }, 0);
  };

  return (
    <div className="db-header__tools">
      <ul className="db-tools">
        <li className="db-tools__item db-tools__item--skip">
          <a href="#maincontent" className="db-tools__btn" title="Skip to main content" aria-label="Skip to main content">
            {skipIcon}
          </a>
        </li>
        <li className="db-tools__item db-tools__item--language">
          <IconButton
            variant="neutral"
            appearance="text"
            className="db-tools__btn"
            aria-label="Select language"
            title="Select language"
            aria-haspopup="dialog"
            onClick={() => setLangOpen(true)}
            icon={languageIcon}
          />
        </li>
        <li className="db-tools__item db-tools__item--accessibility">
          <IconButton
            ref={a11yRef}
            variant="neutral"
            appearance="text"
            className="db-tools__btn"
            aria-label="Accessibility options"
            title="Accessibility options"
            aria-haspopup="dialog"
            onClick={openAccessibility}
            icon={accessibilityIcon}
          />
        </li>
        <li className="db-tools__item db-tools__item--login">
          <Link
            href={dbimHref("/ministry/our-scheme-portals")}
            className="db-tools__btn"
            aria-label="Log In or Register"
            title="Log In or Register"
          >
            {loginIcon}
          </Link>
        </li>
      </ul>
      <LanguageDialog open={langOpen} onClose={() => setLangOpen(false)} />
    </div>
  );
}
