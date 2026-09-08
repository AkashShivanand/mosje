"use client";

import * as React from "react";
import Image from "next/image";
import { FactStrip, Icon, SitePageHeader, buttonClasses, orgLogoSrc } from "@mosje/design-system";
import { PageTrail } from "@/components/website/layout/page-trail";
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
export const NMBA = {
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
    actionLabel: "Register Now",
    actionFullLabel: "Register Now, Be a volunteer for change",
    actionHref: "https://nashamukt.dosje.gov.in/nasha-mukti-mitr",
    helplineLabel: "National De-Addiction Helpline",
    helplineShort: "De-Addiction Helpline",
    helplineNumber: "14446",
    qrSrc: "/website/content/organisation/nmba-nasha-mukti-mitr-qr.png",
  },
  ribbon: {
    eyebrow: "Six Years of the Abhiyaan",
    text: "Organisations taking part may file their pre-event details.",
    action: { label: "File Pre-Event Details", href: "/portals/nmba/admin/login" },
    alt: { note: "No departmental account?", label: "File on the open register", href: "/portals/nmba/activities" },
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   The fold — identical in both options, so the only difference a reviewer
   sees is the one being decided.
   ══════════════════════════════════════════════════════════════════════════ */

export function HeroActions() {
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
export function Fold({
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

export function Dismiss({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="xband__dismiss" onClick={onClick}>
      <Icon name="close" size={20} aria-hidden />
      <span className="ds-sr-only">{label}</span>
    </button>
  );
}

export function Helpline({ innerRef }: { innerRef?: React.Ref<HTMLAnchorElement> }) {
  return (
    <a
      className={buttonClasses("success", "filled", "md", "xband__helpline", "inverse")}
      href={`tel:${NMBA.banner.helplineNumber}`}
      ref={innerRef}
      aria-label={`${NMBA.banner.helplineLabel} ${NMBA.banner.helplineNumber}`}
    >
      <Icon name="call" size={20} aria-hidden />
      <span className="xband__helpline-label">{NMBA.banner.helplineShort}</span>
      <span className="xband__helpline-number">{NMBA.banner.helplineNumber}</span>
    </a>
  );
}

/**
 * The campaign, as production now arranges it: the code leads, the message
 * follows, the button closes the sentence they both open.
 */
export function Campaign() {
  return (
    <>
      <span className="xband__qr">
        <Image src={NMBA.banner.qrSrc} alt="" width={72} height={72} />
      </span>
      <div className="xband__copy">
        <p className="xband__heading">{NMBA.banner.heading}</p>
        <p className="xband__text">{NMBA.banner.text}</p>
      </div>
      <a
        className={buttonClasses("success", "outlined", "md", "xband__cta", "inverse")}
        href={NMBA.banner.actionHref}
        target="_blank"
        rel="noreferrer"
        aria-label={NMBA.banner.actionFullLabel}
      >
        <span>{NMBA.banner.actionLabel}</span>
        <Icon name="open_in_new" size={20} aria-hidden />
        <span className="ds-sr-only"> (opens in a new tab)</span>
      </a>
    </>
  );
}

/** The badge, in the hero. One element, two states, no second copy. */
export function HeroBadge({
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

export function BadgeInner() {
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


/**
 * The anniversary notice, as its own band — the second of the two the fold opens
 * with today.
 */
export function Ribbon({ onDismiss }: { onDismiss: () => void }) {
  return (
    <section className="xrib" aria-label={NMBA.ribbon.eyebrow}>
      <div className="sa-container xrib__inner">
        <div className="xrib__copy">
          <p className="xrib__eyebrow">{NMBA.ribbon.eyebrow}</p>
          <p className="xrib__text">{NMBA.ribbon.text}</p>
        </div>
        <div className="xrib__routes">
          <a className={buttonClasses("primary", "outlined", "sm", "xrib__cta")} href={NMBA.ribbon.action.href}>
            <span>{NMBA.ribbon.action.label}</span>
            <Icon name="arrow_forward" size={20} aria-hidden />
          </a>
          <span className="xrib__second">
            <span className="xrib__second-note">{NMBA.ribbon.alt.note}</span>
            <a className="xrib__alt" href={NMBA.ribbon.alt.href}>
              {NMBA.ribbon.alt.label}
            </a>
          </span>
        </div>
        <button type="button" className="xrib__dismiss" onClick={onDismiss}>
          <Icon name="close" size={20} aria-hidden />
          <span className="ds-sr-only">Dismiss the anniversary notice</span>
        </button>
      </div>
    </section>
  );
}
