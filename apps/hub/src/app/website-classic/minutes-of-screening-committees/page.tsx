import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import {
  grantDocumentColumns,
  grantDocumentRows,
  SCREENING_COMMITTEE_MINUTES,
} from "@/data/website";

export const metadata: Metadata = {
  title: "Minutes of Screening Committees | Department of Social Justice & Empowerment",
  description:
    "Minutes of the Screening Committee meetings that consider new project proposals from voluntary organisations under the Department's grant-in-aid schemes.",
};

export default function Page() {
  return (
    <ListingPage
      title="Minutes of Screening Committees"
      breadcrumb={[
        { label: "Grants-In-Aid To NGOs" },
        { label: "Minutes of Screening Committees" },
      ]}
      description="Records of the Screening Committee meetings at which new project proposals from voluntary organisations are considered."
      lastUpdated="23 Aug 2026"
      intro={
        <p>
          Project proposals submitted by voluntary organisations are placed before a
          Screening Committee, which examines each proposal against the scheme guidelines
          before a grant is recommended. The minutes of those meetings are published here.
        </p>
      }
      columns={grantDocumentColumns}
      rows={grantDocumentRows(SCREENING_COMMITTEE_MINUTES)}
      searchKeys={["title"]}
      searchPlaceholder="Search minutes by title…"
    />
  );
}
