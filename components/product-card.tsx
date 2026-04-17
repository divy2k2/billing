"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [showSpecs, setShowSpecs] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);

  const handleInquiry = () => {
    // For now, just show an alert. In a real app, this would open a modal or form
    alert(`Inquiry submitted for: ${product.title}\n\nWe'll contact you soon with pricing and availability.`);
    setShowInquiry(false);
  };

  return (
    <div className={`product-card animate-fade-in-up stagger-${(index % 6) + 1}`}>
      {/* Product Image */}
      <div className="product-image">
        <img src={product.image} alt={product.title} className="product-image-img" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }} />
      </div>

      {/* Product Info */}
      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.snippet}</p>

        {/* Specs Toggle */}
        {showSpecs && (
          <div className="product-specs">
            <div className="product-specs-title">Specifications:</div>
            <div className="product-specs-content">{product.specs}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="product-actions">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="btn-specs"
          >
            {showSpecs ? "Hide Specs" : "View Specs"}
          </button>

          <button
            onClick={() => setShowInquiry(true)}
            className="btn-inquiry"
          >
            Add to Inquiry
          </button>

          <div className="product-price">
            {product.price}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="modal-overlay">
          <div className="modal-content inquiry-modal">
            <div className="modal-body inquiry-content">
              <h3 className="inquiry-title">Product Inquiry</h3>
              <p className="inquiry-text">
                Interested in <strong>{product.title}</strong>?
              </p>
              <p className="inquiry-text">
                We'll contact you with current pricing, availability, and any additional information you need.
              </p>
              <div className="inquiry-actions">
                <button
                  onClick={() => setShowInquiry(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInquiry}
                  className="btn-submit"
                >
                  Submit Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}