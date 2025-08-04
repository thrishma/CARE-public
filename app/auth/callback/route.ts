import { createClient } from "@/utils/supabase/server";
import { getBaseUrl } from "@/utils/url";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const forwardedProto = request.headers.get("x-forwarded-proto");
      const isLocalEnv = process.env.NODE_ENV === "development";

      let redirectUrl: string;

      if (isLocalEnv) {
        // Local development
        redirectUrl = `${origin}${next}`;
      } else if (forwardedHost) {
        // Production with load balancer
        const protocol = forwardedProto || "https";
        redirectUrl = `${protocol}://${forwardedHost}${next}`;
      } else {
        // Fallback to configured base URL
        redirectUrl = `${getBaseUrl()}${next}`;
      }

      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${getBaseUrl()}/auth/auth-code-error`);
}
