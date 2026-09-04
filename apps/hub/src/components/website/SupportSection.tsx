import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";

export function SupportSection() {
  return (
    <section className="bg-primary-50 py-12 border-y border-border" aria-labelledby="support-heading">
      <div className="sa-container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h2
            id="support-heading"
            className="text-headline-2 text-ink"
          >
            Need Support?
          </h2>
          <p className="mt-2 text-body-1 text-ink-muted">
            Reach out to us and we will get back to you!
          </p>
        </div>
        <Link
          href="/website/contact-us"
          className={buttonClasses("primary", "outlined", "lg", "whitespace-nowrap shrink-0")}
        >
          Get in Touch
          <span className="ds-btn__icon" aria-hidden="true">
            <Icon name="arrow_forward" size={20} />
          </span>
        </Link>
      </div>
    </section>
  );
}
