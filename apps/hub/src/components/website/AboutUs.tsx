import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
import { ABOUT_US } from "@/lib/website-shared/home";

/* Every word, figure and portrait here is shared with the other designs of the
   website — lib/website-shared/home.ts, read from the live home page. This file
   owns the layout only. The stat cells are label -> figure -> sub-caption, in
   that order: a large number with no statement of what it measures until after
   you have read it is the defect WEB-A-05 recorded. */
const { title, intro, quote, links, ministers, stats, dashboard } = ABOUT_US;

export function AboutUs() {
  return (
    <section className="bg-primary-50">
      <div className="sa-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-headline-2 text-primary-dark">
              {title}
            </h2>
            <p className="mt-5 text-body-1 text-ink-muted">{intro}</p>
            <blockquote className="mt-6 border-l-4 border-saffron bg-saffron/10 p-4 rounded-r-lg italic text-body-1 text-ink">
              “{quote}”
            </blockquote>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/website/about-us"
                /* Fourth instance of one DS defect: gov-blue is 4.19:1 on this
                   section's primary-50 ground, under AA. The DS outlined button
                   is correct on white and short of it on every tint. */
                className={buttonClasses(
                  "primary",
                  "outlined",
                  "sm",
                  "border-primary-dark text-primary-dark",
                )}
              >
                Read More
                <span className="ds-btn__icon" aria-hidden="true"><Icon name="arrow_forward" size={16} /></span>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-label-1 text-ink transition hover:border-primary hover:text-primary"
                >
                  <span>{l.label}</span>
                  <Icon name="chevron_right" size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* The lead card is tinted in the design — it is what separates the
                Union Minister from the two Ministers of State beneath, which a
                plain white card on a tinted section could not do [WEB-A-02].
                saffron-50 is the token nearest the frame's cream. */}
            {ministers[0] && (
            <div className="rounded-lg border border-saffron-500/25 bg-saffron-50 p-5 shadow-sm transition hover:shadow-md sm:flex sm:items-center sm:gap-5">
              <Image
                src={ministers[0].photo}
                alt={ministers[0].name}
                width={140}
                height={140}
                className="mx-auto h-[140px] w-[140px] flex-shrink-0 rounded-full border-4 border-white bg-white object-cover shadow-sm sm:mx-0"
              />
              <div className="mt-4 text-center sm:mt-0 sm:text-left">
                <h3 className="text-title-1 text-ink">
                  {ministers[0].name}
                </h3>
                <p className="mt-1 text-body-1 text-ink-muted">
                  {ministers[0].designation}
                </p>
              </div>
            </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {ministers.slice(1).map((minister) => (
                <div
                  key={minister.name}
                  className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:shadow-md"
                >
                  <Image
                    src={minister.photo}
                    alt={minister.name}
                    width={140}
                    height={140}
                    className="h-[140px] w-[140px] rounded-lg object-cover"
                  />
                  <h3 className="mt-4 text-title-2 text-ink">
                    {minister.name}
                  </h3>
                  <p className="mt-1 text-body-2 text-ink-muted">
                    {minister.designation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl bg-gradient-to-r from-primary-dark to-primary p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <dl className="grid flex-1 grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-4 sm:px-6 sm:py-2">
                  <dt className="text-label-3 uppercase text-white">
                    {stat.label}
                  </dt>
                  <dd className="mt-1.5 text-headline-2 tabular-nums text-white">
                    {stat.value}
                  </dd>
                  <dd className="mt-1.5 text-body-3 text-white">
                    {stat.caption}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href={dashboard.href}
              className={buttonClasses("primary", "filled", "md", "bg-white text-primary hover:bg-white/90 whitespace-nowrap self-center shrink-0")}
            >
              {dashboard.label}
              <span className="ds-btn__icon" aria-hidden="true">
                <Icon name="arrow_forward" size={16} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
