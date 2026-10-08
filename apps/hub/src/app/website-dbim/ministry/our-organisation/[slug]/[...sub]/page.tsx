import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimAlbumGrid } from "@/components/website-dbim/media/AlbumGrid";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import {
  DbimOfficialProfileView,
  DbimOrgDirectoryView,
  DbimOrgDocumentsView,
  DbimOrgEventsView,
  DbimOrgSubPageView,
} from "@/components/website-dbim/ministry/OrganisationPages";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { dbimDate } from "@/lib/website-dbim/date";
import {
  officialProfile,
  organisationAlbums,
  organisationDirectory,
  organisationDocuments,
  organisationEvents,
  organisationName,
  organisationSubPage,
  pageOf,
} from "@/lib/website-dbim/organisation-pages";
import "@/components/website-dbim/media/media.css";

type Props = { params: Promise<{ slug: string; sub: string[] }>; searchParams: Promise<{ page?: string }> };

/* Rendered on first visit, not at build: 103 pages of the bodies' own, their registers
   and their officers — the estate's rule for large ingested sets (media/photos/[slug]). */
export function generateStaticParams() {
  return [];
}

type Resolved = { title: string; body: React.ReactNode } | undefined;

/**
 * Everything an organisation's page links to, under that organisation:
 * its own pages, its document registers, events, gallery, directory and officers.
 * The links that lead here are resolved in lib/website-dbim/live-links.ts.
 */
function resolve(id: string, sub: string[], page: number): Resolved {
  const [head, second, ...more] = sub;
  if (more.length) return undefined;
  if (head === "documents" && second) {
    const d = organisationDocuments(id, second);
    if (!d) return undefined;
    const p = pageOf(d.rows, page);
    return { title: d.title, body: <DbimOrgDocumentsView {...p} empty={`No ${d.title.toLowerCase()} have been published.`} /> };
  }
  if (head === "events" && !second) {
    return { title: "Events", body: <DbimOrgEventsView {...pageOf(organisationEvents(id), page)} /> };
  }
  if (head === "gallery" && !second) {
    const albums = organisationAlbums(id).map(({ photos, ...a }) => ({ ...a, count: photos.length, when: (dbimDate(a.date) || undefined) }));
    return { title: "Gallery", body: albums.length ? <DbimAlbumGrid albums={albums} /> : <DbimEmptyState>No photographs have been published.</DbimEmptyState> };
  }
  if (head === "directory") {
    if (!second) return { title: "Directory", body: <DbimOrgDirectoryView offices={organisationDirectory(id)} /> };
    const p = officialProfile(second);
    return p && p.organisationId === id ? { title: p.name, body: <DbimOfficialProfileView p={p} /> } : undefined;
  }
  const page2 = organisationSubPage(id, sub.join("/"));
  return page2 ? { title: page2.title, body: <DbimOrgSubPageView page={page2} /> } : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params;
  const r = resolve(slug, sub, 1);
  const name = organisationName(slug);
  return { title: `${r ? `${r.title} | ` : ""}${name ?? "Our Organisation"} | Department of Social Justice and Empowerment` };
}

export default async function DbimOrganisationSubPage({ params, searchParams }: Props) {
  const { slug, sub } = await params;
  const name = organisationName(slug);
  const r = name ? resolve(slug, sub, Number((await searchParams).page) || 1) : undefined;
  if (!r || !name) notFound();
  const crumbs = [
    { label: "Ministry", path: "/ministry" },
    { label: "Our Organisation", path: "/ministry/our-organisation" },
    { label: name, path: `/ministry/our-organisation/${slug}` },
    ...(sub[0] === "directory" && sub[1] ? [{ label: "Directory", path: `/ministry/our-organisation/${slug}/directory` }] : []),
  ];
  return (
    <DbimPage title={r.title} crumbs={crumbs} path="/ministry/our-organisation" activeTab="/ministry/our-organisation" tabs={DBIM_MENU[0]!.children}>
      {r.body}
    </DbimPage>
  );
}
