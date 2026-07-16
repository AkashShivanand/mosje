import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Organisations under Social Defence Division | Department of Social Justice & Empowerment",
  description:
    "Autonomous bodies, institutes and organisations functioning under the Social Defence Division of the Department of Social Justice & Empowerment.",
};

export default function Page() {
  return (
    <ContentPage
      title="Organisations under Social Defence Division"
      breadcrumb={[{ label: "Department" }, { label: "Organisations under Social Defence Division" }]}
      description="Specialised institutes and bodies that support the delivery of the Social Defence Division's mandate."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        The Social Defence Division works in partnership with a number of autonomous institutes and
        organisations. These bodies provide specialised training, research, capacity building and
        technical support that strengthen the planning and delivery of welfare programmes for senior
        citizens, victims of substance abuse, transgender persons and persons in situations of
        destitution.
      </p>

      <h2>Institutes &amp; Bodies</h2>
      <ul>
        <li>
          <a href="#">National Institute of Social Defence (NISD)</a> — the apex institute for
          human-resource development in the field of social defence, undertaking training, research,
          documentation and awareness in drug abuse prevention, welfare of senior citizens, and
          transgender welfare.
        </li>
        <li>
          <a href="#">National Institute of Social Defence — Regional Resource &amp; Training Centres</a>{" "}
          — a network of centres delivering training and field support across regions.
        </li>
        <li>
          <a href="#">Old Age Homes &amp; Senior Citizen Care Institutions</a> — supported under the
          Atal Vayo Abhyuday Yojana for the care and welfare of the elderly.
        </li>
        <li>
          <a href="#">Integrated Rehabilitation Centres for Addicts (IRCAs)</a> — voluntary-sector
          institutions providing treatment and rehabilitation for substance-dependent persons.
        </li>
        <li>
          <a href="#">Garima Greh — Shelter Homes for Transgender Persons</a> — providing shelter,
          food, medical care, skill development and recreational facilities.
        </li>
      </ul>

      <h2>Coordination</h2>
      <p>
        The Division coordinates with these organisations, State Governments and accredited voluntary
        organisations to ensure that services reach the intended beneficiaries effectively. Periodic
        monitoring, review and evaluation help maintain quality of care and accountability across the
        network.
      </p>
    </ContentPage>
  );
}
