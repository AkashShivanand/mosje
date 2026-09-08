"use client";

import * as React from "react";
import Image from "next/image";
import { FactStrip, Icon, SitePageHeader, buttonClasses, orgLogoSrc } from "@mosje/design-system";
import { PageTrail } from "@/components/website/layout/page-trail";
import {
  flyGhost,
  motionEasing,
  motionMs,
  prefersReducedMotion,
  rectOf,
  type Rect,
} from "../flight";
import "./campaign-band.css";

/**
 * THE DECISION: when a reader dismisses the campaign band, what happens to the
 * national de-addiction helpline that is inside it?
 *
 * ── THE STAGE IS THE REAL FOLD, NOT A DRAWING OF ONE ────────────────────────
 *
 * An earlier version of this file stubbed the hero — a flat blue bar with the
 * mark and one line of title — on the reasoning that the decision was about the
 * band and the hero was only context. That was wrong, and visibly so: the
 * question is where a badge LANDS in the fold, and it cannot be answered against
 * a hero that is not the hero. The real one carries a 100px mark, a 40px title,
 * an italic standfirst against a left rule, two quick-action buttons and a fact
 * card straddling its lower edge, and every one of those competes for the space
 * the badge is being proposed for.
 *
 * So the stage is `PageTrail` + `SitePageHeader` + `FactStrip`, the same three
 * components the live organisation route composes, wired the same way and fed
 * the Abhiyaan's own record. What is NOT imported is `OrganisationJoinBanner`
 * itself — the band is the thing under decision, and an exploration that renders
 * the production component stops being a record of what was proposed the moment
 * production moves.
 */

