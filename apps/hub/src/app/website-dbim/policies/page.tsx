import type { Metadata } from "next";
import { DbimPolicyPage, policyMetadata } from "@/components/website-dbim/utility/PolicyPage";

export const metadata: Metadata = policyMetadata("/policies");

/** Website Policies — its first tab, Terms of Use. */
export default function Page() {
  return <DbimPolicyPage path="/policies" />;
}
