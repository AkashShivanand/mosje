import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Help — Department of Social Justice & Empowerment",
  description:
    "Help with viewing documents in different file formats and accessing this website with a screen reader.",
};

/*
 * [DBIM 3.0 §5.6] Help — "FAQs, screen reader access, accessibility help".
 * [GIGW 3.0] Help content: how to open files of certain formats, plug-ins required.
 *
 * The two tables are the Department's own, from dosje.gov.in/home-page/help/
 * (read 2026-09-17), with the addresses the live page actually links to.
 * Window-Eyes is listed without a link: the product was discontinued and its
 * address now resolves to a parked page, which GIGW's broken-link rule does not
 * allow a government page to send a reader to.
 */

const FILE_FORMATS: { type: string; plugin: string; href: string }[] = [
  {
    type: "Portable Document Format (PDF) files",
    plugin: "Adobe Acrobat Reader",
    href: "https://get.adobe.com/reader/otherversions",
  },
  {
    type: "Word files",
    plugin: "Microsoft Word Viewer 2016",
    href: "https://www.microsoft.com/en-in/microsoft-365/word",
  },
  {
    type: "Excel files",
    plugin: "Microsoft Excel Viewer 2016",
    href: "https://www.microsoft.com/en-in/microsoft-365/excel",
  },
  {
    type: "PowerPoint presentations",
    plugin: "Microsoft PowerPoint Viewer 2016",
    href: "https://www.microsoft.com/en-in/microsoft-365/powerpoint",
  },
];

const SCREEN_READERS: { name: string; href?: string; licence: "Free" | "Commercial" }[] = [
  {
    name: "Screen Access For All (SAFA)",
    href: "https://safa-reader.software.informer.com/download/",
    licence: "Free",
  },
  { name: "Non Visual Desktop Access (NVDA)", href: "https://www.nvaccess.org/", licence: "Free" },
  { name: "System Access To Go", href: "https://www.satogo.com/en/", licence: "Free" },
  {
    name: "JAWS",
    href: "https://vispero.com/jaws-screen-reader-software/",
    licence: "Commercial",
  },
  { name: "Supernova", href: "https://yourdolphin.com/SuperNova", licence: "Commercial" },
  { name: "Window-Eyes", licence: "Commercial" },
];

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (opens in a new window)</span>
    </a>
  );
}

export default function HelpPage() {
  return (
    <ContentPage
      title="Help"
      breadcrumb={[{ label: "Help" }]}
      description="Viewing documents in different file formats, and accessing this website with a screen reader."
      lastUpdated="17 Sep 2026"
    >
      <h2>Viewing Information in Various File Formats</h2>
      <p>
        The information provided by this website is available in various formats, such as Portable
        Document Format (PDF), Word, and HTML. To view the information properly, your browser needs the
        required plug-in or software. If your system does not have it, it can be downloaded from the
        Internet free of charge. The table lists the plug-ins needed for each file format.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Document Type</th>
            <th scope="col">Plug-in for Download</th>
          </tr>
        </thead>
        <tbody>
          {FILE_FORMATS.map((f) => (
            <tr key={f.type}>
              <td>{f.type}</td>
              <td>
                <External href={f.href}>{f.plugin}</External>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Screen Reader Access</h2>
      <p>
        This website complies with the Guidelines for Indian Government Websites and Apps (GIGW).
        Visitors with visual impairments can access it using assistive technologies such as screen
        readers. The following screen readers can be used:
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Screen Reader</th>
            <th scope="col">Free / Commercial</th>
          </tr>
        </thead>
        <tbody>
          {SCREEN_READERS.map((r) => (
            <tr key={r.name}>
              <td>{r.href ? <External href={r.href}>{r.name}</External> : r.name}</td>
              <td>{r.licence}</td>
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
          <Link href="/website/contact-us">Contact Us</Link> — to reach the Department about a
          scheme or an application.
        </li>
      </ul>
    </ContentPage>
  );
}
