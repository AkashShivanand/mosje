"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { Icon } from "@mosje/design-system";

interface GalleryImage {
  src: string;
  caption: string;
}

const IMAGES: GalleryImage[] = [
  { src: "/website/images/Banner-6.png", caption: "SAMAVESH outreach programme" },
  { src: "/website/images/Banner-7.png", caption: "Skill-development initiative under SMILE" },
  { src: "/website/images/Banner-8.png", caption: "Scholarship felicitation ceremony" },
  { src: "/website/images/Banner-9.png", caption: "Nasha Mukt Bharat Abhiyaan awareness drive" },
  { src: "/website/images/Banner-10.png", caption: "Dr. Ambedkar Jayanti commemoration" },
  { src: "/website/images/portal-banner-images.png", caption: "Launch of citizen-service portals" },
  { src: "/website/images/5-234x300.jpg", caption: "Beneficiary interaction camp" },
  { src: "/website/images/3-300x251.jpg", caption: "Community empowerment workshop" },
  { src: "/website/images/65811748325059-300x291.jpg", caption: "Field visit to an Adarsh Gram" },
];

export function GalleryClient() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close]);

  const active = activeIndex === null ? null : IMAGES[activeIndex];

  return (
    <PageLayout
      title="Photo Gallery"
      breadcrumb={[{ label: "Events & Gallery" }, { label: "Gallery" }]}
      description="A glimpse of events, programmes and initiatives of the Department of Social Justice & Empowerment."
    >
      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-10">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IMAGES.map((image, index) => (
              <li key={image.src}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View larger image: ${image.caption}`}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-200 bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:ring-offset-2"
                >
                  <Image
                    src={image.src}
                    alt={image.caption}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-[13px] font-medium text-white">
                    {image.caption}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close image viewer"
              className="absolute -top-3 -right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:ring-offset-2"
            >
              <Icon name="close" size={20} aria-hidden="true" />
            </button>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-muted">
              <Image
                src={active.src}
                alt={active.caption}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            <p className="mt-3 text-center text-[14px] font-medium text-white">{active.caption}</p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
