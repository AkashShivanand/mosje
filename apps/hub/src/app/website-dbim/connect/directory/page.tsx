import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimDirectory } from "@/components/website-dbim/connect/Directory";
import { DBIM_MENU } from "@/lib/website-dbim/nav";

export const metadata: Metadata = {
  title: "Directory | Department of Social Justice and Empowerment",
};

/** Connect › Directory — the Department's telephone directory. */
export default function DbimConnectDirectoryPage() {
  return (
    <DbimPage title="Directory" crumbs={[{ label: "Connect", path: "/connect" }]} path="/connect/directory" tabs={DBIM_MENU[4]!.children}>
      <DbimDirectory />
    </DbimPage>
  );
}
