import type { Metadata } from "next";
import NextLink from "next/link";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";
import { TableWrap } from "@/components/website-next/templates/content/TableWrap";

const TITLE = "Screen Reader Access";
const DESCRIPTION = "Screen readers that can be used to read this website, and where to obtain them.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * GIGW 3.0 mandatory page (issue MAN-02). NEWLY AUTHORED on 21 Sep 2026 — dosje.gov.in
 * has no such page (/screen-reader-access/ returns 404); its Help page carried a
 * screen-reader table, which now lives here.
 *
 * Facts only: each product's publisher, platform, address and licence. The Help page's
 * older list also named SAFA, System Access To Go and Window-Eyes. Window-Eyes was
 * discontinued (its address now resolves to a parked page); SAFA and System Access To
 * Go are left out because no publisher address for them could be confirmed — the Help
 * page linked SAFA to a third-party download site. Add them back with a publisher link.
 */
const READERS: { name: string; platform: string; href: string; site: string; licence: string }[] = [
  {
    name: "Non Visual Desktop Access (NVDA)",
    platform: "Windows",
    href: "https://www.nvaccess.org/",
    site: "nvaccess.org",
    licence: "Free",
  },
  {
    name: "JAWS (Job Access With Speech)",
    platform: "Windows",
    href: "https://www.freedomscientific.com/products/software/jaws/",
    site: "freedomscientific.com",
    licence: "Commercial",
  },
  {
    name: "Narrator",
    platform: "Windows (built in)",
    href: "https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1",
    site: "support.microsoft.com",
    licence: "Free",
  },
  {
    name: "VoiceOver",
    platform: "macOS, iOS and iPadOS (built in)",
    href: "https://www.apple.com/accessibility/vision/",
    site: "apple.com",
    licence: "Free",
  },
  {
    name: "TalkBack",
    platform: "Android (built in)",
    href: "https://support.google.com/accessibility/android/answer/6283677",
    site: "support.google.com",
    licence: "Free",
  },
  {
    name: "SuperNova",
    platform: "Windows",
    href: "https://yourdolphin.com/SuperNova",
    site: "yourdolphin.com",
    licence: "Commercial",
  },
];

export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Website Policies", href: "/website/website-policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="21 Sep 2026"
      sidebar={<PolicySidebar current="/website/screen-reader-access" />}
    >
      <p>
        This website is built to be read with screen readers, the software that reads the content of a screen
        aloud or sends it to a Braille display. It can be used with the screen readers listed below.
      </p>

      <TableWrap label="Screen readers">
        <table>
          <caption className="sr-only">Screen readers that can be used to read this website</caption>
          <thead>
            <tr>
              <th scope="col">Screen Reader</th>
              <th scope="col">Platform</th>
              <th scope="col">Website</th>
              <th scope="col">Free or Commercial</th>
            </tr>
          </thead>
          <tbody>
            {READERS.map((r) => (
              <tr key={r.name}>
                <th scope="row">{r.name}</th>
                <td>{r.platform}</td>
                <td>
                  <Link href={r.href} external>
                    {r.site}
                    <span className="sr-only"> ({r.name})</span>
                  </Link>
                </td>
                <td>{r.licence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <p>
        Screen readers described as built in are part of the device&rsquo;s operating system and need no
        download. The standard this website is built to, and how to report a page that cannot be read, are set out
        in the <NextLink href="/website/accessibility-statement">Accessibility Statement</NextLink>.
      </p>
    </ContentPage>
  );
}
