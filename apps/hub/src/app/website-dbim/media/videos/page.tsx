import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimVideoGrid } from "@/components/website-dbim/media/VideoGrid";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { dottedDate, getDbimVideos } from "@/lib/website-dbim/media";
import "@/components/website-dbim/media/media.css";
import "@/components/website-dbim/connect/connect.css";

export const metadata: Metadata = {
  title: "Videos | Department of Social Justice and Empowerment",
};

/** Media › Videos — every video in the gallery register, newest first. */
export default function DbimVideosPage() {
  const videos = getDbimVideos().map((v) => ({ ...v, when: dottedDate(v.date) }));
  return (
    <DbimPage title="Videos" crumbs={[{ label: "Media", path: "/media" }]} path="/media/videos" tabs={DBIM_MENU[3]!.children}>
      <DbimVideoGrid videos={videos} />
    </DbimPage>
  );
}
