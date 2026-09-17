/**
 * Forward the file — every grade of the Programme Division and the Integrated Finance Division; the
 * Joint Secretary, Integrated Finance Division, records concurrence instead. Its rules, from the
 * review screen: remarks are required; a forward over a document marked Needs Correction asks first.
 *
 * Values: `decision` — "forward"; `remarks`; `mark` — "with-reason" marks one document Needs
 * Correction with `markReason` (`{document}` is its title), "" marks nothing.
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const REMARKS =
  "Examined the file. The documents are verified and certified by the Assistant Section Officer, the beneficiary figures agree with the enrolment register, and the grant sought is within the amount admissible under the scheme guidelines. Submitted for further examination and orders.";

const valid = { decision: "forward", remarks: REMARKS, mark: "", markReason: "" };

export const REVIEW_FORWARD: DemoFormDef = {
  id: "review-forward",
  title: "Forward or Concur",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Forward", valid: true, values: valid },
    { id: "no-remarks", label: "Remarks Left Out", values: { ...valid, remarks: "" } },
    {
      id: "marked",
      label: "Document Marked Needs Correction",
      values: { ...valid, mark: "with-reason", markReason: "The {document} is not legible on pages 2 and 3. Upload a clear, complete copy signed by the authorised signatory." },
    },
  ],
};
