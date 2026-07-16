"use client";

import { ArrowRight, HeartHandshake, Users } from "lucide-react";
import { cn } from "@/lib/website/utils";
import { PLEDGE_STATS } from "@/content/website/deaddiction-centres";
import { LeafVine } from "./LeafVine";

const NON_USER = "/portals/nmba/epledge?channel=non-user";
const RECOVERED = "/portals/nmba/epledge?channel=recovered";
const MITR = "/portals/nmba/register-mitr";
const pledgedLakh = ((PLEDGE_STATS.ePledgesRaw + PLEDGE_STATS.recoveredPledgesRaw) / 100000).toFixed(1);

const LEAF_GREEN = "#2f6d5f";
const LEAF_CREAM = "#f2ecc9";

type Tone = "light" | "onGreen";

const TONE = {
  light: {
    heading: "text-gov-blue-dark",
    sub: "text-ink-muted",
    card: "border border-gray-200 bg-white",
    iconChip: "bg-gov-blue/10 text-gov-blue",
    title: "text-ink",
    meta: "text-ink-muted",
    primary: "bg-gov-blue text-white hover:bg-gov-blue-dark",
    outline: "border border-gov-blue/40 text-gov-blue hover:bg-gov-blue/5",
    dark: "bg-gov-blue-dark text-white hover:opacity-90",
  },
  onGreen: {
    heading: "text-white",
    sub: "text-[#f2ecc9]",
    card: "bg-white/95",
    iconChip: "bg-[#2f6d5f]/12 text-[#2f6d5f]",
    title: "text-[#1b3a33]",
    meta: "text-[#4a6a62]",
    primary: "bg-[#2f6d5f] text-white hover:opacity-90",
    outline: "border border-[#2f6d5f]/50 text-[#2f6d5f] hover:bg-[#2f6d5f]/5",
    dark: "bg-[#1b3a33] text-white hover:opacity-90",
  },
} satisfies Record<Tone, Record<string, string>>;

// Shared combined "twin cards" content, styled per tone.
function TwinCardsInner({ tone }: { tone: Tone }) {
  const t = TONE[tone];
  return (
    <div className="relative">
      <div className="text-center">
        <h3 className={cn("text-[22px] font-semibold", t.heading)}>Join the movement for a drug-free India</h3>
        <p className={cn("mt-1 text-[14px]", t.sub)}>Take the pledge or volunteer as a Nasha Mukti Mitr.</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className={cn("flex flex-col rounded-xl p-5 shadow-sm", t.card)}>
          <span className={cn("flex h-11 w-11 items-center justify-center rounded-lg", t.iconChip)}><HeartHandshake className="h-5 w-5" /></span>
          <h4 className={cn("mt-3 text-[17px] font-semibold", t.title)}>Take the pledge</h4>
          <p className={cn("mt-1 flex-1 text-[13px]", t.meta)}>{pledgedLakh} lakh+ Indians have pledged. Choose the one that applies to you.</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a href={NON_USER} className={cn("inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[14px] font-semibold transition-colors", t.primary)}>I&rsquo;m a non-user <ArrowRight className="h-4 w-4" /></a>
            <a href={RECOVERED} className={cn("inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[14px] font-semibold transition-colors", t.outline)}>I&rsquo;m a recovered user <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
        <div className={cn("flex flex-col rounded-xl p-5 shadow-sm", t.card)}>
          <span className={cn("flex h-11 w-11 items-center justify-center rounded-lg", t.iconChip)}><Users className="h-5 w-5" /></span>
          <h4 className={cn("mt-3 text-[17px] font-semibold", t.title)}>Become a Nasha Mukti Mitr</h4>
          <p className={cn("mt-1 flex-1 text-[13px]", t.meta)}>Volunteer to spread awareness and support drug-demand reduction in your community — no prior experience needed.</p>
          <div className="mt-4"><a href={MITR} className={cn("inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[14px] font-semibold transition-opacity", t.dark)}>Register as a volunteer <ArrowRight className="h-4 w-4" /></a></div>
        </div>
      </div>
    </div>
  );
}

// 1 — Subtle leaf watermark behind the content.
export function AestheticWatermark() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <LeafVine animate className="pointer-events-none absolute -top-4 right-6 h-44 w-auto" style={{ color: LEAF_GREEN, opacity: 0.08 }} />
      <TwinCardsInner tone="light" />
    </div>
  );
}

// 2 — Leaf-vine rail down the left edge.
export function AestheticEdgeVine() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white py-6 pl-16 pr-6 shadow-sm sm:py-8 sm:pr-8">
      <div className="absolute inset-y-0 left-0 w-14 border-r" style={{ background: "rgba(47,109,95,.06)", borderColor: "rgba(47,109,95,.18)" }} />
      <LeafVine animate className="pointer-events-none absolute left-1 top-5 h-[calc(100%-2.5rem)] w-auto" style={{ color: LEAF_GREEN, opacity: 0.55 }} />
      <TwinCardsInner tone="light" />
    </div>
  );
}

// 3 — Green brand band using the logo's own palette.
export function AestheticGreenBand() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 shadow-sm sm:p-8" style={{ background: LEAF_GREEN }}>
      <LeafVine animate className="pointer-events-none absolute -bottom-12 -right-6 h-64 w-auto" style={{ color: LEAF_CREAM, opacity: 0.14 }} />
      <TwinCardsInner tone="onGreen" />
    </div>
  );
}

// 4 — Circular pledge seal + leaf ring as a corner crest.
export function AestheticSeal() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="absolute right-5 top-5 flex h-16 w-16 items-center justify-center rounded-full shadow-md" style={{ background: LEAF_GREEN }}>
        <LeafVine className="h-9 w-auto" style={{ color: LEAF_CREAM, opacity: 0.9 }} />
      </div>
      <TwinCardsInner tone="light" />
    </div>
  );
}
