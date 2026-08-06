"use server";

import { redirect } from "next/navigation";
import { signInAdmin } from "@/lib/admin/auth";

export async function submitAdminLogin(formData: FormData): Promise<void> {
  const entered = String(formData.get("password") ?? "");
  const ok = await signInAdmin(entered);
  redirect(ok ? "/admin" : "/admin/login?error=1");
}
