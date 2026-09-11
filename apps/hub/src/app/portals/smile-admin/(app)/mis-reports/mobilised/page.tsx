"use client";

import { MisReportPage } from "@/components/smile-admin/data/mis-report-page";
import { misReport } from "@/lib/smile-admin/mis-reports";

// "use client" like every other data screen in this portal: the fixtures throw
// if they are pulled into a production server build, and a server component
// here is what reaches them during `next build`.
export default function Page() {
  const report = misReport("mobilised")!;
  return <MisReportPage report={report} />;
}
