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

const BASE = "/portals/pm-ajay";
const PUBLIC_PATHS = [`${BASE}/login`, `${BASE}/forgot-password`];
const SESSION_COOKIE = "pmajay_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DEBUG: expose pathname in response header so we can see what we're getting
  const debugRes = NextResponse.next();
  debugRes.headers.set("x-mw-pathname", pathname);

  // Allow public paths and static assets through
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return debugRes;
  }

  // Check session cookie
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `${BASE}/login`;
    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.headers.set("x-mw-pathname", pathname);
    return redirectRes;
  }

  return debugRes;
}

export const config = {
  // Match ALL paths – Next.js 15 with basePath strips the basePath prefix
  // before passing to middleware, so we use a catch-all here and do our own
  // path-level filtering inside the middleware function.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
