/**
 * Return to the previous level ("Return to Previous") — every grade above the Assistant Section
 * Officer in both divisions, and the Section Officer returning a noted deficiency unsent. Its rule:
 * remarks are required; they travel with the file as the query.
 *
 * Values: `decision` — "raiseQuery"; `remarks`.
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const REMARKS =
  "The recurring grant claimed for staff salaries does not agree with the staff statement at checklist item 14. Examine the difference, reconcile the statement with the salary register, and resubmit the file with your comments.";

const valid = { decision: "raiseQuery", remarks: REMARKS };

export const REVIEW_RETURN_PREVIOUS: DemoFormDef = {
  id: "review-return-previous",
  title: "Return to the Previous Level",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Return With a Query", valid: true, values: valid },
    { id: "no-remarks", label: "Query Left Out", values: { ...valid, remarks: "" } },
  ],
};
