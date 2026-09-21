import type { Metadata } from "next";
import { ContactPage } from "@/components/website-next/templates/ContactPage";
import { getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import { DEPARTMENT_CONTACT } from "../contact-us/department-contact";

const TITLE = "MoSJE Contact";
const DESCRIPTION =
  "Office address, telephone and the officer to contact at the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/mosje-contact" }),
};

/**
 * ── WHAT CHANGED HERE, AND WHY IT HAD TO ─────────────────────────────────────
 *
 * This page once named two officers — "Sh. Arvind Nair, Public Grievance Officer"
 * and "Smt. Kavita Sharma, Nodal Officer" — at "Shastri Bhawan, Dr. Rajendra
 * Prasad Road". None of them are in the department's register. The department's
 * own page names ONE officer, Ms. Kajal Singh, Director, at 8th Floor, GPOA-3,
 * Netaji Nagar, New Delhi-110023 — also the address in the site's footer and on
 * every officer's record.
 *
 * Its details now come from `contact-us/department-contact.ts`, the one source
 * both contact pages read, so this page and Contact Us cannot disagree.
 */
export default function MosjeContactPage() {
  return (
    <ContactPage
      title={TITLE}
      breadcrumb={[{ label: "Contact" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      {...DEPARTMENT_CONTACT}
    />
  );
}
