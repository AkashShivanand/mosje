/**
 * Supplementary ILLUSTRATIVE records for the Manage VDP / Manage Adarsh Gram
 * screens — `registers.ts` is never edited, per the build brief, so anything
 * those screens need beyond `VILLAGES` and `DECLARATION_REQUESTS` lives here.
 *
 * Every figure is invented, shaped like the district register, and carries the
 * same `PROVENANCE_LINE` every screen that reads it already shows.
 */

/** The minimum latest village score the live "Declare Adarsh Gram" screen requires. */
export const MIN_DECLARATION_SCORE = 70;

export interface EligibleDeclarationVillage {
  id: string;
  block: string;
  gramPanchayat: string;
  village: string;
  score: number;
  /**
   * Set only when this village was previously submitted and returned by the
   * state — the register still lists it as eligible to resubmit.
   */
  returnedNote?: string;
}

/**
 * Two villages invented here, not in `VILLAGES` — `registers.ts`'s own three
 * DLCC-approved, score-70+ villages (Silaunja, Dobhi, Deokund) are already
 * pending or returned in `DECLARATION_REQUESTS`, so without these the eligible
 * register would show a single row. Block and Gram Panchayat names are taken
 * from the district's own `BLOCKS` / `GRAM_PANCHAYATS`, so they read as part
 * of the same district rather than an invented one.
 */
export const EXTRA_ELIGIBLE_VILLAGES: EligibleDeclarationVillage[] = [
  { id: "e-01", block: "Tikari", gramPanchayat: "Amethi", village: "Rajauli", score: 81 },
  { id: "e-02", block: "Wazirganj", gramPanchayat: "Naima", village: "Chandauti", score: 73 },
];
