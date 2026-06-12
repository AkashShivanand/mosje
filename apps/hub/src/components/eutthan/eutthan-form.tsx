"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { formDefs } from "@/lib/eutthan/portal-data";

export function FormPage({ path }: { path: string }) {
  const form = formDefs[path];
  const backPath = path.replace(/\/(add|edit)$/, "");

  if (!form) {
    return (
      <div className="page-stack">
        <Link
          href={portalLink(backPath)}
          className="text-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0,51,102,0.08)",
            padding: "8px 14px",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={15} /> Back
        </Link>
        <p style={{ color: "var(--text-muted)" }}>
          Form not configured for: {path}
        </p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          href={portalLink(backPath)}
          className="text-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(0,51,102,0.08)",
            minHeight: 36,
            padding: "6px 14px",
            borderRadius: 8,
          }}
        >
          <ArrowLeft size={15} /> Back
        </Link>
        <h2 className="page-title">{form.title}</h2>
      </div>

      <div className="form-card">
        <div className="form-grid">
          {form.fields.map((field) => (
            <div
              key={field.label}
              className={field.type === "textarea" ? "textarea-field" : "field"}
              style={field.fullWidth ? { gridColumn: "1 / -1" } : undefined}
            >
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select
                  style={{
                    minHeight: 42,
                    border: "1px solid var(--stroke-200)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    color: "var(--text)",
                    background: "white",
                    font: "inherit",
                  }}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea placeholder={field.placeholder} />
              ) : field.type === "readonly" ? (
                <input
                  type="text"
                  defaultValue={field.placeholder ?? ""}
                  readOnly
                  style={{
                    background: "var(--surface-muted)",
                    cursor: "default",
                  }}
                />
              ) : field.type === "file" ? (
                <input type="file" accept=".pdf" />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>
        <div className="form-actions">
          <Link href={portalLink(backPath)} className="secondary-button">
            Cancel
          </Link>
          <button type="submit" className="primary-button">
            {form.submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
