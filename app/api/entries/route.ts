import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-data";
import { entrySchema, formatZodError } from "@/lib/validation";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("entries")
      .select("id,title,notes,amount,type,occurred_on,category_id,created_at,category:categories(id,name,type,color)")
      .order("occurred_on", { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return NextResponse.json({ entries: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: "Could not load entries." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();
    const parsed = entrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const amount = Number(parsed.data.amount);

    const { data, error } = await supabase
      .from("entries")
      .insert({
        title: parsed.data.title,
        notes: parsed.data.notes || null,
        amount,
        type: parsed.data.type,
        occurred_on: parsed.data.occurred_on,
        category_id: parsed.data.category_id
      })
      .select("id,title,notes,amount,type,occurred_on,category_id,created_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ entry: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Could not create entry." }, { status: 500 });
  }
}
