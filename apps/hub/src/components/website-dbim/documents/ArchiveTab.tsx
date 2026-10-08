/*
 * One Archives tab. The reference addresses these as /archives?page=<kind>; here
 * each is a static route so the tab bar is plain links with aria-current.
 */
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { archiveRows, DBIM_ARCHIVE_TABS, type DbimArchiveKind } from "@/lib/website-dbim/documents";
import { DbimFileList } from "./DbimFileList";

export function ArchiveTab({ kind }: { kind: DbimArchiveKind }) {
  const tab = DBIM_ARCHIVE_TABS.find((t) => t.key === kind);
  if (!tab) return null;
  return (
    <DbimPage
      title={tab.label}
      crumbs={[{ label: "Archives", path: "/archives" }]}
      path={tab.path}
      heroHeight={250}
      tabs={DBIM_ARCHIVE_TABS}
      activeTab={tab.path}
    >
      <DbimFileList rows={archiveRows(kind)} label={`Archived ${tab.label}`} archive />
    </DbimPage>
  );
}
