"use client";

import * as React from "react";
import { Icon } from "../utilities/icon";
import {
  downloadCsv,
  downloadPng,
  downloadSvg,
  toFileStem,
} from "../data-display/charts/internal/export";
import "./dashboard.css";

export type ChartExportFormat = "png" | "svg" | "csv";

export interface ChartExportProps {
  /** Filename stem and menu heading, e.g. the chart title. */
  name: string;
  /** Which formats to offer. @default ["png", "svg", "csv"] */
  formats?: ChartExportFormat[];
  /**
   * `icon` — the download glyph alone. `text` — a quieter "Export" link, the glyph at 16px
   * beside the word in subtle text, as the SMILE – Beggary dashboard's handoff draws it
   * (Figma `evmNmlK8g4VYwJVu2FwSGV` 8664:49263). Use `text` where several charts sit side
   * by side and a row of icons would outweigh their titles. @default "icon"
   */
  appearance?: "icon" | "text";
  className?: string;
}

const LABELS: Record<ChartExportFormat, { label: string; icon: string; hint: string }> = {
  png: { label: "PNG image", icon: "image", hint: "for slides and documents" },
  svg: { label: "SVG vector", icon: "shapes", hint: "scales without blur" },
  csv: { label: "CSV data", icon: "table", hint: "opens in a spreadsheet" },
};

/**
 * A download control for the chart it sits beside. Drop it into a ChartCard's
 * `actions` (ChartCard does this for you when `exportable`) and it finds the
 * chart's `<svg>` and screen-reader `<table>` within the surrounding
 * `.ds-chart-card`, then offers PNG, SVG and CSV.
 *
 * It reads the chart from the live DOM rather than a passed ref so a server
 * component can render it without threading refs through — the chart is always
 * a sibling in the same card.
 */
export function ChartExport({
  name,
  formats = ["png", "svg", "csv"],
  appearance = "icon",
  className,
}: ChartExportProps) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [available, setAvailable] = React.useState<ChartExportFormat[]>(formats);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Offer only the formats this chart can actually deliver. A div-based chart
  // (the funnel) has no <svg>, so PNG and SVG are impossible for it — showing
  // them would produce a dead menu item. CSV needs the screen-reader <table>.
  const detectAvailable = React.useCallback((): ChartExportFormat[] => {
    const card = rootRef.current?.closest(".ds-chart-card");
    const hasSvg = Boolean(card?.querySelector(".ds-chart__svg"));
    const hasTable = Boolean(card?.querySelector("table"));
    return formats.filter((f) =>
      f === "csv" ? hasTable : hasSvg,
    );
  }, [formats]);

  const toggle = () => {
    setOpen((v) => {
      if (!v) setAvailable(detectAvailable());
      return !v;
    });
  };

  // Close on outside click or Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = async (format: ChartExportFormat) => {
    const card = rootRef.current?.closest(".ds-chart-card");
    const svg = card?.querySelector<SVGSVGElement>(".ds-chart__svg");
    const table = card?.querySelector<HTMLTableElement>("table");
    const stem = toFileStem(name);
    setOpen(false);
    try {
      setBusy(true);
      if (format === "csv") {
        if (table) downloadCsv(table, `${stem}.csv`);
      } else if (svg) {
        if (format === "png") await downloadPng(svg, `${stem}.png`);
        else downloadSvg(svg, `${stem}.svg`);
      }
    } finally {
      setBusy(false);
    }
  };

  const menuId = React.useId();

  return (
    <div ref={rootRef} className={`ds-chart-export${className ? ` ${className}` : ""}`}>
      {/* raw-button-ok(primitive): the download menu's aria-haspopup="menu" trigger — it owns the menu's expanded state and its busy glyph */}
      <button
        type="button"
        className={`ds-chart-export__trigger${appearance === "text" ? " ds-chart-export__trigger--text" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        // The visible word leads the accessible name (WCAG 2.5.3, Label in Name).
        aria-label={`${appearance === "text" ? "Export" : "Download"} ${name}`}
        disabled={busy}
        onClick={toggle}
      >
        <Icon name={busy ? "hourglass_empty" : "download"} size={appearance === "text" ? 16 : 20} aria-hidden />
        {appearance === "text" ? <span aria-hidden="true">Export</span> : null}
      </button>
      {open && (
        <div id={menuId} role="menu" className="ds-chart-export__menu">
          <p className="ds-chart-export__heading">Download</p>
          {available.map((f) => (
            /* raw-button-ok(primitive): a menuitem in the download menu — its role belongs to the menu, and its two-line label is not a button label */
            <button
              key={f}
              type="button"
              role="menuitem"
              className="ds-chart-export__item"
              onClick={() => void run(f)}
            >
              <Icon name={LABELS[f].icon} size={20} aria-hidden />
              <span className="ds-chart-export__item-label">
                {LABELS[f].label}
                <span className="ds-chart-export__item-hint">{LABELS[f].hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
