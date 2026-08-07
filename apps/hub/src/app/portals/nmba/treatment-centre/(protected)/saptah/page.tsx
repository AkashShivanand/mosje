"use client";

// DS Audit (design-system-first):
//   Button · Input · Select · FormField · Alert · Modal · SideSheet → ✅ @mosje/design-system
//   MediaGalleryInput (multi image/video upload) · Lightbox (gallery viewer) → ✅ @mosje/design-system
//   TCListPage · DataTable → ✅ shared treatment-centre component
//   IconAction · RowActions → ✅ shared treatment-centre row-actions
//   MediaStack (table thumbnail cell) → page-local (wired to this page's lightbox state)

import * as React from "react";
import { Alert, Button, FormField, Icon, Input, Lightbox, MediaGalleryInput, Modal, Select, SideSheet, type GalleryMediaItem, type LightboxItem } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { useTCSession } from "@/lib/nmba/treatment-centre/session-context";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { IconAction, RowActions } from "@/components/nmba/treatment-centre/row-actions";
import type { ColumnDef } from "@/components/nmba/data-table";
import type { SaptahEvent, SaptahEventType, SaptahMedia } from "@/lib/nmba/treatment-centre/types";

// -------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------

type Row = SaptahEvent & { sno: number; treatmentCenter: string };

const EVENT_OPTIONS: { label: string; value: SaptahEventType }[] = [
  { label: "International Day Against Drug Abuse and Illicit Trafficking", value: "International Day Against Drug Abuse and Illicit Trafficking" },
  { label: "Nasha Mukt Bharat Saptah 2026",                               value: "Nasha Mukt Bharat Saptah 2026" },
];

const ACTIVITY_OPTIONS = [
  "Slogan Writing Competition",
  "Rangoli Making Competition",
  "Drawing competition",
  "Marathon/ Walkathon/Cyclothon",
  "Training and awareness generation activities with children, adolescents, youth and Nasha Mukti Mitr",
  "Sports and physical activities",
  "Seminars, Webinars or Workshops for awareness generation",
  "Nukkad Natak, Skits and Play",
  "Flash mobs, drives and Rallies",
  "NMBA pledge (including e-pledge) in educational institutions, hotspots and public places",
  "Community mapping of nearby areas and identifying hotspots for qualitative analysis",
  "Wall Paintings/Graffiti and art competitions",
  "Video-making or short film making",
  "Activities with/NSS/NCC/ NYK volunteers and spiritual organizations",
  "Yoga and Meditation Activities",
  "Documentaries/Film Screenings on substance use and discussions",
  "Awareness generation through NMBA vehicles",
  "Sensitizing the general public about the different schemes and programs of the Ministry with regards to existing deaddiction facilities in the state and districts along with awareness generation in high risk areas",
  "Distribution of IEC Material available on the NMBA website",
  "Organising Inter/Intra University Debate/ Essay/ Painting/ Drawing Competitions (online/offline,any)",
  "Formation of Clubs (for substance use prevention) in educational institutions, communities, in collaboration with service organizations (Rotaract, Lion, etc.)",
  "Identifying influential alumnis from the colleges to advertise the Abhiyaan",
  "Focus Group Discussions with various stakeholders in high risk areas (online and offline)",
  "Social Media Campaigns",
  "Identification and involvement of local brand ambassadors, social media influencers, etc",
  "Surveys and preparatory studies",
  "Celebration of international/national days of importance (for ex: celebrating World Aids Day and spreading awareness about AIDS and how Injecting drug users increase the chances of getting AIDS)",
  "Using regional channels, newspapers, radio's and other media outlets,available to discuss the Nasha Mukt Bharat Abhiyaan",
  "Formation of support groups and initiating counselling networks to address the issues related to substance use",
  "A sub-campaign to increase awareness about the ban of licit/ illicit substances near college areas with the help of police/competent authority",
  "Involvement and convergence with various government departments",
  "Networking with the self-help groups/local leaders/ nongovernmental organizations to reach out to high-risk groups in the neighborhood",
  "Activities in vulnerable areas including border and tribal regions",
  "Health Related Activities/Camps",
];

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

