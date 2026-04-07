import { NextResponse } from "next/server";
import { getAdminEmail, isAdminEmail } from "@/lib/admin";
import { createAdminSessionResponse } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const adminEmail = getAdminEmail();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!isAdminEmail(email)) {
      return NextResponse.json(
        { error: `Only the admin account (${adminEmail}) can sign in to this workspace.` },
        { status: 403 }
      );
    }
    return createAdminSessionResponse();
  } catch (error) {
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
