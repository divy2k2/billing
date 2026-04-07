"use client";

import { useState } from "react";

type AuthCardProps = {
  adminEmail: string;
  initialError?: string;
};

export function AuthCard({ adminEmail, initialError }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    initialError || "Sign in with the admin email to open this private dashboard."
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminEmail) {
      setMessage("Admin email is not configured yet. Set ADMIN_EMAIL in your environment first.");
      return;
    }

    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
      setMessage(`Only the admin account (${adminEmail}) can sign in to this workspace.`);
      return;
    }

    setLoading(true);
    setMessage("Signing in...");

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
      setMessage(payload.error ?? "Could not sign in.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <section className="auth-card panel">
      <h2>Open your dashboard</h2>
      <p className="muted">Only one admin account is allowed: {adminEmail || "set ADMIN_EMAIL first"}.</p>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={adminEmail || "admin@example.com"}
            required
          />
        </div>
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="status">{message}</p>
      </form>
    </section>
  );
}
