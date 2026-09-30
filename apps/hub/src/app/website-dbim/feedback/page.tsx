import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimFeedbackForm } from "@/components/website-dbim/utility/FeedbackForm";
import "@/components/website-dbim/utility/utility.css";

export const metadata: Metadata = {
  title: "Feedback | Department of Social Justice and Empowerment",
  description: "Send the Department of Social Justice & Empowerment your suggestions about this website.",
};

export default function Page() {
  return (
    <DbimPage title="Feedback" crumbs={[{ label: "Feedback" }]} path="/feedback">
      <div className="db-u-fb">
        <div className="db-u-fb__card">
          <DbimFeedbackForm />
        </div>
      </div>
    </DbimPage>
  );
}
