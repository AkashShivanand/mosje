/**
 * Send the noted deficiency to the NGO — the Section Officer, Programme Division, on a file the
 * Assistant Section Officer has noted a deficiency on. Its rule: the message to the NGO is required.
 *
 * Values: `decision` — "communicateDeficiency"; `remarks` (the message).
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const MESSAGE =
  "The application cannot be examined further until the items listed below are corrected. Upload the corrected documents within 15 days of this message, as required under the scheme guidelines.";

const valid = { decision: "communicateDeficiency", remarks: MESSAGE };

export const REVIEW_SEND_DEFICIENCY: DemoFormDef = {
  id: "review-send-deficiency",
  title: "Send Deficiency to the NGO",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Message", valid: true, values: valid },
    { id: "no-message", label: "Message Left Out", values: { ...valid, remarks: "" } },
  ],
};
