"use client";

import { useState } from "react";
import type { Plumber } from "@/lib/types";

interface PlumberBookingModalProps {
  plumber: Plumber;
  onClose: () => void;
}

const serviceTypes = [
  { id: "emergency", name: "Emergency Repair", description: "Urgent fixes, leaks, burst pipes" },
  { id: "installation", name: "New Installation", description: "New plumbing setup, fixtures, pipes" },
  { id: "maintenance", name: "Maintenance", description: "Regular check-ups, cleaning, repairs" },
  { id: "renovation", name: "Renovation", description: "Bathroom/kitchen remodel, upgrades" }
];

export function PlumberBookingModal({ plumber, onClose }: PlumberBookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: "",
    date: "",
    time: "",
    customerName: "",
    phone: "",
    email: "",
    address: "",
    description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData(prev => ({ ...prev, serviceType: serviceId }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const bookingData = {
        ...formData,
        plumberId: plumber.id,
        plumberName: plumber.name,
        type: "plumber_booking"
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert(`Booking confirmed with ${plumber.name}!\n\nWe'll send you a confirmation SMS/WhatsApp shortly.`);
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("There was an error booking the service. Please try again.");
    }
  };

  const canProceedToNext = step === 1 ? formData.serviceType : (
    step === 2 ? (formData.date && formData.time) : (
      step === 3 ? (formData.customerName && formData.phone && formData.address) : false
    )
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderBookingForm = () => {
    return (
      <>
        {/* Progress Indicator */}
        <div className="booking-steps">
          <div className="step-indicator">
            <div className={`step-circle ${step >= 1 ? (step > 1 ? "completed" : "active") : "pending"}`}>1</div>
            <div className={`step-line ${step > 1 ? "active" : ""}`}></div>
            <div className={`step-circle ${step >= 2 ? (step > 2 ? "completed" : "active") : "pending"}`}>2</div>
            <div className={`step-line ${step > 2 ? "active" : ""}`}></div>
            <div className={`step-circle ${step >= 3 ? (step > 3 ? "completed" : "active") : "pending"}`}>3</div>
            <div className={`step-line ${step > 3 ? "active" : ""}`}></div>
            <div className={`step-circle ${step >= 4 ? "completed" : "pending"}`}>4</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Service Type */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">What service do you need?</h3>
              <div className="service-options">
                {serviceTypes.map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceSelect(service.id)}
                    className="service-option"
                  >
                    <h4 className="service-option-title">{service.name}</h4>
                    <p className="service-option-description">{service.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">When would you like the service?</h3>
              <div className="form-row">
                <div>
                  <label className="form-label">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Preferred Time *
                  </label>
                  <select
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
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
            </div>
          )}

          {/* Step 3: Customer Details */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Contact Information</h3>
              <div className="form-row">
                <div>
                  <label className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">
                  Service Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter the address where service is needed"
                  className="form-textarea"
                />
              </div>
              <div>
                <label className="form-label">
                  Additional Details
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the issue or specific requirements"
                  className="form-textarea"
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
              <div className="confirmation-summary">
                <div className="confirmation-row">
                  <div>
                    <strong>Plumber:</strong> {plumber.name}
                  </div>
                  <div>
                    <strong>Service:</strong> {serviceTypes.find(s => s.id === formData.serviceType)?.name}
                  </div>
                </div>
                <div className="confirmation-row">
                  <div>
                    <strong>Date:</strong> {formData.date}
                  </div>
                  <div>
                    <strong>Time:</strong> {formData.time}
                  </div>
                </div>
                <div className="confirmation-row">
                  <div>
                    <strong>Customer:</strong> {formData.customerName}
                  </div>
                  <div>
                    <strong>Phone:</strong> {formData.phone}
                  </div>
                </div>
                {formData.email && (
                  <div className="confirmation-row">
                    <div>
                      <strong>Email:</strong> {formData.email}
                    </div>
                  </div>
                )}
                <div className="confirmation-row">
                  <div>
                    <strong>Address:</strong> {formData.address}
                  </div>
                </div>
                {formData.description && (
                  <div className="confirmation-row">
                    <div>
                      <strong>Details:</strong> {formData.description}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                By confirming this booking, you agree to our terms of service. We'll send you a confirmation via SMS/WhatsApp.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="modal-footer">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceedToNext}
                className={`btn-primary ml-auto ${!canProceedToNext ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ml-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Book {plumber.name}</h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {renderBookingForm()}
        </div>
      </div>
    </div>
  );
};
