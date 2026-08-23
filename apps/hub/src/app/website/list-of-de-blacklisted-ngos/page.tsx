import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import {
  grantDocumentColumns,
  grantDocumentRows,
  DE_BLACKLISTED_NGO_ORDERS,
} from "@/data/website";

export const metadata: Metadata = {
  title: "List of De-Blacklisted NGOs | Department of Social Justice & Empowerment",
  description:
    "Orders by which the Department has removed voluntary organisations from the blacklist, restoring their eligibility for grant-in-aid.",
};

export default function Page() {
  return (
    <ListingPage
      title="List of De-Blacklisted NGOs"
      breadcrumb={[
        { label: "Grants-In-Aid To NGOs" },
        { label: "List of De-Blacklisted NGOs" },
      ]}
      description="Organisations removed from the blacklist by order of the Department, with the order under which each was restored."
      lastUpdated="23 Aug 2026"
      intro={
        <p>
          Blacklisting is not necessarily permanent. Where an organisation has answered the
          case against it, the Department issues an order removing it from the list and
          restoring its eligibility to receive grant-in-aid. Each order below names the
          organisation and the file under which the decision was taken.
        </p>
      }
      columns={grantDocumentColumns}
      rows={grantDocumentRows(DE_BLACKLISTED_NGO_ORDERS)}
      searchKeys={["title"]}
      searchPlaceholder="Search by organisation name…"
    />
  );
}
