import { redirect } from "next/navigation";

/**
 * Master Settings is one screen with a tab rail; shelter data is not a separate master on the live portal, so this returns to the rail.
 */
export default function Page() {
  redirect("/portals/smile-admin/master-setting");
}
