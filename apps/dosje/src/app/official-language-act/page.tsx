import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "The Official Languages Act, 1963 | Department of Social Justice & Empowerment",
  description:
    "An overview of the Official Languages Act, 1963 — its key sections, scope and the rules framed under it for the official use of Hindi and English.",
};

export default function Page() {
  return (
    <ContentPage
      title="The Official Languages Act, 1963"
      breadcrumb={[{ label: "Documents" }, { label: "The Official Languages Act, 1963" }]}
      description="The statute that governs the languages to be used for the official purposes of the Union."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        The <strong>Official Languages Act, 1963</strong> was enacted by Parliament to provide for
        the languages which may be used for the official purposes of the Union, for the transaction
        of business in Parliament, for Central and State Acts, and for certain purposes in High
        Courts. The Act gives statutory effect to the constitutional scheme set out in Part XVII of
        the Constitution and provides for the continued use of English alongside Hindi.
      </p>

      <h2>Key Sections</h2>
      <ul>
        <li>
          <strong>Section 3</strong> — provides for the continued use of English, in addition to
          Hindi, for the official purposes of the Union and for use in Parliament.
        </li>
        <li>
          <strong>Section 4</strong> — provides for the constitution of a Committee of Parliament on
          Official Language to review progress in the use of Hindi.
        </li>
        <li>
          <strong>Section 5</strong> — provides for an authorised Hindi translation of Central Acts,
          Ordinances and certain orders to be deemed authoritative.
        </li>
        <li>
          <strong>Sections 6 &amp; 7</strong> — enable State Legislatures and Governors to authorise
          the use of Hindi (or another State language) in Acts and in the proceedings of High
          Courts, subject to the prescribed conditions.
        </li>
      </ul>

      <h2>Rules Framed under the Act</h2>
      <p>
        The <strong>Official Languages (Use for Official Purposes of the Union) Rules, 1976</strong>,
        framed under the Act, classify the States and Union Territories into regions and prescribe
        the manner and extent of the use of Hindi in correspondence, notings, registers and other
        official documents. The rules set targets for bilingual issue of documents and for training
        officials in Hindi, and are monitored through periodic reports and inspections.
      </p>
    </ContentPage>
  );
}
