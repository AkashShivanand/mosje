/**
 * DS Audit: Button ✅ existing · PasswordInput ➕ added to DS this change ·
 *           FormField ✅ existing · Alert ✅ existing · EstateField ➕ app-local
 *           (shared with the hub hero) · page layout ➕ app-local.
 *
 * The layout is deliberately NOT added to @mosje/design-system: this is a
 * deployment access wall for the hosted prototype, not a product surface any
 * portal will reuse. Portal sign-in screens use `PortalLoginShell` instead.
 *
 * Design note — the gate is the *threshold*. It carries the estate's signature
 * grid-and-glow field (same component as the hub hero) on a gov-navy panel, so
 * arriving here already looks like arriving at this building. Its counterpart,
 * /admin, is deliberately plain: back-of-house should not look like the door.
 */

import type { Metadata } from "next";
import { DEFAULT_APPS } from "@mosje/design-system";
import { GATE_EMBLEM_SRC, safeNextPath } from "@/lib/site-gate";
import { EstateField } from "@/components/estate-field";
import { unlock } from "./actions";
import { GateForm } from "./gate-form";

export const metadata: Metadata = {
  title: "Access — MoSJE Digital Estate",
  robots: { index: false, follow: false },
};

// Counted from the registry rather than typed by hand, so the door cannot
// advertise a number the estate no longer has.
const PORTAL_COUNT = DEFAULT_APPS.filter((a) => a.group === "Portals").length;

const BEHIND_THE_DOOR = [
  { value: "1", label: "Unified website", sub: "consolidating 13 legacy sites" },
  { value: `${PORTAL_COUNT}`, label: "Workflow portals", sub: "schemes, scholarships, corporations" },
  { value: "33+", label: "Organisations", sub: "across the ministry" },
] as const;

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const target = safeNextPath(next);

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ── Threshold panel ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-gov-navy px-6 py-10 text-white sm:py-12 lg:px-14 lg:py-16">
        <EstateField tone="dark" origin="18% 8%" />

        <div className="relative flex h-full flex-col">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- the gate
                renders before any gated route, and next/image's /_next/image
                endpoint sits outside the gate's asset allowlist. */}
            <img
              src={GATE_EMBLEM_SRC}
              alt="National Emblem of India"
              width={28}
              height={45}
              className="h-11 w-auto"
            />
            <span className="flex flex-col border-l border-white/25 pl-4 leading-none">
              <span className="text-[15px] font-bold tracking-tight">MoSJE</span>
              <span className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Digital Estate
              </span>
            </span>
          </div>

          {/* Lockup pins to the top; the statement block centres in what is
              left, so the panel stays balanced from laptop to tall desktop
              instead of stranding the copy at the bottom edge. */}
          <div className="mt-10 sm:mt-14 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:py-10">
            {/* self-start is load-bearing: inside a flex column, `inline-flex`
                blockifies and would stretch the pill to the full column. */}
            <p className="inline-flex w-fit self-start items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
              Work in progress
            </p>

            <h1 className="mt-6 text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
              Ministry of Social Justice &amp; Empowerment
            </h1>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
              A prototype of the unified digital estate, shared for review.
              Everything inside is illustrative and does not represent published
              government data.
            </p>

            {/* Hidden on phones: the panel is context, the password field is the
                job of the page, and on a 375px screen these three columns push
                the field a full screen below the fold. */}
            <dl className="mt-10 hidden max-w-lg grid-cols-3 gap-x-4 border-t border-white/15 pt-8 sm:grid">
              {BEHIND_THE_DOOR.map(({ value, label, sub }) => (
                <div key={label}>
                  <dd className="text-3xl font-bold tracking-tight">{value}</dd>
                  <dt className="mt-1.5 text-[13px] font-semibold text-white/90">{label}</dt>
                  {/* 12px at 70% keeps this above 4.5:1 on gov-navy; 11px at
                      55% measured marginal, and this is a government page. */}
                  <p className="mt-1 text-xs leading-snug text-white/70">{sub}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── The door ────────────────────────────────────────────────────── */}
      <section className="flex items-center justify-center bg-surface px-6 py-14 lg:px-14">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Enter the access password
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Reviewers were sent this with the link. It is not a portal login —
            those come later, inside.
          </p>

          <GateForm action={unlock} next={target} invalid={error === "1"} />

          <p className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-ink-hint">
            Not for public distribution. If you need access, ask the person who
            shared the link.
          </p>
        </div>
      </section>
    </main>
  );
}
