import { Header } from "@/components/website/Header";
import { HeroCarousel } from "@/components/website/HeroCarousel";
import { AboutUs } from "@/components/website/AboutUs";
import { Offerings } from "@/components/website/Offerings";
import { RecentDocuments } from "@/components/website/RecentDocuments";
import { WebsiteSiteFooter } from "@/components/website/SiteFooter";
import { AssistantChat } from "./AssistantChat";

/**
 * The assistant option, shown where it would live: on the website's own home
 * page, built from the same components the website renders. Only the chat is
 * the prototype — it asks the two questions over the scheme master. The
 * website's own assistant is not mounted on this route, so there is one.
 */
export default function AssistantPrototype() {
  return (
    <>
      <Header hideAdminLogin />
      <main id="main-content" className="flex-1">
        <HeroCarousel />
        <AboutUs />
        <Offerings />
        <RecentDocuments />
      </main>
      <WebsiteSiteFooter />
      <AssistantChat />
    </>
  );
}
