import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Drug De-Addiction Division | Department of Social Justice & Empowerment",
  description:
    "The Drug De-Addiction Division of DoSJE leads drug demand reduction through NAPDDR, the Nasha Mukt Bharat Abhiyaan and a national network of de-addiction centres.",
};

export default function Page() {
  return (
    <ContentPage
      title="Drug De-Addiction Division"
      breadcrumb={[{ label: "Department" }, { label: "Drug De-Addiction Division" }]}
      description="Reducing the demand for narcotic drugs and psychotropic substances through awareness, treatment and community participation."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        The Department of Social Justice &amp; Empowerment is the nodal department for drug demand
        reduction in the country. The Drug De-Addiction Division works towards reducing the demand
        for narcotic drugs and psychotropic substances through a balanced approach of preventive
        education, awareness generation, identification, counselling, treatment and rehabilitation
        of affected individuals, with the active involvement of communities and civil society.
      </p>

      <h2>National Action Plan for Drug Demand Reduction (NAPDDR)</h2>
      <p>
        NAPDDR is the umbrella scheme through which the Department provides financial assistance to
        State Governments, Union Territory Administrations and voluntary organisations for
        prevention, treatment and rehabilitation activities. Under the scheme, the Department
        supports <strong>Integrated Rehabilitation Centres for Addicts (IRCAs)</strong>,{" "}
        <strong>Community-based Peer-led Intervention (CPLI)</strong> for children and adolescents,
        outreach and drop-in centres, and District De-Addiction Centres in government hospitals.
      </p>

      <h2>Nasha Mukt Bharat Abhiyaan (NMBA)</h2>
      <p>
        The Nasha Mukt Bharat Abhiyaan is a flagship mass-movement against substance abuse. It
        focuses on awareness generation programmes, reaching out to dependent populations,
        identification and counselling, and capacity building of service providers. The Abhiyaan
        mobilises educational institutions, youth volunteers, Panchayati Raj Institutions and
        community organisations to spread the message of a drug-free India.
      </p>

      <h2>De-Addiction Centres</h2>
      <p>
        A nationwide network of de-addiction and rehabilitation facilities delivers services close
        to those in need. These centres offer detoxification, medical and psycho-social treatment,
        counselling, vocational training and follow-up support to help individuals achieve lasting
        recovery and reintegrate into society with dignity.
      </p>
    </ContentPage>
  );
}
