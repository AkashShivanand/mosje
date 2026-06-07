import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Guidelines for Assisting NGOs / Voluntary Organisations",
  description:
    "Eligibility conditions and terms under which the Department of Social Justice & Empowerment assists NGOs and voluntary organisations through grant-in-aid.",
};

export default function Page() {
  return (
    <ContentPage
      title="Guidelines for Assisting NGOs / Voluntary Organisations"
      breadcrumb={[
        { label: "Department" },
        { label: "Guidelines for Assisting NGOs / Voluntary Organisations" },
      ]}
      description="The eligibility requirements and standard conditions governing grant-in-aid to non-governmental and voluntary organisations."
      lastUpdated="06 Jun 2026"
    >
      <h2>Eligibility</h2>
      <p>
        An organisation seeking assistance must satisfy the following baseline requirements before its
        proposal can be considered:
      </p>
      <ul>
        <li>
          It must be a <strong>registered body</strong> under the Societies Registration Act, the Indian
          Trusts Act, the relevant Public Trust Act, or as a Section 8 company, and registered on
          <strong> NGO Darpan</strong>.
        </li>
        <li>It must have been in existence and engaged in welfare work for at least the prescribed period (normally three years).</li>
        <li>It must have a properly constituted managing body and maintain audited accounts.</li>
        <li>It must work for one or more of the Department&apos;s notified target groups on a no-profit basis.</li>
        <li>It must not have been blacklisted by any Central or State Government department.</li>
      </ul>

      <h2>Conditions of Assistance</h2>
      <ul>
        <li>The grant shall be utilised solely for the sanctioned purpose and within the sanctioned period.</li>
        <li>The organisation shall contribute its share of the project cost where a matching contribution is prescribed.</li>
        <li>
          Separate accounts shall be maintained for the grant, and assets created shall not be disposed of
          or encumbered without prior approval.
        </li>
        <li>
          The organisation shall furnish <strong>utilisation certificates</strong>, audited statements and
          progress reports in the prescribed forms.
        </li>
        <li>It shall permit inspection of its premises, records and beneficiaries by authorised officers.</li>
      </ul>

      <h2>General Principles</h2>
      <p>
        Assistance is supplementary to the organisation&apos;s own resources and is not an entitlement. The
        Department reserves the right to vary, reduce or withhold assistance in the public interest, and to
        recover any amount found to have been mis-utilised, together with interest.
      </p>
    </ContentPage>
  );
}
