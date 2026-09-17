/**
 * Issue a Show Cause Notice — the Section Officer and the Joint Secretary, Programme Division, from
 * "More Actions" on the review screen. Its rules (officer-forms.ts `showCauseError`): the grounds
 * are required; a response deadline, when given, is a date after today.
 *
 * Values: `grounds`; `respondBy` — "", "today" or "+N" days (officer-values.ts).
 */

import type { DemoFormDef } from "./index.ts";
import { REVIEW_PATH } from "./officer-values.ts";

const GROUNDS =
  "The inspection report records 38 residents in the hostel against the 60 for whom the grant was sanctioned. Explain in writing why the recurring grant should not be reduced in proportion under the terms of the sanction order.";

const valid = { grounds: GROUNDS, respondBy: "+15" };

export const SHOW_CAUSE_NOTICE: DemoFormDef = {
  id: "show-cause-notice",
  title: "Show Cause Notice",
  path: REVIEW_PATH,
  presets: [
    { id: "valid", label: "Correct Notice", valid: true, values: valid },
    { id: "no-grounds", label: "Grounds Left Out", values: { ...valid, grounds: "" } },
    { id: "deadline-today", label: "Response Deadline Not After Today", values: { ...valid, respondBy: "today" } },
  ],
};
