"use client";

import { Playground, type ControlDef } from "@/components/playground/index";

const initialCode = `<Badge status="success">Approved</Badge>`;

const controls: ControlDef[] = [
  { name: "status", label: "Status", type: "select", options: ["neutral", "success", "warning", "danger", "primary"], defaultValue: "success" },
  { name: "size", label: "Size", type: "select", options: ["sm", "lg"], defaultValue: "sm" },
  { name: "label", label: "Label", type: "text", defaultValue: "Approved" },
];

function buildCode(v: Record<string, string | boolean>): string {
  return `<Badge status="${v["status"]}" size="${v["size"]}">${v["label"]}</Badge>`;
}

export function BadgePlayground() {
  return <Playground code={initialCode} controls={controls} buildCode={buildCode} />;
}