function fmtDate(iso: string | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function isWithinSaptahWindow(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d >= new Date("2026-06-26") && d <= new Date("2026-07-02");
}

/** SaptahMedia[] (store) <-> GalleryMediaItem[] (form control). */
const toGallery = (media?: SaptahMedia[]): GalleryMediaItem[] =>
  (media ?? []).map((m) => ({ url: m.url, type: m.type, name: m.name ?? "Attachment", poster: m.poster }));

const toLightbox = (media: SaptahMedia[]): LightboxItem[] =>
  media.map((m) => ({ type: m.type, src: m.url, caption: m.name, poster: m.poster, alt: m.name }));

// -------------------------------------------------------------------------
// Form state
// -------------------------------------------------------------------------

type FormState = {
  event: SaptahEventType | "";
  activity: string;
  date: string;
  coordinatingDept: string;
  totalParticipants: string;
  maleParticipants: string;
  femaleParticipants: string;
  numEducationalInstitutions: string;
  isCompleted: "Completed" | "Not Completed" | "";
};

const EMPTY_FORM: FormState = {
  event: "",
  activity: "",
  date: "",
  coordinatingDept: "",
  totalParticipants: "",
  maleParticipants: "",
  femaleParticipants: "",
  numEducationalInstitutions: "",
  isCompleted: "",
};

function formFromEvent(ev: SaptahEvent): FormState {
  return {
    event: ev.event,
    activity: ev.activity,
    date: ev.date,
    coordinatingDept: ev.coordinatingDept,
    totalParticipants: String(ev.totalParticipants),
    maleParticipants: String(ev.maleParticipants),
    femaleParticipants: String(ev.femaleParticipants),
    numEducationalInstitutions: String(ev.numEducationalInstitutions),
    isCompleted: ev.isCompleted,
  };
}

// -------------------------------------------------------------------------
// Small presentational helpers
// -------------------------------------------------------------------------

/** Section divider inside the SideSheet form — breaks a long form into groups. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 mt-3 flex items-center gap-3 first:mt-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-navy">{children}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

// -------------------------------------------------------------------------
// Add / Edit SideSheet — rendered only when open; key-based remount resets form
// -------------------------------------------------------------------------

const FORM_ID = "saptah-activity-form";

function ActivitySheet({
  onClose,
  target,
}: {
  onClose: () => void;
  target: SaptahEvent | null;
}) {
  const { toast } = useToast();
  const store = useTCStore();
  const isEdit = !!target;

  // Lazy initializers eliminate the need for a sync-setState effect.
  const [f, setF] = React.useState<FormState>(() => target ? formFromEvent(target) : EMPTY_FORM);
  const [media, setMedia] = React.useState<GalleryMediaItem[]>(() => toGallery(target?.media));
  const [coords, setCoords] = React.useState<{ lat: string; lng: string } | null>(
    () => target?.latitude ? { lat: target.latitude, lng: target.longitude ?? "" } : null,
  );
  const [gettingLocation, setGettingLocation] = React.useState(false);
  const [errors, setErrors] = React.useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = React.useState(false);

  const isSaptahEvent = f.event === "Nasha Mukt Bharat Saptah 2026";
  const isTimeGated = isSaptahEvent && !!f.date && !isWithinSaptahWindow(f.date);

  // Soft, non-blocking sanity hint: gender split should add up to the total.
  const totalNum = Number(f.totalParticipants);
  const splitNum = (Number(f.maleParticipants) || 0) + (Number(f.femaleParticipants) || 0);
  const showSplitHint =
    f.totalParticipants !== "" && f.maleParticipants !== "" && f.femaleParticipants !== "" &&
    Number.isFinite(totalNum) && splitNum !== totalNum;

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: val }));

  const err = (key: string): string | undefined =>
    submitted && errors.has(key) ? "This field is required." : undefined;

  const getDeviceLocation = () => {
    setGettingLocation(true);
    setTimeout(() => {
      setCoords({ lat: "28.6139", lng: "77.2090" });
      setGettingLocation(false);
      toast("Geotag coordinates retrieved.", "success");
    }, 1000);
  };

  const resetForNext = () => {
    setF(EMPTY_FORM);
    setMedia([]);
    setCoords(null);
    setErrors(new Set());
    setSubmitted(false);
  };

  const submit = (addAnother: boolean) => {
    setSubmitted(true);

    if (isTimeGated) {
      toast("Cannot record Saptah activity outside June 26 – July 2, 2026.", "error");
      return;
    }

    const missing = new Set<string>();
    if (!f.event) missing.add("event");
    if (!f.activity) missing.add("activity");
    if (!f.date) missing.add("date");
    if (!f.coordinatingDept.trim()) missing.add("coordinatingDept");
    if (!f.totalParticipants) missing.add("totalParticipants");
    if (!f.maleParticipants) missing.add("maleParticipants");
    if (!f.femaleParticipants) missing.add("femaleParticipants");
    if (!f.numEducationalInstitutions) missing.add("numEducationalInstitutions");
    if (!f.isCompleted) missing.add("isCompleted");

    if (missing.size > 0) {
      setErrors(missing);
      toast("Please complete all required fields.", "error");
      return;
    }

    const payload = {
      event: f.event as SaptahEventType,
      activity: f.activity,
      date: f.date,
      coordinatingDept: f.coordinatingDept.trim(),
      totalParticipants: Number(f.totalParticipants) || 0,
      maleParticipants: Number(f.maleParticipants) || 0,
      femaleParticipants: Number(f.femaleParticipants) || 0,
      numEducationalInstitutions: Number(f.numEducationalInstitutions) || 0,
      isCompleted: f.isCompleted as "Completed" | "Not Completed",
      media: media.map<SaptahMedia>((m) => ({ url: m.url, type: m.type, name: m.name, poster: m.poster })),
      latitude: coords?.lat,
      longitude: coords?.lng,
    };

    if (isEdit && target) {
      store.updateSaptahEvent(target.id, payload);
      toast("Activity updated successfully.", "success");
      onClose();
      return;
    }

    store.addSaptahEvent(payload);
    if (addAnother) {
      toast("Activity saved. Add the next one.", "success");
      resetForNext();
    } else {
      toast("Activity recorded successfully.", "success");
      onClose();
    }
  };

  return (
    <SideSheet
      open={true}
      onClose={onClose}
      title={isEdit ? "Edit Activity" : "Add New Activity"}
      size="lg"
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          {!isEdit && (
            <Button type="button" appearance="outlined" onClick={() => submit(true)} disabled={isTimeGated}>
              Save &amp; Add Another
            </Button>
          )}
          <Button type="submit" form={FORM_ID} variant="primary" disabled={isTimeGated}>
            {isEdit ? "Save Changes" : "Save Entry"}
          </Button>
        </>
      }
    >
      {isTimeGated && (
        <Alert status="error" className="mb-4">
          <strong>Date outside window:</strong> Saptah entries are restricted to June 26 – July 2, 2026.
        </Alert>
      )}

      <form
        id={FORM_ID}
        onSubmit={(e) => { e.preventDefault(); submit(false); }}
        className="flex flex-col gap-4"
      >
        {/* ---- Campaign & Activity ---- */}
        <SectionLabel>Campaign &amp; Activity</SectionLabel>

        <FormField label="Event" required error={err("event")}>
          {(c) => (
            <Select
              {...c}
              value={f.event}
              onChange={(e) => set("event", e.target.value as SaptahEventType | "")}
              options={[{ label: "Select Event", value: "" }, ...EVENT_OPTIONS]}
              invalid={submitted && errors.has("event")}
            />
          )}
        </FormField>

        <FormField label="Activity" required error={err("activity")}>
          {(c) => (
            <Select
              {...c}
              value={f.activity}
              onChange={(e) => set("activity", e.target.value)}
              options={[{ label: "Select Activity", value: "" }, ...ACTIVITY_OPTIONS.map((a) => ({ label: a, value: a }))]}
              invalid={submitted && errors.has("activity")}
            />
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date of Activity" required error={err("date")}>
            {(c) => (
              <Input
                {...c}
                type="date"
                value={f.date}
                onChange={(e) => set("date", e.target.value)}
                invalid={submitted && errors.has("date")}
              />
            )}
          </FormField>

          <FormField label="Status" required error={err("isCompleted")}>
            {(c) => (
              <Select
                {...c}
                value={f.isCompleted}
                onChange={(e) => set("isCompleted", e.target.value as "Completed" | "Not Completed" | "")}
                options={[
                  { label: "Select Status",   value: "" },
                  { label: "Completed",        value: "Completed" },
                  { label: "Not Completed",    value: "Not Completed" },
                ]}
                invalid={submitted && errors.has("isCompleted")}
              />
            )}
          </FormField>
        </div>

        {/* ---- Participation ---- */}
        <SectionLabel>Participation</SectionLabel>

        <FormField label="Coordinating Department" required error={err("coordinatingDept")}>
          {(c) => (
            <Input
              {...c}
              value={f.coordinatingDept}
              onChange={(e) => set("coordinatingDept", e.target.value)}
              placeholder="e.g. District Social Welfare Dept"
              invalid={submitted && errors.has("coordinatingDept")}
            />
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Total Participants" required error={err("totalParticipants")}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.totalParticipants}
                onChange={(e) => set("totalParticipants", e.target.value)}
                placeholder="0"
                invalid={submitted && errors.has("totalParticipants")}
              />
            )}
          </FormField>

          <FormField label="Educational Institutions" required error={err("numEducationalInstitutions")}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.numEducationalInstitutions}
                onChange={(e) => set("numEducationalInstitutions", e.target.value)}
                placeholder="0"
                invalid={submitted && errors.has("numEducationalInstitutions")}
              />
            )}
          </FormField>

          <FormField label="Males / Boys" required error={err("maleParticipants")}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.maleParticipants}
                onChange={(e) => set("maleParticipants", e.target.value)}
                placeholder="0"
                invalid={submitted && errors.has("maleParticipants")}
              />
            )}
          </FormField>

          <FormField label="Females / Girls" required error={err("femaleParticipants")}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.femaleParticipants}
                onChange={(e) => set("femaleParticipants", e.target.value)}
                placeholder="0"
                invalid={submitted && errors.has("femaleParticipants")}
              />
            )}
          </FormField>
        </div>

        {showSplitHint && (
          <p className="-mt-1 text-xs text-amber-700">
            Males + Females ({splitNum.toLocaleString("en-IN")}) doesn&apos;t match Total
            ({totalNum.toLocaleString("en-IN")}). You can still save.
          </p>
        )}

        {/* ---- Documentation ---- */}
        <SectionLabel>Documentation</SectionLabel>

        <FormField label="Images / Videos">
          {(c) => (
            <MediaGalleryInput
              {...c}
              value={media}
              onChange={setMedia}
            />
          )}
        </FormField>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-4 py-3">
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Current Location</span>
            <span className="font-mono text-sm text-navy">
              {coords ? `${coords.lat}°, ${coords.lng}°` : "Not captured"}
            </span>
          </div>
          <Button
            type="button"
            appearance="outlined"
            onClick={getDeviceLocation}
            disabled={gettingLocation}
          >
            {gettingLocation ? "Capturing…" : "Get Location"}
          </Button>
        </div>
      </form>
    </SideSheet>
  );
}

