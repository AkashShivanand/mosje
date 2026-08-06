import * as React from "react";
import Image from "next/image";
import { ExternalLink, Globe, ChevronDown } from "lucide-react";

const BASE = "/portals/scw";

/** Dark government utility bar pinned to the very top. */
export function GovTopBar({ variant = "admin" }: { variant?: "admin" | "user" }) {
  return (
    <div className="bg-navy-950 text-white">
      <div className="flex h-9 items-center justify-between px-4 text-xs">
        <a className="flex items-center gap-2 font-medium" href="#">
          <span>Government of India</span>
          <ExternalLink className="h-3 w-3 opacity-80" />
        </a>
        <div className="flex items-center gap-3">
          <a href="#main" className="hidden sm:inline hover:underline">
            Skip to Main Content
          </a>
          {/* Text size, contrast and other a11y controls live in the official
              UX4GAccessibilityWidget (rendered in the root layout) — not here. */}
          {variant === "admin" ? (
            <>
              <span className="hidden h-4 w-px bg-white/25 sm:block" />
              <button className="flex items-center gap-1 rounded px-1 hover:bg-white/10">
                <Globe className="h-4 w-4" />
                <span>English</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </>
          ) : (
            <button
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
              aria-label="Translate this page"
              title="Translate this page!"
            >
              <span className="text-sm leading-none">
                अ<span className="align-top text-[10px]">A</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
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
