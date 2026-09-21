import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { Link } from "@mosje/design-system";
import {
  ngoEnforcementColumns,
  ngoEnforcementRows,
  NGO_ENFORCEMENT_REGISTER,
  BLACKLISTING_ORDERS,
} from "@/data/website";

export const metadata: Metadata = {
  title: "Grants Suspended List / Blacklisted NGOs | Department of Social Justice & Empowerment",
  description:
    "The Department's register of voluntary organisations that have been blacklisted, had grant-in-aid stopped, or are subject to recovery proceedings.",
};

export default function Page() {
  return (
    <ListingPage
      title="Grants Suspended List / Blacklisted NGOs"
      breadcrumb={[
        { label: "Grants-In-Aid To NGOs" },
        { label: "Grants Suspended List / Blacklisted NGOs" },
      ]}
      description="Voluntary organisations against which the Department has taken action — blacklisting, stoppage of grant-in-aid, or recovery of grants already released."
      lastUpdated="23 Aug 2026"
      intro={
        <>
          <p>
            An organisation on this list is not eligible for grant-in-aid from the
            Department. The wording in the <strong>Action Taken</strong> column is the
            Department&rsquo;s own and carries the order number under which the decision was
            made; a few entries record action taken by another Ministry. An organisation
            that has since been restored appears on the{" "}
            <a href="/website/list-of-de-blacklisted-ngos">List of De-Blacklisted NGOs</a>.
          </p>
          {BLACKLISTING_ORDERS.length > 0 && (
            <>
              <h2>Recent blacklisting orders</h2>
              <ul>
                {BLACKLISTING_ORDERS.map((order) => (
                  <li key={order.title}>
                    {order.fileUrl ? (
                      <Link href={order.fileUrl} external>
                        {order.title}
                      </Link>
                    ) : (
                      order.title
                    )}{" "}
                    — {order.date} ({order.fileSize})
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      }
      columns={ngoEnforcementColumns}
      rows={ngoEnforcementRows(NGO_ENFORCEMENT_REGISTER)}
      searchKeys={["name", "action"]}
      searchPlaceholder="Search by organisation name…"
      pageSize={25}
    />
  );
}
