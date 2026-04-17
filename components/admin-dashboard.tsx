"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Booking } from "@/lib/types";

export function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuthAndFetchBookings();
  }, []);

  const checkAuthAndFetchBookings = async () => {
    try {
      // First check if we can access the bookings API
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        // Not authenticated, redirect to auth if not already there
        if (pathname !== "/auth") {
          router.push("/auth");
        }
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      if (pathname !== "/auth") {
        router.push("/auth");
      }
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh the bookings list
        checkAuthAndFetchBookings();
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
    // Clear local state and redirect to home
    setIsAuthenticated(false);
    setBookings([]);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Gayatri Hardware - Admin Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Service Bookings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.booking_type === 'plumber' ? booking.customer_name : booking.name}
                        </div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                        {booking.email && (
                          <div className="text-sm text-gray-500">{booking.email}</div>
                        )}
                        {booking.booking_type === 'plumber' && booking.address && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            📍 {booking.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {booking.booking_type === 'plumber' ? (
                          <>
                            <div className="font-medium">{booking.service_type}</div>
                            <div className="text-gray-500">with {booking.plumber_name}</div>
                          </>
                        ) : (
                          booking.service
                        )}
                      </div>
                      {booking.description && (
                        <div className="text-sm text-gray-500 max-w-xs truncate mt-1">
                          {booking.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.preferred_date || "Not specified"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.preferred_time || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                      {booking.booking_type === 'plumber' && (
                        <div className="text-xs text-gray-500 mt-1">Plumber Booking</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No bookings yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}