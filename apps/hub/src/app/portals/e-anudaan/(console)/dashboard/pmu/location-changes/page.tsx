"use client";

import { ChangeRequestDesk } from "@/components/e-anudaan/change-request-desk";

/** Location Changes — the PMU verifies or returns an NGO's request to move a project (inventory §40). */
export default function LocationChangesPage() {
  return <ChangeRequestDesk kind="location" />;
}
