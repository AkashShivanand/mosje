import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "About the Division — Social Defence | Department of Social Justice & Empowerment",
  description:
    "Mandate and functions of the Social Defence Division of DoSJE — covering senior citizens, victims of substance abuse, transgender persons and the prevention of beggary.",
};

export default function Page() {
  return (
    <ContentPage
      title="About the Division — Social Defence"
      breadcrumb={[{ label: "Department" }, { label: "About the Division — Social Defence" }]}
      description="The Social Defence Division works for the welfare, protection and rehabilitation of some of the most vulnerable sections of society."
      lastUpdated="06 Jun 2026"
    >
      <h2>Mandate</h2>
      <p>
        The Social Defence Division of the Department of Social Justice &amp; Empowerment is
        responsible for the welfare, care, protection, rehabilitation and empowerment of
        disadvantaged groups who fall outside the ambit of the Department&rsquo;s other divisions.
        The Division formulates policy, designs schemes and coordinates with State Governments,
        autonomous bodies and voluntary organisations to deliver services on the ground.
      </p>

      <h2>Target Groups</h2>
      <p>The Division addresses the needs of the following groups:</p>
      <ul>
        <li>
          <strong>Senior Citizens</strong> — promoting active, healthy and dignified ageing,
          old-age homes, and protection against abuse and neglect.
        </li>
        <li>
          <strong>Victims of Substance Abuse</strong> — prevention of drug demand, treatment and
          rehabilitation of affected persons.
        </li>
        <li>
          <strong>Transgender Persons</strong> — protection of rights, social inclusion and access
          to welfare measures.
        </li>
        <li>
          <strong>Persons engaged in the act of Beggary</strong> — comprehensive rehabilitation and
          reintegration into the social mainstream.
        </li>
      </ul>

      <h2>Key Schemes</h2>
      <p>
        The Division administers a number of flagship programmes to give effect to its mandate.
        These include the <strong>National Action Plan for Drug Demand Reduction (NAPDDR)</strong>,
        the <strong>Atal Vayo Abhyuday Yojana (AVYAY)</strong> for the welfare of senior citizens,
        and the <strong>SMILE (Support for Marginalised Individuals for Livelihood and Enterprise)</strong>{" "}
        scheme for the welfare of transgender persons and those engaged in begging. Schemes are
        implemented through State Governments, autonomous institutes and accredited voluntary
        organisations, with a focus on prevention, care and sustainable rehabilitation.
      </p>
    </ContentPage>
  );
}
