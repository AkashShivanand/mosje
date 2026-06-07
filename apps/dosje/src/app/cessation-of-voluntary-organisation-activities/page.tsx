import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Cessation of Voluntary Organisation Activities",
  description:
    "Procedure where a grant-aided voluntary organisation closes, withdraws from a project, or has its assistance discontinued by the Department.",
};

export default function Page() {
  return (
    <ContentPage
      title="Cessation of Voluntary Organisation Activities"
      breadcrumb={[
        { label: "Department" },
        { label: "Cessation of Voluntary Organisation Activities" },
      ]}
      description="The steps to be followed when a funded project is wound up, whether voluntarily by the organisation or on discontinuance of assistance by the Department."
      lastUpdated="06 Jun 2026"
    >
      <h2>Circumstances of Cessation</h2>
      <p>
        Activities of a grant-aided voluntary organisation may cease in several situations: the organisation
        may voluntarily wind up the project, it may surrender the grant, the project period may expire, or
        the Department may discontinue assistance on grounds of non-performance or non-compliance.
      </p>

      <h2>Procedure on Closure or Withdrawal</h2>
      <ul>
        <li>
          The organisation shall give <strong>advance written intimation</strong> to the Department of its
          intention to close or withdraw from the project.
        </li>
        <li>
          It shall submit final <strong>accounts and a utilisation certificate</strong> for the period up to
          cessation, duly audited.
        </li>
        <li>
          <strong>Unspent balances</strong> shall be refunded to the Department, together with any interest
          accrued, through the prescribed mode.
        </li>
        <li>
          <strong>Assets</strong> created out of the grant shall be dealt with as directed by the
          Department — transferred to another suitable organisation, to the State Government, or otherwise
          disposed of with prior approval.
        </li>
      </ul>

      <h2>Discontinuance by the Department</h2>
      <p>
        Where the Department decides to discontinue assistance, the organisation is informed in writing of
        the reasons and the effective date. Settlement of accounts, refund of unspent funds and disposal of
        assets follow the same process. Continuity of services to beneficiaries is, as far as possible,
        ensured through transfer to an alternative organisation so that ongoing welfare is not disrupted.
      </p>
    </ContentPage>
  );
}
