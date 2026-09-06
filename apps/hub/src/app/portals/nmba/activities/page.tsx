"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/nmba/public-shell";
import { AddEventModal } from "@/components/nmba/add-event-modal";
import { ACTIVITIES, ACTIVITIES_TOTAL, ACTIVITY_TYPES, FACILITIES } from "@/lib/nmba/mock-data";
import { STATES, STATE_DISTRICTS } from "@/lib/nmba/states";
import type { ActivityRow } from "@/lib/nmba/types";
import {
  Button,
  Icon,
  SectionTitle,
  Select,
  WorklistScreen,
  type WorklistColumn,
} from "@mosje/design-system";

const FacilityMap = dynamic(
  () => import("@/components/nmba/facility-map").then((m) => m.FacilityMap),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-xl bg-surface-muted" /> }
);

/**
 * Twelve columns, and `priority` is what lets them survive a phone.
 *
 * 1 — the activity itself, which becomes the card's title.
 * 2 — where, when and how many, which become the card's label/value pairs.
 * 3 — the administrative detail a citizen on a phone is not looking for.
 *
 * Before this page moved onto the template it rendered all twelve as a table at
 * every width, so on a phone the table ran off the right edge and the last four
 * columns were unreachable.
 */
const COLUMNS: WorklistColumn<ActivityRow>[] = [
  { key: "activity", header: "Activity", priority: 1, sortable: true },
  { key: "state", header: "State", priority: 2, sortable: true },
  { key: "district", header: "District", priority: 2 },
  { key: "activityDate", header: "Date", priority: 2, sortable: true },
  { key: "totalParticipants", header: "Total", priority: 2, sortable: true },
  { key: "maleParticipants", header: "Male", priority: 3 },
  { key: "femaleParticipants", header: "Female", priority: 3 },
  { key: "coordinatingDepartment", header: "Department", priority: 3 },
  { key: "educationalInstitutions", header: "Edu. Inst.", priority: 3 },
  { key: "location", header: "Location", priority: 3 },
  { key: "createdBy", header: "Created By", priority: 3 },
  { key: "createdAt", header: "Created At", priority: 3 },
];

export default function ActivitiesPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState("");
  const [filterDistrict, setFilterDistrict] = React.useState("");
  const [filterActivity, setFilterActivity] = React.useState("");

  const districts = filterState ? (STATE_DISTRICTS[filterState] ?? []) : [];

  const filtered = ACTIVITIES.filter((row) => {
    if (filterState && row.state !== filterState) return false;
    if (filterDistrict && row.district !== filterDistrict) return false;
    if (filterActivity && row.activity !== filterActivity) return false;
    return true;
  });

  /* The real predicate, not "is a select present". A default-valued select is
     not a filter, and counting it would tell a reader with an empty register to
     try clearing filters they never set. */
  const activeFilters = [filterState, filterDistrict, filterActivity].filter(Boolean).length;

  const clearFilters = () => {
    setFilterState("");
    setFilterDistrict("");
    setFilterActivity("");
  };

  return (
    <PublicShell>
      <WorklistScreen<ActivityRow>
        eyebrow="NASHA MUKT BHARAT ABHIYAAN"
        title="Activity Snapshot"
        meta={`${ACTIVITIES_TOTAL.toLocaleString("en-IN")} activities recorded nationally under the campaign.`}
        columns={COLUMNS}
        /* Every row the filters match, and the register total is the count the
           SET is drawn from — not the national figure above.

           This page previously passed the national 1,97,553 straight to the
           table as its `total` while handing it twenty rows, so the pager
           offered 21,951 pages and every one after the first was empty. The two
           numbers are different facts and the template keeps them apart: the
           pager counts what it holds, `registerTotal` feeds the count line, and
           the national figure is provenance and belongs in the meta line. */
        rows={filtered}
        registerTotal={ACTIVITIES.length}
        getRowId={(row) => row.id}
        noun="activity"
        pluralNoun="activities"
        activeFilterCount={activeFilters}
        onClearFilters={clearFilters}
        actions={
          <Button
            onClick={() => setModalOpen(true)}
            iconLeft={<Icon name="add" size={16} />}
            aria-label="Add new activity event"
          >
            Add Event
          </Button>
        }
        filters={
          <>
            <Select
              aria-label="Filter by state"
              value={filterState}
              onChange={(e) => {
                setFilterState(e.target.value);
                setFilterDistrict("");
              }}
            >
              <option value="">All States</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Filter by district"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              disabled={!filterState}
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Filter by activity type"
              value={filterActivity}
              onChange={(e) => setFilterActivity(e.target.value)}
            >
              <option value="">All Activity Types</option>
              {ACTIVITY_TYPES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </>
        }
      />

      {/* A second section of the page, not part of the worklist — so it carries
          its own heading, through the design system's SectionTitle rather than a
          hand-rolled one. */}
      <section className="mt-8" aria-labelledby="nmba-facilities">
        <SectionTitle
          as={2}
          headingId="nmba-facilities"
          title="Treatment Facilities"
          description="De-addiction and rehabilitation centres recorded in the campaign's facility register."
        />
        <div className="mt-4">
          <FacilityMap facilities={FACILITIES} mini legendCollapsible />
        </div>
      </section>

      <AddEventModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PublicShell>
  );
}
