import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimFeedbackForm } from "@/components/website-dbim/utility/FeedbackForm";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import "@/components/website-dbim/utility/utility.css";

export const metadata: Metadata = {
  title: "Feedback | Department of Social Justice and Empowerment",
  description: "Send the Department of Social Justice & Empowerment your suggestions about this website.",
};

export default function Page() {
  return (
    <DbimPage title="Feedback" crumbs={[{ label: "Feedback" }]} path="/feedback" hero={DBIM_MENU[0]!.hero}>
      <div className="db-u-fb">
        <div className="db-u-fb__card">
          <DbimFeedbackForm />
        </div>
      </div>
    </DbimPage>
  );
}
