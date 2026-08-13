import { Button, Card, Icon } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import type { PageHeroProps } from "@/components/website/layout/PageHero";

export interface PersonaCard {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: string;
}

interface PersonaPageProps extends PageHeroProps {
  /** Short line under the title, e.g. "Here's how the Ministry empowers citizens like you." */
  tagline: string;
  cards: PersonaCard[];
}

/**
 * T4 — Persona landing (DBIM persona-based navigation requirement).
 * Hero + a grid of tailored "what you can do" cards for one audience.
 */
export function PersonaPage({ tagline, cards, ...hero }: PersonaPageProps) {
  return (
    <PageLayout {...hero}>
      <section>
        <div className="sa-container py-10 md:py-12">
          <h2 className="mb-8 text-center text-[22px] font-semibold text-ink md:text-[26px]">{tagline}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const iconName = card.icon;
              return (
                <Card
                  key={card.title}
                  variant="outlined"
                  className="p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-saffron-light text-saffron-dark">
                    <Icon name={iconName} aria-hidden="true" />
                  </span>
                  <h3 className="text-[18px] font-semibold text-primary-dark">{card.title}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-muted">{card.description}</p>
                  <Button
                    href={card.href}
                    appearance="text"
                    size="sm"
                    iconRight={<Icon name="arrow_forward" size={16} />}
                    className="mt-4 self-start"
                  >
                    {card.ctaLabel}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
