/**
 * Respond and send back — the officer a file was returned to with a query. Its rule: the response
 * is required. The same answer is given from the Queries register (query-response.ts).
 *
 * Values: `decision` — "resolveQuery"; `remarks`.
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

export const QUERY_RESPONSE_TEXT =
  "The difference arises from two posts of house mother sanctioned in 2025-26 and filled in April 2026. The staff statement has been reconciled with the salary register, and the amount claimed is correct. Submitted for orders.";

const valid = { decision: "resolveQuery", remarks: QUERY_RESPONSE_TEXT };

export const REVIEW_RESPOND: DemoFormDef = {
  id: "review-respond",
  title: "Respond and Send Back",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Response", valid: true, values: valid },
    { id: "no-response", label: "Response Left Out", values: { ...valid, remarks: "" } },
  ],
};
