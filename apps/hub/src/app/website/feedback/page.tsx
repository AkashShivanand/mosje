import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { FeedbackForm } from "@/components/website-next/templates/FeedbackForm";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/people.css";

const TITLE = "Feedback";
const DESCRIPTION =
  "Report a problem with this website, or suggest how it could be improved, to the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/feedback" }),
};

/**
 * The Feedback page GIGW asks every government website to publish (issue
 * X-GIGW-03; dosje.gov.in/feedback/ returns 404). The footer's "Feedback" link and
 * its "Report a problem with this page" link (MAN-11, `?page=<path>`) both land here.
 *
 * The form is `FeedbackForm`. This prototype has no backend, so a valid submit shows
 * the confirmation and sends nothing — see the note in that component.
 */
export default function FeedbackPage() {
  return (
    <PageLayout title={TITLE} breadcrumb={[{ label: "Connect" }, { label: TITLE }]} description={DESCRIPTION}>
      <div className="wn-section wn-section--tight">
        <div className="sa-container wn-split">
          <div className="wn-fb min-w-0">
            <p className="wn-fb__intro">
              Every field is required unless it is marked optional.
            </p>
            <FeedbackForm />
          </div>
          <aside className="wn-aside" aria-label="Other ways to reach the Department">
            <div className="wn-panel">
              <h2 className="wn-panel__title">A Grievance About a Scheme</h2>
              <p className="wn-fb__panel-text">
                Grievances are registered and tracked on the Centralised Public Grievance Redress and Monitoring System.
              </p>
              <ul>
                <li>
                  <a href="https://pgportal.gov.in/" target="_blank" rel="noopener noreferrer">
                    File a Grievance on CPGRAMS
                    <Icon name="open_in_new" size={16} aria-hidden />
                    <span className="sr-only">(opens in a new window)</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="wn-panel">
              <h2 className="wn-panel__title">Other Ways to Reach the Department</h2>
              <ul>
                <li>
                  <Link href="/website/contact-us">Contact Us</Link>
                </li>
                <li>
                  <Link href="/website/whos-who">Who&apos;s Who</Link>
                </li>
                <li>
                  <Link href="/website/rti">Right to Information</Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
