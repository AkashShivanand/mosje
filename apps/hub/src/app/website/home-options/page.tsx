import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/website/Header";
import { WebsiteSamaveshBanner } from "@/components/website/website-samavesh-banner";
import { HeroCarousel } from "@/components/website/HeroCarousel";
import { AboutUs } from "@/components/website/AboutUs";
import { Offerings } from "@/components/website/Offerings";
import { Organisations } from "@/components/website/Organisations";
import { NmbaHomeCompact } from "@/components/website/nmba/NmbaHomeCompact";
import { SamaveshJusticeBanner } from "@/components/website/SamaveshJusticeBanner";
import { RecentDocuments } from "@/components/website/RecentDocuments";
import { DeaddictionMapSection } from "@/components/website/DeaddictionMapSection";
import { ActivityCorner } from "@/components/website/ActivityCorner";
import { SocialMedia } from "@/components/website/SocialMedia";
import { SupportSection } from "@/components/website/SupportSection";
import { LogoStrip } from "@/components/website/LogoStrip";
import { WebsiteSiteFooter } from "@/components/website/SiteFooter";
import { SchemePortalsOverlap, SchemePortalsRail } from "@/components/website/home-options/SchemePortals";
import { PledgeBand, PledgeCards } from "@/components/website/home-options/PledgeSection";
import { PmQuoteBand, PmQuoteCard } from "@/components/website/home-options/PmQuote";

/**
 * The homepage with the Secretary's review options (2026-09-17) swapped in place,
 * so each is judged in context rather than on a board. Internal, never indexed.
 *
 *   ?schemes=rail|overlap   scheme portals in the upper fold
 *   ?pledge=cards|band      Take a Pledge — SCW and NMBA
 *   ?quote=band|card        PM Quote per DBIM
 */
export const metadata: Metadata = {
  title: "Homepage Options for Review",
  robots: { index: false, follow: false },
};

type Search = Promise<Record<string, string | string[] | undefined>>;

const AXES = [
  { key: "schemes", label: "Scheme Portals", options: [["rail", "A · Band below banner"], ["overlap", "B · Card over banner"]] },
  { key: "pledge", label: "Take a Pledge", options: [["cards", "A · Twin cards"], ["band", "B · Single band"]] },
  { key: "quote", label: "PM Quote", options: [["band", "A · Full-width band"], ["card", "B · Card in About Us"]] },
] as const;

function pick(v: string | string[] | undefined, allowed: readonly string[], fallback: string) {
  const s = Array.isArray(v) ? v[0] : v;
  return s && allowed.includes(s) ? s : fallback;
}

export default async function HomeOptions({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const chosen = {
    schemes: pick(sp.schemes, ["rail", "overlap"], "rail"),
    pledge: pick(sp.pledge, ["cards", "band"], "cards"),
    quote: pick(sp.quote, ["band", "card"], "band"),
  };

  return (
    <>
      <div className="border-b border-border bg-surface-muted" data-review-bar="">
        <div className="sa-container flex flex-wrap items-center gap-x-6 gap-y-2 py-2 text-body-3">
          <span className="text-label-2 uppercase text-primary-dark">Review options</span>
          {AXES.map((axis) => (
            <span key={axis.key} className="flex flex-wrap items-center gap-1.5">
              <span className="text-ink-muted">{axis.label}:</span>
              {axis.options.map(([value, label]) => {
                const active = chosen[axis.key] === value;
                const href = `?${new URLSearchParams({ ...chosen, [axis.key]: value }).toString()}`;
                return (
                  <Link
                    key={value}
                    href={href}
                    scroll={false}
                    aria-current={active ? "true" : undefined}
                    className={`rounded px-2 py-0.5 text-label-2 ${active ? "bg-primary-dark text-white" : "bg-surface text-ink hover:text-primary-dark"}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </span>
          ))}
        </div>
      </div>
      <Header />
      <WebsiteSamaveshBanner />
      <main id="main-content" className="flex-1">
        <HeroCarousel />
        {chosen.schemes === "overlap" ? <SchemePortalsOverlap /> : <SchemePortalsRail />}
        {chosen.quote === "band" && <PmQuoteBand />}
        <AboutUs quote={chosen.quote === "card" ? <PmQuoteCard /> : undefined} />
        <PledgeSection kind={chosen.pledge} />
        <Offerings />
        <Organisations />
        <NmbaHomeCompact />
        <SamaveshJusticeBanner />
        <RecentDocuments />
        <DeaddictionMapSection />
        <ActivityCorner />
        <SocialMedia />
        <SupportSection />
        <LogoStrip />
      </main>
      <WebsiteSiteFooter />
    </>
  );
}

function PledgeSection({ kind }: { kind: string }) {
  return kind === "band" ? <PledgeBand /> : <PledgeCards />;
}
