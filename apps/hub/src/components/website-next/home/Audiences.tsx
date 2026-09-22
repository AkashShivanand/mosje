import { T } from "@/components/i18n/translation-provider";
import Image from "next/image";
import Link from "next/link";
import { ActionTile, Band, Icon, SectionTitle } from "@mosje/design-system";
import {
  PERSONAS,
  PERSONA_ART,
  PERSONA_ICON,
} from "@/lib/website-next/schemes";

/**
 * Persona entry (DBIM home-page component; issues NAV-05 and X-IA-07).
 *
 * Two questions, answered in order. "Which schemes are for me?" — the eleven
 * groups of the Department's mandate (8 Sep decision), each opening the scheme
 * finder filtered to it. "What is here for someone in my role?" — the four
 * DBIM personas the live site links to (DBIM §A.4.1 ix).
 */
const ROLES = [
  {
    label: "Students",
    href: "/website/for-student",
    img: "/website/images/Student.png",
  },
  {
    label: "Beneficiaries",
    href: "/website/for-beneficiary",
    img: "/website/images/Beneficiary.png",
  },
  {
    label: "Researchers",
    href: "/website/for-researcher",
    img: "/website/images/Researcher.png",
  },
  {
    label: "Government Officials",
    href: "/website/for-government-official",
    img: "/website/images/Government-Official.png",
  },
] as const;

export function Audiences() {
  return (
    <Band
      as="section"
      tone="brand"
      spacing="xl"
      aria-labelledby="audiences-title"
    >
      <SectionTitle
        size="display"
        headingId="audiences-title"
        title={<T>Find Schemes for You</T>}
        description={
          <T>
            Choose the group you belong to, and see the schemes of the
            Department for it.
          </T>
        }
      />
      <ul className="wn-home-groups">
        {PERSONAS.map((p) => {
          const art = PERSONA_ART[p.id];
          return (
            <li key={p.id}>
              <ActionTile
                linkAs={Link}
                href={`/website/schemes-services?who=${p.id}`}
                layout="stack"
                mediaSize={88}
                title={<T>{p.label}</T>}
                media={
                  art ? (
                    <Image src={art} alt="" width={88} height={88} />
                  ) : (
                    <Icon name={PERSONA_ICON[p.id] ?? "groups"} size={40} />
                  )
                }
              />
            </li>
          );
        })}
        <li>
          <ActionTile
            linkAs={Link}
            href="/website/schemes-services"
            layout="stack"
            mediaSize={88}
            tone="solid"
            title={<T>View All Schemes</T>}
            media={<Icon name="apps" size={40} />}
          />
        </li>
      </ul>

      <section className="wn-home-roles" aria-labelledby="roles-title">
        <h3 id="roles-title" className="wn-home-roles__title">
          <T>Information by Role</T>
        </h3>
        <ul className="wn-home-roles__list">
          {ROLES.map((r) => (
            <li key={r.href}>
              <ActionTile
                linkAs={Link}
                href={r.href}
                shape="pill"
                tone="solid"
                mediaSize={48}
                title={<T>{`For ${r.label}`}</T>}
                media={<Image src={r.img} alt="" width={48} height={48} />}
              />
            </li>
          ))}
        </ul>
      </section>
    </Band>
  );
}
