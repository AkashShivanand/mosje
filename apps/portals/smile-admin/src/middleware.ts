import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* SMILE Admin — route guard.
   All paths under /portals/smile-admin/ are protected EXCEPT:
   - /portals/smile-admin/login       (sign-in page)
   - /portals/smile-admin/forgot-password
   - Static assets (_next/static, _next/image, favicon, public images)

   We read the session from localStorage, but localStorage is not available
   in middleware (Edge runtime). We use a lightweight cookie instead:
   Set "smile_session=1" in the auth-context signIn and clear on signOut.

   Because this is a prototype, the cookie is just a presence flag —
   the real account data still comes from localStorage on the client. */

const BASE = "/portals/smile-admin";
const PUBLIC_PATHS = [`${BASE}/login`, `${BASE}/forgot-password`];
const SESSION_COOKIE = "smile_session";

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
    loginUrl.pathname = `${BASE}/login`;
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
