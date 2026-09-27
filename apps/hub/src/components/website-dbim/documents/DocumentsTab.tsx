/*
 * One Documents tab (Reports · Orders and Notices · Publications): the banner and
 * sub-tabs, the tab's folders, and "View Archive" into the same tab's archive.
 */
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DBIM_MENU, dbimHref } from "@/lib/website-dbim/nav";
import { documentSeries, docTab, type DbimDocTab } from "@/lib/website-dbim/documents";
import { SeriesList } from "./SeriesList";
import "./documents.css";

export function DocumentsTab({ tab }: { tab: DbimDocTab }) {
  const t = docTab(tab);
  if (!t) return null;
  const archivePath = tab === "reports" ? "/archives/reports" : `/archives/${tab}`;
  return (
    <DbimPage
      title={t.label}
      crumbs={[{ label: "Documents", path: "/documents" }]}
      path={t.path}
      tabs={DBIM_MENU.find((m) => m.path === "/documents")?.children}
      activeTab={t.path}
    >
      <SeriesList series={documentSeries(tab)} label={t.label} />
      <div className="db-doc__archive-row">
        <Link className="db-doc__archive" href={dbimHref(archivePath)} aria-label={`View archive of ${t.label}`}>
          <Icon name="archive" size={24} weight={400} />
          View Archive
        </Link>
      </div>
    </DbimPage>
  );
}
