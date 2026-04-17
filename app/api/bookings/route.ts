import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();

    const {
      name,
      phone,
      email,
      service,
      date,
      time,
      description,
      type,
      plumberId,
      plumberName,
      customerName,
      address
    } = body;

    // Handle different booking types
    if (type === "plumber_booking") {
      // Plumber booking
      if (!customerName || !phone || !service || !plumberId) {
        return NextResponse.json(
          { error: "Customer name, phone, service, and plumber are required" },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            customer_name: customerName,
            phone,
            email,
            service_type: service,
            preferred_date: date,
            preferred_time: time,
            description,
            plumber_id: plumberId,
            plumber_name: plumberName,
            address,
            booking_type: "plumber",
            status: "pending",
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error("Error creating plumber booking:", error);
        return NextResponse.json(
          { error: "Failed to create booking" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, booking: data[0] });
    } else {
      // General service booking
      if (!name || !phone || !service) {
        return NextResponse.json(
          { error: "Name, phone, and service are required" },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            name,
            phone,
            email,
            service,
            preferred_date: date,
            preferred_time: time,
            description,
            booking_type: "service",
            status: "pending",
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error("Error creating service booking:", error);
        return NextResponse.json(
          { error: "Failed to create booking" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, booking: data[0] });
    }
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // You might want to check if user is admin here
    // For now, allow authenticated users to view bookings

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings: data });
  } catch (error) {
    console.error("Bookings API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}