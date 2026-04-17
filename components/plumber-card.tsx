"use client";

import { useState } from "react";
import { PlumberBookingModal } from "@/components/plumber-booking-modal";

interface Plumber {
  id: number;
  name: string;
  photo: string;
  specialization: string;
  experience: string;
  rating: number;
  completedJobs: number;
  available: boolean;
  description: string;
}

interface PlumberCardProps {
  plumber: Plumber;
}

export function PlumberCard({ plumber }: PlumberCardProps) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <div className="plumber-card">
        {/* Profile Header */}
        <div className="plumber-header">
          <div className="plumber-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {/* In a real app: <img src={plumber.photo} alt={plumber.name} className="w-full h-full rounded-full object-cover" /> */}
          </div>

          <h3 className="plumber-name">{plumber.name}</h3>
          <p className="plumber-specialty">{plumber.specialization}</p>

          <div className="plumber-stats">
            <div className="plumber-stat">
              <div className="plumber-stat-value">⭐ {plumber.rating}</div>
              <div className="plumber-stat-label">Rating</div>
            </div>
            <div className="plumber-stat">
              <div className="plumber-stat-value">{plumber.completedJobs}</div>
              <div className="plumber-stat-label">Jobs</div>
            </div>
            <div className="plumber-stat">
              <div className="plumber-stat-value">{plumber.experience}</div>
              <div className="plumber-stat-label">Experience</div>
            </div>
          </div>

          <div className={`plumber-availability ${plumber.available ? "available" : "unavailable"}`}>
            {plumber.available ? "Available Now" : "Currently Busy"}
          </div>
        </div>

        {/* Description */}
        <div className="plumber-content">
          <p className="plumber-description">{plumber.description}</p>

          <button
            onClick={() => setShowBooking(true)}
            disabled={!plumber.available}
            className="btn-book"
          >
            {plumber.available ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <PlumberBookingModal
          plumber={plumber}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
}