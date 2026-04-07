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

    const { count, error: linkedEntriesError } = await supabase
      .from("entries")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (linkedEntriesError) {
      throw linkedEntriesError;
    }

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: "This category is used by transactions and cannot be deleted yet." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Could not delete category." }, { status: 500 });
  }
}
