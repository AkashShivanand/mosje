import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimCookieSettings } from "@/components/website-dbim/utility/CookieSettings";
import { DBIM_HEROES } from "@/lib/website-dbim/nav";
import "@/components/website-dbim/utility/utility.css";

export const metadata: Metadata = {
  title: "Cookie Policy | Department of Social Justice and Empowerment",
  description: "What this website stores in your browser, why, and for how long.",
};

export default function Page() {
  return (
    <DbimPage spacing="flush" title="Cookie Policy" crumbs={[{ label: "Cookie Policy" }]} path="/cookies" hero={DBIM_HEROES.help}>
      <div className="db-u-flush">
        <DbimCookieSettings />
      </div>
    </DbimPage>
  );
}
