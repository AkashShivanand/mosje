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
 * "Which schemes are for me?" — the eleven groups of the Department's mandate
 * (8 Sep decision), each opening the scheme finder filtered to it.
 *
 * The second question this section used to answer — "what is here for someone
 * in my role?" — left on 24 Sep 2026 for the panel beside Recent Documents,
 * where the design puts it. Four job titles at the foot of a section a reader
 * had already answered were four more choices with nothing explaining them.
 */
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
    </Band>
  );
}
