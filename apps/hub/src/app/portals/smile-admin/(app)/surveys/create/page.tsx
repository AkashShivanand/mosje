import { redirect } from "next/navigation";

/**
 * A second route onto the create-survey-location form, which lives under Survey Locations.
 */
export default function Page() {
  redirect("/portals/smile-admin/survey-locations/create");
}
