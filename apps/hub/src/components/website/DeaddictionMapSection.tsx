"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type FilterType = "all" | "irca" | "odic" | "cfld" | "atf" | "slca";

const TYPES: { key: FilterType; label: string }[] = [
  { key: "all", label: "All Types" },
  { key: "irca", label: "IRCAs" },
  { key: "odic", label: "ODIC" },
  { key: "cfld", label: "CFLD" },
  { key: "atf", label: "ATF" },
  { key: "slca", label: "SLCA" },
];

export function DeaddictionMapSection() {
  const [activeType, setActiveType] = useState<FilterType>("all");
  const [selectedState, setSelectedState] = useState("Delhi");
  const [selectedDistrict, setSelectedDistrict] = useState("North West Delhi");

  return (
    <section className="bg-surface-muted border-y border-border py-12 md:py-16" aria-labelledby="map-section-heading">
      <div className="sa-container">
        <div className="text-center">
          <h2 id="map-section-heading" className="text-[28px] sm:text-[32px] font-semibold leading-tight text-primary-dark">
            Find a De-addiction Centre Near You
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] text-ink-muted">
            700+ Nasha Mukti Kendras nationwide — find help near you.
          </p>
        </div>

        {/* Search controls bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs max-w-3xl mx-auto">
          <div className="w-full sm:w-1/2">
            <label htmlFor="state-select" className="sr-only">State</label>
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="Delhi">Delhi NCR</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjab">Punjab</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>
          <div className="w-full sm:w-1/2">
            <label htmlFor="district-select" className="sr-only">District</label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="North West Delhi">North West Delhi</option>
              <option value="South Delhi">South Delhi</option>
              <option value="Central Delhi">Central Delhi</option>
              <option value="East Delhi">East Delhi</option>
            </select>
          </div>
          <button
            type="button"
            className={buttonClasses("primary", "filled", "md", "w-full sm:w-auto px-6 whitespace-nowrap")}
          >
            Search
          </button>
        </div>

        {/* Type filter pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {TYPES.map((t) => {
            const isActive = t.key === activeType;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveType(t.key)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-primary-dark text-white shadow-xs"
                    : "bg-white border border-gray-200 text-ink-muted hover:border-primary/40 hover:text-primary"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 2-Column Map & Centre Details */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Map mockup canvas */}
          <div className="lg:col-span-7 relative min-h-[360px] rounded-xl border border-gray-200 bg-gray-100 overflow-hidden shadow-xs">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Pin 1 */}
                <div className="absolute -top-12 -left-16 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-md border border-primary/20 animate-bounce">
                  <Icon name="location_on" size={20} className="text-primary" />
                  <span className="text-xs font-bold text-ink">Mukti Kendra</span>
                </div>
                {/* Pin 2 */}
                <div className="absolute top-16 left-24 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-md border border-primary/20">
                  <Icon name="location_on" size={20} className="text-secondary" />
                  <span className="text-xs font-bold text-ink">Navjeevan Centre</span>
                </div>
                {/* Pin 3 */}
                <div className="absolute top-28 -left-32 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-md border border-primary/20">
                  <Icon name="location_on" size={20} className="text-secondary" />
                  <span className="text-xs font-bold text-ink">Sanjeevani IRCA</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-3 py-1.5 text-xs text-ink-muted backdrop-blur-xs">
              Showing 12 Kendras in {selectedDistrict}, {selectedState}
            </div>
          </div>

          {/* Centre details card */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-primary/30 bg-white p-6 shadow-sm">
            <div>
              <span className="inline-block rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary uppercase">
                Integrated Rehabilitation Centre for Addicts (IRCA)
              </span>
              <h3 className="mt-3 text-[20px] font-bold text-ink">
                Mukti Counselling &amp; Rehabilitation Centre
              </h3>
              <p className="mt-2 text-xs text-ink-muted">
                Run by Society for Social Upliftment · Grant-in-Aid Supported by DoSJE
              </p>

              <div className="mt-5 space-y-3 border-t border-gray-150 pt-4 text-xs text-ink">
                <div className="flex items-start gap-2.5">
                  <Icon name="location_on" size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Plot 12, Sector 4, Rohini, New Delhi - 110085</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon name="call" size={16} className="text-primary shrink-0" />
                  <span>011-27041234 / +91 98101 23456</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon name="bed" size={16} className="text-primary shrink-0" />
                  <span>Bed Capacity: 15 Beds (12 Occupied)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-150 flex items-center justify-between">
              <div className="inline-flex items-center gap-1 rounded bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                <Icon name="headset_mic" size={16} />
                24x7 Helpline: 14446
              </div>
              <Link
                href="/de-addiction-centres"
                className={buttonClasses("primary", "outlined", "sm")}
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
