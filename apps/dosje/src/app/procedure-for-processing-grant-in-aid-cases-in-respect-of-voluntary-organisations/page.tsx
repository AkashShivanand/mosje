import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Procedure for Processing Grant-in-Aid Cases",
  description:
    "Step-by-step procedure followed by the Department of Social Justice & Empowerment for processing grant-in-aid cases of voluntary organisations.",
};

export default function Page() {
  return (
    <ContentPage
      title="Procedure for Processing Grant-in-Aid Cases"
      breadcrumb={[
        { label: "Department" },
        { label: "Procedure for Processing Grant-in-Aid Cases" },
      ]}
      description="The end-to-end process by which proposals from voluntary organisations are received, examined, recommended, sanctioned and released."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        Grant-in-aid to voluntary organisations is processed through a structured, transparent procedure
        designed to ensure that public funds are released only against eligible, complete and well-appraised
        proposals. The principal stages are set out below.
      </p>

      <h2>Stages of Processing</h2>
      <ul>
        <li>
          <strong>1. Application</strong> — The organisation submits its proposal in the prescribed format,
          ordinarily online through the NGO Darpan / scheme portal, along with registration details,
          audited accounts and project particulars.
        </li>
        <li>
          <strong>2. Receipt &amp; Registration</strong> — The proposal is registered, acknowledged and
          checked for completeness; deficient proposals are returned for rectification.
        </li>
        <li>
          <strong>3. Scrutiny</strong> — The concerned section examines eligibility, financial viability,
          unit cost, past utilisation and field reports from the State Government or District authority.
        </li>
        <li>
          <strong>4. Screening Committee</strong> — Eligible proposals are placed before the Grant-in-Aid
          Screening Committee, which evaluates them against the prioritisation guidelines and recommends
          the quantum of assistance.
        </li>
        <li>
          <strong>5. Sanction</strong> — On the Committee&apos;s recommendation and the approval of the
          competent authority, a sanction order is issued specifying the amount, purpose and conditions.
        </li>
        <li>
          <strong>6. Release of Funds</strong> — The grant is released through Direct Benefit Transfer /
          PFMS to the organisation&apos;s designated bank account, subject to the prescribed conditions and
          submission of bonds/undertakings where required.
        </li>
      </ul>

      <h2>Post-Release Compliance</h2>
      <p>
        After release, the organisation must utilise the grant strictly for the sanctioned purpose, maintain
        separate accounts, and furnish utilisation certificates and audited statements. Subsequent
        instalments and renewals are released only after satisfactory compliance is verified.
      </p>
    </ContentPage>
  );
}
