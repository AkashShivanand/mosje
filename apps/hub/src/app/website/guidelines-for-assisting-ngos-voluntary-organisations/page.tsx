import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { DocumentTable, type DocumentRow } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "Guidelines for Assisting NGOs / Voluntary Organisations";
const DESCRIPTION =
  "Documents published by the Department under the Guidelines for Assisting NGOs / Voluntary Organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const DOCS: DocumentRow[] = [
  {
    title: "Instructions to NGOs regarding submission of proper documents for release of grant-in-aid under AVYAY",
    published: "2 Dec 2024",
    size: "1.05 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/25001733129405.pdf",
  },
  {
    title: "Scheme guidelines: Atal Vayo Abhyuday Yojana",
    published: "6 May 2025",
    size: "663.65 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/04/display-avyay.pdf",
  },
  {
    title: "Letter regarding Sanction of Funds for Celebration of International Day of Older Persons IDOP – reg",
    published: "26 Sep 2024",
    size: "442.59 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/47981727345002.pdf",
  },
  {
    title: "21 June 2025 – Celebration of International Day of Yoga – reg",
    published: "21 May 2025",
    size: "788.06 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/18521758543759.pdf",
  },
];

/* Body text: dosje.gov.in/guidelines-for-assisting-ngos-voluntary-organisations/ as published,
   read 21 Sep 2026. The live page is a document table (its own h3 reads "Grants-in-Aid to NGOs
   - Guidelines for Assisting NGOs / Voluntary Organisations"), not the prose this route
   previously carried — replaced in full. Titles kept verbatim except trimming the trailing
   "– reg" spacing already published by the Department. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[
        { label: "Tenders & Vacancies" },
        { label: "Grants to Voluntary Organisations", href: "/website/grants-in-aid-to-ngos-faqs" },
        { label: TITLE },
      ]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Documents</h2>
      <DocumentTable caption="Guidelines for Assisting NGOs / Voluntary Organisations" rows={DOCS} />
    </ContentPage>
  );
}
