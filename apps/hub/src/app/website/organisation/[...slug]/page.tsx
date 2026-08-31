import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { OrganisationDetail } from "@/components/website/templates/OrganisationDetail";
import { AdarshGramDashboard } from "@/components/website/AdarshGramDashboard";
import { GiaDashboard } from "@/components/website/GiaDashboard";
import { HostelDashboard } from "@/components/website/HostelDashboard";
import { getAdarshGramCounts } from "@/lib/website/adarsh-gram-api";
import { getGiaData, getGiaGender, getHostelData } from "@/lib/website/pmajay-api";
import "@/components/website/scheme-dashboard.css";
import { getOrganisationDetail } from "@/content/website/organisation-details";
import { trimRedundantOpening } from "@/lib/website/organisation-prose";
import {
  getOrganisations,
  getOrganisation,
  getDocuments,
  withAssetBasePath,
  getContentSyncedDate,
} from "@/lib/website/content";


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
 */
const PMAJAY = "pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay";

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
      detail: "State governments and district administrations, not to individuals directly",
    },
    {
      term: "Four interventions",
      detail: (
        <>
          Income generation, skilling, infrastructure and special tutoring — each
          approved project sits under exactly one
        </>
      ),
    },
    {
      term: "Approved so far",
      detail: (
        <>
          {/* `{" "}` and a literal en dash, not `&ndash;`: an HTML entity in a
              JSX text node makes SWC re-trim the node, and the space after the
              preceding `</b>` was silently eaten — "across fivefinancial". */}
          <b>8,772</b> projects across <b>five</b>{" "}financial years, from 2022–23
        </>
      ),
    },
    {
      term: "Largest instrument",
      detail: (
        <>
          Income generation, at roughly <b>half</b> of all approved projects
        </>
      ),
    },
  ],
  [HOSTEL_SLUG]: [
    {
      term: "Funds",
      detail:
        "Construction of new hostels and repair of existing ones for Scheduled Caste students",
    },
    {
      term: "Beneficiaries covered",
      detail: (
        <>
          <b>2,30,977</b> places provided for across the component
        </>
      ),
    },
    {
      term: "In occupation",
      detail: (
        <>
          <b>1,25,485</b> — just over <b>half</b> the places covered
        </>
      ),
    },
    {
      term: "Reported through",
      detail: "The PM-AJAY hostel management information system, summarised publicly",
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
  return { title: `${org.title} — DoSJE`, description: firstText };
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
  const isSubPage = slug.length > 1;

  const adarshGram = key === ADARSH_GRAM_SLUG ? await getAdarshGramCounts() : null;
  const gia = key === GIA_SLUG ? await getGiaData() : null;
  const giaGender = gia
    ? await getGiaGender(
        gia.years.reduce((t, y) => t + (y.approvals.total ?? y.mock.totalApproved), 0),
      )
    : null;
  const hostel = key === HOSTEL_SLUG ? await getHostelData() : null;

  const siblingComponents = relatedPages.filter(
    (p) => p.slug !== key && p.slug.includes("/components/"),
  );
  const glance = GLANCE[key];

  const orgHref = (s: string) => `/website/organisation/${s}`;

  const chrome = {
    title: org.title,
    badge: isSubPage ? (rootOrg?.title ?? "Associated Organisation") : "Associated Organisation",
    breadcrumb: isSubPage
      ? [
          { label: "Associated Organisations", href: "/website" },
          { label: rootOrg?.title ?? "Organisation", href: orgHref(rootSlug) },
          { label: org.title },
        ]
      : [
          { label: "Associated Organisations", href: "/website" },
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
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all shadow-sm ${
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
      <a
        href={org.website ?? rootOrg?.website}
        target="_blank"
        rel="noreferrer"
        className={buttonClasses("primary", "filled", "sm", "text-xs px-4 py-2 flex items-center gap-1.5")}
      >
        Visit Official Portal <Icon name="open_in_new" size={16} />
      </a>
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
                    <h2 id={slugify(s.heading)} className="text-[28px] font-semibold text-primary-dark pb-2 mb-6 scroll-mt-28">
                      {s.heading}
                    </h2>
                  )}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: withAssetBasePath(trimRedundantOpening(s.html)),
                    }}
                    className="leading-relaxed text-ink text-[16px]"
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
                        <Link href={`/website/organisation/${c.slug}`} className="sd-aside__link">
                          <span className="sd-aside__link-text">{c.title}</span>
                          <span className="sd-aside__link-arrow" aria-hidden>
                            <Icon name="arrow_forward" size={16} />
                          </span>
                        </Link>
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
            {org.sections.length === 0 ? (
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-neutral-subtle">
                <p className="orgd__empty">
                  This page is being prepared. In the meantime the source page is available on{" "}
                  <a href={org.sourceUrl} target="_blank" rel="noreferrer noopener">
                    dosje.gov.in
                  </a>
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
                        className="text-[22px] md:text-[26px] font-semibold text-primary-dark pb-3 mb-6 border-b border-neutral-subtle scroll-mt-28"
                      >
                        {s.heading}
                      </h2>
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: withAssetBasePath(trimRedundantOpening(s.html)),
                      }}
                      className="gov-prose text-ink text-[16px] leading-relaxed max-w-none"
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
      />
    </PageLayout>
  );
}
