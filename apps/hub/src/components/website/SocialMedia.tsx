"use client";

import { useState } from "react";
import Image from "next/image";
import { BrandGlyph, Icon, Link, type BrandGlyphName } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type SocialTab = "facebook" | "x" | "youtube";

interface SocialMetric {
  /** Material Symbol for this metric. */
  icon: string;
  value: string;
  /** Accessible name — the glyph alone does not say what the number counts. */
  label: string;
}

interface SocialPost {
  id: string;
  image: string;
  caption: string;
  date: string;
  /** Two engagement figures, shown with icons as the design does. */
  metrics: SocialMetric[];
}

interface SocialTabConfig {
  key: SocialTab;
  name: string;
  /** The account the posts belong to — shown in the card header, as designed. */
  accountName: string;
  handle: string;
  ctaLabel: string;
  profileUrl: string;
  icon: BrandGlyphName;
  iconClassName: string;
  iconWrapClassName: string;
  posts: SocialPost[];
}

const SOCIAL_TABS: SocialTabConfig[] = [
  {
    key: "facebook",
    name: "Facebook",
    accountName: "Department of Social Justice & Empowerment",
    handle: "@DoSJE_GoI",
    ctaLabel: "Follow",
    profileUrl: "https://www.facebook.com/MSJEGOI",
    icon: "facebook",
    iconClassName: "text-[#1877F2]",
    iconWrapClassName: "bg-[#1877F2]/10",
    posts: [
      {
        id: "fb-1",
        image: "/website/images/Banner-7.png",
        caption: "Hon'ble Minister Dr. Virendra Kumar inaugurated the National Awareness Drive on Senior Citizens' Welfare and active aging initiatives.",
        date: "18 Aug 2026",
        metrics: [
          { icon: "favorite", value: "1.2K", label: "Likes" },
          { icon: "share", value: "142", label: "Shares" },
        ],
      },
      {
        id: "fb-2",
        image: "/website/images/Banner-8.png",
        caption: "National Workshop on Skill Training and Entrepreneurship for Safai Karamcharis organized by NSKFDC at Dr. Ambedkar International Centre.",
        date: "17 Aug 2026",
        metrics: [
          { icon: "favorite", value: "890", label: "Likes" },
          { icon: "share", value: "94", label: "Shares" },
        ],
      },
      {
        id: "fb-3",
        image: "/website/images/Banner-9.png",
        caption: "Nasha Mukt Bharat Abhiyaan outreach program in educational institutions across 272 districts with student pledges.",
        date: "16 Aug 2026",
        metrics: [
          { icon: "favorite", value: "2.1K", label: "Likes" },
          { icon: "share", value: "318", label: "Shares" },
        ],
      },
    ],
  },
  {
    key: "x",
    name: "X (Twitter)",
    accountName: "Department of Social Justice & Empowerment",
    handle: "@MSJEGOI",
    ctaLabel: "Follow",
    profileUrl: "https://twitter.com/MSJEGOI",
    icon: "x",
    iconClassName: "text-black",
    iconWrapClassName: "bg-black/5",
    posts: [
      {
        id: "x-1",
        image: "/website/images/Banner-8.png",
        caption: "Applications open for Top Class Education Scheme for SC & OBC Students for AY 2026-27. Apply now on National Scholarship Portal.",
        date: "17 Aug 2026",
        metrics: [
          { icon: "repeat", value: "892", label: "Retweets" },
          { icon: "favorite", value: "3.4K", label: "Likes" },
        ],
      },
      {
        id: "x-2",
        image: "/website/images/Banner-9.png",
        caption: "PM-AJAY vertical grants approved for infrastructure enhancement in 1,200 scheduled caste majority villages nationwide.",
        date: "16 Aug 2026",
        metrics: [
          { icon: "repeat", value: "640", label: "Retweets" },
          { icon: "favorite", value: "2.1K", label: "Likes" },
        ],
      },
      {
        id: "x-3",
        image: "/website/images/Banner-10.png",
        caption: "MoSJE rolls out simplified transgender identity card verification mechanism integrated with national health databases.",
        date: "15 Aug 2026",
        metrics: [
          { icon: "repeat", value: "1.1K", label: "Retweets" },
          { icon: "favorite", value: "4.8K", label: "Likes" },
        ],
      },
    ],
  },
  {
    key: "youtube",
    name: "YouTube",
    accountName: "Department of Social Justice & Empowerment",
    handle: "@DoSJE_GoI",
    ctaLabel: "Subscribe",
    profileUrl: "https://www.youtube.com/@DoSJE_GoI",
    icon: "youtube",
    iconClassName: "text-[#FF0000]",
    iconWrapClassName: "bg-[#FF0000]/10",
    posts: [
      {
        id: "yt-1",
        image: "/website/images/Banner-9.png",
        caption: "Watch Live: Chintan Shivir 2026 — Keynote address on empowering marginalized communities through technology and citizen-first delivery.",
        date: "15 Aug 2026",
        metrics: [
          { icon: "visibility", value: "15.8K", label: "Views" },
          { icon: "favorite", value: "2.1K", label: "Likes" },
        ],
      },
      {
        id: "yt-2",
        image: "/website/images/Banner-6.png",
        caption: "Documentary: Stories of Transformation — Beneficiaries of the SMILE project share their journey of dignity and employment.",
        date: "12 Aug 2026",
        metrics: [
          { icon: "visibility", value: "32.4K", label: "Views" },
          { icon: "favorite", value: "4.5K", label: "Likes" },
        ],
      },
      {
        id: "yt-3",
        image: "/website/images/Banner-7.png",
        caption: "Highlights of the National De-addiction Helpline 14446 campaign and counseling resources across India.",
        date: "10 Aug 2026",
        metrics: [
          { icon: "visibility", value: "19.2K", label: "Views" },
          { icon: "favorite", value: "1.8K", label: "Likes" },
        ],
      },
    ],
  },
];

