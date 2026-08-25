import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Handles the email-confirmation / OAuth redirect. Supabase appends a `code`
 * that we exchange for a session cookie, then forwards the user on.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect_to") || "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}
