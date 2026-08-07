"use client";

import * as React from "react";
import { PublicShell } from "@/components/nmba/public-shell";
import { PledgeForm } from "@/components/nmba/pledge-form";
import { PLEDGE_TEXT_EN, PLEDGE_TEXT_HI, DASHBOARD_STATS } from "@/lib/nmba/mock-data";
import { useToast } from "@/components/nmba/toast";
import { Icon } from "@mosje/design-system";

export default function EPledgePage() {
  const { toast } = useToast();
  const [pledgeDone, setPledgeDone] = React.useState(false);
  const [lang, setLang] = React.useState<"en" | "hi">("en");

  const handleDownload = () => {
    toast("Certificate download will be available once backend is connected.", "info");
  };

  return (
    <PublicShell>
      <div className="max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brandwash text-navy">
            <Icon name="volunteer_activism" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">E-Pledge</h1>
            <p className="text-sm text-ink-muted">Take the Nasha Mukt Bharat pledge online</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mb-6 flex flex-wrap gap-6 rounded-xl border border-line bg-white p-4 shadow-card">
          <div className="text-center">
            <div className="text-2xl font-bold text-navy">{DASHBOARD_STATS.totalPledges}</div>
            <div className="text-xs text-ink-muted">Total Pledges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-navy">0</div>
            <div className="text-xs text-ink-muted">Pledges Taken Today</div>
          </div>
        </div>

        {/* Pledge text with language toggle */}
        <div className="rounded-2xl border border-navy/20 bg-brandwash p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy">
              Nasha Mukt Bharat Abhiyaan Pledge
            </h2>
            <div className="flex rounded-lg border border-navy/20 overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`px-3 py-1.5 transition-colors ${lang === "en" ? "bg-navy text-white" : "bg-white text-navy hover:bg-brandwash"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                aria-pressed={lang === "hi"}
                className={`px-3 py-1.5 transition-colors ${lang === "hi" ? "bg-navy text-white" : "bg-white text-navy hover:bg-brandwash"}`}
              >
                हिंदी
              </button>
            </div>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
            {lang === "en" ? PLEDGE_TEXT_EN : PLEDGE_TEXT_HI}
          </p>
        </div>

        {/* Form */}
        {!pledgeDone ? (
          <PledgeForm onSuccess={() => setPledgeDone(true)} />
        ) : (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-base font-semibold text-green-800">
              Thank you for taking the pledge!
            </p>
            <p className="mt-1 text-sm text-green-700">
              Download your certificate directly once the backend is connected.
            </p>
            <button
              onClick={handleDownload}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
            >
              <Icon name="download" size={16} />
              Download Certificate
            </button>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