export function SocialMedia() {
  const [activeTab, setActiveTab] = useState<SocialTab>("facebook");
  const currentTab = SOCIAL_TABS.find((tab) => tab.key === activeTab) ?? SOCIAL_TABS[0]!;

  return (
    <section className="bg-surface-muted py-12 md:py-16">
      <div className="sa-container">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-semibold leading-tight text-primary-dark">
            Explore our Social Media Platforms
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] text-ink-muted">
            Stay connected with the Department of Social Justice &amp; Empowerment across our official channels.
          </p>
        </div>

        {/* Full-width segmented control: three equal segments spanning the
            container, as the design draws it. The build centred a compact pill
            group [WEB-S-01].

            The 320px reflow fix stays: `px-3` and glyph-only below sm. Three
            equal segments at 320 are ~96px each, which will not hold a label,
            so the glyph is still the readable form and `aria-label` carries the
            name [WCAG 2.2 AA 1.4.10]. */}
        <div className="mt-8 flex w-full items-center gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1.5">
          {SOCIAL_TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-label={tab.name}
                aria-pressed={isActive}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-6 sm:text-sm",
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                <BrandGlyph name={tab.icon} size={20} />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Posts for the active platform */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {currentTab.posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:border-primary/30 hover:shadow-md"
            >
              {/* Header: the ACCOUNT, with the platform mark opposite. The build
                  named the platform and offered a Follow button instead, so the
                  card never said whose account it was [WEB-S-03]. */}
              <div className="flex items-start justify-between gap-3 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white">
                    <Image
                      src="/website/images/National-Emblem-logo.svg"
                      alt=""
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px] object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[13px] font-semibold leading-tight text-ink line-clamp-2">
                      {currentTab.accountName}
                    </span>
                    <span className="block text-[11px] text-ink-muted">
                      {post.date}
                    </span>
                  </div>
                </div>
                <BrandGlyph
                  name={currentTab.icon}
                  size={20}
                  className={cn("shrink-0", currentTab.iconClassName)}
                />
              </div>

              {/* Caption BEFORE the image — the design's order. The build put
                  the image first and the text under it [WEB-S-02]. */}
              <div className="flex flex-1 flex-col px-5">
                <p className="text-xs leading-snug text-ink line-clamp-3 sm:text-sm">
                  {post.caption}
                </p>
                <div className="relative mt-3 aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-150">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Engagement with icons, and a Share control — the build had a
                  bare date/stats line [WEB-S-04]. */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-150 px-5 py-3">
                <div className="flex items-center gap-4">
                  {post.metrics.map((metric) => (
                    <span
                      key={metric.label}
                      className="flex items-center gap-1 text-[11px] text-ink-muted"
                    >
                      <Icon name={metric.icon} size={16} aria-hidden />
                      {metric.value}
                      <span className="sr-only"> {metric.label}</span>
                    </span>
                  ))}
                </div>
                <Link
                  href={currentTab.profileUrl}
                  external
                  variant="standalone"
                  className="text-[11px] font-semibold text-primary-dark"
                  iconLeft={<Icon name="share" size={16} aria-hidden />}
                >
                  Share
                  <span className="sr-only"> this post on {currentTab.name}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* No dots and no prev/next here. The design shows a carousel, but
            every platform carries exactly three posts and all three render at
            once, so there is nothing to page: the dots that used to sit here
            were decoration wired to no handler. Arrows would be the same
            defect. WEB-S-05 stays open until there are more posts than fit. */}

      </div>
    </section>
  );
}
