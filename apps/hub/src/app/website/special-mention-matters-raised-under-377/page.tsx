import type { Metadata } from "next";
import { ListingPage } from "@/components/website-next/templates/ListingPage";
import { SPECIAL_MENTION_MATTERS } from "@/data/website";
import { grantDocumentColumns } from "@/data/website/columns";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Special Mention / Matters Raised Under Rule 377";
const DESCRIPTION =
  "Special Mentions made in the Rajya Sabha and matters raised under Rule 377 in the Lok Sabha on subjects administered by the Department, and the monitoring of replies to them.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/special-mention-matters-raised-under-377" }),
};

export default function Page() {
  const rows = SPECIAL_MENTION_MATTERS.map((d, i) => ({
    sno: i + 1,
    title: d.label,
    date: d.date,
    fileSize: d.fileSize,
    fileUrl: d.href,
  }));

  return (
    <ListingPage
      title={TITLE}
      breadcrumb={[{ label: "Department" }, { label: "Parliamentary Matters" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="18 Sep 2026"
      columns={grantDocumentColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search records…"
    />
  );
}
