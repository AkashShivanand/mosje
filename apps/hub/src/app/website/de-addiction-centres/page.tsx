import type { Metadata } from "next";
import { PageHero } from "@/components/website/layout/PageHero";
import { DeAddictionMap } from "@/components/website/nmba/DeAddictionMap";

export const metadata: Metadata = {
  title: "Find a De-addiction Centre (Nasha Mukti Kendra) | Department of Social Justice & Empowerment",
  description:
    "Locate Nasha Mukti Kendras — de-addiction centres under the Nasha Mukt Bharat Abhiyaan — across India. Search by name, state, district or centre type, or use your location to find the nearest centre. No login required.",
};

export default function Page() {
  return (
    <>
      <PageHero
        title="Find a De-addiction Centre near you"
        breadcrumb={[
          { label: "Drug De-Addiction Division", href: "/website/drug-division" },
          { label: "De-addiction Centres" },
        ]}
        description="Locate a Nasha Mukti Kendra across India — search by name, state, district or centre type, or use your location to find the nearest one. No login required."
        lastUpdated="14 Jul 2026"
      />
      <section className="mx-auto max-w-[1280px] px-4 py-8 md:py-10">
        <DeAddictionMap />
      </section>
    </>
  );
}
