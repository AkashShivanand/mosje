import { T } from "@/components/i18n/translation-provider";
import {
  ActionTile,
  Band,
  BrandGlyph,
  SectionTitle,
} from "@mosje/design-system";
import { SOCIAL } from "./facts";

/**
 * Social media (DBIM home-page component). The classic home page drew posts
 * with like and share counts that no feed on this site supplies; here each
 * official account is a tile that opens it. When a live feed is connected,
 * its posts belong here; until then nothing is shown that the Department did
 * not publish.
 */
export function Social() {
  return (
    <Band
      as="section"
      tone="default"
      spacing="xl"
      aria-labelledby="social-title"
    >
      <SectionTitle
        size="display"
        headingId="social-title"
        title={<T>Follow the Department</T>}
        description={
          <T>
            Official accounts of the Department of Social Justice & Empowerment.
          </T>
        }
      />
      <ul className="wn-home-social">
        {SOCIAL.map((s) => (
          <li key={s.name}>
            {/* linkAs-exempt(external-only): official accounts on other sites */}
            <ActionTile
              href={s.href}
              external
              mediaSize={48}
              title={<T>{s.name}</T>}
              description={<T>{s.handle}</T>}
              media={<BrandGlyph name={s.glyph} size={24} />}
            />
          </li>
        ))}
      </ul>
    </Band>
  );
}
