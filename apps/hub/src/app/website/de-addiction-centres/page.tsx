import type { Metadata } from "next";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { CentreLocator } from "@/components/website-next/maps/CentreLocator";

export const metadata: Metadata = {
  title: "Find a De-addiction Centre (Nasha Mukti Kendra) | Department of Social Justice & Empowerment",
  description:
    "Locate Nasha Mukti Kendras — de-addiction centres under the Nasha Mukt Bharat Abhiyaan — across India. Search by name, state, district or centre type, or use your location to find the nearest centre. No login required.",
};

export default function Page() {
  return (
    <PageLayout
        title="Find a De-addiction Centre Near You"
        breadcrumb={[
          { label: "Drug De-Addiction Division", href: "/website/drug-division" },
          { label: "De-addiction Centres" },
        ]}
        description="De-addiction centres supported by the Ministry under the Nasha Mukt Bharat Abhiyaan, by state, district and type of centre."
        lastUpdated="14 Jul 2026"
      >
      <div className="wn-section">
        <div className="sa-container">
          <CentreLocator headingLevel={2} />
        </div>
      </div>
    </PageLayout>
  );
}
