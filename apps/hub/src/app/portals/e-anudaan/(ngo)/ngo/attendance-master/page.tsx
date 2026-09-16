import { redirect } from "next/navigation";

/**
 * "Attendance Master" is now the Overview tab of Attendance (review call 11 Sep 2026, T264–271):
 * it was a dashboard, not a master, and it lived on a separate page from the register it
 * summarised. The route is kept so every link that went out still lands somewhere useful.
 */
export default function AttendanceMasterRedirect(): never {
  redirect("/portals/e-anudaan/ngo/attendance");
}
