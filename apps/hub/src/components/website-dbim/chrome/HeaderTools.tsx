"use client";

import * as React from "react";
import { IconButton, openUx4gWidget, useAccessibilityEntryClaim } from "@mosje/design-system";

import { LanguageDialog } from "@/components/i18n/language-dialog";
import { dbimHref } from "@/lib/website-dbim/nav";

/**
 * The header's three controls, as the reference draws them: skip to main content,
 * language, accessibility — 32px glyphs separated by thin primary rules.
 *
 * ACCESSIBILITY IS THE PAGE'S ONE DOOR (`.claude/rules/accessibility-entry-point.md`).
 * `useAccessibilityEntryClaim` hides the UX4G widget's floating button while this
 * header is mounted (from tablet up), and on a phone while this icon is on screen —
 * the header is not pinned there, so once it scrolls away the floating button comes
 * back and the page is never left with neither door. The click replays on the
 * widget's own trigger on the NEXT task; opening inline loses to the widget's
 * outside-click closer (see `openUx4gWidget`).
 */
export function DbimHeaderTools({
  skipIcon,
  languageIcon,
  accessibilityIcon,
}: {
  skipIcon: React.ReactNode;
  languageIcon: React.ReactNode;
  accessibilityIcon: React.ReactNode;
}) {
  const [langOpen, setLangOpen] = React.useState(false);
  const a11yRef = React.useRef<HTMLButtonElement>(null);
  useAccessibilityEntryClaim(true, a11yRef);

  const openAccessibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.setTimeout(() => {
      if (!openUx4gWidget()) window.location.href = dbimHref("/policies/accessibility-statement");
    }, 0);
  };

  return (
    <div className="db-header__tools">
      <ul className="db-tools">
        <li>
          <a href="#maincontent" className="db-tools__btn" title="Skip to main content" aria-label="Skip to main content">
            {skipIcon}
          </a>
        </li>
        <li>
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
        <li>
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
      </ul>
      <LanguageDialog open={langOpen} onClose={() => setLangOpen(false)} />
    </div>
  );
}
