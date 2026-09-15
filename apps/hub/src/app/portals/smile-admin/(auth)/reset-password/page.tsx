import { redirect } from "next/navigation";

/**
 * The old second half of SMILE Admin's password recovery.
 *
 * Recovery is one page now — `forget-password` runs mobile number → code → new
 * password → done on `PortalRecoveryTemplate`, which will not open the new-password
 * step without a verified code in the same visit. This route opened straight on
 * the code step with no number behind it, so it redirects rather than rendering a
 * step out of order. Kept so links already sent keep working.
 */
export default function ResetPasswordPage(): never {
  redirect("/portals/smile-admin/forget-password");
}
