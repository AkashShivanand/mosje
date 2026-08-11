"use client";

import * as React from "react";
import { Icon, Input } from "@mosje/design-system";

// Registration ("Become a Nasha Mukti Mitr") design options.
// Plain <a> — cross-app link that bypasses this site's `/website` basePath.
const HREF = "/portals/nmba/register-mitr";

const POINTS = [
  { icon: "campaign", text: "Spread awareness on the ill-effects of substance abuse" },
  { icon: "group", text: "Reach out to youth, families and the community" },
  { icon: "verified_user", text: "Guide people toward de-addiction and rehab services" },
];

// R1 — Split hero: text + points on the left, a solid CTA panel on the right.
export function RegisterSplitHero() {
  return (
    <div className="grid overflow-hidden rounded-2xl border border-gray-200 shadow-sm lg:grid-cols-2">
      <div className="bg-white p-6 sm:p-8">
        <h3 className="text-[22px] font-semibold text-primary-dark">Become a Nasha Mukti Mitr</h3>
        <p className="mt-2 text-[15px] text-ink-muted">Join thousands of volunteers driving a drug-free India. No prior experience needed.</p>
        <ul className="mt-5 space-y-3">
          {POINTS.map(({ icon: iconName, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon name={iconName} size={16} />
              </span>
              <span className="text-[14px] text-ink">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-start justify-center gap-4 bg-primary-dark p-6 sm:p-8">
        <Icon name="volunteer_activism" size={40} className="text-white/80" aria-hidden />
        <p className="text-[18px] font-semibold text-white">Ready to make a difference?</p>
        <p className="text-[14px] text-white/70">Registration takes under two minutes.</p>
        <a href={HREF} className="mt-1 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[15px] font-semibold text-primary-dark transition hover:bg-yellow">
          Register as a volunteer <Icon name="arrow_forward" size={16} />
        </a>
      </div>
    </div>
  );
}

// R2 — Feature card with three points in a row + CTA.
export function RegisterPoints() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-1 text-center">
        <h3 className="text-[22px] font-semibold text-primary-dark">Become a Nasha Mukti Mitr</h3>
        <p className="mx-auto max-w-xl text-[15px] text-ink-muted">Volunteer to support drug-demand reduction in your community.</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {POINTS.map(({ icon: iconName, text }) => (
          <div key={text} className="rounded-xl border border-gray-100 bg-surface-muted/40 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name={iconName} size={20} />
            </span>
            <p className="mt-3 text-[13px] leading-relaxed text-ink">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a href={HREF} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-primary-dark">
          Register now <Icon name="arrow_forward" size={16} />
        </a>
      </div>
    </div>
  );
}

// R3 — Low-friction inline teaser: name + mobile → continue to full form.
export function RegisterMiniForm() {
  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const href = `${HREF}?name=${encodeURIComponent(name)}&mobile=${encodeURIComponent(mobile)}`;
  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
          <Icon name="volunteer_activism" size={20} />
        </span>
        <div>
          <h3 className="text-[18px] font-semibold text-ink">Become a Nasha Mukti Mitr</h3>
          <p className="text-[13px] text-ink-muted">Start here — we&rsquo;ll carry your details to the form.</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Your name"
          className="flex-1"
        />
        <Input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          inputMode="numeric"
          placeholder="Mobile number"
          aria-label="Mobile number"
          className="flex-1"
        />
        <a href={href} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[15px] font-semibold text-white transition hover:bg-primary-dark">
          Continue <Icon name="arrow_forward" size={16} />
        </a>
      </div>
    </div>
  );
}
