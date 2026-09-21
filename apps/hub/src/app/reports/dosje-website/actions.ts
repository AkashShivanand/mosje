"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isIssuesEditor } from "@/lib/admin/auth";
import { getIssue } from "@/lib/website-issues/data";
import { writeStatuses, type StatusUpdate } from "@/lib/website-issues/status-store";
import { STATUSES, type IssueStatus } from "@/lib/website-issues/types";

const BASE = "/reports/dosje-website";
/** Remembers who is editing, so the name need not be typed on every save. Not a credential. */
const NAME_COOKIE = "mosje-issues-editor-name";

function field(fd: FormData, k: string): string | undefined {
  const v = fd.get(k);
  return typeof v === "string" ? v : undefined;
}

/** Only return to the register — the form's return address is never trusted as-is. */
function back(fd: FormData, flag: string): never {
  const raw = field(fd, "return") ?? BASE;
  const to = raw === BASE || raw.startsWith(BASE + "?") || raw.startsWith(BASE + "/") ? raw : BASE;
  redirect(to + (to.includes("?") ? "&" : "?") + flag);
}

async function save(fd: FormData, ids: string[], update: StatusUpdate): Promise<void> {
  if (!(await isIssuesEditor())) redirect(`/admin/login?next=${encodeURIComponent(BASE)}`);
  const by = (field(fd, "editor") ?? "").trim().slice(0, 80);
  if (!by) back(fd, "saved=noname");
  const valid = ids.filter((id) => getIssue(id));
  if (valid.length === 0) back(fd, "saved=none");
  if (update.status && !(STATUSES as readonly string[]).includes(update.status)) back(fd, "saved=error");
  try {
    await writeStatuses(valid, update, by);
  } catch {
    back(fd, "saved=error");
  }
  (await cookies()).set(NAME_COOKIE, by, { path: BASE, sameSite: "lax", maxAge: 60 * 60 * 24 * 90, httpOnly: true, secure: process.env.NODE_ENV === "production" });
  revalidatePath(BASE, "layout");
  back(fd, `saved=${valid.length}`);
}

/** One issue: status, assignee, target date and note. */
export async function updateIssue(fd: FormData): Promise<void> {
  const id = field(fd, "id") ?? "";
  await save(fd, [id], {
    status: (field(fd, "status") as IssueStatus | undefined) || undefined,
    assignee: field(fd, "assignee") ?? "",
    targetDate: field(fd, "targetDate") ?? "",
    note: field(fd, "note") ?? "",
  });
}

/** Several issues at once. A field left blank is left as it is on each issue. */
export async function updateMany(fd: FormData): Promise<void> {
  const ids = fd.getAll("ids").filter((v): v is string => typeof v === "string").slice(0, 500);
  const status = field(fd, "bulkStatus") || undefined;
  const assignee = field(fd, "bulkAssignee")?.trim() || undefined;
  const targetDate = field(fd, "bulkTargetDate") || undefined;
  if (!status && !assignee && !targetDate) back(fd, "saved=nothing");
  await save(fd, ids, { status: status as IssueStatus | undefined, assignee, targetDate });
}

export async function editorName(): Promise<string> {
  return (await cookies()).get(NAME_COOKIE)?.value ?? "";
}
