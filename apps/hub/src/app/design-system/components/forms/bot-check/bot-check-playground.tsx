"use client";

import * as React from "react";
import {
  BotCheck,
  useBotCheck,
  type BotCheckMode,
  type BotCheckStatus,
} from "@mosje/design-system";

const MODES: BotCheckMode[] = ["invisible", "checkbox"];
const STATES: (BotCheckStatus | "live")[] = ["live", "idle", "verifying", "verified", "failed"];

/**
 * Two things at once: the real check running, and every state forced.
 *
 * On `live` the work actually happens — SHA-256 over a random challenge until
 * the digest clears 12 leading zero bits — and the receipt below is recomputable
 * by hand. The other settings pin a state so the rendering of each can be seen,
 * including the one that draws nothing.
 */
export function BotCheckPlayground(): React.JSX.Element {
  const [mode, setMode] = React.useState<BotCheckMode>("invisible");
  const [forced, setForced] = React.useState<BotCheckStatus | "live">("live");
  const check = useBotCheck({ auto: mode !== "checkbox" });
  const status = forced === "live" ? check.status : forced;

  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)", maxWidth: 460 }}>
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap" }}>
        <label style={{ display: "grid", gap: "var(--sa-stack-4)" }}>
          <span>Mode</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as BotCheckMode)}>
            {MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label style={{ display: "grid", gap: "var(--sa-stack-4)" }}>
          <span>Status</span>
          <select
            value={forced}
            onChange={(e) => setForced(e.target.value as BotCheckStatus | "live")}
          >
            {STATES.map((s) => (
              <option key={s} value={s}>{s === "live" ? "live (real work)" : s}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={check.solve} style={{ alignSelf: "end" }}>
          Run it again
        </button>
      </div>

      <BotCheck
        mode={mode}
        status={status}
        helpHref="#"
        onVerify={check.solve}
      />

      {mode === "invisible" && status !== "failed" ? (
        <p style={{ color: "var(--sa-text-neutral-subtle)" }}>
          Nothing renders above, and that is the point — an invisible check asks the citizen
          for nothing until it has something to tell them.
        </p>
      ) : null}

      {/* The receipt is shown HERE, on a documentation page, and never on a
          citizen's login screen — see ui-restraint-and-copy.md. It is here so a
          developer can see that the work is real and recompute the hash. */}
      {check.token ? (
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "var(--sa-stack-4) var(--sa-inline-12)",
            fontSize: "var(--sa-type-body-3-size)",
            lineHeight: "var(--sa-type-body-3-lh)",
            color: "var(--sa-text-neutral-subtle)",
          }}
        >
          <dt>challenge</dt>
          <dd style={{ wordBreak: "break-all" }}>{check.token.challenge}</dd>
          <dt>nonce</dt>
          <dd>{check.token.nonce.toLocaleString("en-IN")}</dd>
          <dt>hash</dt>
          <dd style={{ wordBreak: "break-all" }}>{check.token.hash}</dd>
          <dt>work</dt>
          <dd>
            {check.token.attempts.toLocaleString("en-IN")} hashes in {check.token.solvedInMs} ms,
            clearing {check.token.difficulty} leading zero bits
          </dd>
        </dl>
      ) : null}
    </div>
  );
}
