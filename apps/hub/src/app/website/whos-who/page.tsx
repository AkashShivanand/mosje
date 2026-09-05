import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import {
  DIVISIONS_WITH_DIRECTORY,
  getOfficeHolders,
  getOrganisation,
  ORGANISATIONS_WITH_DIRECTORY,
  type Official,
} from "@/data/website";

export const metadata: Metadata = {
  title: "Who's Who — Department of Social Justice & Empowerment",
  description:
    "Directory of Ministers, Commissions, and Senior Administrative Officers under the Ministry of Social Justice & Empowerment.",
};

/**
 * Each group is one body: its office-holders, and a link onward to its full directory.
 *
 * The officials come from officials.ts rather than a list kept here, and `viewAllHref`
 * prefers the body's telephone directory over its narrative profile. That ordering is the
 * fix for a real defect: three of the four "View All" links pointed at
 * /website/organisation/<slug>, which is an About page carrying no officials at all — so a
 * reader who clicked "View All" beneath a list of officials arrived somewhere with none,
 * while the purpose-built directory (daic-directory, ncbc-directory) sat unlinked.
 *
 * The profile is still the fallback, and it is the right one where a body publishes no
 * directory — NCSC has none.
 */

interface OrganizationGroup {
  title: string;
  viewAllHref: string;
  officials: Official[];
}

/** Bodies shown here, in protocol order, keyed by organisation id. */
const GROUPS: { title: string; ownerId: string; profileHref: string }[] = [
  {
    title: "Ministry of Social Justice and Empowerment (MoSJE) Officials",
    ownerId: "ministry-leadership",
    profileHref: "/website/mosje-directory",
  },
  {
    title: "Dr. Ambedkar International Centre (DAIC) Officials",
    ownerId: "dr-ambedkar-international-centre",
    profileHref: "/website/organisation/dr-ambedkar-international-centre",
  },
  {
    title: "National Commission for Backward Classes (NCBC) Officials",
    ownerId: "national-commission-for-backward-classes-ncbc",
    profileHref: "/website/organisation/national-commission-for-backward-classes-ncbc",
  },
  {
    title: "National Commission for Scheduled Castes (NCSC) Officials",
    ownerId: "national-commission-for-scheduled-castes",
    profileHref: "/website/organisation/national-commission-for-scheduled-castes",
  },
];


/**
 * Every telephone directory the site publishes, gathered in one place.
 *
 * Fourteen of these pages existed and nothing linked to them — eleven organisation
 * directories, the Scheduled Caste Welfare division's, the Ministry's general staff
 * directory and the Chairperson's Office. This page is where a reader looking for a
 * government officer arrives, so it is where they belong. The organisation and division
 * entries are read from the registries, so a body that gains a directory appears here
 * without anyone remembering to add it.
 */
const DIRECTORIES: { label: string; href: string; kind: string }[] = [
  { label: "Ministry Leadership", href: "/website/mosje-directory", kind: "Ministry" },
  { label: "General Staff Directory", href: "/website/directory", kind: "Ministry" },
  { label: "Chairperson's Office", href: "/website/chairpersons-office", kind: "Ministry" },
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

const ORG_GROUPS: OrganizationGroup[] = GROUPS.map((g) => ({
  title: g.title,
  viewAllHref: getOrganisation(g.ownerId)?.directoryHref ?? g.profileHref,
  officials: getOfficeHolders(g.ownerId),
}));

export default function WhosWhoPage() {
  return (
    <PageLayout
      title="Who's Who"
      breadcrumb={[{ label: "Department" }, { label: "Who's Who" }]}
      description="Discover the Commissions, Corporations, Institutes and Foundations that work collectively towards social justice, inclusion and empowerment across India."
      lastUpdated="13 Jun 2026"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {ORG_GROUPS.map((group) => (
          <section key={group.title} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-headline-2 text-neutral-900">
                  {group.title}
                </h2>
                <div className="mt-1.5 h-1 w-12 bg-primary rounded-full" />
              </div>

              <Link
                href={group.viewAllHref}
                className="inline-flex items-center gap-1.5 text-label-1 text-primary hover:text-primary-dark transition-colors self-start sm:self-auto px-3 py-1.5 rounded-lg border border-primary/30 bg-blue-50/50 hover:bg-blue-50"
              >
                View All
                <Icon name="chevron_right" size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.officials.map((official) => (
                <div
                  key={official.name}
                  className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col space-y-4"
                >
                  <div className="flex items-start gap-4">
                    {official.photo ? (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm shrink-0 bg-neutral-100">
                        <Image
                          src={official.photo}
                          alt={official.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-primary text-label-1 shrink-0">
                        {official.name
                          .replace(/^(Shri|Smt|Dr\.|Mr\.|Ms\.)\s+/i, "")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-title-2 text-neutral-900">
                        {official.name}
                      </h3>
                      <p className="mt-0.5 text-label-2 text-primary">
                        {official.designation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-100 text-body-3 text-neutral-600">
                    {official.room && (
                      <div className="flex items-center gap-2">
                        <Icon name="home" size={16} className="text-neutral-400 shrink-0" />
                        <span>Room {official.room}</span>
                      </div>
                    )}
                    {official.phone && (
                      <div className="flex items-center gap-2">
                        <Icon name="call" size={16} className="text-neutral-400 shrink-0" />
                        <span className="font-mono text-neutral-700">{official.phone}</span>
                      </div>
                    )}
                    {official.email && (
                      <div className="flex items-center gap-2">
                        <Icon name="mail" size={16} className="text-neutral-400 shrink-0" />
                        <a
                          href={`mailto:${official.email}`}
                          className="text-primary hover:underline truncate"
                        >
                          {official.email}
                        </a>
                      </div>
                    )}
                    {official.address && (
                      <div className="flex items-center gap-2">
                        <Icon name="location_on" size={16} className="text-neutral-400 shrink-0" />
                        <span className="truncate">{official.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Telephone directories */}
        <section className="space-y-4">
          <div>
            <h2 className="text-headline-2 text-neutral-900">Telephone Directories</h2>
            <p className="mt-1 text-body-2 text-neutral-600">
              Full contact lists for the Ministry, its divisions and its associated
              organisations — name, designation, intercom, telephone and email.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DIRECTORIES.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="flex h-full items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span className="min-w-0">
                    <span className="block text-title-3 text-neutral-900">
                      {entry.label}
                    </span>
                    <span className="mt-0.5 block text-body-3 text-neutral-500">
                      {entry.kind}
                    </span>
                  </span>
                  <Icon
                    name="chevron_right"
                    size={20}
                    className="shrink-0 text-neutral-400"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Need Support Callout */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-title-1 text-neutral-900">Need Support?</h3>
            <p className="text-body-2 text-neutral-600">
              Reach out to us and we will get back to you!
            </p>
          </div>
          <Link
            href="/website/contact-us"
            className={buttonClasses("primary", "filled", "md")}
          >
            Get in Touch
          </Link>
        </section>
      </div>
    </PageLayout>
  );
}
