"use client";

import { BeneficiarySubset } from "@/components/smile-admin/data/beneficiary-subset";

export default function Page() {
  return (
    <BeneficiarySubset
      title="Mobilised Beneficiaries"
      subtitle="Beneficiaries who have been moved from a survey location towards a Swashraya (Shelter Home)."
      statuses={["MOBILIZED"]}
    />
  );
}
