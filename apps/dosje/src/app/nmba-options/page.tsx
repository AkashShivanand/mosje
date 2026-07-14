"use client";

import * as React from "react";
import { DeAddictionMap } from "@/components/nmba/DeAddictionMap";
import { DualPledge } from "@/components/nmba/DualPledge";
import { NashaMuktiMitr } from "@/components/nmba/NashaMuktiMitr";
import { LocatorMapFirst } from "@/components/nmba/options/LocatorMapFirst";
import { LocatorTable } from "@/components/nmba/options/LocatorTable";
import { LocatorAccordion } from "@/components/nmba/options/LocatorAccordion";
import { LocatorGallery } from "@/components/nmba/options/LocatorGallery";
import { PledgeSplit, PledgeToggle, PledgeBanner } from "@/components/nmba/options/PledgeOptions";
import { RegisterSplitHero, RegisterPoints, RegisterMiniForm } from "@/components/nmba/options/RegisterOptions";

interface Variant {
  label: string;
  note: string;
  render: () => React.ReactNode;
}

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
  const active = variants[i]!;
  return (
    <section className="border-t border-gray-200 pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[22px] font-semibold text-gov-blue-dark">{title}</h2>
        <span className="text-[13px] text-ink-muted">{active.note}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((v, idx) => (
          <button key={v.label} type="button" onClick={() => setI(idx)} aria-pressed={i === idx}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${i === idx ? "bg-gov-blue text-white" : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark"}`}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{active.render()}</div>
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
          <p className="mt-1 text-[14px] text-ink-muted">Flip between designs for each widget. Nothing here is wired to the live homepage — pick your favourites and I&rsquo;ll set them.</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 py-10">
        <Section title="1 · De-addiction centre locator" variants={LOCATORS} />
        <Section title="2 · Take the pledge" variants={PLEDGES} />
        <Section title="3 · Become a Nasha Mukti Mitr" variants={REGISTERS} />
      </div>
    </main>
  );
}
