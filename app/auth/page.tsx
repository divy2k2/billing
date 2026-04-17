import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { getAdminEmail } from "@/lib/admin";

type AuthPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const adminEmail = getAdminEmail();

  return (
    <main className="auth-page">
      <div className="auth-backdrop" aria-hidden="true">
        <div className="auth-glow auth-glow-a" />
        <div className="auth-glow auth-glow-b" />
        <div className="auth-grid" />
      </div>
      <section className="auth-stage">
        <div className="auth-hero">
          <p className="eyebrow">Gayatri Plywood and Hardware</p>
          <h1>Admin Access</h1>
          <p className="muted">
            This admin panel is for managing service bookings and business operations.
            Authorized email: {" "}
            <strong>{adminEmail || "configure ADMIN_EMAIL first"}</strong>
          </p>
        </div>
        <AuthCard adminEmail={adminEmail} initialError={params?.error} />
      </section>
    </main>
  );
}
