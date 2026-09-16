import { redirect } from "next/navigation";
import { roleForSchemeKey } from "@/lib/e-anudaan/selectors";

/**
 * `/dashboard/sm2/<key>` — a seat's worklist on the live portal ("SHRESHTA M2 — IFD-<GRADE>").
 *
 * It redirects to that seat's queue. Ours drew the same queue as the dashboard a second time: the
 * IFD had both in its sidebar, and for the Programme Division grades it was in no sidebar at all
 * (design-director audit O-04, 16 Sep 2026). One queue per seat now, "My Queue", with its figures
 * above it. The address is kept rather than removed so a live-shaped link still lands somewhere
 * true. Whether the reader may open that seat's queue is decided there, by `ConsoleShell`, exactly
 * as for a direct visit; an address naming no seat renders nothing here and the shell's 404.
 *
 * `sm2/pd` (the Sanction Desk) is its own route and never reaches this page.
 */
export default async function SeatWorklistRedirect({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const role = roleForSchemeKey(key);
  if (!role || !role.division || !role.grade) return null;
  redirect(role.home);
}
