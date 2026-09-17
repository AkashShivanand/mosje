/**
 * Raise a deficiency — the Assistant Section Officer, Programme Division. Its rules, from the review
 * screen and the workflow: remarks are required, and every document marked Needs Correction carries
 * the reason the NGO is to be given.
 *
 * Values: `decision` — "raiseDeficiency"; `remarks`; `mark` — "with-reason" or "without-reason"
 * marks one document Needs Correction; `markReason` (`{document}` is its title).
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const REMARKS =
  "One document does not meet the checklist and is marked for correction with the reason. The NGO is to be asked for a corrected copy before the file is examined further.";
const REASON = "The {document} is not legible on pages 2 and 3. Upload a clear, complete copy signed by the authorised signatory.";

const valid = { decision: "raiseDeficiency", remarks: REMARKS, mark: "with-reason", markReason: REASON };

export const REVIEW_DEFICIENCY: DemoFormDef = {
  id: "review-deficiency",
  title: "Raise Deficiency",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Deficiency", valid: true, values: valid },
    { id: "no-remarks", label: "Remarks Left Out", values: { ...valid, remarks: "" } },
    { id: "no-reason", label: "Document Marked Without a Reason", values: { ...valid, mark: "without-reason", markReason: "" } },
  ],
};
