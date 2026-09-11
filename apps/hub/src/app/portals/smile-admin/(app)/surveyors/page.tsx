import { redirect } from "next/navigation";

/**
 * A second route onto the surveyor register. Surveyor Mappings is the one the live portal publishes.
 */
export default function Page() {
  redirect("/portals/smile-admin/surveyor-mapped");
}
