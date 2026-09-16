"use client";

import { BeneficiarySubset } from "@/components/smile-admin/data/beneficiary-subset";

export default function Page() {
  return (
    <BeneficiarySubset
      title="Under Mobilisation"
      subtitle="Beneficiaries identified in a survey and currently being mobilised."
      statuses={["UNDER_MOBILIZATION"]}
    />
  );
}
