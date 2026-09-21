import type { Metadata } from "next";
import { Icon, SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { StateRegister } from "@/components/website-next/media/StateRegister";
import { NCSC_FUNCTION_CIRCULARS, SCHEDULED_CASTE_LISTS } from "@/data/website";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/media.css";

const TITLE = "List of Scheduled Castes";
const DESCRIPTION =
  "State-wise and Union Territory-wise lists of Scheduled Castes, as notified under Article 341 of the Constitution and published by the National Commission for Scheduled Castes.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/list-of-scheduled-castes" }),
};

/**
 * STATE NAMES, CORRECTED (issue CON-11, a Blocker: "List of Scheduled Castes
 * misspells States").
 *
 * The register (`data/website/scheduled-castes.ts`) transcribes the live page
 * verbatim, misspellings included. The names of States and Union Territories
 * are not the Department's to spell: they are fixed by the Constitution's First
 * Schedule. Only these four labels are changed, and only for display — the
 * gazette documents they link to are the Department's files, untouched:
 *
 *   Gujrat                  → Gujarat
 *   Maharastra              → Maharashtra
 *   Pondicherri/Puducherry  → Puducherry
 *   Laddakh                 → Ladakh
 *
 * NOT changed: "Daman and Diu" and "Dadra and Nagar Haveli" were merged into
 * one Union Territory in 2020, but each links to its own notified list, so both
 * rows stay as published.
 */
const STATE_NAME_CORRECTIONS: Record<string, string> = {
  Gujrat: "Gujarat",
  Maharastra: "Maharashtra",
  "Pondicherri/Puducherry": "Puducherry",
  Laddakh: "Ladakh",
};

/**
 * Two registers on one page, as the Department publishes them: the notified
 * lists, and the circulars that govern how a caste certificate is issued and
 * verified. The second is what a citizen holding a certificate needs, so it has
 * its own section.
 */
export default function Page() {
  const rows = SCHEDULED_CASTE_LISTS.map((s) => ({ state: STATE_NAME_CORRECTIONS[s.label] ?? s.label, href: s.href })).sort((a, b) =>
    a.state.localeCompare(b.state),
  );

  return (
    <PageLayout title={TITLE} description={DESCRIPTION} breadcrumb={[{ label: "Documents" }, { label: TITLE }]} lastUpdated="18 Sep 2026">
      <section className="wn-section" aria-labelledby="sc-lists">
        <div className="sa-container">
          <SectionTitle as={2} headingId="sc-lists" title="State-wise / UT-wise List of Scheduled Castes" description="Updated up to 15 February 2024." />
          <StateRegister rows={rows} caption="Lists of Scheduled Castes by State and Union Territory" documentName="the List of Scheduled Castes" />
        </div>
      </section>

      <section className="wn-section wn-section--muted" aria-labelledby="ncsc-circulars">
        <div className="sa-container">
          <SectionTitle as={2} headingId="ncsc-circulars" title="Functions of NCSC" />
          <ul className="wn-prose">
            {NCSC_FUNCTION_CIRCULARS.map((c) => (
              <li key={`${c.label}-${c.href}`}>
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  {c.label}
                  <span className="sr-only"> (PDF, opens in a new window)</span>
                </a>{" "}
                <Icon name="open_in_new" size={16} aria-hidden />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
