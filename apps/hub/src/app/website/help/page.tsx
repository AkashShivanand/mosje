import type { Metadata } from "next";
import NextLink from "next/link";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";
import { TableWrap } from "@/components/website-next/templates/content/TableWrap";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Help";
const DESCRIPTION = "How to open the file formats in which documents on this website are published.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/help" }),
};

/**
 * The Department's own Help page, dosje.gov.in/home-page/help/ (read 2026-09-21).
 * [DBIM 3.0 §5.6] Help — "FAQs, screen reader access, accessibility help".
 *
 * The plug-in table and its introduction are the Department's words ("your browser
 * need to have" → "needs"). Its screen-reader half moved to the GIGW page built for it,
 * /website/screen-reader-access (issue MAN-02): the live text opened "The National
 * Website of India fully complies with Guidelines for Indian Government Websites",
 * a sentence copied from india.gov.in that is neither about this site nor true of it.
 *
 * The Adobe address is the publisher's current one; the Department's points at a
 * regional "other versions" page.
 */
const PLUGINS = [
  { type: "Portable Document Format (PDF) files", label: "Adobe Acrobat Reader", href: "https://get.adobe.com/reader/" },
  { type: "Word files", label: "Microsoft Word Viewer 2016", href: "https://www.microsoft.com/en-in/microsoft-365/word" },
  { type: "Excel files", label: "Microsoft Excel Viewer 2016", href: "https://www.microsoft.com/en-in/microsoft-365/excel" },
  {
    type: "PowerPoint presentations",
    label: "Microsoft PowerPoint Viewer 2016",
    href: "https://www.microsoft.com/en-in/microsoft-365/powerpoint",
  },
];

export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Contact" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="18 Sep 2026"
      sidebar={<PolicySidebar current="/website/help" />}
    >
      <h2 id="file-formats">Viewing Information in Various File Formats</h2>
      <p>
        The information provided by this website is available in various formats, such as Portable Document Format
        (PDF), Word, and also in HTML format. To view the information properly, your browser needs to have the
        required plug-ins or software. For example, the PDF reader software is required to view a document in PDF
        format. In case your system does not have this software, you can download it from the Internet for free.
        The table lists the plug-ins needed to view the information in various file formats.
      </p>

      <TableWrap label="Software for each file format">
        <table>
          <caption className="sr-only">File formats used on this website and the software needed to open them</caption>
          <thead>
            <tr>
              <th scope="col">Document Type</th>
              <th scope="col">Plug-in for Download</th>
            </tr>
          </thead>
          <tbody>
            {PLUGINS.map((p) => (
              <tr key={p.type}>
                <th scope="row">{p.type}</th>
                <td>
                  <Link href={p.href} external>
                    {p.label}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <h2 id="more-help">Accessibility and Other Help</h2>
      <ul>
        <li>
          <NextLink href="/website/screen-reader-access">Screen Reader Access</NextLink>: screen readers that can be
          used with this website.
        </li>
        <li>
          <NextLink href="/website/accessibility-statement">Accessibility Statement</NextLink>: the accessibility
          standard of this website and how to report a barrier.
        </li>
        <li>
          <NextLink href="/website/grants-in-aid-to-ngos-faqs">Grants-in-Aid to NGOs: Frequently Asked Questions</NextLink>{" "}
          and <NextLink href="/website/social-defence-faqs">Social Defence: Frequently Asked Questions</NextLink>.
        </li>
        <li>
          <NextLink href="/website/sitemap">Sitemap</NextLink>: every section of this website on one page.
        </li>
        <li>
          <NextLink href="/website/contact-us">Contact Us</NextLink>: to reach the Department about a scheme or an
          application.
        </li>
      </ul>
    </ContentPage>
  );
}
