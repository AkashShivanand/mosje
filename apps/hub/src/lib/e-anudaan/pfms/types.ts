/**
 * The payment leg of a grant, from a final sanction to a confirmed bank credit.
 *
 * Source: BRD "Integration of PFMS with the e-Anudaan Portal — Sanction Transmission, Payment
 * Disbursement and Reconciliation (US-PD Maker–Checker Module)", NeGD, v1.0, 08 Sep 2026
 * (docs/source-brd/eAnudaan_PFMS_Integration_BRD.pdf). Section numbers below are that document's.
 *
 * The objects, in the order a grant meets them (plan §2.2):
 *
 *   Sanction (final — never altered here, BR-SNC-002)
 *     └─ PaymentAdvice          prepared by the PD Maker, authorised by the PD Checker
 *          ├─ header · heads of account · beneficiaries · documents   (Annexure F)
 *          └─ PfmsRequest[]     one per transmission; a resubmission is a NEW identifier that
 *               │               points back to the one before (FR-PDM-012, FR-SNC-004)
 *               ├─ status       the PFMS lifecycle, Annexure C
 *               ├─ bill → voucher
 *               └─ payments     one per beneficiary, each with its UTR (FR-STS-003)
 *
 * Nothing here talks to PFMS. The prototype moves no money; `simulator.ts` stands in for the
 * PFMS responses the BRD specifies so every state can be designed and seen.
 *
 * Pure types, no runtime imports.
 */

import type { RoleId } from "../types.ts";

/* ── PFMS master data (FR-MDM) ─────────────────────────────────────────────── */

/** Where a sanction first lands at PFMS. Decides which document fingerprints are mandatory (BR-DOC-001). */
export type LandingStatus = "Approved" | "DigitallySignedByDDO" | "PassedByPAO";

export interface Ddo {
  /** 6-digit DDO code (Annexure A.1). */
  code: string;
  name: string;
  paoCode: string;
  /** GetDDOeBillActivationStatus — an inactive DDO cannot receive an eSanction (FR-MDM-004). */
  eBillActive: boolean;
  landing: LandingStatus;
}

export interface Pao {
  code: string;
  name: string;
  controllerCode: string;
}

export interface PdCode {
  /** 8-digit PD code (Annexure A.1). */
  code: string;
  ddoCode: string;
  label: string;
}

export interface CodedItem {
  code: string;
  label: string;
}

export interface Masters {
  /** When the last successful sync finished (FR-MDM-005). ISO. */
  syncedAt: string;
  controllers: CodedItem[];
  paos: Pao[];
  ddos: Ddo[];
  pdCodes: PdCode[];
  /** 13-digit Function Heads. */
  functionHeads: CodedItem[];
  /** 2-digit Object Heads. */
  objectHeads: CodedItem[];
  categories: CodedItem[];
  /** 3-digit Grant Numbers. */
  grantNumbers: CodedItem[];
}

/* ── Scheme configuration (FR-HOA-002, §3.1 B) ─────────────────────────────── */

export interface HeadOfAccount {
  functionHead: string;
  objectHead: string;
  category: string;
  grantNumber: string;
}

export interface SchemePfmsConfig {
  /** e-Anudaan's scheme code (`GrantApplication.schemeCode`). */
  schemeCode: string;
  /** Numeric PFMS scheme code, or null where PFMS has not allotted one yet (§9). */
  pfmsSchemeCode: string | null;
  /** The heads a Maker may choose from for this scheme. Empty until the Bureau finalises them. */
  heads: HeadOfAccount[];
  /** DDOs that pay this scheme. */
  ddoCodes: string[];
  /** SHRESHTA's payment mode (TSA or hybrid) is undecided (§3.2, §9). */
  pendingDecision?: string;
}

/* ── The payment advice (FR-PDM, Annexure F) ───────────────────────────────── */

export interface HeadLine extends Partial<HeadOfAccount> {
  id: string;
  /** Rupees. */
  amount: number;
}

/** Required only for an expenditure sanction against Object Head 33 (Annexure A.1). */
export type CnaExceptionReason = "" | "01" | "02" | "03";

