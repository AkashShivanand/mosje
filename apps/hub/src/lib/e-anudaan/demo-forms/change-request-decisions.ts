/**
 * Decide a project change the NGO asked for — the Joint Secretary, Programme Division, on Bank
 * Account Changes, and the PMU field officer on Location Changes. Both dialogs enforce one rule
 * (officer-forms.ts `changeDecisionError`): remarks are required, as the NGO is shown them with the
 * decision. Approve and Do Not Approve are separate forms because their remarks say different things.
 *
 * Values: `remarks`. The form opens the first request awaiting a decision.
 */

import type { DemoFormDef, DemoFormPreset } from "./index.ts";

const BANK = /^\/dashboard\/sm2\/bank-changes\/?$/;
const LOCATION = /^\/dashboard\/pmu\/location-changes\/?$/;

function presets(label: string, remarks: string): DemoFormPreset[] {
  return [
    { id: "valid", label, valid: true, values: { remarks } },
    { id: "no-remarks", label: "Remarks Left Out", values: { remarks: "" } },
  ];
}

export const BANK_CHANGE_APPROVE: DemoFormDef = {
  id: "bank-change-approve",
  title: "Bank Account Change — Approve",
  path: BANK,
  presets: presets(
    "Correct Approval",
    "The cancelled cheque and the bank's letter confirm the new account in the Society's registered name. The account is to be registered on the PFMS DBT module before the next release.",
  ),
};

export const BANK_CHANGE_REFUSE: DemoFormDef = {
  id: "bank-change-refuse",
  title: "Bank Account Change — Do Not Approve",
  path: BANK,
  presets: presets(
    "Correct Refusal",
    "The account holder's name on the cancelled cheque does not match the registered name of the Society. The NGO may raise a fresh request with the bank's letter confirming the account in the Society's registered name.",
  ),
};

export const LOCATION_CHANGE_APPROVE: DemoFormDef = {
  id: "location-change-approve",
  title: "Location Change — Approve",
  path: LOCATION,
  presets: presets(
    "Correct Approval",
    "The new premises are within the project's district, as the scheme requires, and the supporting document establishes the reason for the move. The project's address on record is updated from the date of this approval.",
  ),
};

export const LOCATION_CHANGE_REFUSE: DemoFormDef = {
  id: "location-change-refuse",
  title: "Location Change — Do Not Approve",
  path: LOCATION,
  presets: presets(
    "Correct Refusal",
    "The position recorded with the request lies outside the project's district, and a project may move only within its sanctioned district. The NGO may raise a fresh request for premises within the district.",
  ),
};
