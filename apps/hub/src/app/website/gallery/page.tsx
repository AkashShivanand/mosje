import type { Metadata } from "next";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Photo Gallery — DoSJE",
  description:
    "Photo gallery of events, programmes and initiatives of the Department of Social Justice & Empowerment, Government of India.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
