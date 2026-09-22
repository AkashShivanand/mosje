import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { Icon, SectionTitle, buttonClasses } from "@mosje/design-system";
import {
  OrganisationDetail,
  OrganisationSubPage,
} from "@/components/website-next/templates/OrganisationDetail";
import {
  abbreviationOf,
  faqGroups,
  firstSentence,
  tidyTitle,
} from "@/components/website-next/templates/organisation-content";
import type { PageHeaderProps } from "@/components/website-next/layout/PageHeader";
/*
 * DATA-VIZ ONLY from the classic tree. These four are the feeds' own dashboards
 * and maps (live-first, mirrored-snapshot fallback, provenance chips); rebuilding
 * them is out of scope for the organisation template, so the new layout wraps
 * them in its own section. No classic LAYOUT component is imported here.
 */
import { AdarshGramDashboard } from "@/components/website/AdarshGramDashboard";
import { GiaDashboard } from "@/components/website/GiaDashboard";
import { HostelDashboard } from "@/components/website/HostelDashboard";
import { PmajayWorksMap } from "@/components/website/PmajayWorksMap";
import "@/components/website/scheme-dashboard.css";
import { CentreLocator } from "@/components/website-next/maps/CentreLocator";
import { getAdarshGramCounts } from "@/lib/website/adarsh-gram-api";
import {
  getGiaData,
  getGiaGender,
  getHostelData,
  getPmajayReach,
} from "@/lib/website/pmajay-api";
import {
  getOrganisationDetail,
  ORGANISATION_DETAILS,
} from "@/content/website/organisation-details";
import { getOrganisation as getRegistryOrganisation } from "@/data/website/organisations";
import {
  getOrganisations,
  getOrganisation,
  getDocuments,
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


export function generateStaticParams() {
  return getOrganisations().map((o) => ({ slug: o.slug.split("/") })).slice(0, 0); // rendered on first visit, not at build — free-tier budget, see documents/[slug]/page.tsx
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const found = getOrganisation(key);
  if (!found) return { title: "Organisation | Department of Social Justice & Empowerment" };
  const org = withTitleFix(found);
  const firstText = org.sections.find((s) => s.html)?.html.replace(/<[^>]+>/g, "").slice(0, 160);
  const title = `${tidyTitle(org.title)} | Department of Social Justice & Empowerment`;
  // The organisation's own banner where it has one: a link to NCSK should show
  // NCSK, not the ministry lockup.
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

/*
 * Page titles the ingest captured wrongly, corrected to the organisation's own
 * name for the page. Only where the source is unambiguous:
 *   volunteer-corner — ingested as "Corner"; the page's own heading on
 *     dosje.gov.in is "Volunteer Corner", as is the NMBA menu entry.
 *   pmu-corners — ingested as "PMU Corner’s" (a stray apostrophe); the NMBA
 *     menu entry is "PMU Corner".
 */
const TITLE_FIX: Record<string, string> = {
  "nasha-mukt-bharat-abhiyaan/volunteer-corner": "Volunteer Corner",
  "nasha-mukt-bharat-abhiyaan/pmu-corners": "PMU Corner",
};
const withTitleFix = <T extends { slug: string; title: string }>(r: T): T =>
  TITLE_FIX[r.slug] ? { ...r, title: TITLE_FIX[r.slug]! } : r;

/** The registry's grouping, in the words the home page uses for it. */
const CATEGORY_LABEL = {
  commissions: "Commissions",
  corporations: "Finance and Development Corporations",
  foundations: "Foundations and Autonomous Bodies",
  schemes: "Scheme Portals",
} as const;

export default async function OrganisationDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");
  const found = getOrganisation(key);
  if (!found) notFound();
  const org = withTitleFix(found);

  const rootSlug = slug[0] ?? "";
  const allOrgs = getOrganisations().map(withTitleFix);
  const rootOrg = allOrgs.find((o) => o.slug === rootSlug);
  const relatedPages = allOrgs.filter((o) => o.slug === rootSlug || o.slug.startsWith(`${rootSlug}/`));
  const detail = getOrganisationDetail(key);
  /** Exact-slug record only — never the root's, or a child would inherit its parent's text. */
  const authored = ORGANISATION_DETAILS[key];
  const registry = getRegistryOrganisation(rootSlug);
  const isSubPage = slug.length > 1;
  /** The source spells a contact page both `contact` and `contact-us`. */
  const isContactPage = /^contact(-us)?$/.test(slug[slug.length - 1] ?? "");

  const rootTitle = tidyTitle(rootOrg?.title ?? org.title);
  const abbr = registry?.abbr ?? abbreviationOf(rootTitle);
  const orgHref = (s: string) => `/website/organisation/${s}`;

  /*
   * THE OFFICIAL WEBSITE IS NOT `org.website`. The ingest filled that field with
   * whatever the source page linked first — a Minister's profile on eight pages,
   * a circulars listing on two, a Telangana agriculture site on one — and the
   * classic header offered it as "Visit Official Portal". Only the registry's
   * `externalUrl` and a record's own "Official … Portal" link are trusted.
   */
  const officialSite =
    registry?.externalUrl ??
    detail?.nav
      ?.flatMap((g) => g.items)
      .find((i) => /official/i.test(i.label) && /^https?:\/\//.test(i.href))?.href;

  /* The header's one primary action, and at most one quiet companion. */
  const primaryTask = detail?.quickActions?.find((q) => q.variant === "primary");
  const helpline = detail?.joinBanner;
  const actionLinks: { label: string; href: string; primary: boolean; icon?: string; srLabel?: string }[] = [];
  if (!isSubPage) {
    if (primaryTask) actionLinks.push({ label: primaryTask.label, href: primaryTask.href, primary: true, icon: primaryTask.icon });
    else if (officialSite) actionLinks.push({ label: "Visit Official Website", href: officialSite, primary: true });
    if (helpline?.helplineNumber) {
      actionLinks.push({
        label: `Call ${helpline.helplineNumber}`,
        href: `tel:${helpline.helplineNumber.replace(/[^+\d]/g, "")}`,
        primary: false,
        icon: "call",
        srLabel: `${helpline.helplineLabel}: call ${helpline.helplineNumber}`,
      });
    } else if (primaryTask && officialSite) {
      actionLinks.push({ label: "Visit Official Website", href: officialSite, primary: false });
    }
  }
  const actions =
    actionLinks.length > 0 ? (
      <>
        {actionLinks.map((a) => {
          const ext = /^https?:\/\//.test(a.href);
          const cls = buttonClasses("primary", a.primary ? "filled" : "outlined", "md");
          const inner = (
            <>
              {a.icon && <Icon name={a.icon} size={20} aria-hidden />}
              <span aria-hidden={a.srLabel ? true : undefined}>{a.label}</span>
              {a.srLabel && <span className="sr-only">{a.srLabel}</span>}
              {ext && (
                <>
                  <Icon name="open_in_new" size={16} aria-hidden />
                  <span className="sr-only"> (opens in a new window)</span>
                </>
              )}
            </>
          );
          return ext || a.href.startsWith("tel:") ? (
            <a key={a.href} href={a.href} className={cls} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined}>
              {inner}
            </a>
          ) : (
            <NextLink key={a.href} href={a.href} className={cls}>
              {inner}
            </NextLink>
          );
        })}
      </>
    ) : undefined;

  /* One line on what the body is: the record's own lead, else the source's intro. */
  const intro = rootOrg?.sections.find((s) => s.html.replace(/<[^>]+>/g, "").trim().length > 40)?.html
    .replace(/<h4[\s\S]*$/i, "");

  const header: PageHeaderProps = {
    title: isSubPage ? tidyTitle(org.title) : rootTitle,
    // Label-only first crumb: the header menu entry of that name is a menu, not a page.
    breadcrumb: isSubPage
      ? [{ label: "Organisations" }, { label: rootTitle, href: orgHref(rootSlug) }, { label: tidyTitle(org.title) }]
      : [{ label: "Organisations" }, { label: rootTitle }],
    badge: isSubPage ? abbr ?? rootTitle : registry ? CATEGORY_LABEL[registry.category] : undefined,
    description: isSubPage ? undefined : firstSentence(detail?.lead ?? intro),
    lastUpdated: getContentSyncedDate(),
    /*
     * The organisation's own mark, never the National Emblem standing in for a
     * missing one: the Emblem is the Government's, not the organisation's. With
     * no mark, a neutral tile carries the abbreviation, or an icon where the
     * record has none (E-Anudaan, List of Channelizing Agencies, Ministry and
     * Scheme wise Financial Summary, Success Stories at the time of writing).
     */
    logoSrc: detail?.logo ?? registry?.logoSrc,
    logoAside:
      detail?.logo ?? registry?.logoSrc ? undefined : (
        <span className="og-mark" aria-hidden="true">
          {abbr && abbr.length <= 8 ? abbr : <Icon name="account_balance" size={32} />}
        </span>
      ),
    level: isSubPage ? "inner" : "landing",
    /*
     * No banner photograph. LAY-14 asks for a COMPACT header, and the banners the
     * records carry are generic stock scenes (NCSC's is a classroom), not the
     * organisation's own. The images stay on the records for social cards.
     */
    actions,
  };

  if (isSubPage) {
    const glance = GLANCE[key];
    const COMPONENT_SLUGS = new Set([ADARSH_GRAM_SLUG, GIA_SLUG, HOSTEL_SLUG]);
    const siblings = COMPONENT_SLUGS.has(key) ? relatedPages.filter((p) => p.slug !== key && COMPONENT_SLUGS.has(p.slug)) : [];
    const adarshGram = key === ADARSH_GRAM_SLUG ? await getAdarshGramCounts() : null;
    const gia = key === GIA_SLUG ? await getGiaData() : null;
    const giaGender = gia
      ? await getGiaGender(gia.years.reduce((t, y) => t + (y.approvals.total ?? y.mock.totalApproved), 0))
      : null;
    const hostel = key === HOSTEL_SLUG ? await getHostelData() : null;
    const dashboard =
      adarshGram ? <AdarshGramDashboard feed={adarshGram} />
      : gia && giaGender ? <GiaDashboard data={gia} gender={giaGender} />
      : hostel ? <HostelDashboard data={hostel} />
      : undefined;
    return (
      <OrganisationSubPage
        header={header}
        org={org}
        rootOrg={rootOrg}
        detail={detail}
        authored={authored}
        relatedPages={relatedPages}
        abbr={abbr}
        directoryHref={registry?.directoryHref}
        glance={glance}
        siblings={siblings}
        dashboard={dashboard}
        isContactPage={isContactPage}
        faqs={faqGroups(org.sections)}
      />
    );
  }

  /*
   * One organisation's own map, on its own page and nowhere else: the feeds
   * behind them publish PM-AJAY's villages and hostels and NMBA's centres, and
   * fetching them for the other organisations would be a cost with no result.
   */
  const reach = key === PMAJAY ? await getPmajayReach() : null;
  const coverage = reach
    ? { title: "Scheme Coverage", body: <PmajayWorksMap data={reach} /> }
    : key === NMBA
      ? {
          title: "De-Addiction Facilities",
          body: (
            <>
              <SectionTitle
                as={2}
                title="Geo-Tagged De-Addiction Facilities"
                description="Ministry-supported de-addiction and rehabilitation centres, at the locations recorded in the Abhiyaan’s register."
                headingId="coverage-title"
              />
              <CentreLocator />
            </>
          ),
        }
      : undefined;

  return (
    <OrganisationDetail
      header={header}
      org={org}
      detail={detail}
      relatedPages={relatedPages}
      documents={getDocuments()}
      abbr={abbr}
      directoryHref={registry?.directoryHref}
      coverage={coverage}
    />
  );
}
