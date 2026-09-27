import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimRti } from "@/components/website-dbim/connect/Rti";
import { DBIM_MENU } from "@/lib/website-dbim/nav";

export const metadata: Metadata = {
  title: "RTI | Department of Social Justice and Empowerment",
};

/** Connect › RTI — the Right to Information Act, where to apply, and the CPIO and FAA registers. */
export default function Page() {
  return (
    <DbimPage title="RTI" crumbs={[{ label: "Connect", path: "/connect" }]} path="/connect/rti" tabs={DBIM_MENU[4]!.children}>
      <DbimRti />
    </DbimPage>
  );
}
