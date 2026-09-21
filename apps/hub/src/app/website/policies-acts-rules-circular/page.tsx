import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { DocumentTable, type DocumentRow } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "Policies / Acts / Rules / Circular";
const DESCRIPTION = "Policies, Acts, rules and circulars published by the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * Body text: dosje.gov.in/policies-acts-rules-circular/ as published, read
 * 21 Sep 2026. The live page repeats its own title as an h1, h2 and h5 above
 * the table; kept once, as the body's h2. No typos corrected.
 */
const DOCS: DocumentRow[] = [
  {
    title: "The Scheduled Castes and the Scheduled Tribes (PoA) Rules, 2018",
    published: "17 Sep 2024",
    size: "1.20 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/1.pdf",
  },
  {
    title: "The Scheduled Castes and the Scheduled Tribes (PoA) Rules, 2016",
    published: "17 Sep 2024",
    size: "516.94 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/2.pdf",
  },
  {
    title: "Scheme guidelines CSS for PCR and PoA",
    published: "28 Feb 2024",
    size: "815.72 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/3.pdf",
  },
];

export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Documents</h2>
      <DocumentTable caption="Policies, Acts, Rules and Circulars" rows={DOCS} />
    </ContentPage>
  );
}
