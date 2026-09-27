/*
 * One Archives tab. The reference addresses these as /archives?page=<kind>; here
 * each is a static route so the tab bar is plain links with aria-current.
 */
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DBIM_HEROES } from "@/lib/website-dbim/nav";
import { archiveRows, DBIM_ARCHIVE_TABS, type DbimArchiveKind } from "@/lib/website-dbim/documents";
import { DbimFileList } from "./DbimFileList";

export function ArchiveTab({ kind }: { kind: DbimArchiveKind }) {
  const tab = DBIM_ARCHIVE_TABS.find((t) => t.key === kind);
  if (!tab) return null;
  const notice = kind === "tenders" || kind === "vacancies";
  return (
    <DbimPage
      title={tab.label}
      crumbs={[{ label: "Archives", path: "/archives" }]}
      path={tab.path}
      hero={DBIM_HEROES.default}
      heroHeight={250}
      tabs={DBIM_ARCHIVE_TABS}
      activeTab={tab.path}
    >
      <DbimFileList rows={archiveRows(kind)} label={`Archived ${tab.label}`} archive dateSep={notice ? "." : "/"} />
    </DbimPage>
  );
}
