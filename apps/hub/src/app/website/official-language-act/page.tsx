import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "The Official Languages Act, 1963";
const DESCRIPTION =
  "The Official Languages Act, 1963 (as amended, 1967), which provides for the languages that may be used for the official purposes of the Union.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * Body text: dosje.gov.in/official-language-act/ as published, read 21 Sep 2026.
 * The live page publishes the Act's Preamble and Sections 2–9 only (it does not
 * carry Section 1, or the provisos and sub-sections (2)–(5) of Section 3) — that
 * abridgement is the Department's own and is kept as published.
 *
 * Typos corrected, each checked against the Ministry of Home Affairs, Department
 * of Official Language's own text of the Act
 * (rajbhasha.gov.in/sites/default/files/olact1963eng.pdf, consulted 21 Sep 2026):
 *  - Section 2(a): "26th day of January, 1995" -> "1965" (register issue CON-03;
 *    the gazetted Act, and the Act's own Section 1(2), fix the appointed day for
 *    Section 3 as 26 January 1965) — also "Appoint day" -> "appointed day".
 *  - Section 3: "fifteen ears" -> "fifteen years" (CON-03).
 *  - Preamble and Section 3(a): "official purpose"/"certain purpose" -> plural
 *    "purposes", matching the Act throughout.
 *  - Section 4(2): "ad ten" -> "and ten"; "council of States" -> "Council of
 *    States" (capitalised elsewhere in the same clause).
 *  - Section 5(1)(b): stray full stop "Central Act. shall" -> "Central Act,
 *    shall".
 *  - Section 5(2): "as may by prescribed" -> "as may be prescribed" (CON-03).
 *  - Section 6: "thereof I the English language" -> "thereof in the English
 *    language"; missing article "in Official Gazette" -> "in the Official
 *    Gazette"; "authoritative text therefore" -> "authoritative text thereof"
 *    (wrong word — the Act says "thereof", not "therefore").
 *  - Section 7: "authorised the use of Hindi" -> "authorise the use of Hindi"
 *    (the modal "may" takes the base verb); "for the purpose of any judgment"
 *    -> "for the purposes of any judgment"; "High court" -> "High Court".
 *  - Section 8(2): "as soon as my be" -> "as soon as may be"; stray "shall" in
 *    "in the rule shall or both Houses" removed, matching the Act's "in the
 *    rule or both Houses"; "not b made" -> "not be made".
 *  - Section 9: "The provision of section 6" -> "The provisions of section 6".
 * Clause lists ("(a)", "(b)…") and sub-section lists ("(1)", "(2)…") set as
 * <ol> per the site's list rule; letter clauses use type="a" since they are
 * cross-referenced elsewhere in the Act (e.g. "clause (3) of article 348").
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Preamble</h2>
      <p>
        An Act to provide for the languages which may be used for the official purposes of the
        Union, for transaction of business in Parliament, for Central and State Acts and for
        certain purposes in High Courts. Be it enacted by Parliament in the Fourteenth Year of
        the Republic of India as follows:—
      </p>

      <h2>Section 2: Definitions</h2>
      <p>In this Act, unless the context otherwise requires,—</p>
      <ol type="a">
        <li>
          &ldquo;appointed day&rdquo;, in relation to section 3, means the 26th day of January,
          1965 and in relation to any other provision of this Act, means the day on which that
          provision comes into force;
        </li>
        <li>&ldquo;Hindi&rdquo; means Hindi in Devanagari script.</li>
      </ol>

      <h2>Section 3: Continuance of English Language for Official Purposes of the Union and for Use in Parliament</h2>
      <p>
        Notwithstanding the expiration of the period of fifteen years from the commencement of
        the Constitution, the English language may, as from the appointed day, continue to be
        used, in addition to Hindi,—
      </p>
      <ol type="a">
        <li>
          for all the official purposes of the Union for which it was being used immediately
          before that day; and
        </li>
        <li>for the transaction of business in Parliament.</li>
      </ol>

      <h2>Section 4: Committee on Official Language</h2>
      <ol>
        <li>
          After the expiration of ten years from the date on which section 3 comes into force,
          there shall be constituted a Committee on Official Language, on a resolution to that
          effect being moved in either House of Parliament with the previous sanction of the
          President and passed by both Houses.
        </li>
        <li>
          The Committee shall consist of thirty members, of whom twenty shall be members of the
          House of the People and ten shall be members of the Council of States, to be elected
          respectively by the members of the House of the People and the members of the Council
          of States in accordance with the system of proportional representation by means of the
          single transferable vote.
        </li>
        <li>
          It shall be the duty of the Committee to review the progress made in the use of Hindi
          for the official purposes of the Union and submit a report to the President making
          recommendations thereon and the President shall cause the report to be laid before
          each House of Parliament, and sent to all the State Governments.
        </li>
        <li>
          The President may, after consideration of the report referred to in sub-section (3),
          and the views, if any, expressed by the State Governments thereon, issue directions in
          accordance with the whole or any part of that report.
        </li>
      </ol>

      <h2>Section 5: Authorised Hindi Translation of Central Acts, Etc.</h2>
      <ol>
        <li>
          A translation in Hindi published under the authority of the President in the Official
          Gazette on and after the appointed day
          <ol type="a">
            <li>of any Central Act or of any Ordinance promulgated by the President, or</li>
            <li>
              of any order, rule, regulation or bye-law issued under the Constitution or under
              any Central Act, shall be deemed to be the authoritative text thereof in Hindi.
            </li>
          </ol>
        </li>
        <li>
          As from the appointed day, the authoritative text in the English language of all Bills
          to be introduced or amendments thereto to be moved in either House of Parliament shall
          be accompanied by a translation of the same in Hindi authorised in such manner as may
          be prescribed by rules made under this Act.
        </li>
      </ol>

      <h2>Section 6: Authorised Hindi Translation of State Acts in Certain Cases</h2>
      <p>
        Where the Legislature of a State has prescribed any language other than Hindi for use in
        Acts passed by the Legislature of the State or in Ordinances promulgated by the Governor
        of the State, a translation of the same in Hindi, in addition to a translation thereof in
        the English language as required by clause (3) of article 348 of the Constitution, may be
        published on or after the appointed day under the authority of the Governor of the State
        in the Official Gazette of that State and in such a case, the translation in Hindi of any
        such Act or Ordinance shall be deemed to be the authoritative text thereof in the Hindi
        language.
      </p>

      <h2>Section 7: Optional Use of Hindi or Other Official Language in Judgments, Etc., of High Courts</h2>
      <p>
        As from the appointed day or any day thereafter, the Governor of a State may, with the
        previous consent of the President, authorise the use of Hindi or the official language of
        the State, in addition to the English language, for the purposes of any judgment, decree
        or order passed or made by the High Court for that State and where any judgment, decree
        or order is passed or made in any such language (other than the English language), it
        shall be accompanied by a translation of the same in the English language issued under
        the authority of the High Court.
      </p>

      <h2>Section 8: Power to Make Rules</h2>
      <ol>
        <li>
          The Central Government may, by notification in the Official Gazette, make rules for
          carrying out the purposes of this Act.
        </li>
        <li>
          Every rule made under this section shall be laid, as soon as may be after it is made,
          before each House of Parliament while it is in session for a total period of thirty
          days which may be comprised in one session or in two successive sessions, and if before
          the expiry of the session in which it is so laid or the session immediately following,
          both Houses agree in making any modification in the rule or both Houses agree that the
          rule should not be made, the rule shall thereafter have effect only in such modified
          form or be of no effect, as the case may be, so however, that any such modification or
          annulment shall be without prejudice to the validity of anything previously done under
          that rule.
        </li>
      </ol>

      <h2>Section 9: Certain Provisions Not to Apply to Jammu and Kashmir</h2>
      <p>The provisions of section 6 and section 7 shall not apply to the State of Jammu and Kashmir.</p>
    </ContentPage>
  );
}