export interface BeneficiaryLine {
  id: string;
  /** The NGO's PFMS unique (payee / vendor) code (FR-NGO-001). */
  payeeCode: string;
  name: string;
  /** Last four digits only. The full number never reaches the browser's storage. */
  accountLast4: string;
  ifsc: string;
  bank: string;
  /** Rupees. */
  gross: number;
  /** Beneficiary-wise deductions (Annexure A.3, conditional). */
  deductions: HeadLine[];
  /** Max 25 characters (Annexure A.3). */
  remarks: string;
  /** Drawn from the pre-issued pool, one per beneficiary payment (FR-PDM-008). */
  claimReference?: string;
  /** Where the payee code and bank details came from. */
  source: "ngo" | "bureau";
}

/** Annexure E. */
export type DocumentTypeCode = 1 | 2 | 3 | 4 | 5 | 6;

export interface AdviceDocument {
  id: string;
  type: DocumentTypeCode;
  name: string;
  sizeKb: number;
  /** SHA-256 of the file's bytes, Base64 (FR-DOC-001). Computed in the browser on upload. */
  hash: string;
  uploadedAt: string;
  /** The single-use, time-boxed view link PFMS users open (FR-DOC-002). */
  viewLink: { token: string; expiresAt: string; used: boolean };
}

/** Where the advice is inside e-Anudaan. Everything after `transmitted` is read from PFMS. */
export type AdviceState =
  | "draft"
  | "submitted"
  | "returned"
  | "transmitted"
  /** PFMS refused the payload (isSuccess = 0). Nothing was created at PFMS; back with the Maker. */
  | "not-accepted"
  /** PFMS could not be reached. Queued for automatic retry; the case reads "Waiting to Resend". */
  | "queued"
  /** Cancelled at PFMS — terminal. A fresh sanction must originate from e-Anudaan (BR-CAN-001). */
  | "cancelled";

export interface AdviceHeader {
  ddoCode: string;
  pdCode: string;
  /** Auto-generated per DDO per financial year on first save with a DDO (FR-PDM-005). */
  billNumber: string;
  billDate: string;
  /** Not Payable Before date — optional (Annexure A.1). */
  npbDate: string;
  cnaExceptionReason: CnaExceptionReason;
}

export interface ValidationIssue {
  step: AdviceStep;
  /** The field's DOM id on the Maker's screen, so a summary link can jump to it. */
  field: string;
  message: string;
  /** PFMS error code when the issue came back from PFMS rather than a local check. */
  pfmsCode?: string;
}

export type AdviceStep = "header" | "heads" | "beneficiary" | "documents" | "review";

/* ── PFMS (FR-SNC, FR-STS, Annexure C) ─────────────────────────────────────── */

/** Every status GetRequestStatus can return (Annexure C). */
export type PfmsStatus =
  | "Created"
  | "Submitted"
  | "PassByPDMaker"
  | "PendingDSCPDChecker"
  | "Approved"
  | "BillGenerated"
  | "PendingDDODSC"
  | "DigitallySignedByDDO"
  | "PassedByDHForDSC"
  | "PendingDHDSCPassOrder"
  | "ForwardedToAAO"
  | "PassedByAAOForDSC"
  | "PendingAAODSCPassOrder"
  | "ForwardedToPAO"
  | "PassedByPAOForDSC"
  | "PendingPAODSCPassOrder"
  | "PassedByPAO"
  | "XMLGenerated"
  | "DSCBatchGenerated"
  | "PendingDSCBatchFileGenerationSign1"
  | "PendingDSCBatchFileGenerationSign2"
  | "DigitalSignatoryLast"
  | "Closed"
  | "ReturnedByDealingHand"
  | "ReturnedByAAO"
  | "ReturnedByPAO"
  | "ReturnedByDDO"
  | "PendingDSCReturnOrder"
  | "FinYrExpired"
  | "Cancelled";

export interface PfmsError {
  code: string;
  /** PFMS's own message, kept for the audit trail only — never shown raw (FR-STS-006). */
  message: string;
}

