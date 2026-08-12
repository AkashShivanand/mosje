"use client";

import * as React from "react";
import Image from "next/image";
import { AccessibilityBar } from "@mosje/design-system";

const BASE = "/portals/scw";

/** Government utility bar pinned to the very top — the shared DS AccessibilityBar.
    (The old admin language dropdown and the user-variant translate toggle — both
    non-functional placeholders — are superseded by the DS language selector, so
    the bar no longer varies by role.) Font size / contrast live in the
    UX4GAccessibilityWidget (root layout). */
export function GovTopBar() {
  return (
    <AccessibilityBar
      tone="navy"
      layout="fluid"
      govLink={{ href: "#", label: "Government of India" }}
      skipTo="#main"
      showSkip
      fontSize
      accessibility
      language={{ label: "English" }}
    />
  );
}

/** White masthead: emblem + ministry on the left, partner logos + user slot on right. */
export function GovMasthead({ right }: { right?: React.ReactNode }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={`${BASE}/brand/national-emblem.svg`}
            alt="National Emblem of India"
            width={44}
            height={62}
            className="h-14 w-auto"
          />
          <div className="leading-tight">
            <span className="inline-block rounded bg-amber-300/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
              BETA
            </span>
            <div className="mt-0.5 text-[11px] text-ink-muted">Government of India</div>
            <div className="text-lg font-bold text-ink">
              Ministry of Social Justice &amp; Empowerment
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Image
            src={`${BASE}/brand/digital-india.svg`}
            alt="Digital India"
            width={120}
            height={40}
            className="hidden h-9 w-auto md:block"
          />
          <div className="hidden items-center gap-2 lg:flex">
            <Image
              src={`${BASE}/brand/samavesh-logo.svg`}
              alt="SAMAVESH"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <div className="max-w-[210px] leading-tight">
              <div className="text-sm font-bold text-ink">SAMAVESH</div>
              <div className="text-[10px] text-ink-muted">
                Single Access Mechanism for All Verticals of Empowerment &amp; Social Harmony
              </div>
            </div>
          </div>
          {right}
        </div>
      </div>
    </header>
  );
}

/** Footer used by the citizen (UX4G-branded) portal. */
export function Ux4gFooter() {
  return (
    <footer className="border-t border-line bg-navy-950 text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs">
        <span>© 2026 - Copyright UX4G. All rights reserved. Powered by NeGD | MeitY Government of India ® 2026 UX4G</span>
        <div className="flex items-center gap-3">
          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
          <span className="h-3 w-px bg-white/25" />
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

// A dedicated floating accessibility button used to live here (bottom-right,
// citizen portal) but never actually opened anything. The official
// UX4GAccessibilityWidget (rendered in the root layout) is the real one.
