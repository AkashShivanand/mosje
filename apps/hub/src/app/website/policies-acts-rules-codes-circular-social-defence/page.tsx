import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { DocumentTable, type DocumentRow } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "Policies / Acts / Rules / Codes / Circular: Social Defence";
const DESCRIPTION = "Policies, Acts, rules, codes and circulars relevant to the Social Defence Division of the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * Body text: dosje.gov.in/policies-acts-rules-codes-circular-social-defence/
 * as published, read 21 Sep 2026. Document titles kept verbatim per the
 * document-list rule (trim only): row 5's "Transgender Ac 2019" is published
 * with a dropped letter and is NOT corrected here, since only trailing
 * spaces/punctuation may be trimmed from a document title, not its wording —
 * flagged for the Department. Rows 11 and 12 link to the same PDF as
 * published on the live page; not corrected, as the File is the Department's
 * own upload, not our content.
 */
const DOCS: DocumentRow[] = [
  {
    title: "Transgender Persons - Report of the Expert Committee on the Issues relating to Transgender Persons",
    published: "1 Sep 2015",
    size: "5.66 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/Binder2.pdf",
  },
  {
    title: "National Policy for Older Persons 1999",
    published: "1 Sep 2015",
    size: "273.12 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/National-Policy-for-Older-Persons-Year-1999.pdf",
  },
  {
    title: "Draft National Policy on Senior Citizens, 2011: as recommended by Smt (Dr.) Mohini Giri Committee",
    published: "1 Sep 2015",
    size: "247.82 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/dnpsc.pdf",
  },
  {
    title: "Minimum Standards of Services for the Programmes under the Scheme for Prevention of Alcoholism and Substance (Drugs) Abuse",
    published: "4 May 2017",
    size: "1.43 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/Minimum-Standard-of-Care.pdf",
  },
  {
    title: "Transgender Ac 2019",
    published: "1 Oct 2024",
    size: "88.71 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/68491727941600.pdf",
  },
  {
    title: "TG Rules 2020",
    published: "1 Oct 2024",
    size: "351.45 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/85261727941840.pdf",
  },
  {
    title: "Smile Scheme Guidelines",
    published: "1 Oct 2024",
    size: "244.71 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/SMILE-1.pdf",
  },
  {
    title: "Equal Opportunity Policy",
    published: "1 Oct 2024",
    size: "580.00 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/Equal.pdf",
  },
  {
    title: "NCTP Notification",
    published: "1 Oct 2024",
    size: "215.19 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/NCTP.pdf",
  },
  {
    title: "Maintenance and Welfare of Parents and Senior Citizens (Amendment) Bill, 2019",
    published: "27 Dec 2022",
    size: "1.13 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/83211672138255.pdf",
  },
  {
    title: "Maintenance and Welfare of Parents and Senior Citizens (MWPSC) Act, 2007",
    published: "27 Dec 2022",
    size: "676.52 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/13601672137845.pdf",
  },
  {
    title: "Model Rules under MWPSC Act, 2007",
    published: "27 Dec 2022",
    size: "7.93 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/13601672137845.pdf",
  },
  {
    title: "National Council of Senior Citizens (NCSrC)",
    published: "27 Dec 2022",
    size: "158.46 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/ncsrc.pdf",
  },
  {
    title: "Notification -Director (Senior Citizens) as Nodal Officer under MWPSC Act 2007",
    published: "27 Dec 2022",
    size: "32.87 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/mwpsc.pdf",
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
      <DocumentTable caption="Policies, Acts, Rules, Codes and Circulars — Social Defence" rows={DOCS} />
    </ContentPage>
  );
}