export interface BeneficiaryPayment {
  beneficiaryId: string;
  payeeCode: string;
  amount: number;
  /** Bank Transaction ID — the credit is confirmed only when this is present (BR-NTF-001). */
  utr?: string;
  scrollStatus: "Pending" | "Success" | "Failed";
  scrollDate?: string;
}

export interface PfmsRequest {
  /** Unique, non-reusable (FR-PDM-012). */
  uniqueIdentifier: string;
  previousUniqueIdentifier?: string;
  sentAt: string;
  /** "F" fresh; "R" a returned bill being resubmitted (Annexure A.1). */
  billStatus: "F" | "R";
  /** What the ReceiveSanctionData call itself answered. */
  outcome: "accepted" | "not-accepted" | "queued";
  errors: PfmsError[];
  status?: PfmsStatus;
  statusAt?: string;
  /** Every status this request has carried, oldest first — the case timeline reads it. */
  statusHistory: { status: PfmsStatus; at: string }[];
  bill?: { billNumber: string; billDate: string; tokenNumber: string; tokenDate: string };
  voucher?: { number: string; date: string };
  payments: BeneficiaryPayment[];
  /** BillReturnReason, when PFMS returned and cancelled the bill (FR-STS-005). */
  returnReason?: string;
  /** How many automatic resends a queued request has had. */
  retries: number;
}

export interface Signature {
  by: RoleId;
  personName: string;
  at: string;
  certificateSerial: string;
}

export type AdviceEventKind =
  | "created"
  | "saved"
  | "submitted"
  | "returned"
  | "signed"
  | "transmitted"
  | "not-accepted"
  | "queued"
  | "resent"
  | "status"
  | "credited"
  | "cancelled"
  | "reconciled";

export interface AdviceEvent {
  at: string;
  kind: AdviceEventKind;
  by?: RoleId;
  /** One sentence in the portal's register. */
  text: string;
}

export interface PaymentAdvice {
  /** e.g. PA/2026-27/00012. */
  id: string;
  appId: string;
  schemeCode: string;
  financialYear: string;
  /** Rupees. Read from the sanction order; never editable (FR-PDM-006). */
  sanctionAmount: number;
  state: AdviceState;
  header: AdviceHeader;
  heads: HeadLine[];
  beneficiaries: BeneficiaryLine[];
  documents: AdviceDocument[];
  preparedBy?: RoleId;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  /** The Checker's remark on the most recent return (FR-PDC-003). */
  checkerRemark?: string;
  returnCount: number;
  signature?: Signature;
  requests: PfmsRequest[];
  /** Local issues and PFMS errors still to be fixed, attached to their step and field. */
  issues: ValidationIssue[];
  history: AdviceEvent[];
  /** Set once the RD/TD feed has been matched against this advice (FR-STS-004). */
  reconciliation?: { at: string; matched: boolean; note?: string };
}

/* ── Claim Reference Numbers (FR-DOC-003) ──────────────────────────────────── */

export interface ClaimReferenceBatch {
  pdCode: string;
  financialYear: string;
  drawnAt: string;
  numbers: string[];
}

/* ── DSC designation (BR-DSC-001) ─────────────────────────────────────────── */

export interface Designation {
  ddoCode: string;
  maker: RoleId;
  checker: RoleId;
  /** The certificate the designated Checker holds for this DDO. */
  certificateSerial: string;
  certificateExpires: string;
  designatedBy: RoleId;
  designatedAt: string;
}

/* ── Payee codes (FR-NGO-001/002/003) ─────────────────────────────────────── */

export interface PayeeRecord {
  /** `ProjectAccount.id`. */
  accountId: string;
  projectId: string;
  payeeCode: string;
  /** "ngo" — entered and confirmed by the NGO; "bureau" — back-filled for a legacy file. */
  source: "ngo" | "bureau";
  confirmedAt: string;
}

/** A legacy sanctioned file with no bank details on record at all — back-filled whole (FR-NGO-003). */
export interface BackfilledAccount {
  projectId: string;
  bank: string;
  branch: string;
  last4: string;
  ifsc: string;
  payeeCode: string;
  enteredBy: RoleId;
  enteredAt: string;
}
