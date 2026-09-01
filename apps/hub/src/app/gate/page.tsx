/**
 * DS Audit: Button ✅ existing · PasswordInput ✅ existing · FormField ✅
 *           existing · Alert ✅ existing · EstateField ➕ app-local (shared
 *           with the hub hero) · page layout ➕ app-local.
 *
 * The layout is deliberately NOT added to @mosje/design-system: this is a
 * deployment access wall for the hosted prototype, not a product surface any
 * portal will reuse. Portal sign-in screens use `PortalLoginShell` instead.
 *
 * Design note — the gate is the *threshold*. It carries the estate's signature
 * grid-and-glow field (same component as the hub hero) on a navy panel, so
 * arriving here already looks like arriving at this building. Its counterpart,
 * /admin, is deliberately plain: back-of-house should not look like the door.
 *
 * Motion rationale lives in gate.css.
 */

import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { GATE_EMBLEM_SRC, safeNextPath } from "@/lib/site-gate";
import { resolvePortals } from "@/lib/registry/resolve";
import { EstateField } from "@/components/estate-field";
import { socialCard } from "@/lib/seo/social";
import { SITE_NAME } from "@/lib/seo/site";
import { unlock } from "./actions";
import { GateForm } from "./gate-form";
import "./gate.css";

/**
 * The gate carries a social card even though it is `noindex`, and that is not a
 * contradiction — the two answer different machines.
 *
 * `robots` speaks to search crawlers, which must not index a password wall.
 * Open Graph speaks to link unfurlers in WhatsApp, Slack and Teams, which
 * ignore robots directives. While the gate is switched on, EVERY estate url
 * redirects here, so this page is the only one an unfurler ever sees — which
 * makes it the single most important card on the deployment.
 */
export const metadata: Metadata = {
  title: "Access — MoSJE Digital Estate",
  robots: { index: false, follow: false },
  ...socialCard({
    /**
     * KEEP THIS UNDER ~125 CHARACTERS. It was 127 and clipped mid-sentence on
     * mobile, which matters more here than anywhere else in the estate: while
     * the wall is up every url redirects to /gate, so this is the description
     * on EVERY link anyone shares. 117 leaves headroom, because platforms
     * truncate at different widths and some are tighter than 125.
     */
    title: "SAMAVESH — MoSJE Digital Estate",
    description:
      "A private preview of the Ministry of Social Justice & Empowerment's unified digital estate, behind a shared password.",
    url: "/gate",
    siteName: SITE_NAME,
  }),
};

// Counted from the resolved registry rather than typed by hand, so the door
// cannot advertise a number the estate no longer has — including portals an
// admin has switched off.
function behindTheDoor(portalCount: number) {
  return [
    { value: "1", label: "Unified website", sub: "consolidating 13 legacy sites" },
    { value: `${portalCount}`, label: "Workflow portals", sub: "schemes, scholarships, corporations" },
    { value: "33+", label: "Organisations", sub: "across the ministry" },
  ] as const;
}

/** Reading order, in milliseconds. Short gaps — long ones read as slow. */
const DELAY = {
  lockup: 0,
  pill: 70,
  heading: 140,
  blurb: 210,
  stats: 280,
  formHeading: 140,
  form: 250,
  footnote: 320,
} as const;

/** The stagger is driven by one custom property, so the CSS stays declarative. */
const after = (ms: number) => ({ "--gate-delay": `${ms}ms` }) as CSSProperties;

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const target = safeNextPath(next);
  const stats = behindTheDoor((await resolvePortals()).length);

  return (
    <main className="gate grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ── Threshold panel ─────────────────────────────────────────────── */}
      <section
        className="relative isolate flex flex-col overflow-hidden bg-navy
                   px-6 py-10 text-white
                   sm:px-10 sm:py-14
                   lg:px-14 lg:py-16"
      >
        <div className="gate-field pointer-events-none absolute inset-0">
          <EstateField tone="dark" origin="18% 8%" />
        </div>

        <div className="relative flex h-full flex-col">
          <div
            className="gate-reveal flex items-center gap-4"
            style={after(DELAY.lockup)}
          >
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
            <p
              className="gate-reveal inline-flex w-fit self-start items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur"
              style={after(DELAY.pill)}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
              Work in progress
            </p>

            {/* Fluid down to the smallest phone and up to a wide panel, so the
                headline never needs a breakpoint to stay on three lines. */}
            <h1
              className="gate-reveal mt-6 text-balance font-bold leading-[1.08] tracking-tight
                         text-[clamp(1.75rem,1.15rem+2.4vw,2.75rem)]"
              style={after(DELAY.heading)}
            >
              Ministry of Social Justice &amp; Empowerment
            </h1>

            <p
              className="gate-reveal mt-4 max-w-md text-[15px] leading-relaxed text-white/75"
              style={after(DELAY.blurb)}
            >
              A prototype of the unified digital estate, shared for review.
              Everything inside is illustrative and does not represent published
              government data.
            </p>

            {/* Hidden on phones: the panel is context, the password field is the
                job of the page, and on a 375px screen these three columns push
                the field a full screen below the fold. */}
            <dl
              className="gate-reveal mt-10 hidden max-w-lg grid-cols-3 gap-x-4 border-t border-white/15 pt-8 sm:grid"
              style={after(DELAY.stats)}
            >
              {stats.map(({ value, label, sub }) => (
                <div key={label}>
                  <dd className="text-3xl font-bold tracking-tight">{value}</dd>
                  <dt className="mt-1.5 text-[13px] font-semibold text-white/90">{label}</dt>
                  {/* 12px at 70% keeps this above 4.5:1 on navy; 11px at
                      55% measured marginal, and this is a government page. */}
                  <p className="mt-1 text-xs leading-snug text-white/70">{sub}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── The door ────────────────────────────────────────────────────── */}
      <section className="flex items-center justify-center bg-surface px-6 py-14 sm:px-10 lg:px-14">
        <div className="w-full max-w-sm">
          <h2
            className="gate-reveal text-2xl font-bold tracking-tight text-ink"
            style={after(DELAY.formHeading)}
          >
            Enter the access password
          </h2>
          <p
            className="gate-reveal mt-2 text-sm leading-relaxed text-ink-muted"
            style={after(DELAY.formHeading)}
          >
            Reviewers were sent this with the link. It is not a portal login —
            those come later, inside.
          </p>

          <div
            className="gate-reveal"
            style={after(DELAY.form)}
          >
            <GateForm action={unlock} next={target} invalid={error === "1"} />
          </div>

          <p
            className="gate-reveal mt-10 border-t border-border pt-6 text-xs leading-relaxed text-ink-hint"
            style={after(DELAY.footnote)}
          >
            Not for public distribution. If you need access, ask the person who
            shared the link.
          </p>
        </div>
      </section>
    </main>
  );
}
