import type { Metadata } from "next";
import { ListingPage, type ListingColumn } from "@/components/website-next/templates/ListingPage";
import { getContentSyncedDate, getCpios } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "CPIO";
const DESCRIPTION =
  "Central Public Information Officers and First Appellate Authorities designated under the Right to Information Act, 2005 by the Department and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/cpio" }),
};

/**
 * The columns the department's own page prints, in its order.
 *
 * `type: "link"` is not used on the name: a CPIO's row leads to that officer's
 * own page on this site, which is internal navigation, and the declarative link
 * cell renders an external anchor with a download glyph. The name is rendered
 * as text and the last column carries the link.
 */
const columns: ListingColumn[] = [
  { key: "office", label: "Office/Division", align: "left", className: "min-w-[240px]" },
  { key: "name", label: "Name", sortable: true, align: "left", className: "min-w-[180px] font-medium text-ink", type: "record", hrefKey: "href" },
  { key: "organisation", label: "Organisation", sortable: true, align: "center" },
  { key: "designation", label: "Designation", align: "left", className: "min-w-[200px]" },
  { key: "email", label: "Email", align: "left", className: "min-w-[200px]" },
];

export default function Page() {
  const rows = getCpios().map((c) => ({
    office: c.office,
    name: c.name ?? c.title,
    organisation: c.organisation,
    designation: c.designation,
    email: c.email,
    href: `/website/cpio/${c.slug}`,
  }));

  return (
    <ListingPage
      title={TITLE}
      breadcrumb={[{ label: "Contact" }, { label: "CPIO" }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      columns={columns}
      rows={rows}
      searchKeys={["name", "organisation", "designation", "office"]}
      searchPlaceholder="Search by name, organisation or designation"
      filters={[{ key: "organisation", label: "Organisation", allLabel: "All Organisations" }]}
      noun="officers"
      nounSingular="officer"
      pageSize={25}
    />
  );
}
