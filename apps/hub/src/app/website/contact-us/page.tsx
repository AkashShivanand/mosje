import type { Metadata } from "next";
import { ContactPage } from "@/components/website-next/templates/ContactPage";
import { getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import { DEPARTMENT_CONTACT } from "./department-contact";

const TITLE = "Contact Us";
const DESCRIPTION =
  "Telephone, email and postal address of the Department of Social Justice & Empowerment, and the national helplines it runs.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/contact-us" }),
};

/**
 * ── WHAT CHANGED HERE, AND WHY IT HAD TO ─────────────────────────────────────
 * This page named four officers — a Chief Information Officer, a Web Information
 * Manager, a CPIO and a First Appellate Authority — with telephone numbers
 * 011-24105012 to 011-24105018 and `@nic.in` addresses. None of the four names
 * and none of those numbers is in the Department's register
 * (`content/website/official.json`, 452 officers). They were placeholders, and
 * they are gone. It also gave the address as "Netaji Subhash Place, Wazirpur,
 * New Delhi – 110034", which disagrees with the footer, with MoSJE Contact and
 * with every officer's record in the register: GPOA-3, Netaji Nagar, 110023.
 *
 * Every contact below is read from `department-contact.ts`, which reads the
 * register, so this page and MoSJE Contact cannot disagree again.
 */
export default function ContactUsPage() {
  return (
    <ContactPage
      title={TITLE}
      breadcrumb={[{ label: "Connect" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      {...DEPARTMENT_CONTACT}
    />
  );
}
