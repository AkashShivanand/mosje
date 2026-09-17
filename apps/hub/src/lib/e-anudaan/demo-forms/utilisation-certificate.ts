/**
 * Utilisation Certificate (`/ngo/my-applications/<id>/uc`). Its rules, from the page: the amount
 * utilised is a whole number of rupees above 0, and no more than was released (or sanctioned, before
 * a release); the purposes are stated; the certificate signed by the Chartered Accountant is
 * uploaded. The form shows only on a sanctioned file with no certificate yet.
 *
 * Values: `amount` — "within" (94% of the ceiling), "over" (above it) or ""; `remarks`; `document`.
 */

import type { DemoFormDef } from "./index.ts";

const valid = {
  amount: "within",
  remarks:
    "Salaries of the Superintendent, the nurse and two caregivers from April to September 2026; food, medicines and bedding for the residents; electricity and water charges of Sankalp Seniors' Home.",
  document: "utilisation-certificate-signed-by-ca.pdf",
};

/** The amount a role names, against what reached the organisation. */
export function ucAmountOf(role: string, ceiling: number): string {
  if (role === "within") return String(Math.round(ceiling * 0.94));
  if (role === "over") return String(ceiling + 125_000);
  return "";
}

export const UTILISATION_CERTIFICATE: DemoFormDef = {
  id: "utilisation-certificate",
  title: "Utilisation Certificate",
  path: /^\/ngo\/my-applications\/[^/]+\/uc\/?$/,
  presets: [
    { id: "valid", label: "Correct Certificate", valid: true, values: valid },
    { id: "no-amount", label: "Amount Utilised Left Out", values: { ...valid, amount: "" } },
    { id: "over", label: "More Than Was Released", values: { ...valid, amount: "over" } },
    { id: "no-remarks", label: "Purposes Left Out", values: { ...valid, remarks: "" } },
    { id: "no-document", label: "Signed Certificate Not Uploaded", values: { ...valid, document: "" } },
  ],
};
