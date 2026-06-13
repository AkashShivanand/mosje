import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* PM-AJAY — route guard.
   All paths under /portals/pm-ajay/ are protected EXCEPT:
   - /portals/pm-ajay/login       (sign-in page)
   - /portals/pm-ajay/forgot-password
   - Static assets (_next/static, _next/image, favicon, public images)

   We read the session from localStorage, but localStorage is not available
   in middleware (Edge runtime). We use a lightweight cookie instead:
   set "pmajay_session=1" in the auth-context signIn and clear on signOut.

   Because this is a prototype, the cookie is just a presence flag —
   the real account data still comes from localStorage on the client. */

// NOTE: with `basePath` set, Next.js strips the basePath before middleware runs
// (so `pathname` here is e.g. "/login", not "/portals/pm-ajay/login") and re-adds
// it to any redirect we return. So paths here must be basePath-RELATIVE — never
// prepend the basePath manually or it doubles (…/portals/pm-ajay/portals/pm-ajay/…).
const PUBLIC_PATHS = ["/login", "/forgot-password"];
const SESSION_COOKIE = "pmajay_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static assets through
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check session cookie
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match ALL paths – Next.js 15 with basePath strips the basePath prefix
  // before passing to middleware, so we use a catch-all here and do our own
  // path-level filtering inside the middleware function.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