// -------------------------------------------------------------------------
// Table media cell — single thumbnail + corner count badge → lightbox.
// Matches the CPLI Training page's PhotoBadge for estate-wide consistency
// (one thumbnail with a +N badge, not an overlapping stack).
// -------------------------------------------------------------------------

function MediaBadge({ media, onOpen }: { media?: SaptahMedia[]; onOpen: (index: number) => void }) {
  if (!media || media.length === 0) {
    return (
      <span
        className="inline-flex h-10 w-14 items-center justify-center rounded-lg border border-dashed border-line bg-surface-muted text-ink-hint"
        aria-label="No media uploaded"
        title="No media"
      >
        <Icon name="photo_camera" size={16} aria-hidden />
      </span>
    );
  }

  const first = media[0];
  if (!first) return null;
  const isVideo = first.type === "video";

  return (
    <button
      type="button"
      onClick={() => onOpen(0)}
      aria-label={`View ${media.length} attachment${media.length > 1 ? "s" : ""}`}
      className="group relative inline-block shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1"
    >
      {/* Thumbnail */}
      <span
        className="relative block overflow-hidden rounded-lg border border-line/60 shadow-sm transition-transform duration-150 group-hover:scale-105 group-hover:shadow-md"
        style={{ width: 64, height: 48 }}
      >
        {/* data:/blob: URI (synthetic or uploaded media) — not next/image-loadable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isVideo ? (first.poster ?? first.url) : first.url}
          alt={first.name ?? `Attachment 1 of ${media.length}`}
          width={64}
          height={48}
          className="block h-full w-full object-cover"
          loading="lazy"
        />
        {/* Video → persistent play glyph; image → zoom-in on hover */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-colors duration-150 ${
            isVideo ? "bg-black/30" : "bg-black/0 group-hover:bg-black/30"
          }`}
          aria-hidden
        >
          {isVideo ? (
            <Icon name="play_arrow" size={16} className="text-white drop-shadow" fill />
          ) : (
            <Icon name="zoom_in" size={16} className="text-white opacity-0 drop-shadow transition-opacity duration-150 group-hover:opacity-100" />
          )}
        </span>
      </span>

      {/* Count badge — bottom-right corner, shown only for 2+ items */}
      {media.length > 1 && (
        <span
          className="absolute -bottom-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-navy px-1.5 text-[10px] font-bold leading-none text-white shadow ring-2 ring-white"
          aria-hidden
        >
          +{media.length - 1}
        </span>
      )}
    </button>
  );
}

// -------------------------------------------------------------------------
// Page
// -------------------------------------------------------------------------

export default function SaptahPage() {
  const store = useTCStore();
  const session = useTCSession();
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<SaptahEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<SaptahEvent | null>(null);
  const [viewer, setViewer] = React.useState<{ items: LightboxItem[]; index: number } | null>(null);

  const openAdd  = () => { setEditTarget(null);   setSheetOpen(true); };
  const openEdit = (ev: SaptahEvent) => { setEditTarget(ev); setSheetOpen(true); };
  const closeSheet = () => { setSheetOpen(false); setEditTarget(null); };
  const openViewer = (media: SaptahMedia[], index: number) =>
    setViewer({ items: toLightbox(media), index });

  const confirmDelete = () => {
    if (!deleteTarget) return;
    store.removeSaptahEvent(deleteTarget.id);
    toast("Activity deleted.", "success");
    setDeleteTarget(null);
  };

  const rows: Row[] = store.saptahEvents.map((s, i) => ({
    ...s,
    sno: i + 1,
    treatmentCenter: session.centerName,
  }));

  const columns: ColumnDef<Row>[] = [
    { key: "sno", header: "S.No" },
    { key: "treatmentCenter", header: "Treatment Center" },
    {
      key: "activity",
      header: "Type of Activity",
      render: (row) => (
        <span className="block max-w-[180px] truncate" title={row.activity}>
          {row.activity}
        </span>
      ),
      exportValue: (row) => row.activity,
    },
    {
      key: "date",
      header: "Date of Activity",
      render: (row) => fmtDate(row.date),
      exportValue: (row) => fmtDate(row.date),
    },
    {
      key: "coordinatingDept",
      header: "Coordinating Dept.",
      render: (row) => (
        <span className="block max-w-[160px] truncate" title={row.coordinatingDept}>
          {row.coordinatingDept}
        </span>
      ),
      exportValue: (row) => row.coordinatingDept,
    },
    { key: "totalParticipants",         header: "Total" },
    { key: "maleParticipants",           header: "Males/Boys" },
    { key: "femaleParticipants",         header: "Females/Girls" },
    { key: "numEducationalInstitutions", header: "Edu. Inst." },
    {
      key: "media",
      header: "Images/Videos",
      render: (row) => <MediaBadge media={row.media} onOpen={(i) => openViewer(row.media ?? [], i)} />,
      exportValue: (row) => (row.media?.length ? `${row.media.length} file(s)` : "No media"),
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (row) => fmtDate(row.createdAt ?? row.date),
      exportValue: (row) => fmtDate(row.createdAt ?? row.date),
    },
    {
      key: "actions",
      header: "Action",
      noExport: true,
      render: (row) => (
        <RowActions>
          <IconAction
            icon="edit"
            label={`Edit ${row.activity} activity`}
            tone="warning"
            onClick={() => openEdit(row)}
          />
          <IconAction
            icon="delete"
            label={`Delete ${row.activity} activity`}
            tone="danger"
            onClick={() => setDeleteTarget(row)}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <TCListPage
        title="Nasha Mukt Bharat Saptah 2026"
        columns={columns}
        data={rows}
        searchKeys={["activity", "coordinatingDept", "treatmentCenter"]}
        fileName="nmb-saptah-2026"
        action={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-100"
          >
            + Add New Activity
          </button>
        }
      />

      {sheetOpen && (
        <ActivitySheet
          key={editTarget?.id ?? "__new__"}
          onClose={closeSheet}
          target={editTarget}
        />
      )}

      <Lightbox
        open={!!viewer}
        items={viewer?.items ?? []}
        index={viewer?.index ?? 0}
        onClose={() => setViewer(null)}
      />

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Activity"
        footer={
          <>
            <Button appearance="outlined" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-ink">
          Delete the <strong>{deleteTarget?.activity}</strong> activity recorded on{" "}
          <strong>{fmtDate(deleteTarget?.date)}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
