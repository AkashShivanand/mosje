"use client";

import { BeneficiarySubset } from "@/components/smile-admin/data/beneficiary-subset";

export default function Page() {
  return (
    <BeneficiarySubset
      title="Beneficiaries in a Shelter Home"
      subtitle="Beneficiaries assigned to a Swashraya (Shelter Home), and those who have completed rehabilitation from one."
      statuses={["SHELTER_ASSIGNED", "REHABILITATED"]}
      withShelter
    />
  );
}
