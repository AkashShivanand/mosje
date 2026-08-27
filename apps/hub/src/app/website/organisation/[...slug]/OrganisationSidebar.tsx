"use client";

import { usePathname } from "next/navigation";
import { SidebarNav, type SidebarNavGroup } from "@mosje/design-system";

export function OrganisationSidebar({ rootSlug, relatedPages, orgSections }: { rootSlug: string, relatedPages: any[], orgSections: any[] }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const pathname = usePathname();

  // Group pages by their sub-path
  const grouped = new Map<string, any[]>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const flatPages: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  
  for (const page of relatedPages) {
    if (page.slug === rootSlug) continue; // Skip root
    const segments = page.slug.substring(rootSlug.length + 1).split('/');
    const groupName = segments.length > 1 ? segments[0] : 'pages';
    
    if (!grouped.has(groupName)) grouped.set(groupName, []);
    grouped.get(groupName)!.push({
      label: page.title,
      href: `/website/organisation/${page.slug}`,
    });
    
    if (segments.length === 1) {
      flatPages.push(page);
    }
  }

  const navGroups: SidebarNavGroup[] = [];

  // If we have sub-groups (like components, pmajy, reports)
  if (grouped.size > 0 && Array.from(grouped.keys()).some(k => k !== 'pages')) {
    navGroups.push({
      items: Array.from(grouped.entries()).map(([name, pages]) => ({
        label: name.toUpperCase(),
        icon: "folder",
        href: pages[0].href,
        children: pages.map(p => ({
          label: p.label,
          href: p.href
        }))
      }))
    });
  } else if (flatPages.length > 0) {
    // Just a flat list of pages
    navGroups.push({
      label: "Pages",
      items: flatPages.map(rp => ({
        label: rp.title,
        href: `/website/organisation/${rp.slug}`,
        icon: "article"
      }))
    });
  }

  // On this page jump links
  if (orgSections.length > 1) {
    navGroups.push({
      label: "On this page",
      items: orgSections.filter(s => s.heading).map(sec => ({
        label: sec.heading,
        href: `#${(sec.heading || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        icon: "tag"
      }))
    });
  }

  return (
    <div className="sticky top-28 hidden lg:block shrink-0">
      <SidebarNav 
        groups={navGroups} 
        pathname={pathname} 
        collapsed={false} 
      />
    </div>
  );
}
