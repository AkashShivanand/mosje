import type { Metadata } from "next";
import { Icon, Link as DSLink, SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { ListingTable, type ListingTableColumn } from "@/components/website/ui/data-table";
import { NCSC_FUNCTION_CIRCULARS, SCHEDULED_CASTE_LISTS } from "@/data/website";
import { socialCard } from "@/lib/seo/social";

const TITLE = "List of Scheduled Castes";
const DESCRIPTION =
  "State-wise and Union Territory-wise lists of Scheduled Castes, as notified under Article 341 of the Constitution and published by the National Commission for Scheduled Castes.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/list-of-scheduled-castes" }),
};

const columns: ListingTableColumn[] = [
  { key: "sno", label: "S.No.", align: "center" },
  {
    key: "label",
    label: "State / Union Territory",
    sortable: true,
    align: "left",
    className: "min-w-[280px] font-medium text-ink",
  },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

/**
 * Two registers on one page, as the department publishes them: the notified
 * lists, and the circulars that govern how a caste certificate is issued and
 * verified. The second is not a footnote to the first — it is what a citizen
 * holding a certificate actually needs — so it takes its own section heading.
 */
export default function Page() {
  const rows = SCHEDULED_CASTE_LISTS.map((s, i) => ({ ...s, sno: i + 1 }));

  return (
    <PageLayout
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated="18 Sep 2026"
    >
      <section className="sa-container py-10 md:py-14">
        <SectionTitle
          title="State-wise / UT-wise List of Scheduled Castes"
          description="Updated up to 15 February 2024."
          as={2}
        />
        <ListingTable
          caption="State-wise and UT-wise lists of Scheduled Castes"
          columns={columns}
          rows={rows}
          searchKeys={["label"]}
          searchPlaceholder="Search by State or Union Territory…"
          pageSize={15}
        />
      </section>

      <section className="sa-container pb-14">
        <SectionTitle title="Functions of NCSC" as={2} />
        <ul className="wn-prose">
          {NCSC_FUNCTION_CIRCULARS.map((c) => (
            <li key={`${c.label}-${c.href}`}>
              <DSLink
                href={c.href}
                external
                iconLeft={<Icon name="picture_as_pdf" size={16} />}
              >
                {c.label}
              </DSLink>
            </li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
