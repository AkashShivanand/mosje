/**
 * PFMS master data and each scheme's payment configuration — ILLUSTRATIVE.
 *
 * The real values come from PFMS (GetDDO, GetPAO, GetController, GetPDCode, GetFunctionHead,
 * GetObjectHead, GetCategory, GetGrantNumber — Annexure D) and from the Bureau, which has not yet
 * finalised the coded head of account for any scheme (BRD §9, first row: "on critical path").
 * Every code below is shaped like the real one (13-digit Function Head, 2-digit Object Head,
 * 3-digit Grant Number, 6-digit DDO, 8-digit PD code) and none is a real government account code.
 *
 * The PFMS scheme codes ARE the BRD's (§10): NAPDDR 3817, AVYAY 3968, SHRESTHA Mode 2 3964.
 * SHRESTHA Mode 1 and SMILE have none yet, and the design carries that as a state, not a blank.
 */

import type { HeadOfAccount, Masters, SchemePfmsConfig } from "./types.ts";

export function seedMasters(syncedAt: string): Masters {
  return {
    syncedAt,
    controllers: [{ code: "093", label: "Chief Controller of Accounts, MoSJE" }],
    paos: [
      { code: "093001", name: "PAO (Sectt.), MoSJE, New Delhi", controllerCode: "093" },
      { code: "093002", name: "PAO (Schemes), MoSJE, New Delhi", controllerCode: "093" },
    ],
    ddos: [
      { code: "209311", name: "DDO, Social Defence Bureau", paoCode: "093002", eBillActive: true, landing: "Approved" },
      { code: "209312", name: "DDO, Scheduled Castes Development Bureau", paoCode: "093002", eBillActive: true, landing: "Approved" },
      { code: "209313", name: "DDO, Senior Citizens Division", paoCode: "093002", eBillActive: true, landing: "Approved" },
      // Deliberately inactive: the Maker has to see what an inactive DDO does to the form (FR-MDM-004).
      { code: "209317", name: "DDO, Cash Section (Sectt.)", paoCode: "093001", eBillActive: false, landing: "Approved" },
    ],
    pdCodes: [
      { code: "93110017", ddoCode: "209311", label: "Social Defence Bureau — Grants" },
      { code: "93120021", ddoCode: "209312", label: "SC Development Bureau — Grants" },
      { code: "93130008", ddoCode: "209313", label: "Senior Citizens — Grants" },
      { code: "93170002", ddoCode: "209317", label: "Cash Section" },
    ],
    functionHeads: [
      { code: "2235021070101", label: "Social Security & Welfare — Drug De-addiction (NAPDDR)" },
      { code: "2235600200401", label: "Social Security & Welfare — Senior Citizens (AVYAY)" },
      { code: "2225017930201", label: "Welfare of SCs — Residential Education (SHRESTHA)" },
      { code: "2235021040301", label: "Social Security & Welfare — Transgender Persons (SMILE)" },
    ],
    objectHeads: [
      { code: "31", label: "Grants-in-Aid — General" },
      { code: "35", label: "Grants for Creation of Capital Assets" },
      { code: "36", label: "Grants-in-Aid — Salaries" },
      { code: "33", label: "Subsidies" },
    ],
    categories: [
      { code: "GEN", label: "General" },
      { code: "SCSP", label: "Scheduled Castes Sub-Plan" },
      { code: "TSP", label: "Tribal Sub-Plan" },
    ],
    grantNumbers: [
      { code: "093", label: "Department of Social Justice & Empowerment" },
      { code: "094", label: "Department of Empowerment of Persons with Disabilities" },
    ],
  };
}

const head = (functionHead: string, objectHead: string, category: string): HeadOfAccount => ({ functionHead, objectHead, category, grantNumber: "093" });

export const SEED_SCHEME_CONFIG: SchemePfmsConfig[] = [
  {
    schemeCode: "NAPDDR",
    pfmsSchemeCode: "3817",
    heads: [head("2235021070101", "31", "GEN"), head("2235021070101", "36", "GEN"), head("2235021070101", "35", "GEN")],
    ddoCodes: ["209311", "209317"],
  },
  {
    schemeCode: "AVYAY",
    pfmsSchemeCode: "3968",
    heads: [head("2235600200401", "31", "GEN"), head("2235600200401", "36", "GEN")],
    ddoCodes: ["209313"],
  },
  {
    schemeCode: "SHRESHTA_M2",
    pfmsSchemeCode: "3964",
    heads: [head("2225017930201", "31", "SCSP"), head("2225017930201", "36", "SCSP")],
    ddoCodes: ["209312"],
    pendingDecision: "The Ministry has not yet decided whether SHRESTHA pays through a Treasury Single Account or a hybrid mode (BRD §3.2).",
  },
  {
    // No PFMS scheme code allotted yet (BRD §9). The Maker can prepare nothing until one is.
    schemeCode: "SMILE",
    pfmsSchemeCode: null,
    heads: [head("2235021040301", "31", "GEN")],
    ddoCodes: ["209311"],
  },
];

/** A synchronised master older than this blocks submission until it is refreshed (BR-MDM-001). */
export const MASTER_MAX_AGE_HOURS = 24;

export function mastersAgeHours(masters: Pick<Masters, "syncedAt">, now: string): number {
  return (Date.parse(now) - Date.parse(masters.syncedAt)) / 3_600_000;
}

export function mastersStale(masters: Pick<Masters, "syncedAt">, now: string): boolean {
  return mastersAgeHours(masters, now) > MASTER_MAX_AGE_HOURS;
}

export function labelOf(list: readonly { code: string; label: string }[], code: string | undefined): string {
  return list.find((i) => i.code === code)?.label ?? "";
}

/** "2235021070101 · 31 · GEN · 093" — how a coded head is read aloud and printed. */
export function headCode(h: Partial<HeadOfAccount>): string {
  return [h.functionHead, h.objectHead, h.category, h.grantNumber].map((p) => p || "—").join(" · ");
}

export function configFor(configs: readonly SchemePfmsConfig[], schemeCode: string): SchemePfmsConfig | undefined {
  return configs.find((c) => c.schemeCode === schemeCode);
}

/** Illustrative PFMS payee code: the project's state letters and ten digits from its serial. */
export function derivedPayeeCode(projectId: string, salt = 0): string {
  const state = projectId.split("/")[1] ?? "IN";
  let h = 7 + salt;
  for (const ch of projectId) h = (h * 31 + ch.charCodeAt(0)) % 9_999_999_967;
  return `${state.toUpperCase().slice(0, 2)}${String(h).padStart(10, "0").slice(-10)}`;
}

/** PFMS unique (payee) codes are two letters and ten digits in this prototype. Illustrative shape. */
export const PAYEE_CODE = /^[A-Z]{2}[0-9]{10}$/;
export const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
