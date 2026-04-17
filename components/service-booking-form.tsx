"use client";

import { useState } from "react";

export function ServiceBookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you for your booking request! We'll contact you soon.");
        setFormData({
          name: "",
          phone: "",
          email: "",
          service: "",
          date: "",
          time: "",
          description: ""
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("There was an error submitting your booking. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="premium-card animate-fade-in-up">
      <div className="grid md:grid-cols-2 gap-6" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="service" className="form-label">
          Service Needed *
        </label>
        <select
          id="service"
          name="service"
          required
          value={formData.service}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Select a service</option>
          <option value="plumbing-repair">Plumbing Repairs</option>
          <option value="pipe-fitting">Pipe Fitting & Installation</option>
          <option value="drain-cleaning">Drain Cleaning</option>
          <option value="water-heater">Water Heater Services</option>
          <option value="hardware-supply">Hardware Supply</option>
          <option value="emergency">Emergency Services</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Preferred Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="time" className="form-label">
            Preferred Time
          </label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select time</option>
            <option value="morning">Morning (9AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 5PM)</option>
            <option value="evening">Evening (5PM - 8PM)</option>
            <option value="emergency">Emergency (24/7)</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="description" className="form-label">
          Description of Issue
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Please describe your plumbing issue or service needs..."
          className="form-textarea"
        />
      </div>

      <button
        type="submit"
        className="btn-submit w-full"
        style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem' }}
      >
        Submit Booking Request
      </button>
    </form>
  );
}