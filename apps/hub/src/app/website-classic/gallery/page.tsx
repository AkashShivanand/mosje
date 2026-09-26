import type { Metadata } from "next";
import { GalleryClient } from "./gallery-client";
import { getGalleryItems } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Gallery";
const DESCRIPTION =
  "Photographs, videos and news coverage of the programmes of the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/gallery" }),
};

export default function GalleryPage() {
  /*
   * Sorted newest first on the SERVER, once, rather than in the client
   * component's `useMemo` — the order never changes with a filter, so deriving
   * it per keystroke would be work for nothing on a 590-record set.
   */
  const items = [...getGalleryItems()].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
  return <GalleryClient items={items} />;
}
