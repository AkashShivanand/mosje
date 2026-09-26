import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { POLICY_PAGES } from "@/components/website-next/templates/content/policies";

const TITLE = "Website Policies";
const DESCRIPTION = "The policies that govern the use of this website, the information it collects and its accessibility.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * The Website Policy hub DBIM 3.0 §5.6 asks for in the footer (issues MAN-03, X-GIGW-03).
 * NEWLY AUTHORED on 21 Sep 2026 (dosje.gov.in has no such page), so `lastUpdated` is the
 * authoring date. The list is POLICY_PAGES, which the policy pages' side panels and the
 * sitemap also read.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="21 Sep 2026"
    >
      <ul className="wn-policy-list">
        {POLICY_PAGES.map((p) => (
          <li key={p.href}>
            <Link href={p.href}>{p.label}</Link>
            <p>{p.summary}</p>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