/** Quoted from the NMBA record in `organisation-details.ts`. */
const NMBA = {
  title: "Nasha Mukt Bharat Abhiyaan",
  badge: "Associated Organisation",
  lead: "The Ministry of Social Justice and Empowerment (MoSJE) is the nodal Ministry for Drug Demand Reduction and, as part of its mandate, has introduced measures to curtail substance abuse in the country. MoSJE formulated and enacted the National Action Plan for Drug Demand Reduction (NAPDDR).",
  // Resolved through the registry, not written — the mark's path lives in
  // `org-logo.tsx` and an exploration is not a reason to fork it.
  mark: orgLogoSrc("nmba"),
  photo: "/website/content/organisation/nmba-hero-1.jpg",
  breadcrumb: [
    { label: "Associated Organisations" },
    { label: "Nasha Mukt Bharat Abhiyaan" },
  ],
  actions: [
    { label: "Citizen Dashboard", href: "https://nashamukt.dosje.gov.in/", icon: "dashboard", filled: true },
    { label: "Take the Pledge", href: "https://nashamukt.dosje.gov.in/epledge", icon: "front_hand", filled: false },
  ],
  facts: [
    { icon: "flag", value: "15 August 2020", label: "Abhiyaan launched" },
    { icon: "local_hospital", value: "768", label: "De-addiction and rehabilitation centres" },
    { icon: "call", value: "14446", label: "National de-addiction helpline" },
    { icon: "account_balance", value: "Social Justice & Empowerment", label: "Ministry" },
  ],
  banner: {
    heading: "Join Nasha Mukt Bharat Abhiyaan",
    text: "Become a Nasha Mukt Mitr and contribute towards building a healthier, safer and Nasha Mukt Bharat.",
    actionLabel: "Register Now, Be a volunteer for change",
    actionHref: "https://nashamukt.dosje.gov.in/nasha-mukti-mitr",
    helplineLabel: "National De-Addiction Helpline",
    helplineNumber: "14446",
    qrSrc: "/website/content/organisation/nmba-nasha-mukti-mitr-qr.png",
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   The fold — identical in both options, so the only difference a reviewer
   sees is the one being decided.
   ══════════════════════════════════════════════════════════════════════════ */

function HeroActions() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2.5">
      {NMBA.actions.map((a) => (
        <a
          key={a.href}
          href={a.href}
          target="_blank"
          rel="noreferrer"
          className={buttonClasses(
            "primary",
            a.filled ? "filled" : "outlined",
            "md",
            undefined,
            "inverse",
          )}
        >
          <Icon name={a.icon} size={16} />
          <span>{a.label}</span>
          <Icon name="open_in_new" size={16} aria-hidden />
          <span className="ds-sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}

/**
 * The real fold, with the band slotted where the route slots it — between the
 * breadcrumb strip and the banner — and an optional node beside the mark.
 *
 * The badge goes into `SitePageHeader`'s `logo` slot rather than beside the
 * component, because that slot IS the row the mark sits in: "beside the logo"
 * means inside it. That is also how it would ship, so the prototype exercises
 * the real landing place rather than an approximation of it.
 */
function Fold({
  band,
  logoAside,
}: {
  band: React.ReactNode;
  logoAside?: React.ReactNode;
}) {
  return (
    <div className="xband-fold">
      <div className="relative z-20 border-b border-gray-100 bg-white">
        <div className="sa-container py-3">
          <PageTrail items={[...NMBA.breadcrumb]} />
        </div>
      </div>

      {band}

      <SitePageHeader
        variant="landing"
        reservesOverlap
        title={NMBA.title}
        lead={NMBA.lead}
        actions={<HeroActions />}
        logo={
          <div className="xband-logo-row">
            <span className="grid size-[100px] place-items-center">
              <Image
                src={NMBA.mark}
                alt=""
                width={100}
                height={100}
                priority
                className="size-[100px] object-contain"
              />
            </span>
            {logoAside}
          </div>
        }
        media={
          <Image src={NMBA.photo} alt="" width={340} height={340} className="size-full object-cover" />
        }
      />

      <div className="sa-container">
        <FactStrip overlap ariaLabel={`Key facts about ${NMBA.title}`} items={[...NMBA.facts]} />
      </div>
    </div>
  );
}

function Dismiss({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="xband__dismiss" onClick={onClick}>
      <Icon name="close" size={20} aria-hidden />
      <span className="ds-sr-only">{label}</span>
    </button>
  );
}

function Helpline({ innerRef }: { innerRef?: React.Ref<HTMLAnchorElement> }) {
  return (
    <a
      className="xband__helpline"
      href={`tel:${NMBA.banner.helplineNumber}`}
      ref={innerRef}
    >
      <span className="xband__helpline-icon">
        <Icon name="call" size={20} aria-hidden />
      </span>
      <span className="xband__helpline-label">{NMBA.banner.helplineLabel}</span>
      <span className="xband__helpline-number">{NMBA.banner.helplineNumber}</span>
    </a>
  );
}

function Campaign() {
  return (
    <div className="xband__campaign">
      <div className="xband__copy">
        <p className="xband__heading">{NMBA.banner.heading}</p>
        <p className="xband__text">{NMBA.banner.text}</p>
      </div>
      <div className="xband__join">
        <span className="xband__qr">
          <Image src={NMBA.banner.qrSrc} alt="" width={72} height={72} />
        </span>
        <a
          className={buttonClasses("success", "outlined", "sm", "xband__cta", "inverse")}
          href={NMBA.banner.actionHref}
          target="_blank"
          rel="noreferrer"
        >
          <span>{NMBA.banner.actionLabel}</span>
          <Icon name="open_in_new" size={16} aria-hidden />
          <span className="ds-sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

/** The badge, in the hero. One element, two states, no second copy. */
function HeroBadge({
  innerRef,
  arrived,
}: {
  innerRef?: React.Ref<HTMLAnchorElement>;
  arrived: boolean;
}) {
  return (
    <a
      className="xband-hero__badge"
      href={`tel:${NMBA.banner.helplineNumber}`}
      ref={innerRef}
      data-arrived={arrived || undefined}
      /* In the layout from the first render so the flight has a rect to aim at
         and the hero does not reflow when it lands — but out of the
         accessibility tree and out of the tab order until it is real. */
      aria-hidden={arrived ? undefined : true}
      tabIndex={arrived ? undefined : -1}
    >
      <BadgeInner />
    </a>
  );
}

function BadgeInner() {
  return (
    <>
      <span className="xband-hero__badge-icon">
        <Icon name="call" size={20} aria-hidden />
      </span>
      <span className="xband-hero__badge-text">
        <span className="xband-hero__badge-label">Helpline</span>
        <span className="xband-hero__badge-number">{NMBA.banner.helplineNumber}</span>
      </span>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION A — Anchor and guest (what is built today)
   ══════════════════════════════════════════════════════════════════════════ */

export function OptionAnchorGuest() {
  const [gone, setGone] = React.useState(false);

  return (
    <Fold
      band={
        <section className="xband" aria-label={NMBA.banner.helplineLabel}>
          <div className="xband__inner">
            <Helpline />
            {gone ? null : (
              <>
                <Campaign />
                <Dismiss
                  onClick={() => setGone(true)}
                  label="Dismiss the campaign announcement"
                />
              </>
            )}
          </div>
        </section>
      }
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION B — The helpline flies to the hero
   ══════════════════════════════════════════════════════════════════════════ */

type Phase = "band" | "flying" | "landed";

export function OptionFlight() {
  const [phase, setPhase] = React.useState<Phase>("band");
  const bandRef = React.useRef<HTMLElement>(null);
  const pillRef = React.useRef<HTMLAnchorElement>(null);
  const badgeRef = React.useRef<HTMLAnchorElement>(null);
  const ghostRef = React.useRef<HTMLDivElement>(null);
  const [ghostAt, setGhostAt] = React.useState<Rect | null>(null);
  const flight = React.useRef<{ from: Rect; to: Rect; ms: number; easing: string } | null>(null);

  function dismiss() {
    const band = bandRef.current;
    const pill = pillRef.current;
    const badge = badgeRef.current;
    if (!band || !pill || !badge) return;

    /*
     * REDUCED MOTION IS NOT A FASTER FLIGHT — IT IS NO FLIGHT.
     *
     * The estate's `--sa-motion-*` durations already collapse to 0.01ms under
     * the media query, so honouring the tokens alone would technically satisfy
     * the preference. It would still MOUNT the ghost and still move an element
     * across the viewport in one frame, which for a reader with a vestibular
     * disorder is the thing they asked not to happen, only briefer. The badge is
     * simply there, and the band is simply not.
     */
    if (prefersReducedMotion()) {
      setPhase("landed");
      return;
    }

    const from = rectOf(pill);
    const here = rectOf(badge);
    // The badge sits below the band in normal flow, so a band that collapses to
    // zero raises the badge by exactly the band's height. See `flight.ts`.
    const to: Rect = { ...here, top: here.top - band.offsetHeight };

    flight.current = {
      from,
      to,
      /*
       * EMPHASIS, NOT REVEAL — and the difference was visible, not theoretical.
       *
       * `--sa-motion-reveal-easing` is `cubic-bezier(0.22, 1, 0.36, 1)`, a very
       * front-loaded ease-out. It is the right curve for something ARRIVING in
       * place, and the wrong one for something TRAVELLING: at 45% of the
       * duration it had already covered 93% of the distance, so a frozen frame
       * mid-flight showed the badge sitting at its destination. The number
       * teleported and then settled, which is not what "flies" means.
       *
       * An object moving across the screen accelerates and decelerates, so the
       * curve is the emphasized in-out one — same 400ms, and the landing is
       * unaffected either way because both animations end at fixed positions.
       */
      ms: motionMs(band, "--sa-motion-emphasis-duration", 400),
      easing: motionEasing(band, "--sa-motion-emphasis-easing", "cubic-bezier(0.4, 0, 0.2, 1)"),
    };
    setGhostAt(to);
    setPhase("flying");
  }

  /*
   * `useLayoutEffect`, not `useEffect`: the ghost is mounted at the badge's
   * LANDING position, which is not where the pill is. Between paint and the
   * first animation frame it would flash there. A layout effect runs before the
   * browser paints, so the ghost's first painted frame is already the
   * animation's first keyframe.
   */
  React.useLayoutEffect(() => {
    if (phase !== "flying") return;
    const ghost = ghostRef.current;
    const f = flight.current;
    if (!ghost || !f) return;

    const anim = flyGhost(ghost, f.from, f.to, { duration: f.ms, easing: f.easing });
    let cancelled = false;
    anim.finished
      .then(() => {
        if (!cancelled) setPhase("landed");
      })
      .catch(() => {
        /* Cancelled by an unmount — the badge is already in its landed state. */
      });
    return () => {
      cancelled = true;
      anim.cancel();
    };
  }, [phase]);

  const arrived = phase === "landed";

  return (
    <>
      {/*
       * Mounted empty from the first render. A live region INSERTED carrying its
       * text is routinely not announced — assistive technology has to have been
       * watching the node before the text arrived.
       */}
      <p className="ds-sr-only" role="status">
        {arrived
          ? `Campaign announcement dismissed. The ${NMBA.banner.helplineLabel}, ${NMBA.banner.helplineNumber}, has moved to the page heading.`
          : ""}
      </p>

      <Fold
        band={
          arrived ? null : (
            <section
              className={`xband xband--flight${phase === "flying" ? " is-leaving" : ""}`}
              ref={bandRef}
              aria-label={NMBA.banner.heading}
              inert={phase === "flying" || undefined}
            >
              {/* The clip carries NO padding of its own — see `campaign-band.css`. */}
              <div className="xband__clip">
                <div className="xband__inner">
                  <Helpline innerRef={pillRef} />
                  <Campaign />
                  <Dismiss onClick={dismiss} label="Dismiss the campaign band" />
                </div>
              </div>
            </section>
          )
        }
        logoAside={<HeroBadge innerRef={badgeRef} arrived={arrived} />}
      />

      {phase === "flying" && ghostAt ? (
        <div
          className="xband-ghost"
          ref={ghostRef}
          aria-hidden
          style={{
            left: `${ghostAt.left}px`,
            top: `${ghostAt.top}px`,
            width: `${ghostAt.width}px`,
            height: `${ghostAt.height}px`,
          }}
        >
          <BadgeInner />
        </div>
      ) : null}
    </>
  );
}
