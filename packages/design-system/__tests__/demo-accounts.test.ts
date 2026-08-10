import { describe, it, expect } from "vitest";
import { DEMO_ACCOUNTS, findDemoAccounts } from "../demo/demo-accounts.js";

describe("findDemoAccounts", () => {
  it("matches a portal by path prefix", () => {
    const found = findDemoAccounts("/portals/nmba/admin/login");
    expect(found?.path).toBe("/portals/nmba");
    expect(found!.accounts.length).toBeGreaterThan(0);
  });

  it("returns null when no set matches", () => {
    expect(findDemoAccounts("/website/schemes-services")).toBeNull();
    expect(findDemoAccounts("/")).toBeNull();
  });

  it("longest matching prefix wins", () => {
    // /portals/tg has both a citizen and an admin set.
    const admin = findDemoAccounts("/portals/tg/admin/login");
    expect(admin?.path).toBe("/portals/tg/admin");
  });
});

describe("DEMO_ACCOUNTS", () => {
  it("every set has a non-empty path starting with a slash", () => {
    for (const set of DEMO_ACCOUNTS) {
      expect(set.path).toMatch(/^\//);
      expect(set.accounts.length).toBeGreaterThan(0);
    }
  });

  it("every account carries a role, id and password", () => {
    for (const set of DEMO_ACCOUNTS) {
      for (const a of set.accounts) {
        expect(Boolean(a.role && a.id && a.password)).toBe(true);
      }
    }
  });
});
