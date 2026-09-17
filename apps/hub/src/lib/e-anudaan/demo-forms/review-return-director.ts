/**
 * Return to the Assistant Section Officer — the Programme Director. Its rule: the reason for the
 * return is required; the file climbs every level again.
 *
 * Values: `decision` — "return"; `remarks`.
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const REMARKS =
  "The fire safety certificate at checklist item 11 expired on 31 March 2026. Obtain the renewed certificate from the NGO, examine the file again and resubmit it through the levels.";

const valid = { decision: "return", remarks: REMARKS };

export const REVIEW_RETURN_DIRECTOR: DemoFormDef = {
  id: "review-return-director",
  title: "Return to the Assistant Section Officer",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Return", valid: true, values: valid },
    { id: "no-reason", label: "Reason for Return Left Out", values: { ...valid, remarks: "" } },
  ],
};
