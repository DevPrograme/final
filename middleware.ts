import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets, so the Supabase session is
     * refreshed on every navigation and protected routes stay guarded.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|ttf|woff2?|css|js)$).*)",
  ],
};
