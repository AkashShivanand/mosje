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

/** The live page's own standfirst — dosje.gov.in/whos-who/, read 2026-09-21. */
const DESCRIPTION =
  "Discover the initiatives that drive national efforts to advance equality, protect rights, and empower disadvantaged and marginalised communities across India.";

export const metadata: Metadata = {
  title: "Who's Who — Department of Social Justice & Empowerment",
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

interface OrganizationGroup {
  title: string;
  viewAllHref: string;
  officials: Official[];
}

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

const ORG_GROUPS: OrganizationGroup[] = GROUP_IDS.map((id) => {
  if (id === "ministry-leadership") {
    return {
      title: "Department of Social Justice & Empowerment (DoSJE)",
      viewAllHref: "/website/mosje-directory",
      officials: getOfficeHolders(id),
    };
  }
  const org = getOrganisation(id);
  if (!org) throw new Error(`whos-who: no organisation "${id}" in the registry`);
  return {
    title: `${org.name} (${org.abbr})`,
    viewAllHref: org.directoryHref ?? org.profileHref,
    officials: getOfficeHolders(id),
  };
});

/** Whether a card has anything to show beneath the name — some officers publish nothing. */
function hasContact(o: Official): boolean {
  return Boolean(o.room || o.intercom || o.phone || o.email || o.address);
}

/**
 * Wrap each telephone number so a line can break between numbers but never inside one.
 * The Ministers' cards carry five numbers in one string, and without this "011-" ended one
 * line and "23381669(Fax)" began the next — a number no one could dial from the page.
 */
function keepNumbersWhole(phone: string) {
  return phone.split(/(\d[\d-]*\d(?:\s?\(Fax\))?)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function WhosWhoPage() {
  return (
    <PageLayout
      title="Who's Who"
      breadcrumb={[{ label: "Department" }, { label: "Who's Who" }]}
      description={DESCRIPTION}
      lastUpdated="21 Sep 2026"
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
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-label-1 text-primary hover:text-primary-dark transition-colors self-start sm:self-auto px-3 py-1.5 rounded-lg border border-primary/30 bg-blue-50/50 hover:bg-blue-50"
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
                        {/* The live card links the name to the officer's record; so does this. */}
                        {official.slug ? (
                          <Link
                            href={`/website/official/${official.slug}`}
                            className="hover:text-primary hover:underline"
                          >
                            {official.name}
                          </Link>
                        ) : (
                          official.name
                        )}
                      </h3>
                      <p className="mt-0.5 text-label-2 text-primary">
                        {official.designation}
                      </p>
                    </div>
                  </div>

                  {/*
                    * Rows start at the top so a value that wraps keeps its icon beside its
                    * first line. They used to truncate: an address such as the BJRNF Member
                    * Secretary's, eighty characters long, was cut off at the card's edge.
                    */}
                  {hasContact(official) && (
                  <div className="space-y-2 pt-2 border-t border-neutral-100 text-body-3 text-neutral-600">
                    {official.room && (
                      <div className="flex items-start gap-2">
                        <Icon name="home" size={16} className="mt-0.5 text-neutral-400 shrink-0" />
                        <span>Room {official.room}</span>
                      </div>
                    )}
                    {official.intercom && (
                      <div className="flex items-start gap-2">
                        <Icon name="deskphone" size={16} className="mt-0.5 text-neutral-400 shrink-0" />
                        <span>Intercom {official.intercom}</span>
                      </div>
                    )}
                    {official.phone && (
                      <div className="flex items-start gap-2">
                        <Icon name="call" size={16} className="mt-0.5 text-neutral-400 shrink-0" />
                        <span className="min-w-0 font-mono text-neutral-700">
                          {keepNumbersWhole(official.phone)}
                        </span>
                      </div>
                    )}
                    {official.email && (
                      <div className="flex items-start gap-2">
                        <Icon name="mail" size={16} className="mt-0.5 text-neutral-400 shrink-0" />
                        {/* Some officers publish two addresses; each is its own link. */}
                        <span className="flex min-w-0 flex-col">
                          {official.email.split(", ").map((address) => (
                            <a
                              key={address}
                              href={`mailto:${address}`}
                              className="text-primary hover:underline break-all"
                            >
                              {address}
                            </a>
                          ))}
                        </span>
                      </div>
                    )}
                    {official.address && (
                      <div className="flex items-start gap-2">
                        <Icon name="location_on" size={16} className="mt-0.5 text-neutral-400 shrink-0" />
                        <span className="min-w-0">{official.address}</span>
                      </div>
                    )}
                  </div>
                  )}
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
