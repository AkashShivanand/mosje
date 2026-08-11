"use client";

import * as React from "react";
import { PLEDGE_STATS } from "@/content/website/deaddiction-centres";
import { Icon } from "@mosje/design-system";

// Pledge design options. Each links to the NMBA portal e-Pledge via a distinct channel.
// Plain <a> — cross-app link that bypasses this site's `/website` basePath.
const NON_USER = "/portals/nmba/epledge?channel=non-user";
const RECOVERED = "/portals/nmba/epledge?channel=recovered";
const combinedTotal = (PLEDGE_STATS.ePledgesRaw + PLEDGE_STATS.recoveredPledgesRaw).toLocaleString("en-IN");

// P1 — Two bold split cards, side by side.
export function PledgeSplit() {
  const cards = [
    { href: NON_USER, icon: "group", title: "I'm a non-user", blurb: "Pledge to stay drug-free and spread awareness.", count: PLEDGE_STATS.ePledges, accent: "#0373DF" },
    { href: RECOVERED, icon: "refresh", title: "I'm a recovered user", blurb: "Pledge to stay on your recovery journey.", count: PLEDGE_STATS.recoveredPledges, accent: "#16A34A" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((c) => {
        const iconName = c.icon;
        return (
          <a key={c.href} href={c.href} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="h-1.5 w-full" style={{ background: c.accent }} />
            <span className="flex flex-1 flex-col p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: `${c.accent}1a`, color: c.accent }}>
                <Icon name={iconName} size={20} />
              </span>
              <span className="mt-4 text-[19px] font-semibold text-ink">{c.title}</span>
              <span className="mt-1 flex-1 text-[14px] text-ink-muted">{c.blurb}</span>
              <span className="mt-4 text-[13px] text-ink-muted">
                <span className="text-[22px] font-bold" style={{ color: c.accent }}>{c.count}</span> pledged
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: c.accent }}>
                Take the pledge <Icon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
}

// P2 — Single card with a segmented toggle that morphs content.
export function PledgeToggle() {
  const [tab, setTab] = React.useState<"non" | "rec">("non");
  const data = tab === "non"
    ? { href: NON_USER, title: "I'm a non-user", blurb: "Pledge to stay drug-free and help spread awareness in your family, school and community.", count: PLEDGE_STATS.ePledges }
    : { href: RECOVERED, title: "I'm a recovered user", blurb: "Pledge to stay on your recovery journey and inspire others to seek help and rebuild their lives.", count: PLEDGE_STATS.recoveredPledges };
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex rounded-lg bg-surface-muted p-1">
        {(["non", "rec"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t}
            className={`flex-1 rounded-md px-3 py-2 text-[14px] font-semibold transition-colors ${tab === t ? "bg-white text-primary-dark shadow-sm" : "text-ink-muted hover:text-ink"}`}>
            {t === "non" ? "Non-user" : "Recovered user"}
          </button>
        ))}
      </div>
      <p className="mt-5 text-[18px] font-semibold text-ink">{data.title}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{data.blurb}</p>
      <p className="mt-4 text-[13px] text-ink-muted"><span className="font-bold text-primary-dark">{data.count}</span> people have taken this pledge</p>
      <a href={data.href} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark">
        Take the pledge <Icon name="arrow_forward" size={16} />
      </a>
    </div>
  );
}

// P3 — Horizontal solid banner with two inline pill buttons.
export function PledgeBanner() {
  return (
    <div className="overflow-hidden rounded-2xl bg-primary-dark px-6 py-7 sm:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[20px] font-semibold text-white">Take the pledge for a drug-free India</h3>
          <p className="mt-1 text-[14px] text-white/70">
            <span className="font-bold text-white">{combinedTotal}</span> Indians have already pledged. Choose your path:
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <a href={NON_USER} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold text-primary-dark transition hover:bg-yellow">
            <Icon name="group" size={16} /> Non-user
          </a>
          <a href={RECOVERED} className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-white/20">
            <Icon name="refresh" size={16} /> Recovered user
          </a>
        </div>
      </div>
    </div>
  );
}
