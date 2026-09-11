import { redirect } from "next/navigation";

/**
 * A second route onto the survey register. The live portal has one survey list, at Survey Locations, so this sends a reader there rather than showing them a second, emptier copy of it.
 */
export default function Page() {
  redirect("/portals/smile-admin/surveys");
}
