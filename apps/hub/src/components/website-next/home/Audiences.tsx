import Image from "next/image";
import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { PERSONAS, PERSONA_ART, PERSONA_ICON } from "@/lib/website-next/schemes";

/**
 * Persona entry (DBIM home-page component; issues NAV-05 and X-IA-07).
 *
 * Two questions, answered in order. "Which schemes are for me?" — the eleven
 * groups of the Department's mandate (8 Sep decision), each opening the scheme
 * finder filtered to it. "What is here for someone in my role?" — the four
 * DBIM personas the live site links to, including Student and Researcher,
 * which the classic home page left out.
 */
const ROLES = [
  { label: "Students", href: "/website/for-student", img: "/website/images/Student.png" },
  { label: "Beneficiaries", href: "/website/for-beneficiary", img: "/website/images/Beneficiary.png" },
  { label: "Researchers", href: "/website/for-researcher", img: "/website/images/Researcher.png" },
  { label: "Government Officials", href: "/website/for-government-official", img: "/website/images/Government-Official.png" },
] as const;

export function Audiences() {
  return (
    <section className="wn-home-band wn-home-band--tint" aria-labelledby="audiences-title">
      <div className="sa-container">
        <SectionTitle
          size="display"
          headingId="audiences-title"
          title="Find Schemes for You"
          description="Choose the group you belong to, and see the schemes of the Department for it."
        />
        <ul className="wn-home-groups">
          {PERSONAS.map((p) => {
            const art = PERSONA_ART[p.id];
            return (
              <li key={p.id}>
                <Link href={`/website/schemes-services?who=${p.id}`} className="wn-home-group">
                  <span className="wn-home-group__art" aria-hidden>
                    {art ? (
                      <Image src={art} alt="" width={88} height={88} />
                    ) : (
                      <Icon name={PERSONA_ICON[p.id] ?? "groups"} size={40} />
                    )}
                  </span>
                  <span className="wn-home-group__label">{p.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/website/schemes-services" className="wn-home-group wn-home-group--all">
              <span className="wn-home-group__art" aria-hidden>
                <Icon name="apps" size={40} />
              </span>
              <span className="wn-home-group__label">View All Schemes</span>
            </Link>
          </li>
        </ul>

        <section className="wn-home-roles" aria-labelledby="roles-title">
          <h3 id="roles-title" className="wn-home-roles__title">
            Information by Role
          </h3>
          <ul className="wn-home-roles__list">
            {ROLES.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="wn-home-role">
                  <span className="wn-home-role__art" aria-hidden>
                    <Image src={r.img} alt="" width={56} height={56} />
                  </span>
                  <span className="wn-home-role__label">For {r.label}</span>
                  <span className="wn-home-role__go" aria-hidden>
                    <Icon name="arrow_forward" size={20} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
