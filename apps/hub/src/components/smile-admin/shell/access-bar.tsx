"use client";

import { ExternalLink, Globe } from "lucide-react";
import { ColorModeSwitcher } from "@mosje/design-system";

export function AccessBar() {
  return (
    <div className="bg-primary text-white">
      <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between gap-sm px-md text-label-3 md:px-lg">
        <a
          href="https://www.india.gov.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-0 items-center gap-xs whitespace-nowrap hover:underline"
        >
          {/* No tricolour flag swatch: the saffron-white-green motif is barred
              from UI chrome by project convention, and it was the last raw-hex
              colour in this bar. The wordmark carries the attribution. */}
          <span className="hidden sm:inline">Government of India</span>
          <span className="sm:hidden">GoI</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
        <a href="#main-content" className="skip-link">Skip to Main Content</a>
        <div className="flex shrink-0 items-center gap-xs sm:gap-md">
          {/* Font size, contrast and other a11y controls live in the official
              UX4GAccessibilityWidget (rendered in the root layout) — not here. */}
          <ColorModeSwitcher compact hideLabel label="Colour mode" />
          <button className="inline-flex items-center gap-xs rounded-xs px-1 py-1 text-label-3 hover:bg-white/10 sm:px-sm">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">English</span>
            <span className="sm:hidden">EN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
