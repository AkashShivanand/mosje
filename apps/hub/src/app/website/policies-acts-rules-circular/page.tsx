import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Policies, Acts, Rules & Circulars (SC Division)",
  description:
    "Key Acts, rules, policies and circulars administered by the Scheduled Castes Development Division of the Department of Social Justice & Empowerment.",
};

export default function Page() {
  return (
    <ContentPage
      title="Policies, Acts, Rules & Circulars (SC Division)"
      breadcrumb={[{ label: "Documents" }, { label: "Policies, Acts, Rules & Circulars (SC Division)" }]}
      description="A consolidated reference to the principal legislation, rules and administrative circulars governing the welfare of Scheduled Castes."
      lastUpdated="06 Jun 2026"
    >
      <h2>Introduction</h2>
      <p>
        This page brings together the principal Acts, rules, policies and administrative circulars that
        govern the welfare and protection of Scheduled Castes and frame the schemes administered by the
        Scheduled Castes Development Division. Documents are grouped by category for ease of reference.
        Where a document is amended from time to time, the latest consolidated version should be treated as
        authoritative.
      </p>

      <h2>Acts</h2>
      <ul>
        <li>
          <a href="#">The Protection of Civil Rights Act, 1955</a> — abolition of untouchability and
          punishment for its practice.
        </li>
        <li>
          <a href="#">The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989</a> —
          prevention of atrocities and provision for Special Courts and relief.
        </li>
        <li>
          <a href="#">The Constitution (Scheduled Castes) Order, 1950</a> — notification of communities as
          Scheduled Castes.
        </li>
      </ul>

      <h2>Rules</h2>
      <ul>
        <li>
          <a href="#">The SC and ST (Prevention of Atrocities) Rules, 1995</a> — procedure, relief norms
          and monitoring mechanisms.
        </li>
        <li>
          <a href="#">Post-Matric Scholarship Scheme Guidelines for SC Students</a>.
        </li>
      </ul>

      <h2>Policies &amp; Circulars</h2>
      <ul>
        <li>
          <a href="#">Circular on revised income ceiling for SC scholarship eligibility</a>.
        </li>
        <li>
          <a href="#">Office Memorandum on direct benefit transfer of scholarship funds</a>.
        </li>
        <li>
          <a href="#">Guidelines for grant-in-aid to voluntary organisations working for SCs</a>.
        </li>
      </ul>
    </ContentPage>
  );
}
