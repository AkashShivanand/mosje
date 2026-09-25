import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";

export const metadata: Metadata = {
  title: "Page Not Found | Department of Social Justice and Empowerment",
  robots: { index: false, follow: true },
};

/** The DBIM design's 404. A real 404 status; no code printed — the reader needs the way forward. */
export default function DbimNotFound() {
  // path "/" keeps no menu entry active on a page that does not exist.
  return (
    <DbimPage title="Page Not Found" crumbs={[]} path="/404">
      <DbimEmptyState>The page you asked for is not on this website. It may have been moved, renamed or removed.</DbimEmptyState>
    </DbimPage>
  );
}
