"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  DEFAULT_APPS,
  REGISTRY_CONFIG_MAX_BYTES,
  buildRegistryConfig,
  emptyRegistryConfig,
  parseRegistryConfig,
  serializeRegistryConfig,
  type RegistryRowInput,
  type RegistryStatus,
} from "@mosje/design-system/registry";
import { requireAdmin } from "@/lib/admin/auth";
import { SETTING_PORTAL_REGISTRY, writeSetting } from "@/lib/settings/store";
import { REGISTRY_TAG } from "@/lib/registry/resolve";

const STATUSES: readonly RegistryStatus[] = ["live", "planned", "hidden"];

function isStatus(value: unknown): value is RegistryStatus {
  return typeof value === "string" && STATUSES.includes(value as RegistryStatus);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * Read the editor's submission back into row intents.
 *
 * The form posts what it is showing, in display order. Anything malformed
 * yields null rather than a partial read: a half-understood submission would
 * silently drop a row, and dropping a row here means losing its override.
 */
function parseRows(raw: string): RegistryRowInput[] | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(value)) return null;

  const rows: RegistryRowInput[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) return null;
    const row = item as Record<string, unknown>;
    if (typeof row.path !== "string" || !row.path) return null;
    if (!isStatus(row.status)) return null;
    rows.push({
      path: row.path,
      status: row.status,
      name: optionalString(row.name),
      desc: optionalString(row.desc),
      org: optionalString(row.org),
      abbr: optionalString(row.abbr),
      category: optionalString(row.category),
    });
  }
  return rows;
}

/** Persist a config, or redirect with an error code. Never returns on failure. */
async function persist(serialized: string): Promise<void> {
  try {
    await writeSetting(SETTING_PORTAL_REGISTRY, serialized);
  } catch {
    redirect("/admin/portals?error=store");
  }
  // Invalidates the cached read behind every statically rendered surface, so
  // the change is visible on the next request rather than after a TTL.
  //
  // `updateTag` rather than `revalidateTag`: it is the server-action form, and
  // it carries read-your-own-writes semantics — the admin's very next render
  // shows what they just saved, instead of possibly serving them the stale
  // value they were trying to change.
  updateTag(REGISTRY_TAG);
}

export async function saveRegistry(formData: FormData): Promise<void> {
  await requireAdmin();

  const rows = parseRows(String(formData.get("rows") ?? ""));
  if (!rows) redirect("/admin/portals?error=payload");

  const config = buildRegistryConfig(DEFAULT_APPS, rows);
  const serialized = serializeRegistryConfig(config);

  if (new TextEncoder().encode(serialized).length > REGISTRY_CONFIG_MAX_BYTES) {
    redirect("/admin/portals?error=size");
  }
  // Validate what will be stored by the same parser the read side uses, so a
  // value that cannot be read back can never be written in the first place.
  if (!parseRegistryConfig(serialized)) redirect("/admin/portals?error=invalid");

  await persist(serialized);
  redirect("/admin/portals?saved=1");
}

/**
 * Drop every override.
 *
 * Writes an empty patch rather than deleting the row: the two are equivalent
 * to every reader, and writing keeps this on the one code path that already
 * handles a store failure honestly.
 */
export async function resetRegistry(): Promise<void> {
  await requireAdmin();
  await persist(serializeRegistryConfig(emptyRegistryConfig()));
  redirect("/admin/portals?saved=reset");
}
