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
        padding: "var(--ds-spacing-2xl, 24px)",
        background: "var(--ds-surface-muted, #f8f9fa)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "32rem",
          background: "var(--ds-surface, #fff)",
          border: "1px solid var(--ds-border, #e2e6ea)",
          borderRadius: "var(--ds-radius-md, 8px)",
          padding: "var(--ds-spacing-3xl, 32px)",
          boxShadow: "var(--ds-shadow-lg, 0 12px 16px -4px rgba(33,33,33,0.08))",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--ds-radius-sm, 6px)",
            background: "var(--ds-warning-tonal, #ffedd5)",
            color: "var(--ds-saffron-dark, #7c3503)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            marginBottom: "var(--ds-spacing-xl, 20px)",
          }}
        >
          ⚠
        </div>

        <h1
          style={{
            fontSize: "var(--ds-text-title-1, 22px)",
            fontWeight: 600,
            color: "var(--ds-ink, #212121)",
            marginBottom: "var(--ds-spacing-sm, 8px)",
          }}
        >
          {zone}{" "}isn&apos;t running
        </h1>

        <p
          style={{
            fontSize: "var(--ds-text-body-1, 16px)",
            color: "var(--ds-ink-muted, #343a40)",
            lineHeight: 1.6,
            marginBottom: "var(--ds-spacing-xl, 20px)",
          }}
        >
          The hub couldn&apos;t reach this app{from ? <> at <code>{from}</code></> : null}. It&apos;s served by
          its own dev server, which isn&apos;t up right now — so there&apos;s nothing to load here yet.
        </p>

        <div
          style={{
            background: "var(--ds-surface-muted, #f8f9fa)",
            border: "1px solid var(--ds-border, #e2e6ea)",
            borderRadius: "var(--ds-radius-sm, 6px)",
            padding: "var(--ds-spacing-lg, 16px)",
            marginBottom: "var(--ds-spacing-xl, 20px)",
          }}
        >
          <div
            style={{
              fontSize: "var(--ds-text-label-3, 11px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ds-ink-muted, #343a40)",
              marginBottom: "var(--ds-spacing-sm, 8px)",
            }}
          >
            Start everything (recommended)
          </div>
          <code
            style={{
              display: "block",
              fontFamily: "var(--ds-font-mono, ui-monospace, monospace)",
              fontSize: "var(--ds-text-body-2, 14px)",
              color: "var(--ds-ink, #212121)",
              marginBottom: "var(--ds-spacing-lg, 16px)",
            }}
          >
            npm run dev
          </code>
          <div
            style={{
              fontSize: "var(--ds-text-label-3, 11px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ds-ink-muted, #343a40)",
              marginBottom: "var(--ds-spacing-sm, 8px)",
            }}
          >
            …or just this app
          </div>
          <code
            style={{
              display: "block",
              fontFamily: "var(--ds-font-mono, ui-monospace, monospace)",
              fontSize: "var(--ds-text-body-2, 14px)",
              color: "var(--ds-ink, #212121)",
            }}
          >
            {cmd}
          </code>
        </div>

        <div style={{ display: "flex", gap: "var(--ds-spacing-md, 12px)", flexWrap: "wrap" }}>
          <a
            href={from ?? "/"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px var(--ds-spacing-xl, 20px)",
              borderRadius: "var(--ds-radius-sm, 6px)",
              background: "var(--ds-primary, #0373df)",
              color: "var(--ds-on-primary, #fff)",
              fontWeight: 600,
              fontSize: "var(--ds-text-body-2, 14px)",
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
              padding: "10px var(--ds-spacing-xl, 20px)",
              borderRadius: "var(--ds-radius-sm, 6px)",
              border: "1px solid var(--ds-border-strong, #9aa3af)",
              color: "var(--ds-ink, #212121)",
              fontWeight: 600,
              fontSize: "var(--ds-text-body-2, 14px)",
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
