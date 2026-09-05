import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BotCheck } from "./bot-check";

const html = (el: React.ReactElement): string => renderToStaticMarkup(el);
const HELP = /Cannot complete this check\? Contact support/;

describe("BotCheck — the help link", () => {
  it("is absent beneath an idle, verifying or verified checkbox: one deliberate act needs no escape route", () => {
    for (const status of ["idle", "verifying", "verified"] as const) {
      expect(html(<BotCheck mode="checkbox" status={status} helpHref="/help" />)).not.toMatch(HELP);
    }
  });
  it("appears once a checkbox check has failed", () => {
    expect(html(<BotCheck mode="checkbox" status="failed" helpHref="/help" />)).toMatch(HELP);
  });
  it("is always present in challenge mode, because the characters are a sensory barrier", () => {
    for (const status of ["idle", "verifying", "verified", "failed"] as const) {
      expect(html(<BotCheck mode="challenge" status={status} helpHref="/help" challenge={{ type: "text", characters: "7K4M9P" }} />)).toMatch(HELP);
    }
  });
  it("in invisible mode draws nothing until it fails, and then draws the link", () => {
    expect(html(<BotCheck mode="invisible" status="idle" helpHref="/help" />)).toBe("");
    expect(html(<BotCheck mode="invisible" status="failed" helpHref="/help" />)).toMatch(HELP);
  });
});
