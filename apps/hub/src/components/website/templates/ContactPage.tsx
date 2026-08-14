import { Card, Icon } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import type { PageHeroProps } from "@/components/website/layout/PageHero";
import { FeedbackForm } from "@/components/website/ui/feedback-form";

export interface ContactOfficer {
  role: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface ContactPageProps extends PageHeroProps {
  /** Primary office address + contacts. */
  office: { name: string; address: string; phone?: string; email?: string };
  /** Optional Google Maps embed URL. */
  mapSrc?: string;
  /** Key officers / public information officers. */
  officers?: ContactOfficer[];
  /** Show the feedback form (default true). */
  showForm?: boolean;
}

/**
 * T6 — Contact page. Office address + map + key officer/PIO cards + an accessible feedback form.
 */
export function ContactPage({ office, mapSrc, officers = [], showForm = true, ...hero }: ContactPageProps) {
  return (
    <PageLayout {...hero}>
      <section>
        <div className="sa-container py-10 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Left: address + map + officers */}
            <div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="flex items-center gap-2 text-[18px] font-semibold text-primary-dark">
                  <Icon name="apartment" size={20} /> {office.name}
                </h2>
                <ul className="mt-4 space-y-3 text-[14px] text-ink-muted">
                  <li className="flex items-start gap-3">
                    <Icon name="location_on" size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{office.address}</span>
                  </li>
                  {office.phone && (
                    <li className="flex items-center gap-3">
                      <Icon name="call" size={16} className="shrink-0 text-primary" />
                      <span>{office.phone}</span>
                    </li>
                  )}
                  {office.email && (
                    <li className="flex items-center gap-3">
                      <Icon name="mail" size={16} className="shrink-0 text-primary" />
                      <span>{office.email}</span>
                    </li>
                  )}
                </ul>
              </div>

              {mapSrc && (
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                  <iframe
                    src={mapSrc}
                    title={`Map showing ${office.name}`}
                    className="h-[320px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}

              {officers.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 text-[18px] font-semibold text-primary-dark">Key Officers</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {officers.map((o) => (
                      <Card key={o.role} variant="outlined" className="p-4 text-[14px]">
                        <p className="font-semibold text-ink">{o.role}</p>
                        {o.name && <p className="mt-1 text-ink-muted">{o.name}</p>}
                        {o.phone && <p className="mt-1 flex items-center gap-2 text-ink-muted"><Icon name="call" size={14} />{o.phone}</p>}
                        {o.email && <p className="mt-1 flex items-center gap-2 text-ink-muted"><Icon name="mail" size={14} />{o.email}</p>}
                        {o.address && <p className="mt-1 text-gray-500">{o.address}</p>}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: feedback form */}
            {showForm && (
              <aside>
                <div className="rounded-xl border border-gray-200 bg-surface-muted p-6">
                  <h2 className="mb-4 text-[18px] font-semibold text-primary-dark">Send us a message</h2>
                  <FeedbackForm />
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
