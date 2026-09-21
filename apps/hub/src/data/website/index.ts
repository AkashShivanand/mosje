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
export * from "./scheduled-castes";

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
