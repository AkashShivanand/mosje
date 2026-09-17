/**
 * Correct Your Application (`/ngo/my-applications/<id>?focus=deficiency`). What the page enforces,
 * from the page and `edit-policy.ts`:
 *
 *  • every item the Ministry raised is corrected before the correction can be submitted;
 *  • a corrected answer cannot be the answer already submitted;
 *  • an answer the policy marks significant is changed only with a reason;
 *  • an answer the policy locks cannot be changed here — the page says why and where instead;
 *  • under Change Another Answer, the new answer is required and must differ from the one on file,
 *    and a significant one needs its reason.
 *
 * Values name ROLES, and the page resolves them against the file open: `items` — "correct" saves a
 * correction for every open item (a replacement file, a corrected answer with its reason where one
 * is asked, a written answer for a locked or a note item), "untouched" leaves them; `item` — "same"
 * or "no-reason" puts that problem in the first item it applies to; `another` — "locked", "blank",
 * "same" or "no-reason" opens Change Another Answer on a field of that kind; `submit` — "attempt"
 * presses Submit Correction.
 *
 * The correct fill SAVES each item, as leaving each box does on this page; it does not submit.
 * "Items Not Corrected" shows only on a file whose items are still open.
 */

import type { DemoFormDef } from "./index.ts";

const valid = {
  items: "correct",
  item: "",
  another: "",
  submit: "",
  reason: "The figure has been checked against the audited accounts for 2025-26 and brought in line with the expenditure they show.",
  answerIfsc: "The IFSC is being changed through a bank account change request for this project, and the authorisation letter will follow the approved account.",
  answerName: "The list of employees has been reissued with the organisation's name as registered on NGO-DARPAN.",
  answerOther: "The answer has been corrected where the portal directs, and the documents now carry the recorded details.",
  note: "Each item has been corrected as the Ministry asked. The replacement files were checked against the original records before upload.",
};

/**
 * A different answer of the same kind as the one submitted, for a corrected answer: a whole number
 * is brought down by about 5%, anything else is marked as revised.
 */
export function correctedValueOf(submitted: string): string {
  const v = submitted.trim();
  if (/^\d+$/.test(v)) {
    const n = Number(v);
    const next = Math.round(n * 0.95);
    if (next !== n) return String(next);
    return String(n > 0 ? n - 1 : n + 1);
  }
  return v ? `${v} (revised)` : "Revised";
}

export const CORRECT_APPLICATION: DemoFormDef = {
  id: "correct-application",
  title: "Correct Your Application",
  path: /^\/ngo\/my-applications\/(?!deficiencies\/?$)[^/]+\/?$/,
  presets: [
    { id: "valid", label: "Every Item Corrected", valid: true, values: valid },
    { id: "not-corrected", label: "Items Not Corrected", values: { ...valid, items: "untouched", submit: "attempt" } },
    { id: "same-as-submitted", label: "Corrected Answer Same as Submitted", values: { ...valid, items: "untouched", item: "same" } },
    { id: "no-reason", label: "Reason for a Significant Change Left Out", values: { ...valid, items: "untouched", item: "no-reason" } },
    { id: "locked", label: "Answer Locked at This Stage", values: { ...valid, items: "untouched", another: "locked" } },
    { id: "another-blank", label: "Another Answer: New Answer Left Out", values: { ...valid, items: "untouched", another: "blank" } },
    { id: "another-same", label: "Another Answer: Same as on the Application", values: { ...valid, items: "untouched", another: "same" } },
    { id: "another-no-reason", label: "Another Answer: Reason Left Out", values: { ...valid, items: "untouched", another: "no-reason" } },
  ],
};
