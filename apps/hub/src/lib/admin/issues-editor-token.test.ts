// The issue-register editor cookie: scoped to the register, derived from the
// admin password under its own label, so it can never stand in for either admin
// cookie (or they for it).
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ADMIN_COOKIE_PATH,
  ISSUES_EDITOR_COOKIE,
  ISSUES_EDITOR_COOKIE_PATH,
  expectedAdminToken,
  expectedIssuesEditorToken,
  expectedPreviewToken,
} from "./tokens.ts";

test("the editor cookie is scoped to the issue register only", () => {
  assert.equal(ISSUES_EDITOR_COOKIE_PATH, "/reports/dosje-website");
  assert.notEqual(ISSUES_EDITOR_COOKIE_PATH, "/");
  assert.notEqual(ISSUES_EDITOR_COOKIE_PATH, ADMIN_COOKIE_PATH);
  assert.equal(ISSUES_EDITOR_COOKIE, "mosje-issues-editor");
});

test("the editor token differs from the admin and preview tokens", async () => {
  const previous = { ...process.env };
  try {
    process.env.ADMIN_PASSWORD = "s3cret";
    const editor = await expectedIssuesEditorToken();
    assert.ok(editor);
    assert.notEqual(editor, await expectedAdminToken());
    assert.notEqual(editor, await expectedPreviewToken());
  } finally {
    process.env = previous;
  }
});

test("no editor token without an admin password", async () => {
  const previous = { ...process.env };
  try {
    delete process.env.ADMIN_PASSWORD;
    assert.equal(await expectedIssuesEditorToken(), null);
  } finally {
    process.env = previous;
  }
});
