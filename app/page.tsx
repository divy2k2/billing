import { redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard-page";
import { isAdminEmail } from "@/lib/admin";
import { fetchDashboardData, getCurrentUser } from "@/lib/server-data";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const maybeError = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    const parts = [
      maybeError.message,
      maybeError.details,
      maybeError.hint,
      maybeError.code ? `code=${maybeError.code}` : undefined
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(" | ");
    }
  }

  return "Unknown workspace issue.";
}

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/auth?error=This workspace is available to the designated administrator only.");
  }

  let data;

  try {
    data = await fetchDashboardData();
  } catch (error) {
    redirect(
      `/auth?error=${encodeURIComponent(
        `Could not load workspace data: ${getErrorMessage(error)}`
        
      )}`
    );
  }

  return <DashboardPage initialData={data} />;
}
