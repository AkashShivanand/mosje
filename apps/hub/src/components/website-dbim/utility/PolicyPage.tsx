import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DBIM_HEROES, DBIM_POLICY_TABS } from "@/lib/website-dbim/nav";
import { dbimPolicy } from "@/lib/website-dbim/utility";
import { DbimPolicyText } from "./RichText";
import "./utility.css";

export function policyMetadata(path: string): Metadata {
  const policy = dbimPolicy(path);
  return policy ? { title: `${policy.title} | Department of Social Justice and Empowerment`, description: policy.description } : {};
}

/**
 * A Website Policies tab: the policies banner, the five policy tabs, and the policy's
 * text full width with blue section headings (the reference's `.policyContent`).
 * The breadcrumb names the section (the reference's "Home / Policies"); the h1 names the tab.
 */
export function DbimPolicyPage({ path }: { path: string }) {
  const policy = dbimPolicy(path);
  if (!policy) notFound();
  return (
    <DbimPage
      title={policy.title}
      path={path}
      hero={DBIM_HEROES.policies}
      tabs={DBIM_POLICY_TABS}
      activeTab={path}
      crumbs={[{ label: "Website Policies", path: "/policies" }]}
    >
      <DbimPolicyText blocks={policy.blocks} />
    </DbimPage>
  );
}
