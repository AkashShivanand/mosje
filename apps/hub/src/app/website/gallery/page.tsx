import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, Icon, Pagination, TabPanel } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { AlbumCard } from "@/components/website-next/media/AlbumCard";
import { LinkTabs } from "@/components/website-next/media/LinkTabs";
import { ListFilters } from "@/components/website-next/media/ListFilters";
import { deriveAlbums, type AlbumKind } from "@/components/website-next/media/albums";
import { organisationName } from "@/components/website-next/media/org-name";
import { getContentSyncedDate, getGalleryItems } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/media.css";

const TITLE = "Gallery";
const DESCRIPTION =
  "Photographs, videos and news coverage of the programmes of the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/gallery" }),
};

const PAGE_SIZE = 24;

const TABS: { id: string; label: string; kind?: AlbumKind; icon: string }[] = [
  { id: "all", label: "All", icon: "grid_view" },
  { id: "photos", label: "Photographs", kind: "Photos", icon: "photo_library" },
  { id: "videos", label: "Videos", kind: "Videos", icon: "smart_display" },
  { id: "news", label: "News Coverage", kind: "News", icon: "newspaper" },
];

interface Props {
  searchParams: Promise<{ type?: string; org?: string; q?: string; page?: string }>;
}

/**
 * The gallery as ALBUMS — one card per event, never one per photograph
 * (issues NAV-16, BRD-14, BRD-18, BRD-19, DES-D-06). How an album is derived
 * from `gallery.json` is documented in `media/albums.ts`.
 *
 * Rendered on the server from the URL: the tab (`type`), the organisation
 * (`org`), the title search (`q`) and the page (`page`). The classic client
 * shipped all 590 records to the browser to filter them there; this page sends
 * the twenty-four it shows.
 *
 * STATES: populated · filtered to nothing (names the filter, Clear Filters) ·
 * empty tab · too much (paged). Loading and error cannot occur: the register
 * is imported JSON resolved on the server.
 */
export default async function GalleryPage({ searchParams }: Props) {
  const params = await searchParams;
  const albums = deriveAlbums(getGalleryItems());

  const tabIndex = Math.max(0, TABS.findIndex((t) => t.id === params.type));
  const tab = TABS[tabIndex]!;
  const inTab = tab.kind ? albums.filter((a) => a.kind === tab.kind) : albums;

  const orgCodes = [...new Set(inTab.map((a) => a.organisation).filter((o): o is string => !!o))];
  const orgOptions = orgCodes
    .map((code) => ({ value: code, label: organisationName(code) ?? code }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const org = orgCodes.includes(params.org ?? "") ? params.org! : "";
  const q = (params.q ?? "").trim();

  const filtered = inTab.filter(
    (a) => (!org || a.organisation === org) && (!q || a.title.toLowerCase().includes(q.toLowerCase())),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number(params.page) || 1));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filterActive = !!(org || q);

  const url = (patch: Record<string, string | number | undefined>) => {
    const next = { type: tab.id === "all" ? "" : tab.id, org, q, ...patch } as Record<string, string | number | undefined>;
    const s = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v && !(k === "page" && Number(v) <= 1)) s.set(k, String(v));
    const qs = s.toString();
    return qs ? `/website/gallery?${qs}` : "/website/gallery";
  };

  const filterWords = [q && `titles containing “${q}”`, org && `from ${organisationName(org)}`].filter(Boolean).join(", ");
  const noun = tab.kind ? tab.label.toLowerCase() : "albums";

  return (
    <PageLayout
      title={TITLE}
      breadcrumb={[{ label: "Media" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
    >
      <section className="wn-section" aria-label="Albums">
        <div className="sa-container">
          <div className="wn-gallery__tabs">
            <LinkTabs
              idBase="gallery"
              label="Kind of media"
              active={tabIndex}
              tabs={TABS.map((t) => ({ id: t.id, label: t.label, icon: t.icon, href: t.id === "all" ? "/website/gallery" : `/website/gallery?type=${t.id}` }))}
            />
          </div>

          <TabPanel idBase="gallery" tabId={tab.id}>
            <ListFilters
              basePath="/website/gallery"
              keep={{ type: tab.id === "all" ? undefined : tab.id }}
              query={{ name: "q", label: "Search by Title", value: q, placeholder: "Event, place or programme" }}
              fields={[{ name: "org", label: "Organisation", value: org, allLabel: "All Organisations", options: orgOptions }]}
            />

            <p className="wn-count" role="status">
              {filtered.length > 0 &&
                `Showing ${((page - 1) * PAGE_SIZE + 1).toLocaleString("en-IN")}–${Math.min(page * PAGE_SIZE, filtered.length).toLocaleString("en-IN")} of ${filtered.length.toLocaleString("en-IN")} ${noun}${filterActive ? ` (${filterWords})` : ""}`}
              {filtered.length === 0 && filterActive && `No ${noun} match these filters.`}
            </p>

            {inTab.length === 0 ? (
              <EmptyState
                icon={<Icon name="photo_library" size={40} />}
                title={`No ${tab.label} Published`}
                description={`The Department has not published any ${tab.label.toLowerCase()}.`}
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Icon name="filter_alt_off" size={40} />}
                title="No Albums Match These Filters"
                description={`No ${noun} match ${filterWords}. Clear the filters to see all ${inTab.length.toLocaleString("en-IN")}.`}
                action={
                  <Link href={url({ org: "", q: "" })} className="wn-filters__clear">
                    Clear Filters
                  </Link>
                }
              />
            ) : (
              <>
                <ul className="wn-albums">
                  {shown.map((a, i) => (
                    <AlbumCard key={a.key} album={a} eager={i < 4} />
                  ))}
                </ul>
                {totalPages > 1 && (
                  <div className="wn-pager">
                    <Pagination page={page} totalPages={totalPages} hrefFor={(n) => url({ page: n })} label="Gallery pages" />
                  </div>
                )}
              </>
            )}
          </TabPanel>
        </div>
      </section>
    </PageLayout>
  );
}
