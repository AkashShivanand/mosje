import type { SourceNote } from "@/components/website/FigureSource";
import { ALL_FUND_GROUPS, CARD_AUDIENCE, FUND_SLICE_AUDIENCE, type Audience } from "./audience";
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
 * The figures beside the hero's lead, All India — the Beneficiary Dashboard's own, each
 * with the live page's label and the card it sits on there, read from the shared record
 * (`lib/website-shared/dashboard.ts`) and never re-typed.
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
  origin: string;
  note: SourceNote;
  /** The Type of Applicant groups the figure is about: shown when any of them is chosen… */
  audiences: Audience[];
  /** …unless it is a TOTAL, which stands only when the choice covers every part it adds up. */
  everyOf?: Audience[][];
}

function metric(cards: readonly { id: string; title: string; metrics?: readonly DeptMetric[] }[], id: string, i: number, audiences: Audience[]): HeroFigure {
  const c = cards.find((x) => x.id === id);
  const m = c?.metrics?.[i];
  if (!c || !m) throw new Error(`Beneficiary Dashboard record has no metric ${id}[${i}]`);
  const value = m.unit ? `${m.value} ${m.unit}` : m.value;
  const label = `${m.label}, ${c.title}`;
  return { value, label, origin: DEPARTMENT_DASHBOARD_ORIGIN, note: { ...RECEIVED, title: label, value }, audiences };
}

const crore = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fundTotal = FUND_SHARE.slices.reduce((t, s) => t + s.value, 0);

export const ABOUT_HERO: HeroFigure[] = [
  {
    value: `₹${Math.round(fundTotal).toLocaleString("en-IN")} Cr`,
    label: `${FUND_SHARE.subtitle}, ${FUND_SHARE.title}`,
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
