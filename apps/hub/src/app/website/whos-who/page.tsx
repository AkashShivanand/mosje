import type { Metadata } from "next";
import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { WhosWhoBrowser, type WhosWhoTeam } from "@/components/website-next/templates/WhosWhoBrowser";
import "@/components/website-next/templates/people.css";
import {
  DIVISIONS_WITH_DIRECTORY,
  getOfficeHolders,
  getOrganisation,
  ORGANISATIONS_WITH_DIRECTORY,
} from "@/data/website";

/**
 * The live page's standfirst ("Discover the initiatives that drive national efforts to
 * advance equality…", dosje.gov.in/whos-who/, read 2026-09-21) describes the Department's
 * work, not this page, and is a copy of a sentence used elsewhere on the site. The page
 * header says what the page is for instead; the divergence is in the redesign report.
 */
const DESCRIPTION =
  "The Ministers and the Secretary of the Department of Social Justice & Empowerment and the office-holders of its commissions, corporations and institutions, with their official contact details.";

export const metadata: Metadata = {
  title: "Who's Who | Department of Social Justice & Empowerment",
  description: DESCRIPTION,
};

/**
 * Each group is one body: its office-holders, and a link onward to its full directory.
 *
 * The groups are the live page's eleven teams, in the live page's order, and the officials
 * are read from officials.ts, which mirrors that page. A title is the registry's name for
 * the body, so it cannot drift from the rest of the site; `viewAllHref` prefers the body's
 * telephone directory over its narrative profile, because "View All" beneath a list of
 * officials must arrive somewhere that has officials.
 */

/** The live page's teams, in its order. The Department's own team comes first. */
const GROUP_IDS = [
  "ministry-leadership",
  "national-commission-for-scheduled-castes",
  "national-commission-for-safai-karamcharis",
  "national-commission-for-backward-classes-ncbc",
  "national-scheduled-castes-finance-and-development-corporation",
  "national-backward-classes-financeand-development-corporationnbcfdc",
  "national-safai-karamcharis-finance-development-corporation",
  "dr-ambedkar-foundation",
  "dr-ambedkar-international-centre",
  "babu-jagjivan-ram-national-foundation-jrf",
  "national-institute-of-social-defence",
] as const;

/**
 * Every telephone directory the site publishes, gathered in one place.
 *
 * Fourteen of these pages existed and nothing linked to them — eleven organisation
 * directories, the Scheduled Caste Welfare division's, the Ministry's general staff
 * directory and the Chairperson's Office. (That last one is NCSC's directory — the live
 * site titles it "NCSC Directory" — so it is listed with NCSC, from the registry.) This page is where a reader looking for a
 * government officer arrives, so it is where they belong. The organisation and division
 * entries are read from the registries, so a body that gains a directory appears here
 * without anyone remembering to add it.
 */
const DIRECTORIES: { label: string; href: string; kind: string }[] = [
  { label: "Ministry Leadership", href: "/website/mosje-directory", kind: "Ministry" },
  { label: "General Staff Directory", href: "/website/directory", kind: "Ministry" },
  ...DIVISIONS_WITH_DIRECTORY.map((division) => ({
    label: division.name,
    href: division.directoryHref!,
    kind: "Division",
  })),
  ...ORGANISATIONS_WITH_DIRECTORY.map((organisation) => ({
    label: `${organisation.name} (${organisation.abbr})`,
    href: organisation.directoryHref!,
    kind: "Associated Organisation",
  })),
];

const TEAMS: WhosWhoTeam[] = GROUP_IDS.map((id) => {
  if (id === "ministry-leadership") {
    return {
      id,
      title: "Department of Social Justice & Empowerment (DoSJE)",
      viewAllHref: "/website/mosje-directory",
      officials: getOfficeHolders(id),
    };
  }
  const org = getOrganisation(id);
  if (!org) throw new Error(`whos-who: no organisation "${id}" in the registry`);
  return {
    id,
    title: `${org.name} (${org.abbr})`,
    viewAllHref: org.directoryHref ?? org.profileHref,
    officials: getOfficeHolders(id),
  };
});

export default function WhosWhoPage() {
  return (
    <PageLayout
      title="Who's Who"
      breadcrumb={[{ label: "Department" }, { label: "Who's Who" }]}
      description={DESCRIPTION}
      lastUpdated="2026-09-21"
    >
      <div className="wn-section wn-section--tight">
        <div className="sa-container">
          <WhosWhoBrowser teams={TEAMS} />
        </div>
      </div>

      {/* Telephone directories: every one the site publishes, gathered in one place. */}
      <section className="wn-section wn-section--muted" aria-labelledby="directories-title">
        <div className="sa-container">
          <SectionTitle
            headingId="directories-title"
            title="Telephone Directories"
            description="Every officer of the Ministry, its divisions and its associated organisations, with intercom, telephone and email."
          />
          <ul className="wn-who__dirs">
            {DIRECTORIES.map((entry) => (
              <li key={entry.href} className="wn-who__dir">
                <span>
                  <Link href={entry.href}>{entry.label}</Link>
                  <span className="wn-who__dir-kind">{entry.kind}</span>
                </span>
                <span className="wn-who__dir-go" aria-hidden="true">
                  <Icon name="arrow_forward" size={20} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
