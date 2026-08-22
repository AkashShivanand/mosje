"use client";

import * as React from "react";
import Image from "next/image";
import { AccessibilityBar, BrandLockup } from "@mosje/design-system";

const BASE = "/portals/nhapoa";

/** Government utility bar pinned to the very top — the shared DS AccessibilityBar.
    Font size / contrast live in the official UX4GAccessibilityWidget (root layout). */
export function GovTopBar() {
  return (
    <div data-brand="navy">
      <AccessibilityBar
        layout="fluid"
        govLink={{ href: "#", label: "Government of India" }}
        skipTo={"#main"}
        showSkip
        fontSize
        accessibility
        language={{ label: "English" }}
      />
    </div>
  );
}

/** White masthead: emblem + ministry on the left, partner logos + user slot on right. */
export function GovMasthead({ right }: { right?: React.ReactNode }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        {/* Identity comes from the DS lockup — never retyped. The emblem, the
            line order and the BETA badge are estate policy, and a hand-rolled
            copy is a place for them to drift. */}
        <BrandLockup
          emblemSrc={`${BASE}/brand/national-emblem.svg`}
          lines={{ org: "Government of India", ministry: "National Helpline Against Atrocities", department: "SAMBAL \u0938\u0902\u092c\u0932" }}
          href={BASE}
          beta
          compact
        />
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
                Ministry of Social Justice &amp; Empowerment
              </div>
            </div>
          </div>
          {right}
        </div>
      </div>
    </header>
  );
}
