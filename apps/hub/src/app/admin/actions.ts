"use server";

import { redirect } from "next/navigation";
import { requireAdmin, signOutAdmin } from "@/lib/admin/auth";
import { SETTING_GATE_TOKEN, writeSetting } from "@/lib/settings/store";
import { deriveToken } from "@/lib/site-gate";

/** Minimum length for the shared review password. */
const MIN_LENGTH = 12;

export async function changeGatePassword(formData: FormData): Promise<void> {
  await requireAdmin();

  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < MIN_LENGTH) redirect("/admin?error=short");
  if (next !== confirm) redirect("/admin?error=mismatch");

  // Only the digest is stored. The plaintext password never reaches the
  // database, so a leak cannot expose a string reused elsewhere.
  const token = await deriveToken(next);
  try {
    await writeSetting(SETTING_GATE_TOKEN, token);
  } catch {
    redirect("/admin?error=store");
  }

  redirect("/admin?saved=1");
}

export async function signOut(): Promise<void> {
  await signOutAdmin();
  redirect("/admin/login");
}
