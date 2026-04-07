import { NextResponse } from "next/server";
import { fetchDashboardData } from "@/lib/server-data";
import { clearAdminSessionResponse } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Could not load dashboard summary." }, { status: 500 });
  }
}

export async function DELETE() {
  return clearAdminSessionResponse();
}
