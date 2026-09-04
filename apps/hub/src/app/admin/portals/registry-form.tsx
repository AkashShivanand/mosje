"use client";

/**
 * The estate registry editor.
 *
 * Rows with move-up / move-down buttons rather than drag-and-drop, on purpose:
 * this is a government estate held to WCAG 2.1 AA, and buttons are keyboard
 * operable and announceable with no dnd library, no custom keyboard fallback,
 * and no pointer-only affordance to explain.
 *
 * The form posts one hidden field holding every row in display order. The
 * server derives the minimal patch from that, so this component never has to
 * reason about which fields count as overrides.
 */

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Alert, Badge, Button, Icon, Input, Select, Toggle } from "@mosje/design-system";
import type { RegistryStatus } from "@mosje/design-system/registry";
import type { SamaveshBannerPlacement } from "@/lib/samavesh-banner/config";

export interface RegistryRow {
  path: string;
  group: string;
  status: RegistryStatus;
  code: {
    name: string;
    desc: string;
    org: string;
    abbr: string;
    category: string;
    status: "live" | "planned";
  };
  override: {
    name: string;
    desc: string;
    org: string;
    abbr: string;
    category: string;
  };
  /**
   * The assistant's state for this surface.
   *
   * Lives on the registry row rather than on a page of its own because it is
   * the SAME 22 surfaces: two tables listing the same estate, each with one
   * control, is a worse answer than one table with two. `applicable` is false
   * for Resources entries (the design system, Storybook), which are not places
   * a citizen asks a question.
   */
  assistant: {
    applicable: boolean;
    enabled: boolean;
    /** True when no stored override applies — i.e. this is the code default. */
    isDefault: boolean;
  };
}

export interface RegistryFormProps {
  rows: RegistryRow[];
  /** The assistant's master switch — estate-wide, so it is not a per-row value. */
  assistantEnabled: boolean;
  /**
   * The demo dock's master switch. No per-surface variant: the dock is one
   * cross-zone navigator, and its whole job is getting between zones, so
   * switching it off on some of them makes it worse rather than more precise.
   */
  demoToolsEnabled: boolean;
  /** The cookie consent banner's switch. Currently off pending a redesign. */
  cookieBannerEnabled: boolean;
  /** SAMAVESH top banner placement across website pages. */
  samaveshBannerPlacement: SamaveshBannerPlacement;
  saveAction: (formData: FormData) => Promise<void>;
  resetAction: () => Promise<void>;
  storeConfigured: boolean;
  overrideCount: number;
  savedMessage?: string;
  errorMessage?: string;
}

const SAMAVESH_BANNER_OPTIONS = [
  { value: "all", label: "All pages (Default)" },
  { value: "except_org_details", label: "All pages except organisation details" },
  { value: "homepage_only", label: "Only the homepage" },
];

const STATUS_OPTIONS = [
  { value: "live", label: "Live — shown and clickable" },
  { value: "planned", label: "Planned — shown, greyed out" },
  { value: "hidden", label: "Hidden — removed and blocked" },
];

const LABEL_FIELDS = [
  { key: "name", label: "Name" },
  { key: "abbr", label: "Icon initials" },
  { key: "org", label: "Organisation" },
  { key: "category", label: "Category" },
  { key: "desc", label: "Description" },
] as const;

/** The bucket a row is ordered within — its overridden category, else code's. */
function bucketOf(row: RegistryRow): string {
  const category = row.override.category.trim() || row.code.category;
  return `${row.group} ${category}`;
}

/** Human-readable bucket heading. */
function bucketLabel(row: RegistryRow): string {
  const category = row.override.category.trim() || row.code.category;
  return category ? `${row.group} · ${category}` : row.group;
}

function statusBadge(status: RegistryStatus) {
  if (status === "live") return <Badge status="success">Live</Badge>;
  if (status === "planned") return <Badge>Planned</Badge>;
  return <Badge status="warning">Hidden</Badge>;
}

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={disabled || pending}>
      {pending ? "Saving…" : "Save registry"}
    </Button>
  );
}

function ResetButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      appearance="outlined"
      variant="danger"
      disabled={disabled || pending}
    >
      {pending ? "Clearing…" : "Reset all to code defaults"}
    </Button>
  );
}

export function RegistryForm({
  rows: initialRows,
  assistantEnabled: initialAssistantEnabled,
  demoToolsEnabled: initialDemoToolsEnabled,
  cookieBannerEnabled: initialCookieBannerEnabled,
  samaveshBannerPlacement: initialSamaveshBannerPlacement,
  saveAction,
  resetAction,
  storeConfigured,
  overrideCount,
  savedMessage,
  errorMessage,
}: RegistryFormProps) {
  const [rows, setRows] = React.useState<RegistryRow[]>(initialRows);
  const [assistantEnabled, setAssistantEnabled] = React.useState(initialAssistantEnabled);
  const [demoToolsEnabled, setDemoToolsEnabled] = React.useState(initialDemoToolsEnabled);
  const [cookieBannerEnabled, setCookieBannerEnabled] = React.useState(
    initialCookieBannerEnabled,
  );
  const [samaveshBannerPlacement, setSamaveshBannerPlacement] = React.useState<SamaveshBannerPlacement>(
    initialSamaveshBannerPlacement,
  );
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState("");

  const setRow = (path: string, next: (row: RegistryRow) => RegistryRow) => {
    setRows((current) => current.map((row) => (row.path === path ? next(row) : row)));
  };

  /**
   * Swap a row with its nearest neighbour in the same bucket.
   *
   * Nearest in-bucket neighbour, not the adjacent array index: rows from other
   * groups sit between buckets in the list, and stepping over one would move an
   * entry out of its category by accident.
   */
  const move = (path: string, direction: -1 | 1) => {
    setRows((current) => {
      const index = current.findIndex((row) => row.path === path);
      const row = current[index];
      if (!row) return current;

      const bucket = bucketOf(row);
      let target = -1;
      for (
        let i = index + direction;
        i >= 0 && i < current.length;
        i += direction
      ) {
        const candidate = current[i];
        if (candidate && bucketOf(candidate) === bucket) {
          target = i;
          break;
        }
      }
      if (target === -1) return current;

      const next = [...current];
      next[index] = next[target]!;
      next[target] = row;

      const inBucket = next.filter((r) => bucketOf(r) === bucket);
      const position = inBucket.findIndex((r) => r.path === path) + 1;
      setAnnouncement(
        `${row.override.name.trim() || row.code.name} moved ${direction === -1 ? "up" : "down"} to position ${position} of ${inBucket.length} in ${bucketLabel(row)}.`,
      );
      return next;
    });
  };

  const resetRow = (path: string) => {
    setRow(path, (row) => ({
      ...row,
      status: row.code.status,
      override: { name: "", desc: "", org: "", abbr: "", category: "" },
    }));
    const row = rows.find((r) => r.path === path);
    setAnnouncement(`${row?.code.name ?? path} reset to its code defaults.`);
  };

  // What the server receives: intent in display order, not a patch.
  const payload = JSON.stringify(
    rows.map((row) => ({
      path: row.path,
      status: row.status,
      name: row.override.name,
      desc: row.override.desc,
      org: row.override.org,
      abbr: row.override.abbr,
      category: row.override.category,
    })),
  );

  /**
   * The assistant's intent, posted alongside the registry's.
   *
   * One form and one Save button, but TWO settings rows behind it — see
   * `saveRegistry`. The UI is merged because an admin thinks in surfaces; the
   * storage is not, because the proxy reads the registry row on every request
   * and a malformed assistant config must not be able to reach that path.
   */
  const assistantPayload = JSON.stringify({
    enabled: assistantEnabled,
    surfaces: rows
      .filter((row) => row.assistant.applicable)
      .map((row) => ({ path: row.path, enabled: row.assistant.enabled })),
  });

  const assistantOn = rows.filter(
    (row) => row.assistant.applicable && row.assistant.enabled,
  ).length;
  const assistantTotal = rows.filter((row) => row.assistant.applicable).length;

  /**
   * Everything each row needs to render, derived once.
   *
   * Precomputed rather than tracked with a running variable inside the map:
   * mutating during render is exactly what the React Compiler forbids, and a
   * heading that depends on iteration order is the kind of thing that breaks
   * silently under a re-render.
   */
  const view = React.useMemo(() => {
    const bucketPaths = new Map<string, string[]>();
    for (const row of rows) {
      const key = bucketOf(row);
      const list = bucketPaths.get(key) ?? [];
      list.push(row.path);
      bucketPaths.set(key, list);
    }

    return rows.map((row, index) => {
      const bucket = bucketOf(row);
      // Compared against the previous row by index rather than tracked in a
      // running variable — no reassignment during render.
      const previous = index > 0 ? bucketOf(rows[index - 1]!) : "";
      const showHeading = bucket !== previous;
      const siblings = bucketPaths.get(bucket) ?? [];
      return {
        row,
        showHeading,
        isFirst: siblings[0] === row.path,
        isLast: siblings[siblings.length - 1] === row.path,
      };
    });
  }, [rows]);

  return (
    <>
      <div className="mt-6 space-y-3">
        {savedMessage && (
          <Alert status="success" title="Registry updated">
            {savedMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert status="error" title="Not saved">
            {errorMessage}
          </Alert>
        )}
        {!storeConfigured && (
          <Alert status="warning" title="No settings store configured">
            SUPABASE_URL is not set, so nothing can be saved from here. Every
            surface is rendering the code defaults in <code>DEFAULT_APPS</code>.
            This is the expected state in local development.
          </Alert>
        )}
      </div>

      <p className="mt-6 text-body-3 text-ink-hint" role="status" aria-live="polite">
        {announcement ||
          (overrideCount === 0
            ? `${rows.length} entries, all following the code defaults.`
            : `${rows.length} entries, ${overrideCount} with a saved override.`)}
      </p>

      <form action={saveAction} className="mt-4">
        <input type="hidden" name="rows" value={payload} />
        <input type="hidden" name="assistant" value={assistantPayload} />
        <input type="hidden" name="demoTools" value={demoToolsEnabled ? "on" : "off"} />
        <input
          type="hidden"
          name="cookieBanner"
          value={cookieBannerEnabled ? "on" : "off"}
        />
        <input
          type="hidden"
          name="samaveshBanner"
          value={samaveshBannerPlacement}
        />

        <section className="mb-4 rounded-xl border border-border bg-surface p-5 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-label-3 uppercase text-ink">
                Demo dock
              </h2>
              <p className="mt-1.5 text-body-2 text-ink-muted">
                The floating rail that switches between portals, re-tones the
                brand palette and fills in demo sign-ins. Turn it off for a
                walkthrough, a screenshot or a recording, and put it back
                afterwards — no redeploy.
              </p>
              <p className="mt-2 text-body-3 text-ink-hint">
                It never appears on this admin surface, on the hub root or on
                the gate, whatever this is set to.
              </p>
            </div>
            <Toggle
              checked={demoToolsEnabled}
              onChange={(event) => {
                setDemoToolsEnabled(event.target.checked);
                setAnnouncement(
                  event.target.checked
                    ? "Demo dock shown across the estate."
                    : "Demo dock hidden across the estate.",
                );
              }}
              label={demoToolsEnabled ? "On" : "Off"}
            />
          </div>
        </section>

        <section className="mb-6 rounded-xl border border-border bg-surface p-5 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-label-3 uppercase text-ink">
                Assistant
              </h2>
              <p className="mt-1.5 text-body-2 text-ink-muted">
                Samajik Sahayak, the chat assistant in the bottom-right corner. This is the
                master switch; turn it on per surface in the list below. What it
                says is set in code, not here.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-body-3 text-ink-hint">
                {assistantOn} of {assistantTotal} on
              </span>
              <Toggle
                checked={assistantEnabled}
                onChange={(event) => {
                  setAssistantEnabled(event.target.checked);
                  setAnnouncement(
                    event.target.checked
                      ? "Assistant enabled estate-wide."
                      : "Assistant disabled estate-wide; per-surface settings kept.",
                  );
                }}
                label={assistantEnabled ? "On" : "Off"}
              />
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-xl border border-border bg-surface p-5 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-label-3 uppercase text-ink">
                Cookie banner
              </h2>
              <p className="mt-1.5 text-body-2 text-ink-muted">
                The consent notice along the foot of the website. Off while it
                is being redesigned.
              </p>
              <p className="mt-2 text-body-3 text-ink-hint">
                Its copy cites GIGW 3.0 and DBIM, so this is a compliance
                control as well as a visual one. Defensible while the estate is
                a gated prototype storing only a first-party consent flag; put
                it back before real analytics or a public deployment.
              </p>
            </div>
            <Toggle
              checked={cookieBannerEnabled}
              onChange={(event) => {
                setCookieBannerEnabled(event.target.checked);
                setAnnouncement(
                  event.target.checked
                    ? "Cookie banner shown on the website."
                    : "Cookie banner hidden on the website.",
                );
              }}
              label={cookieBannerEnabled ? "On" : "Off"}
            />
          </div>
        </section>

        <section className="mb-6 rounded-xl border border-border bg-surface p-5 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-label-3 uppercase text-ink">
                SAMAVESH Banner
              </h2>
              <p className="mt-1.5 text-body-2 text-ink-muted">
                Controls where the top saffron SAMAVESH banner and expandable portal exploration drawer appear across the website.
              </p>
              <p className="mt-2 text-body-3 text-ink-hint">
                Choose between displaying on all pages, hiding specifically on organisation detail profiles, or restricting exclusively to the homepage.
              </p>
            </div>
            <div className="w-full sm:w-80">
              <Select
                value={samaveshBannerPlacement}
                options={SAMAVESH_BANNER_OPTIONS}
                onChange={(event) => {
                  const next = event.target.value as SamaveshBannerPlacement;
                  setSamaveshBannerPlacement(next);
                  setAnnouncement(`SAMAVESH banner placement set to ${next}.`);
                }}
                aria-label="SAMAVESH Banner placement"
              />
            </div>
          </div>
        </section>

        <ul className="space-y-2">
          {view.map(({ row, showHeading, isFirst, isLast }, index) => {
            const displayName = row.override.name.trim() || row.code.name;
            const isOpen = expanded === row.path;
            const panelId = `overrides-${index}`;

            return (
              <React.Fragment key={row.path}>
                {/* The heading li is deliberately NOT aria-hidden: it is the
                    only thing telling a screen-reader user which category the
                    following rows belong to, and heading navigation is how
                    they skip between categories in a 25-row list. */}
                {showHeading && (
                  <li className="!mt-8 flex items-center gap-3 first:!mt-0">
                    <span className="h-4 w-1 rounded-full bg-primary" aria-hidden="true" />
                    <h2 className="text-label-3 uppercase text-ink">
                      {bucketLabel(row)}
                    </h2>
                  </li>
                )}

                <li className="rounded-xl border border-border bg-surface shadow-xs">
                  <div className="flex flex-wrap items-center gap-3 p-4">
                    {/* `basis-56` is what makes the row WRAP rather than crush.
                        With `flex-1` alone the name column shrinks toward zero
                        to keep the controls on one line, and at narrow widths
                        the portal name and its path were clipped to "Liv…" and
                        "/…" — unreadable, and worse since the assistant toggle
                        became a third control here. A basis gives the name a
                        floor to defend, so the controls drop to the next line
                        instead. */}
                    <div className="min-w-0 flex-1 basis-56">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-title-3 text-ink">
                          {displayName}
                        </span>
                        {statusBadge(row.status)}
                      </div>
                      <code className="mt-0.5 block truncate text-body-3 text-ink-muted">
                        {row.path}
                      </code>
                    </div>

                    {row.assistant.applicable && (
                      <span
                        className={
                          assistantEnabled
                            ? "flex items-center gap-2"
                            : "flex items-center gap-2 opacity-50"
                        }
                        title={
                          assistantEnabled
                            ? undefined
                            : "The assistant's master switch is off"
                        }
                      >
                        <Toggle
                          checked={row.assistant.enabled}
                          aria-label={`Show the assistant on ${displayName}`}
                          onChange={(event) =>
                            setRow(row.path, (r) => ({
                              ...r,
                              assistant: { ...r.assistant, enabled: event.target.checked },
                            }))
                          }
                        />
                        <span className="text-label-2 text-ink-muted">
                          Assistant
                        </span>
                      </span>
                    )}

                    <label className="flex items-center gap-2 text-label-2 text-ink-muted">
                      <span className="sr-only">{`Status for ${displayName}`}</span>
                      <Select
                        value={row.status}
                        options={STATUS_OPTIONS}
                        aria-label={`Status for ${displayName}`}
                        onChange={(event) =>
                          setRow(row.path, (r) => ({
                            ...r,
                            status: event.target.value as RegistryStatus,
                          }))
                        }
                      />
                    </label>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        appearance="text"
                        size="sm"
                        disabled={isFirst}
                        aria-label={`Move ${displayName} up`}
                        onClick={() => move(row.path, -1)}
                      >
                        <Icon name="arrow_upward" size={18} aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        appearance="text"
                        size="sm"
                        disabled={isLast}
                        aria-label={`Move ${displayName} down`}
                        onClick={() => move(row.path, 1)}
                      >
                        <Icon name="arrow_downward" size={18} aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        appearance="text"
                        size="sm"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setExpanded(isOpen ? null : row.path)}
                      >
                        {isOpen ? "Hide labels" : "Edit labels"}
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div
                      id={panelId}
                      className="grid gap-4 border-t border-border p-4 sm:grid-cols-2"
                    >
                      {LABEL_FIELDS.map(({ key, label }) => (
                        <label key={key} className="flex flex-col gap-1.5 text-label-2">
                          <span className="font-semibold text-ink">{label}</span>
                          <Input
                            value={row.override[key]}
                            placeholder={row.code[key] || "—"}
                            onChange={(event) =>
                              setRow(row.path, (r) => ({
                                ...r,
                                override: { ...r.override, [key]: event.target.value },
                              }))
                            }
                          />
                        </label>
                      ))}
                      <p className="text-body-3 text-ink-hint sm:col-span-2">
                        Leave a field empty to keep the value from the code
                        registry, shown as the placeholder. The path, group and
                        new-tab behaviour are code-only and cannot be changed
                        here.
                      </p>
                      <div className="sm:col-span-2">
                        <Button
                          type="button"
                          appearance="outlined"
                          size="sm"
                          onClick={() => resetRow(row.path)}
                        >
                          Reset this entry
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-3 border-t border-border bg-surface-muted/95 py-4 backdrop-blur">
          <SaveButton disabled={!storeConfigured} />
          <span className="text-body-3 text-ink-hint">
            Nothing is stored until you save.
          </span>
        </div>
      </form>

      <form
        action={resetAction}
        className="mt-6 border-t border-border pt-6"
      >
        <p className="mb-3 text-body-3 text-ink-hint">
          Clearing removes every override at once and puts the estate back on
          the code defaults. It cannot be undone from this page.
        </p>
        <ResetButton disabled={!storeConfigured} />
      </form>
    </>
  );
}
