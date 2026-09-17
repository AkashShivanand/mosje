/**
 * Reject — any officer holding the file, and the Programme Director. Its rule: the reason for the
 * rejection is required; it is read back before the rejection is recorded.
 *
 * Values: `decision` — "reject"; `remarks`.
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const REMARKS =
  "The NGO has not furnished audited accounts for the last three financial years, which the scheme guidelines require before a grant is sanctioned. The application is not admissible and is rejected.";

const valid = { decision: "reject", remarks: REMARKS };

export const REVIEW_REJECT: DemoFormDef = {
  id: "review-reject",
  title: "Reject the Application",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Rejection", valid: true, values: valid },
    { id: "no-reason", label: "Reason for Rejection Left Out", values: { ...valid, remarks: "" } },
  ],
};
