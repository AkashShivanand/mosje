"use server";

/**
 * Gate actions live in their own module with a file-level "use server"
 * directive. An inline directive on a module-scope function in page.tsx does
 * not compile to an action reference, so passing it to the client form failed
 * with "Functions cannot be passed directly to Client Components".
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  GATE_COOKIE,
  GATE_MAX_AGE_SECONDS,
  deriveToken,
  resolveGateToken,
  safeEqual,
  safeNextPath,
} from "@/lib/site-gate";

export async function unlock(formData: FormData): Promise<void> {
  const target = safeNextPath(String(formData.get("next") ?? "/"));
  const expected = await resolveGateToken();

  // Gate switched off between render and submit — nothing left to check.
  if (!expected) redirect(target);

  const entered = String(formData.get("password") ?? "");
  // Compare digests, not the raw strings, so the comparison is over two values
  // of identical width and leaks nothing about the password's length.
  const matches = safeEqual(await deriveToken(entered), expected);

  if (!matches) {
    redirect(`/gate?next=${encodeURIComponent(target)}&error=1`);
  }

  const store = await cookies();
  store.set(GATE_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE_SECONDS,
  });

  redirect(target);
}
