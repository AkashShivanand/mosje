/**
 * Respond and send back, from the Queries register — the officer a file was returned to. Its rule
 * (officer-forms.ts `queryResponseError`): the response is required.
 *
 * Values: `response`. The form opens the first query awaiting this officer's response.
 */

import type { DemoFormDef } from "./index.ts";
import { QUERY_RESPONSE_TEXT } from "./review-respond.ts";

const valid = { response: QUERY_RESPONSE_TEXT };

export const QUERY_RESPONSE: DemoFormDef = {
  id: "query-response",
  title: "Respond to a Query",
  path: /^\/dashboard\/(pd|finance)\/[^/]+\/queries\/?$/,
  presets: [
    { id: "valid", label: "Correct Response", valid: true, values: valid },
    { id: "no-response", label: "Response Left Out", values: { response: "" } },
  ],
};
