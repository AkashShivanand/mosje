import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Official Language: Background";
const DESCRIPTION =
  "The Hindi unit's responsibility for the Official Language policy and the officers and employees who execute it in the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const related = (
  <nav className="wn-panel" aria-labelledby="related-title">
    <h2 className="wn-panel__title" id="related-title">
      Related Pages
    </h2>
    <ul>
      <li>
        <Link href="/website/official-language-act">The Official Languages Act, 1963</Link>
      </li>
      <li>
        <Link href="/website/activities-of-the-ministry-official-language">
          Official Language Activities of the Ministry
        </Link>
      </li>
    </ul>
  </nav>
);

/* Body text: dosje.gov.in/official-language-background/ as published, read 21 Sep 2026. No typos found to correct. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: "Official Language", href: "/website/official-language-act" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={related}
    >
      <h2>Background</h2>
      <p>
        Hindi unit is responsible for implementation of Official Language policy and the
        progressive use of Official Language Hindi in the Department of Social Justice and
        Empowerment and the Offices under its control. Equally important is the work of
        translation of documents related to the Department and the material related to
        Parliamentary Affairs and the addresses/speeches of the Ministers and Secretary.
      </p>
      <p>
        The Department of Social Justice and Empowerment has the following Officers and Employees
        to execute the jobs pertaining to the implementation of Official Language Policy:
      </p>
      <ul>
        <li>JS (Admn. &amp; Hindi)</li>
        <li>DD (OL) (One)</li>
        <li>AD (OL) (Two)</li>
        <li>Five Translators (3 Senior &amp; 2 Junior)</li>
      </ul>
    </ContentPage>
  );
}
