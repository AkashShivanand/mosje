/**
 * SAMBAL rename campaign — the single source of truth for the NHAA → SAMBAL
 * transition, mandated by OM PCR-11/2/2026-PCR-Part(1) dated 06.07.2026.
 *
 * The OM directs the portal to display "a pop-up notification on login and a
 * floating banner on the portal ... for an appropriate period" to disseminate
 * the name change. That period is date-boxed here so the login pop-up
 * (<RenameNotice />) and the floating <AnnouncementBanner /> self-retire on
 * `END` with a single edit — no code change, no redeploy of copy.
 *
 * Approved name is SAMBAL (संबल), per the signed OM — not SAMBHAL.
 * Acronym: Safety Against Mistreatment through Better Assistance & Law-enforcement.
 */
export const RENAME = {
  /** Retired public name — kept as the searchable descriptor, never dropped. */
  oldName: "National Helpline Against Atrocities",
  oldAbbr: "NHAA",
  /** Approved brand name (OM, 06.07.2026). */
  newName: "SAMBAL",
  /** Devanagari wordmark — संबल = "support / strength". */
  newNameHi: "संबल",
  /** Continuity anchors — the number never changes, only the name. */
  helpline: "1800-202-1989",
  shortCode: "14566",
  /** Campaign window: launch → ~90 days (IST). */
  start: new Date("2026-07-06T00:00:00+05:30"),
  end: new Date("2026-10-04T00:00:00+05:30"),
} as const;

/** localStorage keys — dismissal is per-browser and survives the window. */
export const RENAME_KEYS = {
  bannerDismissed: "sambal:banner-dismissed",
  noticeAck: "sambal:rename-ack",
} as const;

/** One-line transition message reused by the pop-up and the banner. */
export const RENAME_MESSAGE =
  `${RENAME.oldName} is now ${RENAME.newNameHi} ${RENAME.newName} — same helpline, same number.`;

/** True while the announcement layer should still be shown. */
export function campaignActive(now: Date = new Date()): boolean {
  return now.getTime() < RENAME.end.getTime();
}
