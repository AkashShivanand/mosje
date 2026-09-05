"use client";
import * as React from "react";
import { Button, Modal, type ModalSize } from "@mosje/design-system";

/**
 * One trigger per arrangement, one dialog. The Figma page's arrangements
 * section draws the same list, so a designer reading the library and a
 * developer reading this page see one set: each size on its scrim, a title
 * that wraps, a body that outgrows the panel, a single action, a destructive
 * one, and the two props Figma has no property for — `hideClose` and an
 * omitted `footer`.
 */
interface Arrangement {
  key: string;
  label: string;
  size?: ModalSize;
  title: string;
  body: React.ReactNode;
  /** `two` = Cancel + action · `one` = a single action · `none` = no footer. */
  footer: "two" | "one" | "none";
  primaryLabel?: string;
  danger?: boolean;
  hideClose?: boolean;
}

const SUBMIT_BODY =
  "Once submitted, the application cannot be edited. It can be withdrawn from your dashboard until it is taken up for scrutiny.";

const ARRANGEMENTS: Arrangement[] = [
  { key: "sm", label: "Small", size: "sm", title: "Submit this application?", body: SUBMIT_BODY, footer: "two", primaryLabel: "Submit" },
  { key: "md", label: "Default", size: "md", title: "Submit this application?", body: SUBMIT_BODY, footer: "two", primaryLabel: "Submit" },
  { key: "lg", label: "Large", size: "lg", title: "Submit this application?", body: SUBMIT_BODY, footer: "two", primaryLabel: "Submit" },
  {
    key: "title",
    label: "Title on two lines",
    size: "md",
    title: "Withdraw this application from the PM-AJAY 2025–26 cycle?",
    body: SUBMIT_BODY,
    footer: "two",
    primaryLabel: "Submit",
  },
  {
    key: "body",
    label: "Long body",
    size: "md",
    title: "Before you submit",
    body: (
      <>
        <p>Check that the beneficiary&apos;s Aadhaar number, bank account and category certificate match the documents uploaded in Step 3.</p>
        <p>Once submitted, the application moves to the district officer for scrutiny and cannot be edited. It can be withdrawn from your dashboard until scrutiny begins.</p>
        <p>You will receive an SMS with the application number within a few minutes.</p>
      </>
    ),
    footer: "two",
    primaryLabel: "Submit",
  },
  {
    key: "one",
    label: "One action",
    size: "md",
    title: "Your session has expired",
    body: "Sign in again to continue. Anything entered in the last step was not saved.",
    footer: "one",
    primaryLabel: "Sign in again",
  },
  {
    key: "danger",
    label: "Destructive action",
    size: "md",
    title: "Withdraw this application?",
    body: "The application will be removed from the scrutiny queue. This cannot be undone.",
    footer: "two",
    primaryLabel: "Withdraw application",
    danger: true,
  },
  {
    key: "hideClose",
    label: "hideClose",
    size: "md",
    title: "Your session has expired",
    body: "Sign in again to continue. Anything entered in the last step was not saved.",
    footer: "one",
    primaryLabel: "Sign in again",
    hideClose: true,
  },
  {
    key: "noFooter",
    label: "No footer",
    size: "md",
    title: "How this figure is counted",
    body: "Beneficiaries are counted once per scheme year, from the state MIS returns received by 31 March.",
    footer: "none",
  },
];

export function ModalPlayground() {
  const [current, setCurrent] = React.useState<Arrangement | null>(null);
  const close = () => setCurrent(null);

  const footer =
    current && current.footer !== "none" ? (
      <div style={{ display: "flex", gap: "var(--sa-inline-12)", justifyContent: "flex-end" }}>
        {current.footer === "two" && (
          <Button variant="neutral" appearance="outlined" onClick={close}>
            Cancel
          </Button>
        )}
        <Button variant={current.danger ? "danger" : "primary"} onClick={close}>
          {current.primaryLabel}
        </Button>
      </div>
    ) : undefined;

  return (
    <div
      className="cdp-ground"
      style={{ display: "flex", flexWrap: "wrap", gap: "var(--sa-inline-12)", justifyContent: "center" }}
    >
      {ARRANGEMENTS.map((a) => (
        <Button key={a.key} variant="primary" appearance="outlined" onClick={() => setCurrent(a)}>
          {a.label}
        </Button>
      ))}

      <Modal
        open={current !== null}
        onClose={close}
        title={current?.title ?? ""}
        size={current?.size ?? "md"}
        hideClose={current?.hideClose}
        footer={footer}
      >
        <div
          style={{
            display: "grid",
            gap: "var(--sa-stack-12)",
            color: "var(--sa-text-neutral-subtle)",
            fontSize: "var(--sa-type-body-2-size)",
            lineHeight: "var(--sa-type-body-2-lh)",
          }}
        >
          {typeof current?.body === "string" ? <p style={{ margin: 0 }}>{current.body}</p> : current?.body}
        </div>
      </Modal>
    </div>
  );
}
