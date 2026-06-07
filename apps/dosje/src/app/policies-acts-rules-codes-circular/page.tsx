import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Policies, Acts, Rules, Codes & Circulars (OBC Division)",
  description:
    "Key Acts, rules, codes, policies and circulars administered by the Backward Classes Division of the Department of Social Justice & Empowerment.",
};

export default function Page() {
  return (
    <ContentPage
      title="Policies, Acts, Rules, Codes & Circulars (OBC Division)"
      breadcrumb={[
        { label: "Documents" },
        { label: "Policies, Acts, Rules, Codes & Circulars (OBC Division)" },
      ]}
      description="A consolidated reference to the principal legislation, rules, codes and administrative circulars governing the welfare of Other Backward Classes."
      lastUpdated="06 Jun 2026"
    >
      <h2>Introduction</h2>
      <p>
        This page consolidates the key Acts, rules, codes, policies and administrative circulars relevant to
        the welfare of Other Backward Classes (OBCs) and Economically Backward Classes (EBCs). The documents
        below frame the reservation policy, scholarship schemes and credit support administered by the
        Backward Classes Division. The latest consolidated version of any amended document should be treated
        as authoritative.
      </p>

      <h2>Acts</h2>
      <ul>
        <li>
          <a href="#">The National Commission for Backward Classes Act, 1993</a> (as superseded by the
          constitutional NCBC under the 102nd Amendment, 2018).
        </li>
        <li>
          <a href="#">The Constitution (102nd Amendment) Act, 2018</a> — insertion of Article 338B
          according constitutional status to the NCBC.
        </li>
      </ul>

      <h2>Rules &amp; Codes</h2>
      <ul>
        <li>
          <a href="#">Guidelines for preparation and revision of the Central List of OBCs</a>.
        </li>
        <li>
          <a href="#">Creamy Layer income criteria and exclusion code</a>.
        </li>
        <li>
          <a href="#">Post-Matric Scholarship Scheme Guidelines for OBC Students</a>.
        </li>
      </ul>

      <h2>Policies &amp; Circulars</h2>
      <ul>
        <li>
          <a href="#">Office Memorandum revising the creamy layer income ceiling</a>.
        </li>
        <li>
          <a href="#">Circular on hostel construction grants for OBC boys and girls</a>.
        </li>
        <li>
          <a href="#">Guidelines for grant-in-aid to voluntary organisations working for OBCs</a>.
        </li>
      </ul>
    </ContentPage>
  );
}
