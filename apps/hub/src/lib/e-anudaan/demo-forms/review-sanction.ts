/**
 * Sanction — the Programme Director, on a file the Integrated Finance Division has concurred in.
 * Its rules, from the sanction order panel: remarks are required; both amounts are entered, together
 * more than ₹0 and no more than the amount sought; an amount above the scheme's cost norms is
 * stated beside the figure (AVYAY is the only scheme whose norms the portal holds).
 *
 * Values: `decision` — "sanction"; `remarks`; `recurring` and `nonRecurring` — "admissible",
 * "sought", "above-sought", "above-norm", or digits ("" for an empty field; see officer-values.ts).
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const REMARKS =
  "Sanctioned with the concurrence of the Integrated Finance Division. The amount is within the grant sought and the admissible amount under the scheme guidelines, and is released subject to the conditions of grants-in-aid under the General Financial Rules, 2017.";

const valid = { decision: "sanction", remarks: REMARKS, recurring: "admissible", nonRecurring: "admissible" };

export const REVIEW_SANCTION: DemoFormDef = {
  id: "review-sanction",
  title: "Sanction Order",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Sanction", valid: true, values: valid },
    { id: "no-remarks", label: "Remarks Left Out", values: { ...valid, remarks: "" } },
    { id: "no-amount", label: "Recurring Amount Left Out", values: { ...valid, recurring: "" } },
    { id: "above-sought", label: "Above the Amount Sought", values: { ...valid, recurring: "above-sought", nonRecurring: "sought" } },
    { id: "nil", label: "Nil Sanction", values: { ...valid, recurring: "0", nonRecurring: "0" } },
    { id: "above-norm", label: "Above the Cost Norms (AVYAY)", values: { ...valid, recurring: "above-norm", nonRecurring: "sought" } },
  ],
};
