import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user && !isAdminEmail(user.email)) {
      await supabase.auth.signOut();

      const authUrl = new URL("/auth", url.origin);
      authUrl.searchParams.set("error", "This workspace is restricted to the admin account only.");
      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
