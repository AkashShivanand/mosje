/**
 * Village removal requests — ILLUSTRATIVE, for `/adarsh-gram-district/remove-village`.
 *
 * The live screen's own table is a queue of villages already submitted to the state for
 * removal (S.No., District, Block, Gram Panchayat, Village, Status, remarks, requested
 * date). This register instead tracks ONE removal status per village in `VILLAGES` —
 * "Not Requested" until an officer acts — so the screen is the district's whole list of
 * selected villages, with the removal request as a per-row action, rather than a second
 * table an officer has no way to reach a village from.
 *
 * Every figure here is invented; none of it is the department's.
 * `.claude/rules/prototype-data-modes.md` — the screen carries `PROVENANCE_LINE`.
 */

export type RemovalStatus =
  | "Not Requested"
  | "Pending with State"
  | "Returned for Correction"
  | "Approved";

export interface RemovalRequest {
  villageId: string;
  status: RemovalStatus;
  reason: string;
  requestedOn: string;
  /** The state's own note — set only once it has acted. */
  stateRemarks: string | null;
  /** The ministry's note, where the removal has travelled that far. */
  ministryRemarks: string | null;
}

/** Seed data: three of the twelve selected villages already have a removal in flight. */
export const REMOVAL_REQUESTS: RemovalRequest[] = [
  {
    villageId: "v-05",
    status: "Pending with State",
    reason: "Village re-verified as not SC-majority after the 2026 household re-survey.",
    requestedOn: "12 Sep 2026",
    stateRemarks: null,
    ministryRemarks: null,
  },
  {
    villageId: "v-09",
    status: "Pending with State",
    reason: "Duplicate entry — Konch was also declared under an adjoining district's Adarsh Gram list.",
    requestedOn: "05 Sep 2026",
    stateRemarks: "Forwarded to the ministry on 09 Sep 2026.",
    ministryRemarks: "Held pending the adjoining district's confirmation.",
  },
  {
    villageId: "v-12",
    status: "Returned for Correction",
    reason: "Boundary dispute with the neighbouring Naima gram panchayat, raised by the block office.",
    requestedOn: "18 Aug 2026",
    stateRemarks: "Attach the block-level boundary verification report before resubmitting.",
    ministryRemarks: null,
  },
];
