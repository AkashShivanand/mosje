/**
 * The website's data layer.
 *
 * Everything the site knows about organisations, divisions, officials and the NGO grants
 * register is defined once, here, and read from here. Before this, the same facts were
 * retyped into whichever page or component needed them — 17 organisations across four
 * hand-written lists, 115 officials across 15 page files, a rail of division links that had
 * silently lost nine entries. Drift was not a risk; it had already happened.
 *
 * If you are about to paste a name, an abbreviation, a phone number or an href into a
 * component, it belongs in one of these modules instead.
 */

export * from "./columns";
export * from "./organisations";
export * from "./divisions";
export * from "./officials";
export * from "./ngo-grants";

import type { Official } from "./officials";
import { getOfficials } from "./officials";

/** A row of the shared directory table — an Official plus the S.No. the table prints. */
export interface DirectoryRow extends Official {
  sno: number;
  /**
   * DataTable is generic over `Record<string, unknown>` and indexes rows by the column
   * `key`. The named fields above keep their own types; this only satisfies that contract.
   */
  [column: string]: unknown;
}

/**
 * Officials of one body as directory-table rows.
 *
 * `sno` is generated here rather than stored, because it is a property of the rendered
 * table and not of the person: it renumbers when the list changes, and the same official
 * shown in two places would otherwise carry two different "numbers".
 */
export function directoryRows(ownerId: string): DirectoryRow[] {
  return getOfficials(ownerId).map((official, i) => ({ ...official, sno: i + 1 }));
}

import type { GrantDocument, NgoEnforcementRecord } from "./ngo-grants";

/** Grant documents as table rows, numbered for display. */
export function grantDocumentRows(docs: GrantDocument[]): Record<string, unknown>[] {
  return docs.map((doc, i) => ({ ...doc, sno: i + 1 }));
}

/** Enforcement register entries as table rows, numbered for display. */
export function ngoEnforcementRows(
  records: NgoEnforcementRecord[]
): Record<string, unknown>[] {
  return records.map((record, i) => ({ ...record, sno: i + 1 }));
}
