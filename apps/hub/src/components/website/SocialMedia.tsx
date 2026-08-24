"use client";

import { useState } from "react";
import Image from "next/image";
import { BrandGlyph, Icon, type BrandGlyphName } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type SocialTab = "facebook" | "x" | "youtube";

interface SocialPost {
  id: string;
  image: string;
  caption: string;
  date: string;
  stats: string;
}

interface SocialTabConfig {
  key: SocialTab;
  name: string;
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
        stats: "1.2K Likes · 142 Shares",
      },
      {
        id: "fb-2",
        image: "/website/images/Banner-8.png",
        caption: "National Workshop on Skill Training and Entrepreneurship for Safai Karamcharis organized by NSKFDC at Dr. Ambedkar International Centre.",
        date: "17 Aug 2026",
        stats: "890 Likes · 94 Shares",
      },
      {
        id: "fb-3",
        image: "/website/images/Banner-9.png",
        caption: "Nasha Mukt Bharat Abhiyaan outreach program in educational institutions across 272 districts with student pledges.",
        date: "16 Aug 2026",
        stats: "2.1K Likes · 318 Shares",
      },
    ],
  },
  {
    key: "x",
    name: "X (Twitter)",
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
        stats: "892 Retweets · 3.4K Likes",
      },
      {
        id: "x-2",
        image: "/website/images/Banner-9.png",
        caption: "PM-AJAY vertical grants approved for infrastructure enhancement in 1,200 scheduled caste majority villages nationwide.",
        date: "16 Aug 2026",
        stats: "640 Retweets · 2.1K Likes",
      },
      {
        id: "x-3",
        image: "/website/images/Banner-10.png",
        caption: "MoSJE rolls out simplified transgender identity card verification mechanism integrated with national health databases.",
        date: "15 Aug 2026",
        stats: "1.1K Retweets · 4.8K Likes",
      },
    ],
  },
  {
    key: "youtube",
    name: "YouTube",
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
        stats: "15.8K Views · 2.1K Likes",
      },
      {
        id: "yt-2",
        image: "/website/images/Banner-6.png",
        caption: "Documentary: Stories of Transformation — Beneficiaries of the SMILE project share their journey of dignity and employment.",
        date: "12 Aug 2026",
        stats: "32.4K Views · 4.5K Likes",
      },
      {
        id: "yt-3",
        image: "/website/images/Banner-7.png",
        caption: "Highlights of the National De-addiction Helpline 14446 campaign and counseling resources across India.",
        date: "10 Aug 2026",
        stats: "19.2K Views · 1.8K Likes",
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
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[32px] font-semibold leading-tight text-primary-dark">
            Explore our Social Media Platforms
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] text-ink-muted">
            Stay connected with the Department of Social Justice &amp; Empowerment across our official channels.
          </p>
        </div>

        {/* Tab Selector matching Figma node 8137:48670 */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center rounded-xl bg-gray-100 p-1.5 border border-gray-200">
            {SOCIAL_TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "rounded-lg px-6 py-2 text-xs sm:text-sm font-semibold transition flex items-center gap-2",
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  <BrandGlyph name={tab.icon} size={20} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Posts Grid (3 Posts from current active platform) */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {currentTab.posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:shadow-md hover:border-primary/30"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${currentTab.iconWrapClassName}`}
                  >
                    <BrandGlyph
                      name={currentTab.icon}
                      size={20}
                      className={currentTab.iconClassName}
                    />
                  </span>
                  <div>
                    <span className="block text-[15px] font-semibold leading-tight text-ink">
                      {currentTab.name}
                    </span>
                    <span className="block text-[11px] text-ink-muted">{currentTab.handle}</span>
                  </div>
                </div>
                <a
                  href={currentTab.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {currentTab.ctaLabel}
                  <Icon name="arrow_outward" size={16} />
                </a>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-150">
                    <Image
                      src={post.image}
                      alt={`${currentTab.name} post visual`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-3 text-xs sm:text-sm font-normal text-ink line-clamp-3 leading-snug">
                    {post.caption}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-150 flex items-center justify-between text-[11px] text-ink-muted">
                  <span>{post.date}</span>
                  <span>{post.stats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel / Page Dots Indicator */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-gray-300" />
          <span className="h-2 w-2 rounded-full bg-gray-300" />
        </div>
      </div>
    </section>
  );
}
