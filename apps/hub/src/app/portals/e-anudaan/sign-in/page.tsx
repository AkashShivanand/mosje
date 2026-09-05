import { redirect } from "next/navigation";

/**
 * The NGO sign-in used to be its own page. It is now the NGO tab of the one
 * E-Anudaan login, and this route exists so every link that went out with
 * `/sign-in` on it still lands on that tab.
 */
export default function EAnudaanNgoSignInRedirect(): never {
  redirect("/portals/e-anudaan/login?role=ngo");
}
