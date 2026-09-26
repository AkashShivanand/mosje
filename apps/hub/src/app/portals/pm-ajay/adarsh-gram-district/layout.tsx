import type { Metadata } from "next";
import { DistrictShell } from "@/components/pm-ajay/district/district-shell";

export const metadata: Metadata = {
  title: "Adarsh Gram — District · PM-AJAY",
  description:
    "District officer's workspace for the Adarsh Gram component of PM-AJAY — village formats, village development plans, works progress and declaration.",
};

export default function DistrictLayout({ children }: { children: React.ReactNode }) {
  return <DistrictShell>{children}</DistrictShell>;
}
