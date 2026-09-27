import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimAlbumPhotos } from "@/components/website-dbim/media/AlbumPhotos";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { dottedDate, getDbimAlbum } from "@/lib/website-dbim/media";
import "@/components/website-dbim/media/media.css";

type Params = { params: Promise<{ slug: string }> };

/* Rendered on first visit, not at build — the estate's rule for its 590 gallery records
   (see app/website/gallery/[slug]/page.tsx). */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const album = getDbimAlbum((await params).slug);
  return { title: `${album?.title ?? "Album Not Found"} | Department of Social Justice and Empowerment` };
}

/** Media › Photos › one album: its photographs, each opening the lightbox. */
export default async function DbimAlbumPage({ params }: Params) {
  const album = getDbimAlbum((await params).slug);
  if (!album) notFound();
  const n = album.photos.length;
  return (
    <DbimPage
      title={album.title}
      crumbs={[{ label: "Media", path: "/media" }, { label: "Photos", path: "/media" }]}
      path="/media"
      activeTab="/media"
      tabs={DBIM_MENU[3]!.children}
    >
      <p className="db-album-meta">
        {[dottedDate(album.date), album.category, `${n} ${n === 1 ? "Item" : "Items"}`].filter(Boolean).join(" · ")}
      </p>
      <DbimAlbumPhotos photos={album.photos} />
    </DbimPage>
  );
}
