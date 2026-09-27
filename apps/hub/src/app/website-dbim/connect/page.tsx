import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimContactUs } from "@/components/website-dbim/connect/ContactUs";
import { DBIM_MENU } from "@/lib/website-dbim/nav";

export const metadata: Metadata = {
  title: "Contact Us | Department of Social Justice and Empowerment",
};

/** Connect › Contact Us — the Department's address and a map. */
export default function Page() {
  return (
    <DbimPage title="Contact Us" crumbs={[{ label: "Connect", path: "/connect" }]} path="/connect" tabs={DBIM_MENU[4]!.children}>
      <DbimContactUs />
    </DbimPage>
  );
}
