import { Header } from "@/components/website/Header";
import { SamaveshBanner } from "@/components/website/SamaveshBanner";
import { SiteFooter } from "@/components/website/SiteFooter";
import { ImportantLinks } from "@/components/website/ImportantLinks";
import { ErrorView } from "@mosje/design-system";

export default function WebsiteNotFound() {
  return (
    <>
      <Header />
      <SamaveshBanner />
      <main id="content" className="flex-1 bg-surface-base">
        <div className="py-12 md:py-16">
          <ErrorView
            kind="404"
            badge="404 · Page Not Found"
            title="We Couldn’t Find That Page"
            description="The page or document you are looking for might have been removed, had its name changed, or is temporarily unavailable during the Ministry’s digital consolidation."
            searchUrl="/website/search?q="
            primaryAction={{
              label: "Return to Homepage",
              href: "/website",
              icon: "home",
            }}
          />
        </div>
      </main>
      <SiteFooter />
      <ImportantLinks />
    </>
  );
}
