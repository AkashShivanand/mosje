"use client";

import * as React from "react";
import { BotCheck, type BotCheckMode, type BotCheckStatus } from "@mosje/design-system";

const MODES: BotCheckMode[] = ["invisible", "checkbox", "challenge"];
const STATES: BotCheckStatus[] = ["idle", "verifying", "verified", "failed"];

/**
 * Every mode against every state, because the interesting cell is the one that
 * draws nothing: `invisible` is blank for three of the four states, and that is
 * the component working, not the specimen failing.
 */
export function BotCheckPlayground(): React.JSX.Element {
  const [mode, setMode] = React.useState<BotCheckMode>("invisible");
  const [status, setStatus] = React.useState<BotCheckStatus>("idle");
  const [answer, setAnswer] = React.useState("");

  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)", maxWidth: 420 }}>
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap" }}>
        <label style={{ display: "grid", gap: "var(--sa-stack-4)" }}>
          <span>Mode</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as BotCheckMode)}>
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "grid", gap: "var(--sa-stack-4)" }}>
          <span>Server says</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as BotCheckStatus)}>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <BotCheck
        mode={mode}
        status={status}
        helpHref="#"
        challenge={{ type: "text", characters: "G584V" }}
        value={answer}
        onValueChange={setAnswer}
        onRefresh={() => setAnswer("")}
        onVerify={() => setStatus(status === "verified" ? "idle" : "verified")}
      />

      {mode === "invisible" && status !== "failed" ? (
        <p style={{ color: "var(--sa-text-neutral-subtle)" }}>
          Nothing renders here, and that is the point — an invisible check asks the citizen for
          nothing until it has something to tell them.
        </p>
      ) : null}
    </div>
  );
}
