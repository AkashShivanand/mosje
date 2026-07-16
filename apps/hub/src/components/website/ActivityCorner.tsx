import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses, Card } from "@mosje/design-system";

interface ActivityCard {
  img: string;
  title: string;
  date: string;
}

const activities: ActivityCard[] = [
  {
    img: "/website/images/65811748325059-300x291.jpg",
    title: "Chintan Shivir 2026 — Strengthening Social Justice Delivery",
    date: "26 Apr 2026",
  },
  {
    img: "/website/images/5-234x300.jpg",
    title: "National Workshop on Empowerment of Persons with Disabilities",
    date: "20 Apr 2026",
  },
  {
    img: "/website/images/4-1-300x133.jpg",
    title: "Nasha Mukt Bharat Abhiyaan — Community Outreach Drive",
    date: "12 Apr 2026",
  },
  {
    img: "/website/images/3-300x251.jpg",
    title: "Scholarship Disbursement Review Meeting",
    date: "05 Apr 2026",
  },
];

export function ActivityCorner() {
  return (
    <section className="bg-surface-muted">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-[32px] font-semibold leading-tight text-gov-blue-dark">
            Activity Corner
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
            Explore our affiliated bodies
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((activity) => (
            <Card
              key={activity.title}
              variant="outlined"
              className="shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={activity.img}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[16px] font-medium leading-snug text-ink">
                  {activity.title}
                </h3>
                <p className="mt-2 text-[13px] text-ink-muted">{activity.date}</p>
                <Link
                  href="/website/events"
                  className={buttonClasses("primary", "text", "sm", "mt-4 self-start")}
                >
                  Read More
                  <span className="ds-btn__icon" aria-hidden="true"><ArrowRight className="h-4 w-4" /></span>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/website/events"
            className={buttonClasses("primary", "outlined", "sm")}
          >
            View All Events
            <span className="ds-btn__icon" aria-hidden="true"><ArrowRight className="h-4 w-4" /></span>
          </Link>
          <Link
            href="/website/events"
            className={buttonClasses("primary", "outlined", "sm")}
          >
            View All Press Releases
            <span className="ds-btn__icon" aria-hidden="true"><ArrowRight className="h-4 w-4" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
