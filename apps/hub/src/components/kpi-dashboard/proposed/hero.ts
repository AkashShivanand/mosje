import { DEPARTMENT_DASHBOARD_ORIGIN, FUND_SHARE, SCHOLARSHIPS } from "@/lib/website-shared/dashboard";

/**
 * The figures beside the hero's lead, All India — the Department's own, as received
 * (`lib/website-shared/dashboard.ts`). Read from the shared record, never re-typed, so the
 * hero cannot drift from the section that shows the same figures in full.
 */
const byId = (id: string) => {
  const c = SCHOLARSHIPS.cards.find((x) => x.id === id);
  if (!c) throw new Error(`Beneficiary Dashboard record has no card "${id}"`);
  return c;
};
const nth = <T,>(list: readonly T[], i: number): T => {
  const v = list[i];
  if (v === undefined) throw new Error(`Beneficiary Dashboard record has no entry ${i}`);
  return v;
};
const [sc, obc, shreyas] = [byId("sc"), byId("obc"), byId("shreyas")];
const fundTotal = Math.round(FUND_SHARE.slices.reduce((t, s) => t + s.value, 0));
const shown = (m: { value: string; unit?: string }) => (m.unit ? `${m.value} ${m.unit}` : m.value);

export const ABOUT_HERO: { value: string; label: string; origin: string }[] = [
  { value: `₹${fundTotal.toLocaleString("en-IN")} Cr`, label: "released under nine scholarship and education schemes, 2014-15 to 2025-26", origin: DEPARTMENT_DASHBOARD_ORIGIN },
  { value: shown(nth(sc.metrics, 2)), label: "SC students benefited from Pre-Matric and Post-Matric Scholarships", origin: DEPARTMENT_DASHBOARD_ORIGIN },
  { value: shown(nth(obc.metrics, 2)), label: "OBC, EBC and DNT students benefited under PM-YASASVI", origin: DEPARTMENT_DASHBOARD_ORIGIN },
  { value: shown(nth(shreyas.metrics, 1)), label: "scholars funded under the SHREYAS National Fellowship", origin: DEPARTMENT_DASHBOARD_ORIGIN },
];
