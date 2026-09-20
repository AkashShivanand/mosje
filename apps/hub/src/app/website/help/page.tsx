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
 * [DBIM 3.0 §5.6] Help — "FAQs, screen reader access, accessibility help".
 * [GIGW 3.0] Help content: how to open files of certain formats, plug-ins required.
 *
 * Both tables are the department's — the plug-in list and the screen-reader list
 * — from dosje.gov.in/home-page/help/ (read 2026-09-17), and the wording is
 * theirs. `ui-restraint-and-copy.md` prefers the department's own words and this
 * page is entirely them.
 *
 * The ADDRESSES are ours to keep working: the live page still points NVDA, JAWS
 * and Supernova at addresses those products moved away from, so each is given the
 * publisher's current one. Window-Eyes is listed WITHOUT a link — the product was
 * discontinued and its address now resolves to a parked page, which GIGW's
 * broken-link rule does not allow a government page to send a reader to.
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

const SCREEN_READERS: { name: string; href?: string; licence: "Free" | "Commercial" }[] = [
  { name: "Screen Access For All (SAFA)", href: "https://safa-reader.software.informer.com/download/", licence: "Free" },
  { name: "Non Visual Desktop Access (NVDA)", href: "https://www.nvaccess.org/", licence: "Free" },
  { name: "System Access To Go", href: "https://www.satogo.com/en/", licence: "Free" },
  { name: "JAWS", href: "https://vispero.com/jaws-screen-reader-software/", licence: "Commercial" },
  { name: "Supernova", href: "https://yourdolphin.com/SuperNova", licence: "Commercial" },
  { name: "Window-Eyes", licence: "Commercial" },
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
        browser needs to have the required plug-ins or software. If your system does not have it, it
        can be downloaded from the Internet free of charge.
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
        This website complies with the Guidelines for Indian Government Websites and Apps (GIGW).
        Visitors with visual impairments can access the website using assistive technologies such as
        screen readers.
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
            <th scope="col">Free / Commercial</th>
          </tr>
        </thead>
        <tbody>
          {SCREEN_READERS.map((s) => (
            <tr key={s.name}>
              <td>
                {s.href ? (
                  <Link href={s.href} external>
                    {s.name}
                  </Link>
                ) : (
                  s.name
                )}
              </td>
              <td>{s.licence}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Accessibility and Other Help</h2>
      <ul>
        <li>
          <Link href="/website/accessibility">Accessibility Statement</Link> — the accessibility
          features of this website and how to report a barrier.
        </li>
        <li>
          <Link href="/website/grants-in-aid-to-ngos-faqs">Grants-in-Aid to NGOs: FAQs</Link> and{" "}
          <Link href="/website/social-defence-faqs">Social Defence: FAQs</Link>.
        </li>
        <li>
          <Link href="/website/sitemap">Sitemap</Link> — every section of this website on one page.
        </li>
        <li>
          <Link href="/website/contact-us">Contact Us</Link> — to reach the Department about a scheme
          or an application.
        </li>
      </ul>
    </ContentPage>
  );
}
