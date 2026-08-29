import { ErrorView } from "@mosje/design-system";

export default function RootNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-surface-base">
      <ErrorView
        kind="404"
        badge="404 · Page Not Found"
        title="We Couldn’t Find That Page"
        description="The resource you requested does not exist on the Ministry of Social Justice & Empowerment digital estate."
        searchUrl="/website/search?q="
        primaryAction={{
          label: "Go to Main Website",
          href: "/website",
          icon: "home",
        }}
        secondaryAction={{
          label: "View All Portals",
          href: "/portals",
          icon: "apps",
        }}
      />
    </main>
  );
}
