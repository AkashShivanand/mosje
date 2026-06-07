import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Official Language — Background | Department of Social Justice & Empowerment",
  description:
    "Constitutional and statutory background of the Official Language policy, including Articles 343 to 351 and the Official Languages Act, 1963, and its role in the Ministry.",
};

export default function Page() {
  return (
    <ContentPage
      title="Official Language — Background"
      breadcrumb={[{ label: "Department" }, { label: "Official Language — Background" }]}
      description="The constitutional framework and statutory basis for the use of Hindi as the Official Language of the Union."
      lastUpdated="06 Jun 2026"
    >
      <h2>Constitutional Provisions</h2>
      <p>
        The Constitution of India deals with the Official Language in <strong>Part XVII</strong>,
        spanning <strong>Articles 343 to 351</strong>. Article 343 declares Hindi in the Devanagari
        script to be the Official Language of the Union, while permitting the continued use of
        English for official purposes. Articles 344 and 351 provide for the constitution of a
        Committee of Parliament on Official Language and for the directive to promote the spread and
        development of Hindi so that it may serve as a medium of expression for the composite culture
        of India.
      </p>

      <h2>The Official Languages Act, 1963</h2>
      <p>
        To give effect to these constitutional provisions, Parliament enacted the{" "}
        <strong>Official Languages Act, 1963</strong>, which provides for the languages that may be
        used for the official purposes of the Union, for transaction of business in Parliament, and
        for communications between the Union and the States. The Act, together with the Official
        Languages (Use for Official Purposes of the Union) Rules, 1976, guides the progressive use of
        Hindi in government work.
      </p>

      <h2>Role in the Ministry</h2>
      <p>
        Within the Department of Social Justice &amp; Empowerment, the Official Language Section is
        responsible for implementing the constitutional and statutory provisions and the Annual
        Programme issued by the Department of Official Language, Ministry of Home Affairs. Its work
        includes promoting the progressive use of Hindi in official communications, organising
        training and Hindi workshops, and ensuring compliance with the targets set for the use of
        Hindi.
      </p>
    </ContentPage>
  );
}
