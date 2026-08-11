import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "App not running — SAMAVESH",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ zone?: string; cmd?: string; from?: string }>;
}

export default async function ZoneUnavailablePage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const { zone = "This app", cmd = "npm run dev", from } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--sa-padding-xl, 24px)",
        background: "var(--sa-bg-neutral-subtler, #f8f9fa)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "32rem",
          background: "var(--sa-bg-neutral-base, #fff)",
          border: "1px solid var(--sa-border-neutral-subtle, #f1f3f5)",
          borderRadius: "var(--sa-shape-md, 8px)",
          padding: "var(--sa-padding-2xl, 32px)",
          boxShadow: "var(--sa-elevation-modal, 0 12px 16px -4px rgba(31, 36, 40, 0.08), 0 4px 6px -2px rgba(31, 36, 40, 0.03))",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--sa-shape-sm, 6px)",
            background: "var(--sa-color-status-warningTonal, #fff4e5)",
            color: "var(--sa-color-status-warning, #8c571f)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            marginBottom: "var(--sa-padding-l, 20px)",
          }}
        >
          ⚠
        </div>

        <h1
          style={{
            fontSize: "var(--sa-type-headline-2-size, 22px)",
            fontWeight: 600,
            color: "var(--sa-color-text-default, #1f2428)",
            marginBottom: "var(--sa-stack-xs, 8px)",
          }}
        >
          {zone}{" "}isn&apos;t running
        </h1>

        <p
          style={{
            fontSize: "var(--sa-type-body-1-size, 16px)",
            color: "var(--sa-color-text-muted, #343a40)",
            lineHeight: 1.6,
            marginBottom: "var(--sa-padding-l, 20px)",
          }}
        >
          The hub couldn&apos;t reach this app{from ? <> at <code>{from}</code></> : null}. It&apos;s served by
          its own dev server, which isn&apos;t up right now — so there&apos;s nothing to load here yet.
        </p>

        <div
          style={{
            background: "var(--sa-bg-neutral-subtler, #f8f9fa)",
            border: "1px solid var(--sa-border-neutral-subtle, #f1f3f5)",
            borderRadius: "var(--sa-shape-sm, 6px)",
            padding: "var(--sa-padding-m, 16px)",
            marginBottom: "var(--sa-padding-l, 20px)",
          }}
        >
          <div
            style={{
              fontSize: "var(--sa-type-label-3-size, 11px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--sa-color-text-muted, #343a40)",
              marginBottom: "var(--sa-stack-xs, 8px)",
            }}
          >
            Start everything (recommended)
          </div>
          <code
            style={{
              display: "block",
              fontFamily: "var(--sa-font-mono, ui-monospace, monospace)",
              fontSize: "var(--sa-type-body-2-size, 14px)",
              color: "var(--sa-color-text-default, #1f2428)",
              marginBottom: "var(--sa-stack-m, 16px)",
            }}
          >
            npm run dev
          </code>
          <div
            style={{
              fontSize: "var(--sa-type-label-3-size, 11px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--sa-color-text-muted, #343a40)",
              marginBottom: "var(--sa-stack-xs, 8px)",
            }}
          >
            …or just this app
          </div>
          <code
            style={{
              display: "block",
              fontFamily: "var(--sa-font-mono, ui-monospace, monospace)",
              fontSize: "var(--sa-type-body-2-size, 14px)",
              color: "var(--sa-color-text-default, #1f2428)",
            }}
          >
            {cmd}
          </code>
        </div>

        <div style={{ display: "flex", gap: "var(--sa-stack-s, 12px)", flexWrap: "wrap" }}>
          <a
            href={from ?? "/"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px var(--sa-padding-l, 20px)",
              borderRadius: "var(--sa-shape-sm, 6px)",
              background: "var(--sa-color-action-primary-default, #0373df)",
              color: "var(--sa-color-text-onPrimary, #fff)",
              fontWeight: 600,
              fontSize: "var(--sa-type-body-2-size, 14px)",
              textDecoration: "none",
            }}
          >
            Retry
          </a>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px var(--sa-padding-l, 20px)",
              borderRadius: "var(--sa-shape-sm, 6px)",
              border: "1px solid var(--sa-border-neutral-base, #e2e6ea)",
              color: "var(--sa-color-text-default, #1f2428)",
              fontWeight: 600,
              fontSize: "var(--sa-type-body-2-size, 14px)",
              textDecoration: "none",
            }}
          >
            Back to hub
          </Link>
        </div>
      </div>
    </main>
  );
}
