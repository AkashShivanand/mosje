import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimDetailLayout } from "@/components/website-dbim/ministry/DetailLayout";
import { DbimAboutBody } from "@/components/website-dbim/ministry/AboutBody";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { DBIM_ABOUT } from "@/lib/website-dbim/ministry";

export const metadata: Metadata = {
  title: "About Us | Department of Social Justice and Empowerment",
  description: DBIM_ABOUT.summary,
};

/** Ministry › About Us — the reference's `/ministry` (spec §1). */
export default function DbimAboutPage() {
  return (
    <DbimPage title="About Us" crumbs={[{ label: "Ministry", path: "/ministry" }]} path="/ministry" tabs={DBIM_MENU[0]!.children}>
      <DbimDetailLayout summary={DBIM_ABOUT.summary}>
        <DbimAboutBody />
      </DbimDetailLayout>
    </DbimPage>
  );
}
