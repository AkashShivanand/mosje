/**
 * Middleware unit tests — PM-AJAY route guard.
 *
 * INTEGRATION NOTE: The middleware uses Edge-runtime globals (NextRequest /
 * NextResponse from "next/server"). Running those directly in a Node/Vitest
 * environment requires mocking because the Web Fetch API types are used
 * internally by Next.js. Full end-to-end integration tests (using
 * `next-test-utils` or a playwright environment) would cover actual network
 * responses; the tests below cover the routing *logic* via a manually-mocked
 * Next.js module so they remain fast and dependency-free.
 *
 * What IS tested here (unit):
 *  - Routing decisions: redirect vs. pass-through given various paths/cookies.
 *  - QA-003 regression: no x-mw-pathname header is added to responses.
 *
 * What needs integration testing:
 *  - The actual HTTP redirect URL construction (loginUrl.clone() behaviour).
 *  - Cookie reading from a real request in the Edge runtime.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock next/server ────────────────────────────────────────────────────────

/** Minimal NextResponse stand-in that records what action was taken. */
class MockResponse {
  public type: "next" | "redirect";
  public redirectUrl?: string;
  public headers: Map<string, string>;

  constructor(type: "next" | "redirect", redirectUrl?: string) {
    this.type = type;
    this.redirectUrl = redirectUrl;
    this.headers = new Map();
  }
}

/** Minimal NextURL stand-in. */
class MockNextUrl {
  pathname: string;
  constructor(pathname: string) {
    this.pathname = pathname;
  }
  clone() {
    return new MockNextUrl(this.pathname);
  }
}

/** Minimal NextRequest stand-in. */
class MockNextRequest {
  nextUrl: MockNextUrl;
  cookies: { get: (name: string) => { value: string } | undefined };

  constructor(pathname: string, cookieValue?: string) {
    this.nextUrl = new MockNextUrl(pathname);
    this.cookies = {
      get: (name: string) =>
        name === "pmajay_session" && cookieValue !== undefined
          ? { value: cookieValue }
          : undefined,
    };
  }
}

// Provide global mock before importing middleware
vi.mock("next/server", () => {
  return {
    NextResponse: {
      next: () => new MockResponse("next"),
      redirect: (url: MockNextUrl) =>
        new MockResponse("redirect", url.pathname),
    },
  };
});

// ─── Import middleware AFTER the mock is registered ─────────────────────────
// Dynamic import is used so that vi.mock() is hoisted and applied first.
let middleware: (req: MockNextRequest) => MockResponse;

beforeEach(async () => {
  // Re-import each time to get the hoisted mock applied properly.
  const mod = await import("../src/middleware.js");
  middleware = mod.middleware as unknown as (
    req: MockNextRequest
  ) => MockResponse;
});

// ─── Helper ─────────────────────────────────────────────────────────────────

function req(pathname: string, hasSession?: boolean) {
  return new MockNextRequest(
    pathname,
    hasSession === true ? "1" : undefined
  ) as unknown as Parameters<typeof middleware>[0];
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("PM-AJAY middleware — unauthenticated requests", () => {
  it("redirects to login when no session cookie is present on a protected path", () => {
    const res = middleware(req("/portals/pm-ajay/dashboard"));
    expect(res.type).toBe("redirect");
    expect(res.redirectUrl).toBe("/portals/pm-ajay/login");
  });

  it("redirects to login for the base path /portals/pm-ajay", () => {
    const res = middleware(req("/portals/pm-ajay"));
    expect(res.type).toBe("redirect");
    expect(res.redirectUrl).toBe("/portals/pm-ajay/login");
  });

  it("redirects for any deep protected path", () => {
    const res = middleware(req("/portals/pm-ajay/reports/monthly"));
    expect(res.type).toBe("redirect");
    expect(res.redirectUrl).toBe("/portals/pm-ajay/login");
  });
});

describe("PM-AJAY middleware — authenticated requests", () => {
  it("passes through when pmajay_session cookie is present on a protected path", () => {
    const res = middleware(req("/portals/pm-ajay/dashboard", true));
    expect(res.type).toBe("next");
  });

  it("passes through for authenticated requests to deep paths", () => {
    const res = middleware(req("/portals/pm-ajay/schemes/pm-ajay/edit", true));
    expect(res.type).toBe("next");
  });
});

describe("PM-AJAY middleware — public paths (always pass-through)", () => {
  it("allows /portals/pm-ajay/login without a session cookie", () => {
    const res = middleware(req("/portals/pm-ajay/login"));
    expect(res.type).toBe("next");
  });

  it("allows /portals/pm-ajay/login with a session cookie", () => {
    const res = middleware(req("/portals/pm-ajay/login", true));
    expect(res.type).toBe("next");
  });

  it("allows /portals/pm-ajay/forgot-password without a session cookie", () => {
    const res = middleware(req("/portals/pm-ajay/forgot-password"));
    expect(res.type).toBe("next");
  });

  it("allows sub-paths of /portals/pm-ajay/login (e.g. with trailing segment)", () => {
    // The PUBLIC_PATHS check uses pathname.startsWith(p + "/")
    const res = middleware(req("/portals/pm-ajay/login/otp"));
    expect(res.type).toBe("next");
  });
});

describe("PM-AJAY middleware — static asset paths", () => {
  it("always passes through /_next/static/... paths", () => {
    const res = middleware(req("/_next/static/chunks/main.js"));
    expect(res.type).toBe("next");
  });

  it("always passes through /_next/image paths", () => {
    const res = middleware(req("/_next/image?url=/logo.png"));
    expect(res.type).toBe("next");
  });

  it("passes through paths containing a dot (e.g. favicon.ico)", () => {
    const res = middleware(req("/favicon.ico"));
    expect(res.type).toBe("next");
  });

  it("passes through any file-like path (contains '.')", () => {
    // The middleware uses pathname.includes(".") as a heuristic for static files
    const res = middleware(req("/portals/pm-ajay/logo.svg"));
    expect(res.type).toBe("next");
  });
});

describe("QA-003 regression — no x-mw-pathname header", () => {
  it("pass-through response does not set x-mw-pathname header", () => {
    const res = middleware(req("/portals/pm-ajay/dashboard", true));
    expect(res.headers.get("x-mw-pathname")).toBeUndefined();
  });

  it("redirect response does not set x-mw-pathname header", () => {
    const res = middleware(req("/portals/pm-ajay/dashboard"));
    expect(res.headers.get("x-mw-pathname")).toBeUndefined();
  });
});
