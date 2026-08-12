import * as React from "react";
import Image from "next/image";
import { AccessibilityBar } from "@mosje/design-system";

const BASE = "/portals/tg";

/** Government utility bar pinned to the very top — the shared DS AccessibilityBar.
    Font size / contrast live in the UX4GAccessibilityWidget (root layout). */
export function GovTopBar() {
  return (
    <AccessibilityBar
      tone="navy"
      layout="fluid"
      govLink={{ href: "#", label: "Government of India" }}
      skipTo="#main"
      showSkip
      fontSize={false}
      accessibility={false}
      language={{ label: "English" }}
    />
  );
}

/**
 * White masthead. Left: emblem + full 3-line GoI/MoSJE/DoSJE identity (Department
 * line bold — fixes TG-GLOBAL-002). Right: the SAMAVESH + Digital India
 * co-branding lockup (fixes TG-GLOBAL-001) then the user slot.
 */
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
            <span className="inline-block rounded bg-await-bg px-1.5 py-0.5 text-[10px] font-bold text-await-fg">
              BETA
            </span>
            <div className="mt-0.5 text-[11px] text-ink-muted">Government of India</div>
            <div className="text-sm font-semibold text-ink">
              Ministry of Social Justice &amp; Empowerment
            </div>
            <div className="text-[11px] font-bold text-navy">
              Department of Social Justice &amp; Empowerment
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
