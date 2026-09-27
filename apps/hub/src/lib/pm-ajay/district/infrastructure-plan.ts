/**
 * Format II — Infrastructure Development & Action Plan.
 *
 * The live screen narrows the district's ten monitorable-indicator domains
 * (`registers.ts`) to the five that are physical infrastructure — as opposed to
 * services or livelihoods — then lets the officer raise a work against one of the
 * scheme's Monitorable Indicators under that domain. Every value here is
 * illustrative, shaped like the district's own picklists, per
 * `.claude/rules/prototype-data-modes.md`.
 */

import { INDICATOR_DOMAINS } from "./registers";

/** The five of the ten domains that Format II treats as infrastructure. */
export const INFRASTRUCTURE_DOMAINS = [
  "Drinking Water & Sanitation",
  "Rural Roads & Housing",
  "Electricity & Clean Fuel",
  "Health & Nutrition",
  "Education",
] as const satisfies readonly (typeof INDICATOR_DOMAINS)[number][];

export type InfrastructureDomain = (typeof INFRASTRUCTURE_DOMAINS)[number];

export function isInfrastructureDomain(domain: string): domain is InfrastructureDomain {
  return (INFRASTRUCTURE_DOMAINS as readonly string[]).includes(domain);
}

/** The Monitorable Indicator a work is raised against, by domain. */
export const MONITORABLE_INDICATORS: Record<InfrastructureDomain, string[]> = {
  "Drinking Water & Sanitation": [
    "Household tap water connection",
    "Community water point",
    "Individual household toilet",
  ],
  "Rural Roads & Housing": ["All-weather internal road", "Pucca housing unit"],
  "Electricity & Clean Fuel": ["Household electricity connection", "Street lighting"],
  "Health & Nutrition": ["Sub-centre or health post", "Anganwadi centre upgrade"],
  Education: ["Primary school infrastructure", "Additional classroom"],
};

export const FUNDING_SOURCES = [
  "PM-AJAY — Adarsh Gram Component",
  "MGNREGA Convergence",
  "State Plan Convergence",
  "15th Finance Commission Grant",
] as const;
