import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimDirectory } from "@/components/website-dbim/connect/Directory";
import { DBIM_MENU } from "@/lib/website-dbim/nav";

export const metadata: Metadata = {
  title: "Directory | Department of Social Justice and Empowerment",
  description: "Telephone directory of the Department of Social Justice and Empowerment.",
};

/** Ministry › Directory — the same list as Connect › Directory, as the reference serves it at both addresses. */
export default function DbimMinistryDirectoryPage() {
  return (
    <DbimPage title="Directory" crumbs={[{ label: "Ministry", path: "/ministry" }]} path="/ministry/directory" tabs={DBIM_MENU[0]!.children}>
      <DbimDirectory />
    </DbimPage>
  );
}
