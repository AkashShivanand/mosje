import { redirect } from "next/navigation";

/**
 * The live portal answers `/survey-list` with the Beneficiary List — not a
 * survey register, despite the name. This follows it there rather than
 * inventing a screen the portal does not have.
 */
export default function Page() {
  redirect("/portals/smile-admin/persons");
}
