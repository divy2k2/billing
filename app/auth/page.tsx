import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { getAdminEmail, isAdminEmail } from "@/lib/admin";
import { getCurrentUser } from "@/lib/server-data";

type AuthPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const user = await getCurrentUser();
  const params = searchParams ? await searchParams : undefined;
  const adminEmail = getAdminEmail();

  if (user && isAdminEmail(user.email) && !params?.error) {
    redirect("/");
  }

  return (
    <main className="auth-page">
      <div className="auth-backdrop" aria-hidden="true">
        <div className="auth-glow auth-glow-a" />
        <div className="auth-glow auth-glow-b" />
        <div className="auth-grid" />
      </div>
      <section className="auth-stage">
        <div className="auth-hero">
          <p className="eyebrow">Lilavanti Enterprise</p>
          <h1>Finance, Refined.</h1>
          <p className="muted">
            This workspace is reserved for a single administrator. Authorized email:
            {" "}
            <strong>{adminEmail || "configure ADMIN_EMAIL first"}</strong>
          </p>
        </div>
        <AuthCard adminEmail={adminEmail} initialError={params?.error} />
      </section>
    </main>
  );
}
