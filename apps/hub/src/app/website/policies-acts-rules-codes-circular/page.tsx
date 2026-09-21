import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { DocumentTable, type DocumentRow } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "Policies / Acts / Rules / Codes / Circular";
const DESCRIPTION = "Policies, Acts, rules, codes and circulars published by the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * Body text: dosje.gov.in/policies-acts-rules-codes-circular/ as published,
 * read 21 Sep 2026. Document titles kept verbatim, including an unclosed
 * parenthesis in row 1's title as published. No other typos corrected.
 */
const DOCS: DocumentRow[] = [
  {
    title:
      "Amendment in the Central Lists of Andhra Pradesh, Bihar, Punjab, Sikkim, Tamil Nadu & Uttar Pradesh. (No.12011/4/2002-BCC Dt.13/01/2004",
    published: "13 Jan 2004",
    size: "317.80 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/12011-4-2002-BCC636232767143703395.pdf",
  },
  {
    title:
      "Amendment in the Central List of Andhra Pradesh, Goa, Gujarat, Haryana, Karnataka, Madhya Pradesh, Orissa, Pondicherry, Rajasthan, Tamil Nadu, U.P., W.B. (No.12011/44/99-BCC) Dt.21/09/2000",
    published: "21 Sep 2000",
    size: "1.33 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/12011-44-99-BCC.pdf",
  },
  {
    title:
      "Amendment in the lists of Andhra Pradesh, Chandigarh, Bihar, Goa, Gujarat, Karnataka, Kerala, Madhya Pradesh, Orissa, Pondicherry, Punjab, Rajasthan, Sikkim, Tamil Nadu, Tripura, U.P., W.B., (No.12011/88/98-BCC) Dt.06/12/1999",
    published: "6 Dec 1999",
    size: "1.69 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/No-12011-88-98-BCC.pdf",
  },
  {
    title:
      "Amendment in the list of Andhra Pradesh, Chandigarh, Delhi, Goa, Gujarat, Haryana, Karnataka, Kerala, M.P., Maharashtra, Orissa, Punjab, Rajasthan, Tamil Nadu, Tripura, U.P., W.B. (No.12011/68/98-BCC) Dt.27/10/1999",
    published: "27 Oct 1999",
    size: "1.75 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/No-12011-68-98-BCC.pdf",
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
      <DocumentTable caption="Policies, Acts, Rules, Codes and Circulars" rows={DOCS} />
    </ContentPage>
  );
}
