import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { VISITOR_ANALYTICS as V } from "@/lib/website/visitor-analytics";

export const metadata: Metadata = {
  title: "Visitor Analytics — Department of Social Justice & Empowerment",
  description: "Visitors to the website of the Department of Social Justice & Empowerment, by language and month.",
};

const fmt = (n: number) => n.toLocaleString("en-IN");
const asOf = new Date(V.asOf).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/*
 * Every figure comes from `VISITOR_ANALYTICS`, the mirror of
 * dosje.gov.in/visitor-analytics/ — the same object the footer's Total Visits
 * reads, so the two cannot disagree. The one provenance sentence below is the
 * whole-section mark `live-data-fallback.md` requires for mirrored figures.
 */
export default function VisitorAnalyticsPage() {
  return (
    <ContentPage
      title="Visitor Analytics"
      breadcrumb={[{ label: "Visitor Analytics" }]}
      description="Visitors to this website, by language and by month."
      lastUpdated="17 Sep 2026"
    >
      <p>Figures as published by the Department, as of {asOf}.</p>

      <h2>Visitors</h2>
      <table>
        <tbody>
          <tr>
            <th scope="row">Total Visitors</th>
            <td>{fmt(V.total)}</td>
          </tr>
          <tr>
            <th scope="row">Visitors (English Version)</th>
            <td>{fmt(V.english)}</td>
          </tr>
          <tr>
            <th scope="row">Visitors (Hindi Version)</th>
            <td>{fmt(V.hindi)}</td>
          </tr>
        </tbody>
      </table>

      <h2>Monthly Visitor Statistics</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">English</th>
            <th scope="col">Hindi</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {V.months.map((m) => (
            <tr key={m.month}>
              <th scope="row">{m.month}</th>
              <td>{fmt(m.english)}</td>
              <td>{fmt(m.hindi)}</td>
              <td>{fmt(m.english + m.hindi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ContentPage>
  );
}
