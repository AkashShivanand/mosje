/**
 * PFMS error codes → the sentence an officer reads, and the step and field it belongs to.
 *
 * FR-STS-006: "display PFMS-returned ErrorCode and ErrorMessage values against the case in plain
 * language, mapped through a maintained lookup, rather than showing raw codes to the user." This is
 * that lookup. The Bureau could reword a message on a page retired on 3 Oct 2026; rewordings
 * already saved still apply. The code, step and field are fixed, because they are what lets the
 * Maker's error summary jump to the right input.
 *
 * Codes the BRD names are real: ERRM05, the ERRSNC and ERRCC families, and ERRSNC44 ("Bill Number
 * already exists", §8.5). The remaining numbers are ILLUSTRATIVE — the full list is in the PFMS
 * Claim WebAPI specification, which this prototype does not have. Replace them from that document.
 *
 * The raw code is kept on the advice's audit trail and never rendered in a message.
 */

import type { AdviceStep } from "./types.ts";

export interface PfmsErrorEntry {
  code: string;
  step: AdviceStep;
  field: string;
  /** Plain language, what to do next, one or two sentences. */
  message: string;
  /** Real (named in the BRD) or illustrative (shape only). */
  provenance: "brd" | "illustrative";
  /** Grouping for the Failure Trend report (§11). */
  category: "Schema" | "Master Data" | "Beneficiary" | "Documents" | "Duplicate";
}

export const PFMS_ERRORS: readonly PfmsErrorEntry[] = [
  {
    code: "ERRM05",
    step: "review",
    field: "advice-review",
    message: "PFMS could not read the payment advice. Nothing was created at PFMS. Check every step, then send it again.",
    provenance: "brd",
    category: "Schema",
  },
  {
    code: "ERRSNC44",
    step: "header",
    field: "hdr-bill-number",
    message: "This bill number has already been used for this DDO. A new bill number has been generated; review it and send again.",
    provenance: "brd",
    category: "Duplicate",
  },
  {
    code: "ERRSNC12",
    step: "header",
    field: "hdr-ddo",
    message: "PFMS does not recognise this DDO for e-Sanctions. Choose another DDO, or ask the Bureau to refresh the master data.",
    provenance: "illustrative",
    category: "Master Data",
  },
  {
    code: "ERRSNC19",
    step: "header",
    field: "hdr-pd",
    message: "The division code is not mapped to the chosen DDO at PFMS. Choose a code listed for this DDO.",
    provenance: "illustrative",
    category: "Master Data",
  },
  {
    code: "ERRSNC23",
    step: "heads",
    field: "heads-total",
    message: "The amounts against the heads of account do not add up to the sanction amount.",
    provenance: "illustrative",
    category: "Schema",
  },
  {
    code: "ERRSNC27",
    step: "heads",
    field: "head-0-function",
    message: "PFMS does not accept this combination of Function Head, Object Head, Category and Grant Number for the scheme.",
    provenance: "illustrative",
    category: "Master Data",
  },
  {
    code: "ERRSNC31",
    step: "beneficiary",
    field: "ben-0-payee",
    message: "PFMS does not recognise the NGO's payee code. Confirm the code with the NGO; it is on their PFMS registration.",
    provenance: "illustrative",
    category: "Beneficiary",
  },
  {
    code: "ERRSNC32",
    step: "beneficiary",
    field: "ben-0-ifsc",
    message: "The IFSC does not match the bank account held at PFMS for this payee.",
    provenance: "illustrative",
    category: "Beneficiary",
  },
  {
    code: "ERRSNC38",
    step: "beneficiary",
    field: "ben-0-claim",
    message: "The Claim Reference Number was not issued to this division code. A fresh number has been drawn from the pool.",
    provenance: "illustrative",
    category: "Master Data",
  },
  {
    code: "ERRCC05",
    step: "documents",
    field: "doc-list",
    message: "A mandatory supporting document is missing or its fingerprint does not match the file. Upload it again.",
    provenance: "illustrative",
    category: "Documents",
  },
];

export function pfmsError(code: string, overrides?: Readonly<Record<string, string>>): PfmsErrorEntry {
  const entry = PFMS_ERRORS.find((e) => e.code === code);
  const fallback: PfmsErrorEntry = {
    code,
    step: "review",
    field: "advice-review",
    message: "PFMS did not accept the payment advice. Check every step, then send it again. If it is refused again, contact the Bureau.",
    provenance: "illustrative",
    category: "Schema",
  };
  const base = entry ?? fallback;
  const reworded = overrides?.[code];
  return reworded ? { ...base, message: reworded } : base;
}
