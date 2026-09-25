import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimAlbumGrid } from "@/components/website-dbim/media/AlbumGrid";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { dottedDate, getDbimAlbums } from "@/lib/website-dbim/media";
import "@/components/website-dbim/media/media.css";
import "@/components/website-dbim/connect/connect.css";

export const metadata: Metadata = {
  title: "Photos | Department of Social Justice and Empowerment",
};

/** Media › Photos — the gallery register's photo albums, newest first. */
export default function DbimPhotosPage() {
  // The photographs themselves stay on the server; a card needs only its cover and count.
  const albums = getDbimAlbums().map(({ photos, ...a }) => ({ ...a, count: photos.length, when: dottedDate(a.date) }));
  return (
    <DbimPage title="Photos" crumbs={[{ label: "Media", path: "/media" }]} path="/media" tabs={DBIM_MENU[3]!.children}>
      <DbimAlbumGrid albums={albums} />
    </DbimPage>
  );
}
