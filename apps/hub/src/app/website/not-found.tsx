import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { DeadEnd } from "@/components/website-next/search/DeadEnd";

export const metadata: Metadata = {
  title: "Page Not Found | Department of Social Justice & Empowerment",
  robots: { index: false, follow: true },
};

/**
 * The website's 404 (issues NAV-09, X-IA-10). Served with a real 404 status by
 * `notFound()` and by unmatched routes under `/website` — never the classic
 * site's soft 404 (HTTP 200). No status code is printed: the reader needs the
 * way forward, not the number.
 */
export default function WebsiteNotFound() {
  return (
    <PageLayout
      title="Page Not Found"
      breadcrumb={[{ label: "Page Not Found" }]}
      description="The page you asked for is not on this website. It may have been moved, renamed or removed."
    >
      <DeadEnd
        actions={
          <Link href="/website" className={buttonClasses("primary", "filled", "md")}>
            Go to the Home Page
          </Link>
        }
      />
    </PageLayout>
  );
}
