// NAPDDR Three-Tier Committee — data model.
// Pure types only (safe to import from server and client).

export type CommitteeTier = "STATE" | "DISTRICT" | "BLOCK";

/**
 * An uploaded document. In this prototype the bytes live only in-session as a
 * `blob:` object URL; after a reload the URL no longer resolves, so `blobUrl`
 * is `null` and the UI shows a "re-upload to view" placeholder.
 */
export interface UploadedFile {
  name: string;
  sizeBytes: number;
  mime: string;
  /** In-session object URL, or null once the session that created it is gone. */
  blobUrl: string | null;
}

export interface MeetingMinute {
  id: string;
  committeeId: string;
  committeeName: string;
  meetingDate: string; // ISO yyyy-mm-dd
  file: UploadedFile;
}

export interface CommitteeRecord {
  id: string;
  tier: CommitteeTier;
  state: string;
  district?: string; // DISTRICT, BLOCK
  block?: string; // BLOCK

  chiefSecretaryName?: string; // STATE
  chairpersonName?: string; // DISTRICT, BLOCK
  chairpersonDesignation?: string; // auto: DC/Deputy Commissioner | BDO
  memberSecretaryName?: string; // STATE, DISTRICT
  memberSecretaryDesignation?: string; // STATE (textbox) | DISTRICT (auto: DSWO)
  nodalDepartment?: string; // STATE, DISTRICT

  formationDate: string; // ISO yyyy-mm-dd
  memberCount: number; // 0–50
  notification: UploadedFile;
  minutes: MeetingMinute[];

  createdBy: string; // demo account id
  createdAt: string; // ISO timestamp
}

/**
 * Portal roles in the NMBA portal.
 *   ADMIN    → all States/UTs, districts, blocks (view + reports)
 *   STATE    → State Nodal Officer: own state (+ its districts & blocks)
 *   DISTRICT → District Nodal Officer: own district (+ its blocks)
 *   BLOCK    → Block Nodal Officer: own block only
 *   ENTITY   → a non-geographic reporter (Line Ministry, Spiritual Organisation,
 *              Higher Education Institution, GIA); scoped by `entityKind`
 *
 * BLOCK and ENTITY were added for Mass Pledge reporting: the requirement puts
 * blocks at the bottom of the approval chain, and gives four organisation types
 * their own reporting forms. NAPDDR predates both and is unaffected —
 * `tiersForRole` and `canAddAtTier` keep them out of the committee flow, which
 * stays a State/District responsibility.
 */
export type PortalRole = "ADMIN" | "STATE" | "DISTRICT" | "BLOCK" | "ENTITY";

/**
 * The four non-geographic reporter types. They have no State/District/Block
 * scope, so they carry their entity identity instead.
 */
export type PortalEntityKind = "LINE_MINISTRY" | "SPIRITUAL_ORG" | "HEI" | "GIA";

/** The authenticated portal user, carried on the existing admin session cookie. */
export interface PortalSession {
  role: PortalRole;
  accountId: string; // login mobile
  displayName: string;
  state?: string; // STATE, DISTRICT, BLOCK
  district?: string; // DISTRICT, BLOCK
  block?: string; // BLOCK
  entityKind?: PortalEntityKind; // ENTITY
  entityName?: string; // ENTITY
}
