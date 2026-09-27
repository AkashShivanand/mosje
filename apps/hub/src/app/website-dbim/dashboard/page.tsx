import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DashboardGlance } from "@/components/website-next/media/DashboardGlance";
import { AdarshGramDashboard } from "@/components/website/AdarshGramDashboard";
import { GiaDashboard } from "@/components/website/GiaDashboard";
import { HostelDashboard } from "@/components/website/HostelDashboard";
import { getAdarshGramCounts } from "@/lib/website/adarsh-gram-api";
import { getGiaData, getGiaGender, getHostelData } from "@/lib/website/pmajay-api";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import "@/components/website-dbim/dashboard/dashboard.css";

export const metadata: Metadata = {
  title: "PM-AJAY Dashboard | Department of Social Justice and Empowerment",
  description:
    "Progress of the Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY), as reported by the scheme's Management Information System.",
};

/**
 * The PM-AJAY dashboard, opened from the PM-AJAY tile on Ministry › Our Performance.
 * The reference build has a /dashboard route with nothing on it; this is the
 * Department's own dashboard in its place.
 *
 * SAME DATA, SAME COMPONENTS as the 2026 design's `/website/dashboard`
 * (`app/website/dashboard/page.tsx`): the three PM-AJAY feeds, live where they answer
 * and from the committed, dated snapshot where they do not, drawn by the components
 * that carry the merge, the provenance chips, the per-card states and the retry. Only
 * the frame is DBIM's — the banner, the Ministry sub-tabs, and a DBIM-scoped
 * stylesheet for the At a Glance strip (whose own rules are scoped to the 2026 design).
 *
 * Fetched on the server, each with a short timeout and an hourly revalidate; a feed
 * that is down degrades to its snapshot, never to an error boundary.
 */
export default async function DbimDashboardPage() {
  const [adarshGram, gia, hostel] = await Promise.all([getAdarshGramCounts(), getGiaData(), getHostelData()]);
  // The same total the 2026 design passes, so the illustrative gender split is scaled to the figure on screen.
  const giaGender = await getGiaGender(gia.years.reduce((t, y) => t + (y.approvals.total ?? y.mock.totalApproved), 0));

  return (
    <DbimPage
      title="PM-AJAY Dashboard"
      crumbs={[
        { label: "Ministry", path: "/ministry" },
        { label: "Our Performance", path: "/ministry/our-performance" },
      ]}
      path="/ministry/our-performance"
      tabs={DBIM_MENU[0]!.children}
    >
      <div className="db-dash">
        <section className="db-dash__section" aria-labelledby="db-dash-glance">
          {/* The section dashboards' own heading style, so the four headings on the page read as one set. */}
          <h2 id="db-dash-glance" className="sd-dash__title">
            At a Glance
          </h2>
          <DashboardGlance adarshGram={adarshGram} gia={gia} hostel={hostel} />
        </section>
        <div className="db-dash__section">
          <AdarshGramDashboard feed={adarshGram} />
        </div>
        <div className="db-dash__section">
          <GiaDashboard data={gia} gender={giaGender} />
        </div>
        <div className="db-dash__section">
          <HostelDashboard data={hostel} />
        </div>
      </div>
    </DbimPage>
  );
}
