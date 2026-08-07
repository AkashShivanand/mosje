"use client";

// DS Audit (design-system-first):
//   Button · Input · Textarea · Select · FormField · Checkbox · Search · Chip ·
//   Badge · SideSheet · Modal · Lightbox · EmptyState · MediaGalleryInput → ✅ @mosje/design-system
//   GalleryCard · GalleryRow · category chips · selection bar → page-local composition
//     (a photo gallery is not a DataTable; it reuses DS atoms rather than TCListPage)

import * as React from "react";
import { Alert, Badge, Button, Checkbox, Chip, EmptyState, FormField, Icon, Input, Lightbox, MediaGalleryInput, Modal, Search, Select, SideSheet, Textarea, type GalleryMediaItem, type LightboxItem } from "@mosje/design-system";
import { useTCSession } from "@/lib/nmba/treatment-centre/session-context";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { useToast } from "@/components/nmba/toast";
import type { CenterPhoto, CenterPhotoCategory } from "@/lib/nmba/treatment-centre/types";

// -------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------

const CATEGORIES: CenterPhotoCategory[] = [
  "Infrastructure",
  "Counselling & Therapy",
  "Awareness & Events",
  "Wellness & Recreation",
  "Staff & Team",
  "Community Outreach",
];

/**
 * Category → badge colour role, for a consistent album colour language.
 * Reserves "danger"/"warning" for actual severity elsewhere in the DS —
 * albums are all neutral taxonomy, so none of them read as an error state.
 */
const CATEGORY_TONE: Record<CenterPhotoCategory, React.ComponentProps<typeof Badge>["status"]> = {
  "Infrastructure": "info",
  "Counselling & Therapy": "primary",
  "Awareness & Events": "success",
  "Wellness & Recreation": "neutral",
  "Staff & Team": "info",
  "Community Outreach": "primary",
};

type SortKey = "newest" | "oldest" | "az" | "za";
const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Caption A → Z", value: "az" },
  { label: "Caption Z → A", value: "za" },
];

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

function fmtDate(iso: string | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

/** CenterPhoto[] → LightboxItem[] for the full-screen viewer. */
const toLightbox = (photos: CenterPhoto[]): LightboxItem[] =>
  photos.map((p) => ({ type: p.type, src: p.url, caption: p.caption, poster: p.poster, alt: p.caption }));

// -------------------------------------------------------------------------
// Upload SideSheet — bulk add via MediaGalleryInput
// -------------------------------------------------------------------------

const UPLOAD_FORM_ID = "photo-upload-form";

function UploadSheet({ onClose, uploadedBy }: { onClose: () => void; uploadedBy: string }) {
  const store = useTCStore();
  const { toast } = useToast();

  const [media, setMedia] = React.useState<GalleryMediaItem[]>([]);
  const [category, setCategory] = React.useState<CenterPhotoCategory | "">("");
  const [date, setDate] = React.useState<string>(todayIso());
  const [captionPrefix, setCaptionPrefix] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const stripExt = (name: string) => name.replace(/\.[^.]+$/, "");

  const submit = () => {
    setSubmitted(true);
    if (media.length === 0) {
      toast("Add at least one image or video.", "error");
      return;
    }
    if (!category) {
      toast("Choose an album for these files.", "error");
      return;
    }

    const prefix = captionPrefix.trim();
    const photos = media.map<Omit<CenterPhoto, "id">>((m, i) => ({
      url: m.url,
      type: m.type,
      poster: m.poster,
      caption: prefix
        ? media.length > 1 ? `${prefix} — ${i + 1}` : prefix
        : stripExt(m.name),
      category: category as CenterPhotoCategory,
      date: date || todayIso(),
      uploadedBy,
    }));

    store.addCenterPhotos(photos);
    toast(`${photos.length} item${photos.length > 1 ? "s" : ""} added to the gallery.`, "success");
    onClose();
  };

  return (
    <SideSheet
      open
      onClose={onClose}
      title="Upload Photos & Videos"
      size="lg"
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={UPLOAD_FORM_ID} variant="primary" disabled={media.length === 0}>
            Add {media.length > 0 ? `${media.length} ` : ""}to Gallery
          </Button>
        </>
      }
    >
      <form
        id={UPLOAD_FORM_ID}
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="flex flex-col gap-4"
      >
        <FormField label="Images / Videos" required error={submitted && media.length === 0 ? "Add at least one file." : undefined}>
          {(c) => <MediaGalleryInput {...c} value={media} onChange={setMedia} maxItems={20} />}
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Album" required error={submitted && !category ? "Select an album." : undefined}>
            {(c) => (
              <Select
                {...c}
                value={category}
                onChange={(e) => setCategory(e.target.value as CenterPhotoCategory | "")}
                options={[{ label: "Select album", value: "" }, ...CATEGORIES.map((v) => ({ label: v, value: v }))]}
                invalid={submitted && !category}
              />
            )}
          </FormField>

          <FormField label="Date">
            {(c) => <Input {...c} type="date" value={date} onChange={(e) => setDate(e.target.value)} max={todayIso()} />}
          </FormField>
        </div>

        <FormField label="Caption / Event name" hint="Optional. Left blank, each file keeps its own name.">
          {(c) => (
            <Input
              {...c}
              value={captionPrefix}
              onChange={(e) => setCaptionPrefix(e.target.value)}
              placeholder="e.g. Independence Day Awareness Drive"
            />
          )}
        </FormField>
      </form>
    </SideSheet>
  );
}

