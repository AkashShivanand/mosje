/**
 * The Swashraya (Shelter Home) facility checklist.
 *
 * The twelve items are transcribed VERBATIM from the live portal, punctuation
 * and spelling included — "Electricty", "Anganwadi Centers". They are the
 * scheme's own wording for what a shelter must provide, and correcting the
 * spelling here would put the clone out of step with the register officers
 * actually tick.
 */
export interface Facility {
  id: string;
  label: string;
}

export const FACILITIES: Facility[] = [
  { id: "ventilation", label: "Well ventilated rooms." },
  { id: "water", label: "Water arrangements (Potable drinking water and other needs) and sanitation." },
  { id: "bathing", label: "Adequate bathing & toilet facilities." },
  { id: "lighting", label: "Standard lighting for shelter." },
  { id: "fire", label: "Adequate fire protection measures, as per the norms." },
  { id: "firstaid", label: "First aid kit." },
  { id: "pest", label: "Pest and vector (mosquito) control" },
  { id: "linen", label: "Regular cleaning of blankets, mattresses and sheets, and maintenance of other services." },
  { id: "kitchen", label: "Common kitchen/cooking space, necessary utensils for cooking and serving, cooking gas connections etc." },
  { id: "children", label: "Facilities for children by linking to the nearest Anganwadi Centers" },
  { id: "convergence", label: "Facilitation for convergence with other services/entitlements" },
  { id: "power", label: "Electricty connection & Inverter connection" },
];

/**
 * What each shelter has already declared.
 *
 * The live screen says submissions "pre-fill on your next visit", so a shelter
 * that has been through this once opens with its ticks in place rather than
 * blank — which is the difference between a form and a record.
 */
export const DECLARED: Record<string, string[]> = {
  "sh-001": ["ventilation", "water", "bathing", "lighting", "fire", "firstaid", "linen", "kitchen", "power"],
  "sh-002": ["ventilation", "water", "bathing", "lighting", "firstaid", "kitchen"],
  "sh-003": ["ventilation", "water", "bathing", "lighting", "fire", "firstaid", "pest", "linen", "kitchen", "children", "convergence", "power"],
  "sh-004": ["ventilation", "water", "lighting"],
  "sh-005": ["ventilation", "water", "bathing", "lighting", "fire", "firstaid", "pest", "kitchen", "power"],
  "sh-006": ["ventilation", "water", "bathing", "lighting", "fire", "firstaid", "linen", "kitchen", "children", "power"],
  "sh-007": ["ventilation", "water", "bathing", "lighting", "fire", "firstaid", "pest", "linen", "kitchen", "convergence", "power"],
};
