import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { Button, Icon, Link, SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { OrganisationDetail } from "@/components/website/templates/OrganisationDetail";
import { AdarshGramDashboard } from "@/components/website/AdarshGramDashboard";
import { GiaDashboard } from "@/components/website/GiaDashboard";
import { HostelDashboard } from "@/components/website/HostelDashboard";
import { PmajayWorksMap } from "@/components/website/PmajayWorksMap";
import { DeAddictionMap } from "@/components/website/nmba/DeAddictionMap";
import {
  DEADDICTION_CENTRES,
  PUBLISHED_TOTAL,
} from "@/content/website/deaddiction-centres";
import { getAdarshGramCounts } from "@/lib/website/adarsh-gram-api";
import {
  getGiaData,
  getGiaGender,
  getHostelData,
  getPmajayReach,
} from "@/lib/website/pmajay-api";
import "@/components/website/scheme-dashboard.css";
import {
  getOrganisationDetail,
  ORGANISATION_DETAILS,
} from "@/content/website/organisation-details";
import { trimRedundantOpening } from "@/lib/website/organisation-prose";
import {
  getOrganisations,
  getOrganisation,
  getDocuments,
  withAssetBasePath,
  getContentSyncedDate,
} from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";


/*
 * THE THREE PM-AJAY COMPONENT PAGES SHARE ONE LAYOUT.
 *
 * Each is an editorial two-column — the department's own write-up beside an
 * "At a glance" panel — over a full-width dashboard band. They are three parts
 * of one scheme, so a citizen moving between them should not have to relearn
 * the page; only the facts and the dashboard change.
 *
 * The facts are here rather than in `organisation.json` because they are
 * READ OFF THE PROSE ON THE PAGE ITSELF — the qualifying threshold, the score,
 * the indicator count. They are a summary of the article beside them, not a
 * separate content type, and inventing a CMS field for four lines that exist to
 * summarise the paragraph next to them would be the wrong kind of tidy.
 *
 * EVERY FACT HERE MUST BE STATED POLICY, NEVER A FIGURE FROM THE FEED.
 *
 * This panel is static JSX. It carries no provenance chip and it does not move
 * when the demo rail's data-mode switch moves. The dashboard directly beneath it
 * does both. So a feed number typed in here is a number that will, sooner or
 * later, contradict the chart under it — and the typed one is the one that looks
 * official.
 *
 * It had already happened. Hostels claimed "2,30,977 places / 1,25,485 in
 * occupation" above a dashboard reading 1,57,708 and 89,776: the panel was
 * quoting a stale snapshot while the chart read the feed, on the same screen.
 * GIA claimed "four interventions" three inches from prose saying the component
 * "falls into three broad categories".
 *
 * Both panels now carry what the source states permanently — the 15%/10% GIA
 * floors, the 70% hostel reservation, who qualifies — and leave every count to
 * the dashboard, which is built to report one.
 */
const PMAJAY = "pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay";
const NMBA = "nasha-mukt-bharat-abhiyaan";

const ADARSH_GRAM_SLUG = `${PMAJAY}/development-of-sc-dominated-villages-into-adarsh-gram`;
const GIA_SLUG = `${PMAJAY}/grants-in-aid-to-state-districts`;
const HOSTEL_SLUG = `${PMAJAY}/construction-repair-of-hostels`;

interface GlanceFact {
  term: string;
  detail: React.ReactNode;
}

const GLANCE: Record<string, GlanceFact[]> = {
  [ADARSH_GRAM_SLUG]: [
    {
      term: "Village qualifies if",
      detail: (
        <>
          SC population above <b>40%</b> and total population <b>500 or more</b>
        </>
      ),
    },
    {
      term: "Declared Adarsh Gram at",
      detail: (
        <>
          A score of <b>70 or above</b> out of 100, plus Open Defecation Free status
        </>
      ),
    },
    {
      term: "Measured against",
      detail: (
        <>
          <b>50</b> monitorable indicators across <b>10</b> domains
        </>
      ),
    },
    {
      term: "Gaps funded by",
      detail:
        "Dedicated gap-filling funds, where convergence with other schemes falls short",
    },
  ],
  [GIA_SLUG]: [
    {
      term: "Grant goes to",
      detail:
        "State governments and Union Territories, which design projects to suit local requirements",
    },
    {
      term: "Three broad categories",
      detail: (
        <>
          Comprehensive Livelihood Projects, Infrastructure Development Projects
          and Special Tutoring
        </>
      ),
    },
    {
      term: "Reserved for SC women",
      detail: (
        <>
          At least <b>15%</b> of funds released to a State or UT go to
          income-generating schemes for Scheduled Caste women
        </>
      ),
    },
    {
      term: "Reserved for skilling",
      detail: (
        <>
          At least <b>10%</b> of funds released go to skill development
          programmes
        </>
      ),
    },
  ],
  [HOSTEL_SLUG]: [
    {
      term: "Funds",
      detail:
        "Construction of new hostels and repair of existing ones, including those built under the earlier Babu Jagjivan Ram Chhatrawas Yojana",
    },
    {
      term: "Seats reserved",
      detail: (
        <>
          Institutions receiving support must reserve <b>70%</b> of hostel seats
          for Scheduled Caste students
        </>
      ),
    },
    {
      term: "Girls' hostels",
      detail:
        "Required to have lady wardens and guards available at all times",
    },
    {
      term: "Who can receive it",
      detail:
        "Higher educational institutions ranked under the NIRF, other Central Institutes, and State institutions and schools funded by the Centre or a State",
    },
  ],
};


function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function generateStaticParams() {
  return getOrganisations().map((o) => ({ slug: o.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const org = getOrganisation(key);
  if (!org) return { title: "Organisation — DoSJE" };
  const firstText = org.sections.find((s) => s.html)?.html.replace(/<[^>]+>/g, "").slice(0, 160);
  const title = `${org.title} — DoSJE`;
  // The organisation's own banner where it has one. This is the one family of
  // pages where a page-specific picture beats the estate card: a link to NCSK
  // should show NCSK, not the ministry lockup.
  const banner = getOrganisationDetail(key)?.featuredImage;
  return {
    title,
    description: firstText,
    ...socialCard({
      title,
      description: firstText,
      url: `/website/organisation/${key}`,
      images: banner ? [banner] : undefined,
    }),
  };
}

export default async function OrganisationDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");
  const org = getOrganisation(key);
  if (!org) notFound();

  const rootSlug = slug[0] ?? "";
  const allOrgs = getOrganisations();
  const rootOrg = allOrgs.find((o) => o.slug === rootSlug);
  const relatedPages = allOrgs.filter((o) => o.slug === rootSlug || o.slug.startsWith(`${rootSlug}/`));
  const detail = getOrganisationDetail(key);
  /** Exact-slug record only — see the sub-page empty state below. */
  const authored = ORGANISATION_DETAILS[key];
  const isSubPage = slug.length > 1;

  const adarshGram = key === ADARSH_GRAM_SLUG ? await getAdarshGramCounts() : null;
  const gia = key === GIA_SLUG ? await getGiaData() : null;
  const giaGender = gia
    ? await getGiaGender(
        gia.years.reduce((t, y) => t + (y.approvals.total ?? y.mock.totalApproved), 0),
      )
    : null;
  const hostel = key === HOSTEL_SLUG ? await getHostelData() : null;

  /*
   * The reach map, on PM-AJAY's own page and nowhere else.
   *
   * Gated on the exact slug rather than on "has a detail record", because the
   * feed behind it publishes PM-AJAY's villages and hostels — there is nothing
   * in it for the other 177 organisations, and fetching 3.5 MB on their pages to
   * discover that would be a cost paid 177 times for no result.
   */
  const reach = key === PMAJAY ? await getPmajayReach() : null;

  /*
   * NMBA'S GEO-TAGGED FACILITIES, on its own page and nowhere else.
   *
   * The source page draws an India map of every Ministry-supported centre with
   * a six-way colour key beside it. The ingest captured the key and the 768
   * total as prose and, having no way to capture a map, left the key standing
   * alone — a legend for a picture that was not there.
   *
   * The map itself already existed: `DeAddictionMap`, 487 geo-tagged centres
   * from the Abhiyaan's own endpoint, shipping on the site home and at
   * /website/de-addiction-centres. This is that component finally appearing on
   * the page the source puts it on, not a second one built to match.
   *
   * The two ingested husks are suppressed by `hideIngestedSections` on the NMBA
   * record, so the heading and the key appear once, here.
   */
  const isNmba = key === NMBA;

  /*
   * The other two components, for the "Other PM-AJAY components" card.
   *
   * MATCHED BY SLUG, NOT BY PATH SHAPE. This used to test
   * `slug.includes("/components/")`, which was true only while the three pages
   * lived under an invented `/components/` segment. Moving them onto the source
   * site's own flat paths silently emptied this list and the card disappeared
   * from all three pages — no error, no failing check, just a missing card.
   *
   * These three slugs are already declared above because the dashboards key off
   * them, so matching against that set costs nothing and cannot rot when a URL
   * changes again.
   */
  const COMPONENT_SLUGS = new Set([ADARSH_GRAM_SLUG, GIA_SLUG, HOSTEL_SLUG]);
  const siblingComponents = COMPONENT_SLUGS.has(key)
    ? relatedPages.filter((p) => p.slug !== key && COMPONENT_SLUGS.has(p.slug))
    : [];
  const glance = GLANCE[key];

  const orgHref = (s: string) => `/website/organisation/${s}`;

  const chrome = {
    // This route KNOWS which header level it is rendering, so it says rather
    // than letting PageHero guess from whether an image happens to exist.
    level: (isSubPage ? "inner" : "landing") as "inner" | "landing",
    // Only a sub-page has somewhere to go back TO.
    backHref: isSubPage ? orgHref(rootSlug) : undefined,
    // The template draws a fact card that straddles the band's lower edge.
    hasOverlappingFacts: (detail?.facts?.length ?? 0) > 0,
    title: org.title,
    badge: isSubPage ? (rootOrg?.title ?? "Associated Organisation") : "Associated Organisation",
    // "Associated Organisations" carries NO href. It used to point at /website —
    // the site home, which is exactly where the "Home" crumb beside it already
    // goes, so the trail read Home › Home › … A crumb that lies about its
    // destination is worse than one that does not offer to travel. There is no
    // listing page to point it at either: the header entry of that name is a
    // mega-menu (`href: "#"`), not a route. Label-only is the honest form, and
    // PageLayout already renders crumbs without an href.
    breadcrumb: isSubPage
      ? [
          { label: "Associated Organisations" },
          { label: rootOrg?.title ?? "Organisation", href: orgHref(rootSlug) },
          { label: org.title },
        ]
      : [
          { label: "Associated Organisations" },
          { label: org.title },
        ],
    lastUpdated: getContentSyncedDate(),
    logoSrc: detail?.logo ?? (rootOrg as { logo?: string })?.logo ?? "/website/images/National-Emblem-logo.svg",
    featuredImage: detail?.featuredImage ?? org.featuredImage ?? rootOrg?.featuredImage,
    description:
      (org as { description?: string }).description ??
      detail?.lead,
    actions: detail?.quickActions && detail.quickActions.length > 0 ? (
      <div className="flex flex-wrap gap-2.5 items-center mt-2">
        {detail.quickActions.map((qa) => {
          const isExternal = qa.external || qa.href.startsWith("http");
          return (
            <a
              key={qa.href}
              href={qa.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-label-1 transition-all shadow-sm ${
                qa.variant === "primary"
                  ? "bg-white text-[var(--sa-color-primaryScale-600)] hover:bg-white/90 shadow-md font-bold"
                  : qa.variant === "danger"
                  ? "bg-amber-400 text-slate-900 hover:bg-amber-300 font-bold"
                  : "bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur-sm"
              }`}
            >
              {qa.icon && <Icon name={qa.icon} size={16} />}
              <span>{qa.label}</span>
              {isExternal ? (
                <Icon name="open_in_new" size={16} className="opacity-80" />
              ) : (
                <Icon name="arrow_forward" size={16} className="opacity-80" />
              )}
            </a>
          );
        })}
      </div>
    ) : (org.website ?? rootOrg?.website) ? (
      <Button
        href={org.website ?? rootOrg?.website}
        external
        variant="primary"
        appearance="filled"
        size="sm"
        className="text-label-2 px-4 py-2"
      >
        Visit Official Portal
      </Button>
    ) : undefined,
  };

  /*
   * THE PM-AJAY COMPONENT PAGES KEEP THEIR OWN 2-COLUMN DASHBOARD LAYOUT (Figma 51858:48299).
   */
  if (glance) {
    return (
      <PageLayout {...chrome}>
        <section className="py-10 md:py-14 bg-surface-muted/30">
          <div className="sa-container flex flex-col gap-6 lg:flex-row lg:items-start">
            <article className="gov-prose sd-article min-w-0 lg:flex-1">
              {org.sections.map((s, i) => (
                <section key={s.heading ?? i} className="mb-8">
                  {s.heading && slugify(s.heading) !== slugify(org.title) && (
                    <h2 id={slugify(s.heading)} className="text-headline-2 text-primary-dark pb-2 mb-6 scroll-mt-28">
                      {s.heading}
                    </h2>
                  )}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: withAssetBasePath(trimRedundantOpening(s.html)),
                    }}
                    className="text-body-1 text-ink"
                  />
                </section>
              ))}
            </article>

            <div className="sd-aside">
              <aside className="sd-aside__card sd-aside__card--facts" aria-labelledby="sd-aside-title">
                <h2 id="sd-aside-title" className="sd-aside__title">
                  At a glance
                </h2>
                <dl className="sd-aside__list">
                  {glance.map((f) => (
                    <div key={f.term} className="sd-aside__row">
                      <dt>{f.term}</dt>
                      <dd>{f.detail}</dd>
                    </div>
                  ))}
                </dl>
              </aside>

              {siblingComponents.length > 0 && (
                <nav className="sd-aside__card sd-aside__card--nav" aria-labelledby="sd-aside-more">
                  <h2 id="sd-aside-more" className="sd-aside__subtitle">
                    Other PM-AJAY components
                  </h2>
                  <ul className="sd-aside__links">
                    {siblingComponents.map((c) => (
                      <li key={c.slug}>
                        <NextLink href={`/website/organisation/${c.slug}`} className="sd-aside__link">
                          <span className="sd-aside__link-text">{c.title}</span>
                          <span className="sd-aside__link-arrow" aria-hidden>
                            <Icon name="arrow_forward" size={16} />
                          </span>
                        </NextLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-14">
          <div className="sa-container">
            {adarshGram && <AdarshGramDashboard feed={adarshGram} />}
            {gia && giaGender && <GiaDashboard data={gia} gender={giaGender} />}
            {hostel && <HostelDashboard data={hostel} />}
          </div>
        </section>
      </PageLayout>
    );
  }

  /*
   * CANONICAL SUBPAGE LAYOUT (Figma node 3751:7943).
   *
   * Renders the complete, authentic scraped content for the subpage in full-width
   * structured container sections without synthetic fabrication or artificial 2-column squeezing.
   */
  if (isSubPage) {
    return (
      <PageLayout {...chrome}>
        <section className="py-10 md:py-14 bg-surface-muted/30">
          <div className="sa-container max-w-7xl mx-auto">
            {org.sections.length === 0 && authored?.aboutHtml != null ? (
              /*
               * THE SCRAPE RETURNED NOTHING, BUT THE SOURCE PUBLISHES SOMETHING.
               *
               * Two NMBA child pages — Contact Us and the PMU Corner — came back
               * with zero sections while the source page carried an address, two
               * named officers and eleven PMU officers with their allocated
               * States. They rendered the "being prepared" notice below, which
               * told a reader the Department had not written the page when in
               * fact the Department had.
               *
               * `authored` is an EXACT lookup, never the root-record fallback:
               * without that, an empty child page of any organisation would
               * inherit its parent's About text and publish it as the child's
               * own content.
               */
              <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-neutral-subtle">
                {authored.aboutHeading != null && (
                  <h2
                    id={slugify(authored.aboutHeading)}
                    className="text-headline-2 text-primary-dark pb-3 mb-6 border-b border-neutral-subtle scroll-mt-28"
                  >
                    {authored.aboutHeading}
                  </h2>
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: authored.aboutHtml }}
                  className="gov-prose text-ink max-w-none"
                />
              </div>
            ) : org.sections.length === 0 ? (
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-neutral-subtle">
                <p className="orgd__empty">
                  This page is being prepared. In the meantime the source page is available on{" "}
                  <Link href={org.sourceUrl} external>
                    dosje.gov.in
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {org.sections.map((s, i) => (
                  <section
                    key={s.heading ?? i}
                    className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-neutral-subtle"
                  >
                    {s.heading && slugify(s.heading) !== slugify(org.title) && (
                      <h2
                        id={slugify(s.heading)}
                        className="text-headline-2 text-primary-dark pb-3 mb-6 border-b border-neutral-subtle scroll-mt-28"
                      >
                        {s.heading}
                      </h2>
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: withAssetBasePath(trimRedundantOpening(s.html)),
                      }}
                      className="gov-prose text-ink max-w-none"
                    />
                  </section>
                ))}
              </div>
            )}
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout {...chrome}>
      <OrganisationDetail
        org={org}
        detail={detail}
        relatedPages={relatedPages}
        documents={getDocuments()}
        reachSlot={
          reach ? (
            <PmajayWorksMap data={reach} />
          ) : isNmba ? (
            <>
              <SectionTitle
                as={2}
                title="Geo-Tagged De-addiction Facilities"
                description={
                  /*
                   * BOTH NUMBERS, RECONCILED — because both are on screen.
                   *
                   * The band's heading said 768 while the map beneath it said
                   * "All 487" and "487 centres". One reading, two figures, and
                   * nothing telling a reader which was true or why they differ
                   * — the exact shape of the defect in
                   * `.claude/rules/data-state-completeness.md` §2.
                   *
                   * 768 is what the Ministry publishes; 487 of those carry
                   * coordinates and can be drawn. Saying so in one sentence is
                   * what stops a reader concluding a third of the country's
                   * centres have gone missing.
                   */
                  `Of the ${PUBLISHED_TOTAL} centres the Ministry publishes, the ${DEADDICTION_CENTRES.length} with recorded coordinates are plotted here.`
                }
                headingId="deaddiction-map-heading"
              />
              <DeAddictionMap compact />
            </>
          ) : null
        }
      />
    </PageLayout>
  );
}
