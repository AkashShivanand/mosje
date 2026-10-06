import type { SourceNote } from "@/components/website/FigureSource";
import type { AreaScope } from "@/lib/kpi/types";
import { ALL_FUND_GROUPS, CARD_AUDIENCE, FUND_SLICE_AUDIENCE, shows, type Audience } from "./audience";
import {
  DEPARTMENT_DASHBOARD_AS_ON,
  DEPARTMENT_DASHBOARD_ORIGIN,
  DEPARTMENT_DASHBOARD_SOURCE,
  DEPARTMENT_DASHBOARD_URL,
  FUND_SHARE,
  SCHOLARSHIPS,
  type DeptMetric,
} from "@/lib/website-shared/dashboard";

/**
 * The figures beside the hero's lead, All India — the Beneficiary Dashboard's own, each with
 * the live page's label and, under it, the card it comes from, read from the shared record
 * (`lib/website-shared/dashboard.ts`) and never re-typed.
 *
 * THE HERO IS THE DASHBOARD'S TOP FIVE (instruction, 6 Oct 2026): NMBA's Total Outreach as
 * the lead, then these four. A hero figure may repeat a figure from a card below, and links to
 * that card; the card keeps every figure the live page gives it.
 *
 * ONE IS DERIVED, AND SAYS HOW. The live page prints nine fund slices and "Total spend
 * across 9 schemes" but never the total itself; the ₹67,977 crore here is their sum, and
 * its note (demo rail → Show sources and calculations) gives the sum in full
 * (instruction, 6 Oct 2026: a derived figure is acceptable when its working is shown).
 */
const RECEIVED = {
  kind: "document" as const,
  source: DEPARTMENT_DASHBOARD_SOURCE,
  asOn: DEPARTMENT_DASHBOARD_AS_ON,
  links: [{ label: "Beneficiary Dashboard, as published", href: DEPARTMENT_DASHBOARD_URL }],
};

export interface HeroFigure {
  value: string;
  label: string;
  /** Where the figure is from, under its label — never run into the label itself. */
  context?: string;
  origin: string;
  note: SourceNote;
  /** The Type of Applicant groups the figure is about: shown when any of them is chosen… */
  audiences: Audience[];
  /** …unless it is a TOTAL, which stands only when the choice covers every part it adds up. */
  everyOf?: Audience[][];
  /** The Beneficiary Dashboard card the figure leads, so that card can lead with another. */
  card?: string;
}

function metric(cards: readonly { id: string; title: string; metrics?: readonly DeptMetric[] }[], id: string, i: number, audiences: Audience[]): HeroFigure {
  const c = cards.find((x) => x.id === id);
  const m = c?.metrics?.[i];
  if (!c || !m) throw new Error(`Beneficiary Dashboard record has no metric ${id}[${i}]`);
  const value = m.unit ? `${m.value} ${m.unit}` : m.value;
  // The live label as the label, the card's title as the context — one per line.
  return { value, label: m.label, context: c.title, origin: DEPARTMENT_DASHBOARD_ORIGIN, note: { ...RECEIVED, title: `${m.label}, ${c.title}`, value }, audiences, card: id };
}

const crore = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fundTotal = FUND_SHARE.slices.reduce((t, s) => t + s.value, 0);

export const ABOUT_HERO: HeroFigure[] = [
  {
    value: `₹${Math.round(fundTotal).toLocaleString("en-IN")} Cr`,
    // The live page's subtitle as the label, its chart's title as the context: "Total spend
    // across 9 schemes, Share of Fund Release" was two labels run together.
    label: FUND_SHARE.subtitle,
    context: FUND_SHARE.title,
    origin: DEPARTMENT_DASHBOARD_ORIGIN,
    // The nine schemes' total: an answer for Students (all nine are theirs), or for Scheduled
    // Castes and Other Backward Classes together — never for one of them alone.
    audiences: ALL_FUND_GROUPS,
    everyOf: Object.values(FUND_SLICE_AUDIENCE),
    note: {
      ...RECEIVED,
      title: FUND_SHARE.subtitle,
      value: `₹${Math.round(fundTotal).toLocaleString("en-IN")} Cr`,
      breakdown: {
        method: "The nine schemes' fund release in Share of Fund Release, added together, and shown to the nearest crore.",
        rows: FUND_SHARE.slices.map((s, i) => ({ label: s.label, value: `₹${crore(s.value)} Cr`, op: i === 0 ? undefined : ("+" as const) })),
        result: { label: "Total, nine schemes", value: `₹${crore(fundTotal)} Cr` },
      },
    },
  },
  metric(SCHOLARSHIPS.cards, "sc", 2, CARD_AUDIENCE.sc!),
  metric(SCHOLARSHIPS.cards, "obc", 2, CARD_AUDIENCE.obc!),
  metric(SCHOLARSHIPS.cards, "shreyas", 1, CARD_AUDIENCE.shreyas!),
];

/**
 * The Department figures the hero shows for this view — none on a State/UT view (the
 * Department publishes them for All India only), and, under a Type of Applicant choice, only
 * those about a chosen group; a TOTAL only when the choice covers every part it adds up.
 */
export function heroFigures(scope: AreaScope, audiences: Set<Audience>): HeroFigure[] {
  if (scope.state) return [];
  return ABOUT_HERO.filter((x) => (x.everyOf ? x.everyOf.every((part) => shows(audiences, part)) : shows(audiences, x.audiences)));
}
