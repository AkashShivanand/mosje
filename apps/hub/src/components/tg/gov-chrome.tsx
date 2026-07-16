import * as React from "react";
import Image from "next/image";
import { ExternalLink, Globe, ChevronDown } from "lucide-react";

const BASE = "/portals/tg";

/** Dark government utility bar pinned to the very top. */
export function GovTopBar() {
  return (
    <div className="bg-navy-950 text-white">
      <div className="flex h-9 items-center justify-between px-4 text-xs">
        <a className="flex items-center gap-2 font-medium" href="#">
          <span aria-hidden>🇮🇳</span>
          <span>Government of India</span>
          <ExternalLink className="h-3 w-3 opacity-80" />
        </a>
        <div className="flex items-center gap-3">
          <a
            href="#main"
            className="sr-only rounded hover:underline focus:not-sr-only focus:bg-white focus:px-2 focus:py-1 focus:text-navy"
          >
            Skip to Main Content
          </a>
          {/* Text size / contrast controls live in the UX4GAccessibilityWidget
              (root layout) — not here. */}
          <span className="hidden h-4 w-px bg-white/25 sm:block" />
          <button className="flex items-center gap-1 rounded px-1 hover:bg-white/10">
            <Globe className="h-4 w-4" />
            <span>English</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
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
