"use client";
import * as React from "react";
import { Modal } from "@mosje/design-system";
import { Button } from "@mosje/design-system";

export function ModalPlayground() {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm application submission"
        size="sm"
        footer={
          <div style={{ display: "flex", gap: "var(--sa-inline-12)", justifyContent: "flex-end" }}>
            <Button variant="primary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
          </div>
        }
      >
        <p style={{ margin: 0, color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-2-size)" }}>
          Are you sure you want to submit this application? You will not be able to edit it after submission.
        </p>
      </Modal>
    </div>
  );
}
