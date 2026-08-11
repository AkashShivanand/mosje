"use client";

import * as React from "react";
import { Header } from "@/components/website/Header";
import { SamaveshBanner } from "@/components/website/SamaveshBanner";
import { HeroCarousel } from "@/components/website/HeroCarousel";
import { LatestUpdates } from "@/components/website/LatestUpdates";
import { AboutUs } from "@/components/website/AboutUs";
import { Offerings } from "@/components/website/Offerings";
import { Organisations } from "@/components/website/Organisations";
import { PortalBanner } from "@/components/website/PortalBanner";
import { RecentDocuments } from "@/components/website/RecentDocuments";
import { ActivityCorner } from "@/components/website/ActivityCorner";
import { SocialMedia } from "@/components/website/SocialMedia";
import { LogoStrip } from "@/components/website/LogoStrip";
import { SiteFooter } from "@/components/website/SiteFooter";
import { NashaMuktBharat } from "@/components/website/nmba/NashaMuktBharat";

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
                    ? "bg-primary text-white"
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
