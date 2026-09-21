import Image from "next/image";
import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { PERSONAS, PERSONA_ART, PERSONA_ICON } from "@/lib/website-next/schemes";

/**
 * Persona entry (DBIM home-page component; issues NAV-05 and X-IA-07).
 *
 * The classic site showed two of four personas in a carousel, linking to
 * unfiltered lists. Here are all eleven groups from the Department's mandate
 * (the 8 Sep review's single vocabulary), each opening the scheme finder
 * already filtered to it. The sequence opens on Students, drawn as a young
 * woman (8 Sep decision). No counts on this screen (8 Sep decision).
 */
export function Audiences() {
  return (
    <section className="wn-section" aria-labelledby="audiences-title">
      <div className="sa-container">
        <SectionTitle
          headingId="audiences-title"
          title="Find Schemes for You"
          description="Choose the group that describes you to see the schemes that name it."
        />
        <ul className="wn-audiences">
          {PERSONAS.map((p) => {
            const art = PERSONA_ART[p.id];
            return (
              <li key={p.id}>
                <Link href={`/website/schemes-services?who=${p.id}`} className="wn-audience">
                  <span className="wn-audience__mark" aria-hidden>
                    {art ? (
                      <Image src={art} alt="" width={64} height={64} />
                    ) : (
                      <Icon name={PERSONA_ICON[p.id] ?? "groups"} size={32} />
                    )}
                  </span>
                  <span className="wn-audience__label">{p.label}</span>
                  <span className="wn-audience__go" aria-hidden>
                    <Icon name="chevron_right" size={20} />
                  </span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/website/schemes-services" className="wn-audience wn-audience--all">
              <span className="wn-audience__mark" aria-hidden>
                <Icon name="apps" size={32} />
              </span>
              <span className="wn-audience__label">View All Schemes</span>
              <span className="wn-audience__go" aria-hidden>
                    <Icon name="chevron_right" size={20} />
                  </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
