import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title:
    "Policies, Acts, Rules & Circulars — Social Defence | Department of Social Justice & Empowerment",
  description:
    "Legislation, rules, policies and circulars relevant to the Social Defence Division, including the Senior Citizens Act 2007 and the Transgender Persons (Protection of Rights) Act 2019.",
};

export default function Page() {
  return (
    <ContentPage
      title="Policies, Acts, Rules & Circulars — Social Defence"
      breadcrumb={[{ label: "Documents" }, { label: "Policies, Acts, Rules & Circulars — Social Defence" }]}
      description="A consolidated reference of the legal and policy framework governing the Social Defence Division."
      lastUpdated="06 Jun 2026"
    >
      <h2>Acts</h2>
      <ul>
        <li>
          <a href="#">The Maintenance and Welfare of Parents and Senior Citizens Act, 2007</a> —
          provides for the maintenance and welfare of parents and senior citizens, and for matters
          connected therewith.
        </li>
        <li>
          <a href="#">The Transgender Persons (Protection of Rights) Act, 2019</a> — provides for
          the protection of the rights of transgender persons and their welfare.
        </li>
      </ul>

      <h2>Rules</h2>
      <ul>
        <li>
          <a href="#">The Maintenance and Welfare of Parents and Senior Citizens (Model) Rules</a> —
          framed by State Governments for the implementation of the 2007 Act.
        </li>
        <li>
          <a href="#">The Transgender Persons (Protection of Rights) Rules, 2020</a> — operational
          rules including the procedure for issuance of certificate of identity.
        </li>
      </ul>

      <h2>Policies</h2>
      <ul>
        <li>
          <a href="#">National Policy for Senior Citizens</a> — the overarching policy framework for
          the welfare and empowerment of the elderly.
        </li>
        <li>
          <a href="#">National Action Plan for Drug Demand Reduction (NAPDDR)</a> — the policy
          framework for prevention, treatment and rehabilitation in relation to substance abuse.
        </li>
      </ul>

      <h2>Circulars &amp; Guidelines</h2>
      <ul>
        <li>
          <a href="#">Scheme guidelines for the Atal Vayo Abhyuday Yojana (AVYAY)</a>.
        </li>
        <li>
          <a href="#">Scheme guidelines for SMILE — Support for Marginalised Individuals for Livelihood and Enterprise</a>.
        </li>
        <li>
          <a href="#">Office memoranda and circulars on the operation of de-addiction centres and shelter homes</a>.
        </li>
      </ul>
    </ContentPage>
  );
}
