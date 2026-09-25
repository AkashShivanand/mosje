import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimGrievance } from "@/components/website-dbim/connect/Grievance";
import { DBIM_MENU } from "@/lib/website-dbim/nav";

export const metadata: Metadata = {
  title: "Grievance Redressal | Department of Social Justice and Empowerment",
};

/** Connect › Grievance Redressal — CPGRAMS, and the link to lodge a grievance. */
export default function Page() {
  return (
    <DbimPage title="Grievance Redressal" crumbs={[{ label: "Connect", path: "/connect" }]} path="/connect/grievance-redressal" tabs={DBIM_MENU[4]!.children}>
      <DbimGrievance />
    </DbimPage>
  );
}
