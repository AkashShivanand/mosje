import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Grants-in-Aid to NGOs — FAQs",
  description:
    "Frequently asked questions on eligibility, application and compliance for grant-in-aid to NGOs and voluntary organisations from the Department of Social Justice & Empowerment.",
};

export default function Page() {
  return (
    <ContentPage
      title="Grants-in-Aid to NGOs — FAQs"
      breadcrumb={[{ label: "Department" }, { label: "Grants-in-Aid to NGOs — FAQs" }]}
      description="Common questions and answers on how voluntary organisations can seek and account for grant-in-aid from the Department."
      lastUpdated="06 Jun 2026"
    >
      <h2>Frequently Asked Questions</h2>

      <h3>Who is eligible to apply for grant-in-aid?</h3>
      <p>
        Any organisation registered as a society, trust or Section 8 company, registered on NGO Darpan,
        with the prescribed minimum years of welfare experience and audited accounts, working for the
        Department&apos;s notified target groups on a no-profit basis, is eligible to apply.
      </p>

      <h3>How do I submit a proposal?</h3>
      <p>
        Proposals are submitted online in the prescribed format through NGO Darpan / the relevant scheme
        portal, along with registration documents, audited accounts, the project plan and budget.
      </p>

      <h3>What expenses can a grant cover?</h3>
      <p>
        Grants typically cover recurring costs such as honoraria, rent and beneficiary services, and
        certain non-recurring costs as permitted under the scheme. Each scheme specifies admissible items
        and unit-cost norms.
      </p>

      <h3>Is matching contribution required?</h3>
      <p>
        Many schemes require the organisation to bear a share of the project cost. The exact percentage of
        matching contribution depends on the scheme under which assistance is sought.
      </p>

      <h3>When are funds released and through what mode?</h3>
      <p>
        Funds are released after sanction, in instalments, directly to the organisation&apos;s bank account
        through Direct Benefit Transfer / PFMS, subject to submission of the required undertakings.
      </p>

      <h3>What documents must I submit after receiving a grant?</h3>
      <p>
        The organisation must submit utilisation certificates, audited statements of accounts and progress
        reports in the prescribed forms, and must maintain separate accounts for the grant.
      </p>

      <h3>What happens if a grant is mis-utilised?</h3>
      <p>
        Mis-utilised amounts are recovered with interest, further assistance is stopped, and the
        organisation may be blacklisted and, where warranted, face legal action.
      </p>

      <h3>Can assistance be renewed?</h3>
      <p>
        Yes. Continuation or renewal is considered on satisfactory performance, proper utilisation of
        earlier grants and submission of all required reports, subject to availability of funds.
      </p>
    </ContentPage>
  );
}
