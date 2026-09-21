"use server";

import { redirect } from "next/navigation";
import { signInAdmin } from "@/lib/admin/auth";

/** Pages sign-in may return to. Anything else goes to /admin — never an open redirect. */
const RETURN_TO = ["/reports/dosje-website"];

function safeNext(raw: FormDataEntryValue | null): string | null {
  const next = typeof raw === "string" ? raw : "";
  return RETURN_TO.some((p) => next === p || next.startsWith(p + "/") || next.startsWith(p + "?")) ? next : null;
}

export async function submitAdminLogin(formData: FormData): Promise<void> {
  const entered = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const ok = await signInAdmin(entered);
  if (ok) redirect(next ?? "/admin");
  redirect(next ? `/admin/login?error=1&next=${encodeURIComponent(next)}` : "/admin/login?error=1");
}
