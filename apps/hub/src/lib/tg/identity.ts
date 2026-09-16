/**
 * Identity services SMILE-Transgender offers, per role.
 *
 * DigiLocker is an OPTION, switched on only for a portal or role that has it
 * connected. No portal on the estate offers it today (decided 15 September 2026),
 * so every switch is off. Turning one on restores the whole path it governs:
 * - `login` — the "Continue with DigiLocker" card on that role's login tab, and
 *   the hand-off page it links to (which returns Not Found while this is off);
 * - `applicationPrefill` — the "Fetch details with DigiLocker" step on the
 *   certificate application, and its "Entry Method" row on the review.
 */
export interface DigiLockerSwitches {
  login: boolean;
  applicationPrefill: boolean;
}

export const TG_DIGILOCKER: { citizen: DigiLockerSwitches } = {
  citizen: { login: false, applicationPrefill: false },
};
