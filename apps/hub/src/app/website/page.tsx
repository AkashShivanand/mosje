import type { Metadata } from "next";
import { Masthead } from "@/components/website-next/chrome/Masthead";
import { WebsiteFooter } from "@/components/website-next/chrome/Footer";
import { Hero } from "@/components/website-next/home/Hero";
import { Audiences } from "@/components/website-next/home/Audiences";
import { Offerings } from "@/components/website-next/home/Offerings";
import { Latest } from "@/components/website-next/home/Latest";
import { Campaign } from "@/components/website-next/home/Campaign";
import { Organisations } from "@/components/website-next/home/Organisations";
import { Leadership } from "@/components/website-next/home/Leadership";
import { Helplines } from "@/components/website-next/home/Helplines";

export const metadata: Metadata = {
  title: "Department of Social Justice & Empowerment, Government of India",
  description:
    "Schemes, services and support from the Department of Social Justice & Empowerment for Scheduled Castes, Other Backward Classes, senior citizens, transgender persons and other groups.",
};

/**
 * The redesigned home page. Section order is task first, institution second:
 * what can I do → who is it for → what is offered → what is new → the national
 * campaign → who runs it → the Department → whom to call.
 */
export default function Home() {
  return (
    <>
      <Masthead />
      <main id="content" tabIndex={-1} className="wn-main">
        <Hero />
        <Audiences />
        <Offerings />
        <Latest />
        <Campaign />
        <Organisations />
        <Leadership />
        <Helplines />
      </main>
      <WebsiteFooter />
    </>
  );
}