// -------------------------------------------------------------------------
// Edit SideSheet — single photo metadata
// -------------------------------------------------------------------------

const EDIT_FORM_ID = "photo-edit-form";

function EditSheet({ photo, onClose }: { photo: CenterPhoto; onClose: () => void }) {
  const store = useTCStore();
  const { toast } = useToast();

  const [caption, setCaption] = React.useState(photo.caption);
  const [category, setCategory] = React.useState<CenterPhotoCategory>(photo.category);
  const [date, setDate] = React.useState(photo.date);
  const [featured, setFeatured] = React.useState(!!photo.featured);
  const [submitted, setSubmitted] = React.useState(false);

  const submit = () => {
    setSubmitted(true);
    if (!caption.trim()) {
      toast("Caption can't be empty.", "error");
      return;
    }
    store.updateCenterPhoto(photo.id, { caption: caption.trim(), category, date, featured });
    toast("Photo details updated.", "success");
    onClose();
  };

  return (
    <SideSheet
      open
      onClose={onClose}
      title="Edit Photo Details"
      size="md"
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={EDIT_FORM_ID} variant="primary">Save Changes</Button>
        </>
      }
    >
      <div className="mb-4 overflow-hidden rounded-xl border border-line bg-black/5">
        {/* data:/blob: URI (synthetic or uploaded photo) — not next/image-loadable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.type === "video" ? (photo.poster ?? photo.url) : photo.url}
          alt={photo.caption}
          className="h-44 w-full object-cover"
        />
      </div>

      <form
        id={EDIT_FORM_ID}
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="flex flex-col gap-4"
      >
        <FormField label="Caption" required error={submitted && !caption.trim() ? "Caption is required." : undefined}>
          {(c) => (
            <Textarea
              {...c}
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              invalid={submitted && !caption.trim()}
            />
          )}
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Album" required>
            {(c) => (
              <Select
                {...c}
                value={category}
                onChange={(e) => setCategory(e.target.value as CenterPhotoCategory)}
                options={CATEGORIES.map((v) => ({ label: v, value: v }))}
              />
            )}
          </FormField>

          <FormField label="Date">
            {(c) => <Input {...c} type="date" value={date} onChange={(e) => setDate(e.target.value)} max={todayIso()} />}
          </FormField>
        </div>

        <Checkbox
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          label="Pin as a highlighted / cover photo"
        />
      </form>
    </SideSheet>
  );
}

// -------------------------------------------------------------------------
// Shared per-item action handler shape
// -------------------------------------------------------------------------

type ItemHandlers = {
  photo: CenterPhoto;
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
};

/** Small circular icon button used in card hover bar / list rows. */
function IconBtn({
  icon: iconName, label, onClick, danger,
}: { icon: string; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
        danger ? "text-danger" : "text-navy"
      }`}
    >
      <Icon name={iconName} size={16} />
    </button>
  );
}

// -------------------------------------------------------------------------
// Gallery card (grid view)
// -------------------------------------------------------------------------

function GalleryCard({
  photo, selectMode, selected, onToggleSelect, onOpen, onEdit, onDelete, onDownload,
}: ItemHandlers) {
  const isVideo = photo.type === "video";
  const thumb = isVideo ? (photo.poster ?? photo.url) : photo.url;

  return (
    <figure
      data-testid="gallery-card"
      data-caption={photo.caption}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-xs transition-shadow hover:shadow-md ${
        selected ? "border-navy ring-2 ring-navy/40" : "border-line"
      }`}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brandwash">
        <button
          type="button"
          onClick={selectMode ? onToggleSelect : onOpen}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-inset"
          aria-label={selectMode ? `Select ${photo.caption}` : `View ${photo.caption}`}
        >
          {/* data:/blob: URI (synthetic or uploaded photo) — not next/image-loadable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={photo.caption}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* hover scrim + zoom / play affordance */}
          <span
            className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${
              isVideo ? "bg-black/25" : "bg-black/0 group-hover:bg-black/25"
            }`}
            aria-hidden
          >
            {isVideo ? (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy shadow">
                <Icon name="play_arrow" size={20} fill />
              </span>
            ) : (
              <Icon name="zoom_in" size={28} className="text-white opacity-0 drop-shadow transition-opacity duration-200 group-hover:opacity-100" />
            )}
          </span>
        </button>

        {/* Selection checkbox */}
        {selectMode && (
          <label className="absolute left-2 top-2 z-10 flex cursor-pointer items-center justify-center rounded-md bg-white/90 p-0.5 shadow">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              className="h-4 w-4 accent-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1"
              aria-label={`Select ${photo.caption}`}
            />
          </label>
        )}

        {/* Type + featured chips */}
        <div className="pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-1">
          {photo.featured && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gov-yellow text-navy shadow" title="Highlighted">
              <Icon name="star" size={14} fill aria-hidden />
              <span className="sr-only">Highlighted photo</span>
            </span>
          )}
          {isVideo && (
            <span className="flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
              <Icon name="videocam" size={12} /> Video
            </span>
          )}
        </div>

        {/* Hover action bar */}
        {!selectMode && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 transition-transform duration-200 group-hover:translate-y-0">
            <IconBtn icon="zoom_in" label="View" onClick={onOpen} />
            <IconBtn icon="download" label="Download" onClick={onDownload} />
            <IconBtn icon="edit" label="Edit" onClick={onEdit} />
            <IconBtn icon="delete" label="Delete" onClick={onDelete} danger />
          </div>
        )}
      </div>

      {/* Caption + meta */}
      <figcaption className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-ink" title={photo.caption}>{photo.caption}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <Badge status={CATEGORY_TONE[photo.category]} size="sm">{photo.category}</Badge>
          <span className="shrink-0 text-[11px] text-ink-hint">{fmtDate(photo.date)}</span>
        </div>
      </figcaption>
    </figure>
  );
}

// -------------------------------------------------------------------------
// Gallery row (list view)
// -------------------------------------------------------------------------

function GalleryRow({
  photo, selectMode, selected, onToggleSelect, onOpen, onEdit, onDelete, onDownload,
}: ItemHandlers) {
  const isVideo = photo.type === "video";
  const thumb = isVideo ? (photo.poster ?? photo.url) : photo.url;

  return (
    <div
      data-testid="gallery-row"
      data-caption={photo.caption}
      className={`flex items-center gap-3 rounded-xl border bg-white p-2.5 transition-colors ${
        selected ? "border-navy bg-navy/5" : "border-line hover:bg-surface-muted"
      }`}
    >
      {selectMode && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="ml-1 h-4 w-4 shrink-0 accent-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1"
          aria-label={`Select ${photo.caption}`}
        />
      )}
      <button
        type="button"
        onClick={onOpen}
        className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-brandwash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        aria-label={`View ${photo.caption}`}
      >
        {/* data:/blob: URI (synthetic or uploaded photo) — not next/image-loadable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt={photo.caption} className="h-full w-full object-cover" loading="lazy" />
        {isVideo && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/30" aria-hidden>
            <Icon name="play_arrow" size={16} className="text-white" fill />
          </span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-ink" title={photo.caption}>
          {photo.featured && (
            <>
              <Icon name="star" size={14} className="shrink-0 text-gov-yellow" fill aria-hidden />
              <span className="sr-only">Highlighted photo —</span>
            </>
          )}
          {photo.caption}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ink-hint">
          <Badge status={CATEGORY_TONE[photo.category]} size="sm">{photo.category}</Badge>
          <span>{fmtDate(photo.date)}</span>
          {photo.uploadedBy && <span className="hidden sm:inline">· {photo.uploadedBy}</span>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 pr-1">
        <IconBtn icon="download" label="Download" onClick={onDownload} />
        <IconBtn icon="edit" label="Edit" onClick={onEdit} />
        <IconBtn icon="delete" label="Delete" onClick={onDelete} danger />
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Stat tile
// -------------------------------------------------------------------------

function StatTile({ icon: iconName, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-xs">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
        <Icon name={iconName} size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none text-navy">{value}</p>
        <p className="mt-1 truncate text-[11px] font-medium text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Page
// -------------------------------------------------------------------------

export default function CenterPhotosPage() {
  const session = useTCSession();
  const store = useTCStore();
  const { toast } = useToast();

  const photos = store.centerPhotos;

  // Demo-mode data-loss notice — dismissible per session, not permanently silenced,
  // since a refresh genuinely discards in-session uploads (no backend yet).
  const [demoNoticeOpen, setDemoNoticeOpen] = React.useState(true);

  // View / filter state
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<CenterPhotoCategory | "All">("All");
  const [sort, setSort] = React.useState<SortKey>("newest");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  // Selection state
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Dialog state
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<CenterPhoto | null>(null);
  const [deleteIds, setDeleteIds] = React.useState<string[] | null>(null);
  const [viewer, setViewer] = React.useState<{ items: LightboxItem[]; index: number } | null>(null);

  // ---- Derived: counts per album -----------------------------------------
  const countByCategory = React.useMemo(() => {
    const m = new Map<CenterPhotoCategory, number>();
    for (const p of photos) m.set(p.category, (m.get(p.category) ?? 0) + 1);
    return m;
  }, [photos]);

  const stats = React.useMemo(() => ({
    total: photos.length,
    images: photos.filter((p) => p.type === "image").length,
    videos: photos.filter((p) => p.type === "video").length,
    albums: new Set(photos.map((p) => p.category)).size,
  }), [photos]);

  // ---- Derived: visible list ---------------------------------------------
  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = photos.filter((p) => {
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      const matchesQ =
        !q ||
        p.caption.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.uploadedBy ?? "").toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
    return list.sort((a, b) => {
      switch (sort) {
        case "oldest": return a.date.localeCompare(b.date);
        case "az": return a.caption.localeCompare(b.caption);
        case "za": return b.caption.localeCompare(a.caption);
        case "newest":
        default: return b.date.localeCompare(a.date);
      }
    });
  }, [photos, query, activeCategory, sort]);

  // ---- Selection helpers --------------------------------------------------
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const allVisibleSelected = visible.length > 0 && visible.every((p) => selectedIds.has(p.id));
  const toggleSelectAll = () =>
    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev);
        visible.forEach((p) => next.delete(p.id));
        return next;
      }
      return new Set([...prev, ...visible.map((p) => p.id)]);
    });

  // ---- Actions ------------------------------------------------------------
  const openViewer = (photo: CenterPhoto) => {
    const items = toLightbox(visible);
    const index = Math.max(0, visible.findIndex((p) => p.id === photo.id));
    setViewer({ items, index });
  };

  const download = React.useCallback((photo: CenterPhoto) => {
    const a = document.createElement("a");
    a.href = photo.url;
    a.download = `${photo.caption.replace(/[^\w-]+/g, "_")}.${photo.type === "video" ? "mp4" : "jpg"}`;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const confirmDelete = () => {
    if (!deleteIds) return;
    store.removeCenterPhotos(deleteIds);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.delete(id));
      return next;
    });
    toast(`${deleteIds.length} item${deleteIds.length > 1 ? "s" : ""} deleted.`, "success");
    setDeleteIds(null);
  };

  const itemHandlers = (photo: CenterPhoto): ItemHandlers => ({
    photo,
    selectMode,
    selected: selectedIds.has(photo.id),
    onToggleSelect: () => toggleSelect(photo.id),
    onOpen: () => openViewer(photo),
    onEdit: () => setEditTarget(photo),
    onDelete: () => setDeleteIds([photo.id]),
    onDownload: () => download(photo),
  });

  const uploaderName = `${session.role} · ${session.centerName}`;

  return (
    <div className="flex flex-col gap-4">
      {/* ---- Header ---- */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy px-5 py-3.5 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <Icon name="collections" size={20} />
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">Centre Photo Gallery</h1>
            <p className="text-xs text-white/70">{session.centerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            appearance={selectMode ? "inverse" : "inverseOutlined"}
            onClick={() => { setSelectMode((s) => !s); setSelectedIds(new Set()); }}
            className="inline-flex items-center gap-2 text-sm font-semibold"
          >
            {selectMode ? <><Icon name="close" size={16} /> Done</> : <><Icon name="check_box" size={16} /> Select</>}
          </Button>
          {/* Upload isn't a valid action mid-selection — hiding it keeps the header
              from competing with the sticky selection bar for attention. */}
          {!selectMode && (
            <Button
              appearance="inverse"
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold"
            >
              <Icon name="add" size={16} /> Upload Photos
            </Button>
          )}
        </div>
      </div>

      {/* ---- Demo-mode data-loss notice ---- */}
      {demoNoticeOpen && (
        <Alert
          status="warning"
          title="Demo mode — uploads aren't saved permanently"
          dismissible
          onDismiss={() => setDemoNoticeOpen(false)}
        >
          Photos and videos you upload here live only in this browser tab. Refreshing the page or
          closing the tab will discard them — download anything you need to keep before you leave.
        </Alert>
      )}

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon="collections" label="Total items" value={stats.total} />
        <StatTile icon="image" label="Photos" value={stats.images} />
        <StatTile icon="videocam" label="Videos" value={stats.videos} />
        <StatTile icon="grid_view" label="Albums" value={stats.albums} />
      </div>

      {/* ---- Toolbar ---- */}
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[200px] flex-1">
            <Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              size="sm"
              placeholder="Search captions, albums, uploader…"
              aria-label="Search photos"
            />
          </div>
          <div className="w-44">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              options={SORT_OPTIONS}
              aria-label="Sort photos"
            />
          </div>
          <div className="flex overflow-hidden rounded-lg border border-line">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`flex h-9 w-9 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-inset ${view === "grid" ? "bg-navy text-white" : "bg-white text-ink-muted hover:bg-surface-muted"}`}
            >
              <Icon name="grid_view" size={16} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`flex h-9 w-9 items-center justify-center border-l border-line transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-inset ${view === "list" ? "bg-navy text-white" : "bg-white text-ink-muted hover:bg-surface-muted"}`}
            >
              <Icon name="list" size={16} />
            </button>
          </div>
        </div>

        {/* Album filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <Chip selected={activeCategory === "All"} onSelectedChange={() => setActiveCategory("All")}>
            All <span className="ml-1 opacity-60">{photos.length}</span>
          </Chip>
          {CATEGORIES.map((cat) => {
            const n = countByCategory.get(cat) ?? 0;
            return (
              <Chip
                key={cat}
                selected={activeCategory === cat}
                onSelectedChange={() => setActiveCategory(cat)}
                disabled={n === 0}
              >
                {cat} <span className="ml-1 opacity-60">{n}</span>
              </Chip>
            );
          })}
        </div>
      </div>

      {/* ---- Selection action bar ---- */}
      {selectMode && (
        <div
          data-testid="selection-bar"
          className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/30 bg-navy/5 px-4 py-2.5"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-sm font-semibold text-navy hover:underline"
            >
              {allVisibleSelected ? "Clear selection" : "Select all"}
            </button>
            <span className="text-sm text-ink-muted">{selectedIds.size} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              appearance="outlined"
              disabled={selectedIds.size === 0}
              onClick={() => { visible.filter((p) => selectedIds.has(p.id)).forEach(download); }}
              className="inline-flex items-center gap-1.5 text-sm"
            >
              <Icon name="download" size={16} /> Download
            </Button>
            <Button
              variant="danger"
              disabled={selectedIds.size === 0}
              onClick={() => setDeleteIds([...selectedIds])}
              className="inline-flex items-center gap-1.5 text-sm"
            >
              <Icon name="delete" size={16} /> Delete
            </Button>
          </div>
        </div>
      )}

      {/* ---- Gallery ---- */}
      {visible.length === 0 ? (
        <EmptyState
          className="rounded-xl border border-dashed border-line bg-white py-16"
          icon={<Icon name="photo_camera" size={40} className="text-ink-hint" />}
          title={photos.length === 0 ? "No photos yet" : "No photos match your filters"}
          description={
            photos.length === 0
              ? "Upload photos and short videos to build your centre's gallery."
              : "Try a different album or clear your search."
          }
          action={
            photos.length === 0 ? (
              <Button variant="primary" onClick={() => setUploadOpen(true)} className="inline-flex items-center gap-2">
                <Icon name="add" size={16} /> Upload Photos
              </Button>
            ) : (
              <Button appearance="outlined" onClick={() => { setQuery(""); setActiveCategory("All"); }}>
                Clear filters
              </Button>
            )
          }
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((p) => <GalleryCard key={p.id} {...itemHandlers(p)} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((p) => <GalleryRow key={p.id} {...itemHandlers(p)} />)}
        </div>
      )}

      {visible.length > 0 && (
        <p className="text-xs text-ink-hint">
          Showing {visible.length} of {photos.length} item{photos.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}. Uploads are held in this session only (demo).
        </p>
      )}

      {/* ---- Dialogs ---- */}
      {uploadOpen && <UploadSheet onClose={() => setUploadOpen(false)} uploadedBy={uploaderName} />}
      {editTarget && <EditSheet key={editTarget.id} photo={editTarget} onClose={() => setEditTarget(null)} />}

      <Lightbox
        open={!!viewer}
        items={viewer?.items ?? []}
        index={viewer?.index ?? 0}
        onClose={() => setViewer(null)}
      />

      <Modal
        open={!!deleteIds}
        onClose={() => setDeleteIds(null)}
        title={deleteIds && deleteIds.length > 1 ? "Delete Photos" : "Delete Photo"}
        footer={
          <>
            <Button appearance="outlined" onClick={() => setDeleteIds(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-ink">
          {deleteIds && deleteIds.length > 1
            ? <>Delete <strong>{deleteIds.length}</strong> selected items from the gallery? This cannot be undone.</>
            : <>Delete this item from the gallery? This action cannot be undone.</>}
        </p>
      </Modal>
    </div>
  );
}
