import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-data";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from("entries")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Could not delete entry." }, { status: 500 });
  }
}
