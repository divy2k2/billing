import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-data";
import { categorySchema, formatZodError } from "@/lib/validation";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,type,color,created_at")
      .order("name");

    if (error) {
      throw error;
    }

    return NextResponse.json({ categories: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: "Could not load categories." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: parsed.data.name,
        type: parsed.data.type,
        color: parsed.data.color
      })
      .select("id,name,type,color,created_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Could not create category." }, { status: 500 });
  }
}
