import "server-only";

import issuesRaw from "@/data/website-issues/issues.json";
import metaRaw from "@/data/website-issues/meta.json";
import type { AffectedRow, Issue, RegisterMeta } from "./types";

export const ISSUES = issuesRaw as unknown as Issue[];
export const META = metaRaw as unknown as RegisterMeta;
const BY_ID = new Map(ISSUES.map((i) => [i.id, i]));

export function getIssue(id: string): Issue | undefined {
  return BY_ID.get(id);
}

/**
 * Affected pages are 34,000 rows (about 6 MB), needed only on an issue's own
 * page, so they load on first use rather than with the register.
 */
let affected: Record<string, AffectedRow[]> | null = null;
export async function getAffected(id: string): Promise<AffectedRow[]> {
  if (!affected) affected = (await import("@/data/website-issues/affected.json")).default as unknown as Record<string, AffectedRow[]>;
  return affected[id] ?? [];
}
