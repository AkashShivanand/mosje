import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimEvents } from "@/components/website-dbim/connect/Events";
import { DBIM_MENU } from "@/lib/website-dbim/nav";

export const metadata: Metadata = {
  title: "Events | Department of Social Justice and Empowerment",
};

/** Connect › Events — upcoming and past events, the past paged on the server (`?page=`). */
export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  return (
    <DbimPage title="Events" crumbs={[{ label: "Connect", path: "/connect" }]} path="/connect/events" tabs={DBIM_MENU[4]!.children}>
      <DbimEvents page={Number(page) || 1} />
    </DbimPage>
  );
}
