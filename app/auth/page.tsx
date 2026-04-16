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
      <div className="auth-hero">
        <p className="eyebrow">Lilavanti Enterprise</p>
        <h1>Smart Money Tracker.</h1>
        <p className="muted">
          One private admin account manages the full finance workspace. Allowed admin email:
          {" "}
          <strong>{adminEmail || "set ADMIN_EMAIL first"}</strong>
        </p>
      </div>
      <AuthCard adminEmail={adminEmail} initialError={params?.error} />
    </main>
  );
}
