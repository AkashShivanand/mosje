import master from "@/content/website/scheme-master.json";

/**
 * The Department's scheme master, typed.
 *
 * SOURCE: docs/research/dosje-scheme-master-2026-09.json — every scheme, persona
 * and offering there is taken from the Department's Annual Report 2025-26, its
 * Demand for Grants 2026-27 and the PIB Year-End Review 2025. The beta site's
 * Schemes list is NOT a source (issue X-IA-04: 92 of its 140 entries are not
 * this Department's schemes).
 *
 * The copy in src/content/website/ exists because the app cannot import from
 * docs/. `schemes.test.ts` fails when the two differ, so the copy cannot drift.
 *
 * Nothing here is a count and nothing states that anyone is eligible: `who`
 * records whom a scheme names as its target group; the sanctioning authority
 * decides.
 */

export type PersonaId =
  | "student" | "sc" | "obc" | "dnt" | "safai" | "senior" | "tg" | "drug" | "begging" | "atrocity" | "ngo";
export type OfferingId =
  | "scholarship" | "schooling" | "loan" | "skill" | "care" | "deaddiction" | "protection" | "grant" | "housing" | "awards";

export interface Persona { id: PersonaId; label: string; short?: string; sub: string; portal?: { route: string; blurb: string } }
export interface Offering { id: OfferingId; label: string; short?: string; sub: string }
export interface Route { label: string; href: string | null; source: string; hrefUnconfirmed?: string }
export interface Scheme {
  id: string;
  umbrella?: string;
  division?: string;
  type: string;
  name: string;
  who: PersonaId[];
  offers: OfferingId[];
  offersFor?: Partial<Record<OfferingId, PersonaId[]>>;
  provides: string;
  named: string;
  apply: string[];
  sources: string[];
  note?: string;
}

const M = master as unknown as {
  personas: Persona[];
  offerings: Offering[];
  routes: Record<string, Route>;
  schemes: Scheme[];
};

export const PERSONAS: readonly Persona[] = M.personas;
export const OFFERINGS: readonly Offering[] = M.offerings;
export const ROUTES: Readonly<Record<string, Route>> = M.routes;
export const SCHEMES: readonly Scheme[] = M.schemes;

/** Illustrated figures exist for these groups; the rest are drawn as an icon of
 *  what the scheme gives, never a stand-in figure (service-discovery review). */
export const PERSONA_ART: Partial<Record<PersonaId, string>> = {
  student: "/website/images/personas/student.png",
  sc: "/website/images/personas/sc.png",
  obc: "/website/images/personas/obc.png",
  dnt: "/website/images/personas/dnt.png",
  safai: "/website/images/personas/safai.png",
  senior: "/website/images/personas/senior.png",
  tg: "/website/images/personas/tg.png",
  ngo: "/website/images/personas/ngo.png",
};
export const PERSONA_ICON: Partial<Record<PersonaId, string>> = {
  drug: "health_and_safety",
  begging: "night_shelter",
  atrocity: "balance",
};

/** Material Symbols for the ten kinds of support. */
export const OFFERING_ICON: Record<OfferingId, string> = {
  scholarship: "school",
  schooling: "menu_book",
  loan: "account_balance",
  skill: "construction",
  care: "volunteer_activism",
  deaddiction: "self_improvement",
  protection: "shield_person",
  grant: "handshake",
  housing: "home",
  awards: "workspace_premium",
};

/** Does this scheme provide `offer` to `who`? A grant to the NGO that runs an
 *  old-age home is not an offering to the senior citizen who lives in it. */
function pairOk(s: Scheme, who?: PersonaId, offer?: OfferingId): boolean {
  if (who && !s.who.includes(who)) return false;
  if (offer && !s.offers.includes(offer)) return false;
  if (who && offer && s.offersFor?.[offer] && !s.offersFor[offer]!.includes(who)) return false;
  if (who && !offer && s.offersFor) {
    return s.offers.some((o) => !s.offersFor![o] || s.offersFor![o]!.includes(who));
  }
  return true;
}

/** One expression, used by every surface, so a key and a list never disagree. */
export function matchSchemes(filter: { who?: PersonaId; offer?: OfferingId; q?: string }): Scheme[] {
  const q = filter.q?.trim().toLowerCase();
  return SCHEMES.filter(
    (s) =>
      pairOk(s, filter.who, filter.offer) &&
      (!q || `${s.name} ${s.umbrella ?? ""} ${s.provides} ${s.named}`.toLowerCase().includes(q)),
  );
}

export function isPersona(v: unknown): v is PersonaId {
  return typeof v === "string" && PERSONAS.some((p) => p.id === v);
}
export function isOffering(v: unknown): v is OfferingId {
  return typeof v === "string" && OFFERINGS.some((o) => o.id === v);
}

/** "Apply on" a portal, "Call" a helpline, "Apply through" an office or agency. */
export function applyLabel(routeId: string): string {
  const r = ROUTES[routeId];
  if (!r) return "How to Apply";
  if (r.href?.startsWith("tel:")) return `Call ${r.label}`;
  return (/portal/i.test(r.label) ? "Apply on " : "Apply through ") + r.label;
}
