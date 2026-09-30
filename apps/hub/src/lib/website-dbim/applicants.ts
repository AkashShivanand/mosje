/**
 * The Department's applicant groups — the eleven "Type of Applicant" chips finalised
 * with the Additional Secretary (MoSJE Handoff, Offerings › Scheme Discovery, review of
 * 14 Sep 2026: node 52500:8212). The list, its order and its words are the scheme-
 * discovery master's (`SD_PERSONAS`), the record the finalised design was built from.
 *
 * Two DBIM surfaces read it and must agree: the home page's Explore User Personas
 * (one slide per group) and Offerings › Schemes and Services' Type of Applicant filter,
 * which each slide opens (`?applicant=<id>`).
 */
import { SD_PERSONAS } from "@/lib/explorations/service-discovery-master";

export interface DbimApplicantType {
  /** The master's id, and the `applicant` query value. */
  id: string;
  label: string;
  /** One line on who the group is, as the master words it. */
  sub: string;
}

export const DBIM_APPLICANT_TYPES: DbimApplicantType[] = SD_PERSONAS.map((p) => ({ id: p.id, label: p.label, sub: p.sub }));

/** The group an `applicant` query names, or undefined for anything else. */
export function dbimApplicantType(id: string | undefined): DbimApplicantType | undefined {
  return id ? DBIM_APPLICANT_TYPES.find((a) => a.id === id) : undefined;
}
