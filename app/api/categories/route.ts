import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-data";

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

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: body.name,
        type: body.type,
        color: body.color ?? "#0f766e"
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
