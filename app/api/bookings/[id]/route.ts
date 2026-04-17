import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const body = await request.json();

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Update booking status
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating booking:", error);
      return NextResponse.json(
        { error: "Failed to update booking" },
        { status: 500 }
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking: data[0] });
  } catch (error) {
    console.error("Booking update API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}