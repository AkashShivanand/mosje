import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Penalties in Case of Misutilisation of Grants",
  description:
    "Consequences, recovery and blacklisting provisions where grant-in-aid released to voluntary organisations is mis-utilised.",
};

export default function Page() {
  return (
    <ContentPage
      title="Penalties in Case of Misutilisation of Grants"
      breadcrumb={[{ label: "Department" }, { label: "Penalties in Case of Misutilisation of Grants" }]}
      description="The action taken by the Department where grant-in-aid is diverted, mis-utilised or not accounted for, including recovery and debarment."
      lastUpdated="06 Jun 2026"
    >
      <h2>What Constitutes Misutilisation</h2>
      <p>
        Misutilisation occurs where a grant is used for a purpose other than that sanctioned, where funds
        remain unspent without authorisation, where accounts are falsified, or where the conditions of the
        sanction are violated. It also covers failure to furnish utilisation certificates or to permit
        inspection.
      </p>

      <h2>Consequences</h2>
      <ul>
        <li>
          <strong>Recovery</strong> — the mis-utilised amount is recovered, together with interest at the
          rate prescribed under the General Financial Rules, from the date of release.
        </li>
        <li>
          <strong>Stoppage of further grants</strong> — pending and future instalments and renewals are
          withheld until the matter is resolved.
        </li>
        <li>
          <strong>Blacklisting / debarment</strong> — the organisation may be blacklisted and debarred from
          receiving assistance from the Department, and from other Government departments through the
          NGO Darpan flag.
        </li>
        <li>
          <strong>Legal action</strong> — where warranted, civil recovery proceedings or criminal complaints
          for misappropriation or fraud may be initiated.
        </li>
      </ul>

      <h2>Procedure Before Penal Action</h2>
      <p>
        Before penal action is taken, the organisation is issued a notice setting out the alleged
        irregularity and is given a reasonable opportunity to explain. If the explanation is unsatisfactory,
        the competent authority passes a speaking order specifying the amount to be recovered and the action
        to be taken. Recovery may be effected by adjustment against other dues, by demand, or through the
        State Government as arrears of land revenue.
      </p>
    </ContentPage>
  );
}
