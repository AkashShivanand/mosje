"use client";

import { Playground, type ControlDef } from "@/components/design-system/playground/index";

const initialCode = `<Button variant="primary" size="md">Submit application</Button>`;

const controls: ControlDef[] = [
  { name: "variant", label: "variant", type: "select", options: ["primary", "secondary", "ghost", "danger"], defaultValue: "primary" },
  { name: "size",    label: "size",    type: "select", options: ["sm", "md", "lg"], defaultValue: "md" },
  { name: "disabled", label: "disabled", type: "boolean", defaultValue: false },
  { name: "loading",  label: "loading",  type: "boolean", defaultValue: false },
  { name: "label",    label: "label",    type: "text",    defaultValue: "Submit application" },
];

function buildCode(v: Record<string, string | boolean>): string {
  const intent = String(v["variant"]);
  let realVariant = "primary";
  let appearance = "filled";
  if (intent === "secondary") { realVariant = "primary"; appearance = "outlined"; }
  else if (intent === "ghost") { realVariant = "primary"; appearance = "text"; }
  else if (intent === "danger") { realVariant = "danger"; appearance = "filled"; }
  const disabledAttr = (v["disabled"] || v["loading"]) ? " disabled" : "";
  const ariaBusy = v["loading"] ? ' aria-busy="true"' : "";
  const label = v["loading"] ? "Loading…" : String(v["label"]);
  return `<Button variant="${realVariant}" appearance="${appearance}" size="${v["size"]}"${disabledAttr}${ariaBusy}>${label}</Button>`;
}

export function ButtonPlayground() {
  return <Playground code={initialCode} controls={controls} buildCode={buildCode} />;
}
