"use client";

import { ExternalLink, Globe, Minus, Plus, Contrast, Accessibility } from "lucide-react";
import { useApp } from "@/store/app-context";
import { cn } from "@/lib/utils";

const Btn = ({ active, ...rest }: { active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...rest}
    className={cn(
      "inline-flex h-7 w-7 items-center justify-center rounded-xs text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
      active && "bg-white/15 text-white",
      rest.className,
    )}
  />
);

export function AccessBar() {
  const { fontScale, setFontScale, highContrast, setHighContrast } = useApp();
  return (
    <div className="bg-primary text-white">
      <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between gap-sm px-md text-label-3 md:px-lg">
        <a
          href="https://www.india.gov.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-0 items-center gap-xs whitespace-nowrap hover:underline"
        >
          <span
            aria-hidden
            className="inline-block h-3 w-4 shrink-0 overflow-hidden rounded-[1px] bg-gradient-to-b from-[#ff9933] via-white to-[#138808]"
          />
          <span className="hidden sm:inline">Government of India</span>
          <span className="sm:hidden">GoI</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
        <a href="#main-content" className="skip-link">Skip to Main Content</a>
        <div className="flex shrink-0 items-center gap-xs sm:gap-md">
          <div className="flex items-center gap-xs">
            <Btn
              aria-label="Decrease font size"
              onClick={() => setFontScale("small")}
              active={fontScale === "small"}
            >
              <Minus className="h-3.5 w-3.5" />
            </Btn>
            <Btn
              aria-label="Default font size"
              onClick={() => setFontScale("default")}
              active={fontScale === "default"}
            >
              <span className="text-label-2 font-bold">A</span>
            </Btn>
            <Btn
              aria-label="Increase font size"
              onClick={() => setFontScale("large")}
              active={fontScale === "large"}
            >
              <Plus className="h-3.5 w-3.5" />
            </Btn>
          </div>
          <Btn
            aria-label="Toggle high-contrast theme"
            onClick={() => setHighContrast(!highContrast)}
            active={highContrast}
            aria-pressed={highContrast}
          >
            <Contrast className="h-3.5 w-3.5" />
          </Btn>
          <Btn aria-label="Accessibility preferences" className="hidden sm:inline-flex">
            <Accessibility className="h-3.5 w-3.5" />
          </Btn>
          <button className="inline-flex items-center gap-xs rounded-xs px-1 py-1 text-label-3 hover:bg-white/10 sm:px-sm">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">English</span>
            <span className="sm:hidden">EN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
