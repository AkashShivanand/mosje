import { ArrowUpRight } from "lucide-react";
import type { SVGProps } from "react";

type BrandIcon = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.022 1.792-4.69 4.533-4.69 1.312 0 2.686.235 2.686.235v2.969h-1.514c-1.491 0-1.956.93-1.956 1.886v2.243h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.099 24 12.073z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

interface SocialPlatform {
  name: string;
  href: string;
  ctaLabel: string;
  icon: BrandIcon;
  /** Tailwind class for the brand icon color. */
  iconClassName: string;
  /** Tailwind class for the header icon container background. */
  iconWrapClassName: string;
}

const platforms: SocialPlatform[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/MSJEGOI",
    ctaLabel: "Follow",
    icon: FacebookIcon,
    iconClassName: "text-[#1877F2]",
    iconWrapClassName: "bg-[#1877F2]/10",
  },
  {
    name: "X (Twitter)",
    href: "https://twitter.com/MSJEGOI",
    ctaLabel: "Follow",
    icon: XIcon,
    iconClassName: "text-black",
    iconWrapClassName: "bg-black/5",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/socialjustice_goi",
    ctaLabel: "Visit",
    icon: InstagramIcon,
    iconClassName: "text-[#E1306C]",
    iconWrapClassName: "bg-[#E1306C]/10",
  },
];

export function SocialMedia() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-[32px] font-semibold leading-tight text-gov-blue-dark">
            Explore our Social Media Platforms
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted">
            Stay connected with the Department of Social Justice &amp;
            Empowerment across our official channels.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${platform.iconWrapClassName}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${platform.iconClassName}`}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-[16px] font-semibold text-ink">
                      {platform.name}
                    </span>
                  </div>
                  <a
                    href={platform.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-gov-blue px-3.5 py-1.5 text-[14px] font-medium text-gov-blue transition-colors hover:bg-gov-blue hover:text-white"
                  >
                    {platform.ctaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="p-4">
                  <div className="flex h-[360px] flex-col items-center justify-center gap-3 rounded-lg bg-surface-muted">
                    <Icon
                      className={`h-12 w-12 ${platform.iconClassName} opacity-60`}
                      aria-hidden="true"
                    />
                    <span className="text-[14px] font-medium text-ink-muted">
                      Live feed
                    </span>
                    <span className="px-6 text-center text-[13px] text-ink-muted/70">
                      Latest posts from {platform.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
