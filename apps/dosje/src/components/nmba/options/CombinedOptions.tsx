"use client";

import { ArrowRight, HeartHandshake, Users } from "lucide-react";
import { PLEDGE_STATS } from "@/content/deaddiction-centres";

// Combined "Take the pledge + Become a Nasha Mukti Mitr" layouts for review.
// Real <a> links; the showcase intercepts clicks to show behaviour without navigating.
const NON_USER = "/portals/nmba/epledge?channel=non-user";
const RECOVERED = "/portals/nmba/epledge?channel=recovered";
const MITR = "/portals/nmba/register-mitr";
const pledgedLakh = ((PLEDGE_STATS.ePledgesRaw + PLEDGE_STATS.recoveredPledgesRaw) / 100000).toFixed(1);
const combinedTotal = (PLEDGE_STATS.ePledgesRaw + PLEDGE_STATS.recoveredPledgesRaw).toLocaleString("en-IN");

// A — Twin cards under one shared header.
export function CombinedTwinCards() {
  return (
    <div>
      <div className="text-center">
        <h3 className="text-[22px] font-semibold text-gov-blue-dark">Join the movement for a drug-free India</h3>
        <p className="mt-1 text-[14px] text-ink-muted">Take the pledge or volunteer as a Nasha Mukti Mitr.</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue"><HeartHandshake className="h-5 w-5" /></span>
          <h4 className="mt-3 text-[17px] font-semibold text-ink">Take the pledge</h4>
          <p className="mt-1 flex-1 text-[13px] text-ink-muted"><span className="font-semibold text-gov-blue-dark">{pledgedLakh} lakh+</span> Indians have pledged. Choose the one that applies to you.</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a href={NON_USER} className="inline-flex items-center gap-1.5 rounded-lg bg-gov-blue px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-gov-blue-dark">I&rsquo;m a non-user <ArrowRight className="h-4 w-4" /></a>
            <a href={RECOVERED} className="inline-flex items-center gap-1.5 rounded-lg border border-gov-blue/40 px-4 py-2 text-[14px] font-semibold text-gov-blue transition-colors hover:bg-gov-blue/5">I&rsquo;m a recovered user <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue"><Users className="h-5 w-5" /></span>
          <h4 className="mt-3 text-[17px] font-semibold text-ink">Become a Nasha Mukti Mitr</h4>
          <p className="mt-1 flex-1 text-[13px] text-ink-muted">Volunteer to spread awareness and support drug-demand reduction in your community — no prior experience needed.</p>
          <div className="mt-4"><a href={MITR} className="inline-flex items-center gap-1.5 rounded-lg bg-gov-blue-dark px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90">Register as a volunteer <ArrowRight className="h-4 w-4" /></a></div>
        </div>
      </div>
    </div>
  );
}

// B — One unified panel: shared header + two halves.
export function CombinedUnifiedPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between bg-gov-blue-dark px-6 py-3">
        <span className="text-[15px] font-semibold text-white">Nasha Mukt Bharat Abhiyaan</span>
        <span className="text-[13px] text-white/75"><span className="font-semibold text-white">{combinedTotal}</span> pledged</span>
      </div>
      <div className="grid bg-white sm:grid-cols-2">
        <div className="border-b border-gray-100 p-6 sm:border-b-0 sm:border-r">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue"><HeartHandshake className="h-5 w-5" /></span>
          <h4 className="mt-3 text-[16px] font-semibold text-ink">Take the pledge</h4>
          <p className="mt-1 text-[13px] text-ink-muted">Stand up for a drug-free India.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={NON_USER} className="inline-flex items-center gap-1 rounded-lg bg-gov-blue px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-gov-blue-dark">Non-user <ArrowRight className="h-3.5 w-3.5" /></a>
            <a href={RECOVERED} className="inline-flex items-center gap-1 rounded-lg border border-gov-blue/40 px-3.5 py-1.5 text-[13px] font-semibold text-gov-blue hover:bg-gov-blue/5">Recovered <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </div>
        <div className="p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue"><Users className="h-5 w-5" /></span>
          <h4 className="mt-3 text-[16px] font-semibold text-ink">Become a Nasha Mukti Mitr</h4>
          <p className="mt-1 text-[13px] text-ink-muted">Volunteer to spread awareness in your community.</p>
          <div className="mt-3"><a href={MITR} className="inline-flex items-center gap-1 rounded-lg bg-gov-blue-dark px-3.5 py-1.5 text-[13px] font-semibold text-white hover:opacity-90">Register as a volunteer <ArrowRight className="h-3.5 w-3.5" /></a></div>
        </div>
      </div>
    </div>
  );
}

// C — Pledge-forward band + volunteer follow-on strip.
export function CombinedPledgeForward() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-2xl bg-gov-blue-dark px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h3 className="text-[19px] font-semibold text-white">Take the pledge for a drug-free India</h3>
          <p className="mt-1 text-[14px] text-white/70"><span className="font-bold text-white">{combinedTotal}</span> Indians have already pledged</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <a href={NON_USER} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold text-gov-blue-dark transition hover:bg-gov-yellow">I&rsquo;m a non-user</a>
          <a href={RECOVERED} className="inline-flex items-center gap-1.5 rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-white/20">I&rsquo;m a recovered user</a>
        </div>
      </div>
      <a href={MITR} className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm transition hover:border-gov-blue/40">
        <span className="flex items-center gap-2.5">
          <Users className="h-5 w-5 text-gov-blue" aria-hidden />
          <span className="text-[14px] text-ink-muted">Want to do more? <span className="font-semibold text-ink">Become a Nasha Mukti Mitr</span> and volunteer in your community.</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-gov-blue">Register <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
      </a>
    </div>
  );
}
