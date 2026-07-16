"use client";

import * as React from "react";
import { MousePointerClick } from "lucide-react";
import { DeAddictionMap } from "@/components/website/nmba/DeAddictionMap";
import { DualPledge } from "@/components/website/nmba/DualPledge";
import { NashaMuktiMitr } from "@/components/website/nmba/NashaMuktiMitr";
import { LocatorMapFirst } from "@/components/website/nmba/options/LocatorMapFirst";
import { LocatorTable } from "@/components/website/nmba/options/LocatorTable";
import { LocatorAccordion } from "@/components/website/nmba/options/LocatorAccordion";
import { LocatorGallery } from "@/components/website/nmba/options/LocatorGallery";
import { PledgeSplit, PledgeToggle, PledgeBanner } from "@/components/website/nmba/options/PledgeOptions";
import { RegisterSplitHero, RegisterPoints, RegisterMiniForm } from "@/components/website/nmba/options/RegisterOptions";
import { CombinedTwinCards, CombinedUnifiedPanel, CombinedPledgeForward } from "@/components/website/nmba/options/CombinedOptions";
import { AestheticWatermark, AestheticEdgeVine, AestheticGreenBand, AestheticSeal } from "@/components/website/nmba/options/AestheticOptions";

interface Variant {
  label: string;
  note: string;
  render: () => React.ReactNode;
}

// Map a link's href to a plain-English destination for the behaviour readout.
function describeHref(href: string): string {
  if (href.includes("/epledge")) {
    if (href.includes("channel=non-user")) return "→ opens the NMBA e-Pledge (Non-user channel)";
    if (href.includes("channel=recovered")) return "→ opens the NMBA e-Pledge (Recovered-user channel)";
    return "→ opens the NMBA e-Pledge";
  }
  if (href.includes("/register-mitr")) return "→ opens the Nasha Mukti Mitr registration form (NMBA portal)";
  if (href.includes("/de-addiction-centres")) return "→ opens the full De-addiction Centre locator page";
  if (href.includes("google.com/maps")) return "→ opens Google Maps directions to the centre";
  if (href.startsWith("tel:")) return `→ dials the helpline (${href.replace("tel:", "")})`;
  return `→ ${href}`;
}

const COMBINED: Variant[] = [
  { label: "Twin cards", note: "Two equal cards under one shared header", render: () => <CombinedTwinCards /> },
  { label: "Unified panel", note: "One container · shared header · two halves", render: () => <CombinedUnifiedPanel /> },
  { label: "Pledge-forward", note: "Prominent pledge band + volunteer strip", render: () => <CombinedPledgeForward /> },
];

const AESTHETICS: Variant[] = [
  { label: "Subtle leaf watermark", note: "Faint logo leaf-vine behind the content", render: () => <AestheticWatermark /> },
  { label: "Leaf-vine edge accent", note: "Leaf rail down the left edge", render: () => <AestheticEdgeVine /> },
  { label: "Green brand band", note: "Logo's deep-green + cream palette", render: () => <AestheticGreenBand /> },
  { label: "Pledge seal + leaf ring", note: "Circular crest badge in the corner", render: () => <AestheticSeal /> },
];

const LOCATORS: Variant[] = [
  { label: "Split-view (current)", note: "Cards left · sticky map right · use-my-location", render: () => <DeAddictionMap /> },
  { label: "Map-first immersive", note: "Full-frame map · floating search · overlay detail · slide-out list", render: () => <LocatorMapFirst /> },
  { label: "Directory table", note: "Sortable/paginated table + compact map", render: () => <LocatorTable /> },
  { label: "State accordion", note: "Collapsible by state + mini-map on expand", render: () => <LocatorAccordion /> },
  { label: "Card gallery + modal", note: "Card grid · click opens a focused map modal", render: () => <LocatorGallery /> },
];

const PLEDGES: Variant[] = [
  { label: "Two-row panel (current)", note: "One panel · two rows led by pledge counts", render: () => <DualPledge /> },
  { label: "Split cards", note: "Two bold side-by-side cards", render: () => <PledgeSplit /> },
  { label: "Segmented toggle", note: "One card · toggle morphs content", render: () => <PledgeToggle /> },
  { label: "Solid banner", note: "Horizontal banner · two inline buttons", render: () => <PledgeBanner /> },
];

const REGISTERS: Variant[] = [
  { label: "Flat strip (current)", note: "Solid navy strip · single CTA", render: () => <NashaMuktiMitr /> },
  { label: "Split hero", note: "Text + points | solid CTA panel", render: () => <RegisterSplitHero /> },
  { label: "Feature points", note: "Three what-a-Mitr-does points + CTA", render: () => <RegisterPoints /> },
  { label: "Mini-form teaser", note: "Name + mobile → continue to full form", render: () => <RegisterMiniForm /> },
];

function Section({ title, variants }: { title: string; variants: Variant[] }) {
  const [i, setI] = React.useState(0);
  const [action, setAction] = React.useState<{ text: string; href: string } | null>(null);
  const active = variants[i]!;

  // Intercept link clicks so reviewing stays on this page; report the destination.
  const onCapture = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    if (a && a.getAttribute("href")) {
      e.preventDefault();
      setAction({ text: (a.textContent || "").trim().replace(/\s+/g, " "), href: a.getAttribute("href")! });
    }
  };

  return (
    <section className="border-t border-gray-200 pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[22px] font-semibold text-gov-blue-dark">{title}</h2>
        <span className="text-[13px] text-ink-muted">{active.note}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((v, idx) => (
          <button key={v.label} type="button" onClick={() => { setI(idx); setAction(null); }} aria-pressed={i === idx}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${i === idx ? "bg-gov-blue text-white" : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark"}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Behaviour readout */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-surface-muted/40 px-3.5 py-2 text-[12px]">
        <MousePointerClick className="h-3.5 w-3.5 shrink-0 text-gov-blue" aria-hidden />
        {action ? (
          <span className="text-ink">
            Clicked <span className="font-semibold">“{action.text}”</span>{" "}
            <span className="text-ink-muted">{describeHref(action.href)}</span>
          </span>
        ) : (
          <span className="text-ink-muted">Hover to see states · click any button/link to preview where it goes (navigation is paused here so you can keep reviewing).</span>
        )}
      </div>

      <div className="mt-5" onClickCapture={onCapture}>{active.render()}</div>
    </section>
  );
}

export default function NmbaOptionsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-[#f9fafb]">
        <div className="mx-auto max-w-[1280px] px-4 py-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gov-blue">Design options · internal review</p>
          <h1 className="mt-1 text-[26px] font-semibold text-gov-blue-dark">NMBA widget options</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-ink-muted">
            Flip between designs for each widget and interact with them — hover for states, click to preview each
            action&rsquo;s destination. Nothing here is wired to the live homepage; tell me your final picks and I&rsquo;ll set them.
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 py-10">
        <Section title="1 · Take the pledge + Nasha Mukti Mitr (combined)" variants={COMBINED} />
        <Section title="2 · Combined block — leaf-motif aesthetics" variants={AESTHETICS} />
        <Section title="3 · De-addiction centre locator" variants={LOCATORS} />
        <Section title="4 · Take the pledge (on its own)" variants={PLEDGES} />
        <Section title="5 · Become a Nasha Mukti Mitr (on its own)" variants={REGISTERS} />
      </div>
    </main>
  );
}
