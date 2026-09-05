import { redirect } from "next/navigation";

/**
 * The portal's front door is its login. This used to be a "choose how to sign
 * in" page with one card per audience; the login now carries the audiences as
 * role tabs, so the choice is made on the page that acts on it. Website links
 * to `/portals/e-anudaan` keep working and arrive at the NGO tab.
 */
export default function EAnudaanLandingRedirect(): never {
  redirect("/portals/e-anudaan/login");
}
