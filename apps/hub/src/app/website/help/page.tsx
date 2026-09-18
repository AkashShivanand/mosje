import type { Metadata } from "next";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website/templates/ContentPage";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Help";
const DESCRIPTION =
  "How to view the file formats published on this website, and the screen readers with which its content has been made accessible.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/help" }),
};

/**
 * The department's own Help page, in our design language.
 *
 * Both tables are the department's — the plug-in list and the screen-reader
 * list — and the wording is theirs, including "The National Website of India
 * fully complies with Guidelines for Indian Government Websites." Nothing here
 * is authored; `ui-restraint-and-copy.md` prefers the department's own words
 * and this page is entirely them.
 */
const PLUGINS = [
  { type: "Portable Document Format (PDF) files", label: "Adobe Acrobat Reader", href: "https://get.adobe.com/reader/" },
  { type: "Word files", label: "Microsoft Word Viewer 2016", href: "https://www.microsoft.com/en-in/microsoft-365/word" },
  { type: "Excel files", label: "Microsoft Excel Viewer 2016", href: "https://www.microsoft.com/en-in/microsoft-365/excel" },
  { type: "PowerPoint presentations", label: "Microsoft PowerPoint Viewer 2016", href: "https://www.microsoft.com/en-in/microsoft-365/powerpoint" },
];

const SCREEN_READERS = [
  { name: "Screen Access For All (SAFA)", href: "https://safa-reader.software.informer.com/download/", licence: "Free" },
  { name: "Non Visual Desktop Access (NVDA)", href: "http://www.nvda-project.org/", licence: "Free" },
  { name: "System Access To Go", href: "http://www.satogo.com/", licence: "Free" },
  { name: "JAWS", href: "https://www.freedomscientific.com/products/software/jaws/", licence: "Commercial" },
  { name: "Supernova", href: "http://www.yourdolphin.co.uk/productdetail.asp?id=1", licence: "Commercial" },
  { name: "Window-Eyes", href: "http://www.gwmicro.com/Window-Eyes/", licence: "Commercial" },
];

export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Support" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="18 Sep 2026"
    >
      <h2>Viewing Information in Various File Formats</h2>
      <p>
        The information provided by this website is available in various formats, such as Portable
        Document Format (PDF), Word, and also in HTML format. To view the information properly, your
        browser needs to have the required plug-ins or software.
      </p>

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
              <td>{p.type}</td>
              <td>
                <Link href={p.href} external>
                  {p.label}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Screen Reader Access</h2>
      <p>
        This website complies with the Guidelines for Indian Government Websites. Visitors with visual
        impairments can access the website using assistive technologies such as screen readers.
      </p>
      <p>
        The information on this website is accessible with different screen readers, such as JAWS, NVDA,
        SAFA, Supernova and Window-Eyes.
      </p>

      <table>
        <caption className="sr-only">Screen readers with which this website has been tested</caption>
        <thead>
          <tr>
            <th scope="col">Screen Reader</th>
            <th scope="col">Website</th>
            <th scope="col">Free / Commercial</th>
          </tr>
        </thead>
        <tbody>
          {SCREEN_READERS.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>
                <Link href={s.href} external>
                  {s.href}
                </Link>
              </td>
              <td>{s.licence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ContentPage>
  );
}
