"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { SamaveshBanner } from "@/components/SamaveshBanner";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LatestUpdates } from "@/components/LatestUpdates";
import { AboutUs } from "@/components/AboutUs";
import { Offerings } from "@/components/Offerings";
import { Organisations } from "@/components/Organisations";
import { PortalBanner } from "@/components/PortalBanner";
import { RecentDocuments } from "@/components/RecentDocuments";
import { ActivityCorner } from "@/components/ActivityCorner";
import { SocialMedia } from "@/components/SocialMedia";
import { LogoStrip } from "@/components/LogoStrip";
import { SiteFooter } from "@/components/SiteFooter";
import { NashaMuktBharat } from "@/components/nmba/NashaMuktBharat";

type Option = "A" | "B" | "C";

const OPTIONS: { id: Option; label: string; note: string }[] = [
  { id: "A", label: "Option A", note: "Unified section, mid-page (after Portal banner)" },
  { id: "B", label: "Option B", note: "Unified section, high (after Latest updates)" },
  { id: "C", label: "Option C", note: "Pledge band high + map lower" },
];

export default function NmbaPlacementPreview() {
  const [option, setOption] = React.useState<Option>("B");

  return (
    <>
      {/* Review-only control bar */}
      <div className="sticky top-0 z-[1000] border-b border-border-ds bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            NMBA placement preview
          </span>
          <div className="flex overflow-hidden rounded-lg border border-border-ds text-sm font-semibold">
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOption(o.id)}
                aria-pressed={option === o.id}
                className={`px-3 py-1.5 transition-colors ${
                  option === o.id
                    ? "bg-gov-blue text-white"
                    : "bg-white text-ink hover:bg-surface-muted"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-ink-muted">
            {OPTIONS.find((o) => o.id === option)?.note}
          </span>
        </div>
      </div>

      <Header />
      <main id="main-content" className="flex-1">
        <SamaveshBanner />
        <HeroCarousel />

        {option === "C" && <NashaMuktBharat variant="band" />}

        <LatestUpdates />

        {option === "B" && <NashaMuktBharat variant="full" />}

        <AboutUs />
        <Offerings />
        <Organisations />
        <PortalBanner />

        {option === "A" && <NashaMuktBharat variant="full" />}
        {option === "C" && <NashaMuktBharat variant="map" />}

        <RecentDocuments />
        <ActivityCorner />
        <SocialMedia />
        <LogoStrip />
      </main>
      <SiteFooter />
    </>
  );
}
