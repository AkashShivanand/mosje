import { ErrorView } from "@mosje/design-system";

export default function PortalsNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-surface-base">
      <ErrorView
        kind="404"
        badge="404 · Portal Not Found"
        title="Portal Service Not Found"
        description="The workflow portal or administrative service you requested could not be located. It may have been renamed or migrated."
        searchUrl={null}
        primaryAction={{
          label: "View All Portals",
          href: "/portals",
          icon: "dashboard",
        }}
        secondaryAction={{
          label: "Return to MoSJE Website",
          href: "/website",
          icon: "home",
        }}
        wayfindingLinks={[
          {
            title: "Portals Directory",
            description: "Browse all 20 workflow portals across MoSJE schemes and divisions.",
            href: "/portals",
            icon: "apps",
          },
          {
            title: "e-Utthaan Portal",
            description: "Online project proposals and monitoring system for NGOs.",
            href: "/portals/eutthan-admin",
            icon: "admin_panel_settings",
          },
          {
            title: "SMILE Scheme Portal",
            description: "Comprehensive rehabilitation and livelihood support portal.",
            href: "/portals/smile-admin",
            icon: "volunteer_activism",
          },
          {
            title: "Main Website",
            description: "Return to the unified Ministry website homepage.",
            href: "/website",
            icon: "public",
          },
        ]}
      />
    </main>
  );
}
