"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Band, Button, Figure, Icon, Lightbox, SectionTitle } from "@mosje/design-system";
import { T } from "@/components/i18n/translation-provider";
import { INFOGRAPHICS } from "@/lib/website/infographics";

/**
 * Infographics — DBIM 3.0 §7.3 xiii, placed where Figure 49 draws it: after
 * citizen engagement, before the footer carousel (issue BRD-24).
 *
 * DS Audit: Band ✅ · SectionTitle ✅ · Figure ✅ · Lightbox ✅ · Button ✅ · Icon ✅
 *
 * Each infographic sits beside its figures AS TEXT. That is not restatement: a
 * picture of numbers cannot be read aloud, searched, translated or enlarged
 * without blurring, and the NMBA survey graphic was reported for exactly that
 * (ACC-P070). The alt names the picture; the list carries what it says.
 */
export function Infographics() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Band as="section" tone="default" spacing="xl" aria-labelledby="infographics-title">
      <SectionTitle
        size="display"
        headingId="infographics-title"
        title={<T>Infographics</T>}
        description={<T>Key figures from the Department&apos;s schemes, from its published dashboards.</T>}
      />
      {INFOGRAPHICS.map((info, i) => (
        <article key={info.id} className="wn-home-infographic" aria-labelledby={`${info.id}-title`}>
          <Figure
            ratio="square"
            fit="contain"
            className="wn-home-infographic__figure"
            credit={
              <>
                <T>Source:</T>{" "}
                <a href={info.source.href} target="_blank" rel="noopener noreferrer">
                  <T>{info.source.label}</T>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </>
            }
          >
            <Image
              src={info.src}
              alt={info.alt}
              width={info.width}
              height={info.height}
              sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 100vw"
            />
          </Figure>

          <div className="wn-home-infographic__text">
            <h3 id={`${info.id}-title`} className="wn-home-infographic__title">
              <T>{info.title}</T>
            </h3>
            <p className="wn-home-infographic__subtitle">
              <T>{info.subtitle}</T>
            </p>

            <dl className="wn-home-infographic__figures">
              {info.figures.map((f) => (
                <div key={f.scheme} className="wn-home-infographic__row">
                  <dt>
                    <span className="wn-home-infographic__scheme"><T>{f.scheme}</T></span>
                    {f.audience ? (
                      <span className="wn-home-infographic__audience"><T>{f.audience}</T></span>
                    ) : null}
                  </dt>
                  {f.values.map((v) => (
                    <dd key={v}><T>{v}</T></dd>
                  ))}
                </div>
              ))}
            </dl>

            <div className="wn-home-infographic__actions">
              <Button
                variant="primary"
                appearance="outlined"
                iconLeft={<Icon name="zoom_in" aria-hidden />}
                onClick={() => setOpen(i)}
              >
                <T>View Full Size</T>
              </Button>
              <Button
                href={info.src}
                linkAs={Link}
                download={`${info.id}.png`}
                variant="primary"
                appearance="text"
                iconLeft={<Icon name="download" aria-hidden />}
              >
                <T>Download Image</T>
              </Button>
            </div>
          </div>
        </article>
      ))}
      <Lightbox
        open={open !== null}
        index={open ?? 0}
        items={INFOGRAPHICS.map((info) => ({
          type: "image" as const,
          src: info.src,
          alt: info.alt,
          caption: info.title,
        }))}
        onClose={() => setOpen(null)}
      />
    </Band>
  );
}
