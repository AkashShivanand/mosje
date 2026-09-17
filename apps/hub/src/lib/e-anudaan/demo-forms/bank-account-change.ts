/**
 * Request a Change of Bank Account (`/ngo/bank-accounts`, the dialog each project row opens). Its
 * rules, from the dialog: bank, branch, a reason and the PFMS answer are required; the account
 * number is 9 to 18 digits and typed twice alike; the IFSC is 11 characters in the RBI pattern; the
 * new account cannot be the one already recorded for the project.
 *
 * A project with a request under examination offers no "Request Change" at all, so that is not a
 * message the dialog can show and has no preset.
 *
 * Values: `project` — "free" (no request pending); `account` and `ifsc` may be `{current}`, the
 * project's recorded account; the rest are the dialog's own fields. `pfms` is "yes", "no" or "".
 */

import { DEMO_APPLICANT } from "../demo-answers.ts";
import type { DemoFormDef } from "./index.ts";

const valid = {
  project: "free",
  bank: DEMO_APPLICANT.bank,
  branch: DEMO_APPLICANT.branch,
  account: DEMO_APPLICANT.account,
  confirm: DEMO_APPLICANT.account,
  ifsc: DEMO_APPLICANT.ifsc,
  pfms: "yes",
  reason:
    "The Society's account at the Camp branch is being closed. Grants for this project are to be received in the Society's account at the Hadapsar branch, which is registered on the PFMS DBT module.",
  document: "sbi-hadapsar-cancelled-cheque.pdf",
};

export const BANK_ACCOUNT_CHANGE: DemoFormDef = {
  id: "bank-account-change",
  title: "Request a Change of Bank Account",
  path: /^\/ngo\/bank-accounts\/?$/,
  presets: [
    { id: "valid", label: "Correct Request", valid: true, values: valid },
    { id: "no-bank", label: "Bank Name Left Out", values: { ...valid, bank: "" } },
    { id: "no-branch", label: "Branch Left Out", values: { ...valid, branch: "" } },
    { id: "short-account", label: "Account Number Too Short", values: { ...valid, account: "12345678", confirm: "12345678" } },
    { id: "mismatch", label: "Account Numbers Do Not Match", values: { ...valid, confirm: "123456789021" } },
    { id: "bad-ifsc", label: "IFSC in the Wrong Pattern", values: { ...valid, ifsc: "SBIN1000001" } },
    { id: "same-account", label: "Account Already Recorded", values: { ...valid, account: "{current}", confirm: "{current}", ifsc: "{current}" } },
    { id: "no-pfms", label: "PFMS Registration Not Stated", values: { ...valid, pfms: "" } },
    { id: "no-reason", label: "Reason Left Out", values: { ...valid, reason: "" } },
  ],
};
