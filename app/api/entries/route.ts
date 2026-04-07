import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-data";

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

    if (!body.title || !body.category_id || !body.type || !body.occurred_on) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than zero." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("entries")
      .insert({
        title: body.title,
        notes: body.notes || null,
        amount,
        type: body.type,
        occurred_on: body.occurred_on,
        category_id: body.category_id
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
