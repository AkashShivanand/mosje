"use client";

import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { formDefs } from "@/lib/eutthan/portal-data";
import { Icon } from "@mosje/design-system";

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
            gap: "var(--sa-inline-8)",
            background: "var(--primary-tonal)",
            padding: "var(--sa-padding-8) var(--sa-padding-12)",
            borderRadius: "var(--sa-shape-8)",
            marginBottom: "var(--sa-stack-12)",
          }}
        >
          <Icon name="arrow_back" size={15} /> Back
        </Link>
        <p style={{ color: "var(--text-muted)" }}>
          Form not configured for: {path}
        </p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-inline-12)" }}>
        <Link
          href={portalLink(backPath)}
          className="text-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sa-inline-6)",
            background: "var(--primary-tonal)",
            minHeight: 36,
            padding: "var(--sa-padding-6) var(--sa-padding-12)",
            borderRadius: "var(--sa-shape-8)",
          }}
        >
          <Icon name="arrow_back" size={15} /> Back
        </Link>
        <h2 className="page-title">{form.title}</h2>
      </div>

      <div className="form-card">
        <div className="form-grid">
          {form.fields.map((field) => {
            const fieldId = `eu-field-${field.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return (
            <div
              key={field.label}
              className={field.type === "textarea" ? "textarea-field" : "field"}
              style={field.fullWidth ? { gridColumn: "1 / -1" } : undefined}
            >
              <label htmlFor={fieldId}>{field.label}</label>
              {field.type === "select" ? (
                <select
                  id={fieldId}
                  style={{
                    minHeight: 42,
                    border: "1px solid var(--stroke-200)",
                    borderRadius: "var(--sa-shape-8)",
                    padding: "var(--sa-padding-8) var(--sa-padding-12)",
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
                <textarea id={fieldId} placeholder={field.placeholder} />
              ) : field.type === "readonly" ? (
                <input
                  id={fieldId}
                  type="text"
                  defaultValue={field.placeholder ?? ""}
                  readOnly
                  style={{
                    background: "var(--surface-muted)",
                    cursor: "default",
                  }}
                />
              ) : field.type === "file" ? (
                <input id={fieldId} type="file" accept=".pdf" />
              ) : (
                <input
                  id={fieldId}
                  type={field.type}
                  placeholder={field.placeholder}
                />
              )}
            </div>
            );
          })}
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
