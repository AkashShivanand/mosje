"use client";
import * as React from "react";
import { Carousel } from "@mosje/design-system";

const SLIDES = [
  { title: "Applications Open for AVYAY 2026-27", body: "Institutions may apply until 31 October 2026." },
  { title: "Adarsh Gram Declarations", body: "19,768 villages have been declared under PM-AJAY." },
  { title: "Nasha Mukt Bharat Abhiyaan", body: "Treatment centres are listed by district." },
  { title: "National Overseas Scholarship", body: "The scrutiny stage begins on 15 September." },
];

const CARD: React.CSSProperties = {
  padding: "var(--sa-padding-32)",
  minHeight: "9rem",
  borderRadius: "var(--sa-cmp-card-radius)",
  background: "var(--sa-bg-brand-primary-base)",
  color: "var(--sa-text-neutral-bolder)",
};

/** Both arrangements: reader-driven (the default) and auto-rotating with its pause control. */
export function CarouselPlayground(): React.JSX.Element {
  const slides = SLIDES.map((s) => (
    <div key={s.title} style={CARD}>
      <h3
        style={{
          margin: 0,
          fontSize: "var(--sa-type-title-2-size)",
          lineHeight: "var(--sa-type-title-2-lh)",
        }}
      >
        {s.title}
      </h3>
      <p style={{ marginBottom: 0 }}>{s.body}</p>
    </div>
  ));

  return (
    <div
      style={{
        padding: "var(--sa-padding-32)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-40)",
      }}
    >
      <Carousel label="Departmental announcements">{slides}</Carousel>
      <Carousel label="Rotating announcements" autoPlay interval={5}>
        {slides}
      </Carousel>
    </div>
  );
}
