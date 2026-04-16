"use client";

import { useState } from "react";
import { useToast } from "@/components/toast-provider";

type AuthCardProps = {
  adminEmail: string;
  initialError?: string;
};

export function AuthCard({ adminEmail, initialError }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  const [message, setMessage] = useState(
    initialError || "Sign in with the authorized administrator email to access the workspace."
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminEmail) {
      const nextMessage = "The administrator email is not configured yet. Add ADMIN_EMAIL to your environment to continue.";
      setMessage(nextMessage);
      showToast(nextMessage, "error");
      return;
    }

    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
      const nextMessage = `Access is limited to the authorized administrator account (${adminEmail}).`;
      setMessage(nextMessage);
      showToast(nextMessage, "error");
      return;
    }

    setLoading(true);
    setMessage("Signing you in...");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    const payload = await response.json();

    setLoading(false);
    if (!response.ok) {
      const nextMessage = payload.error ?? "We couldn't complete sign-in.";
      setMessage(nextMessage);
      showToast(nextMessage, "error");
      return;
    }

    showToast("Welcome back.");
    window.location.href = "/";
  }

  return (
    <section className="auth-card panel">
      <div className="auth-card-header">
        <span className="auth-badge">Private Finance Workspace</span>
        <h2>Access the admin workspace</h2>
        <p className="muted">
          Access is reserved for one administrator account: {adminEmail || "configure ADMIN_EMAIL first"}.
        </p>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={adminEmail || "admin@company.com"}
            required
          />
        </div>
        <button className="button primary shimmer-button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Continue"}
        </button>
        <p className="status">{message}</p>
      </form>
    </section>
  );
}
