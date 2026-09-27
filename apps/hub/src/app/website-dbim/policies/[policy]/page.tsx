import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPolicyPage, policyMetadata } from "@/components/website-dbim/utility/PolicyPage";
import { DBIM_POLICIES, dbimPolicy } from "@/lib/website-dbim/utility";

interface Props {
  params: Promise<{ policy: string }>;
}

/** Every policy tab except the first, which is /policies itself. */
export function generateStaticParams() {
  return DBIM_POLICIES.filter((p) => p.path !== "/policies").map((p) => ({ policy: p.path.split("/").pop() ?? "" }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { policy } = await params;
  return policyMetadata(`/policies/${policy}`);
}

export default async function Page({ params }: Props) {
  const { policy } = await params;
  const path = `/policies/${policy}`;
  if (!dbimPolicy(path) || path === "/policies") notFound();
  return <DbimPolicyPage path={path} />;
}
