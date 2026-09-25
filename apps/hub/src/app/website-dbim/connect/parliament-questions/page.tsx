import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimParliamentQuestions } from "@/components/website-dbim/connect/ParliamentQuestions";
import { DBIM_MENU } from "@/lib/website-dbim/nav";

export const metadata: Metadata = {
  title: "Parliament Questions | Department of Social Justice and Empowerment",
};

/** Connect › Parliament Questions — the question archives of both Houses. */
export default function Page() {
  return (
    <DbimPage title="Parliament Questions" crumbs={[{ label: "Connect", path: "/connect" }]} path="/connect/parliament-questions" tabs={DBIM_MENU[4]!.children}>
      <DbimParliamentQuestions />
    </DbimPage>
  );
}
