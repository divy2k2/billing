function requireNamedEnv(name: string, value?: string) {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Add it to .env or .env.local for local development, or set it in Vercel Project Settings -> Environment Variables for production.`
    );
  }

  return value;
}

function optionalEnv(value?: string, fallback?: string) {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : (fallback ?? "");
}

export function getSupabaseEnv() {
  return {
    url: requireNamedEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: requireNamedEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  };
}

export function getSupabaseServiceRoleKey() {
  return requireNamedEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getCompanyProfile() {
  return {
    name: optionalEnv(process.env.COMPANY_NAME, "Lilavanti Enterprise"),
    address: optionalEnv(process.env.COMPANY_ADDRESS, "Address not configured"),
    taxId: optionalEnv(process.env.COMPANY_TAX_ID, "GST / Tax ID not configured"),
    contact: optionalEnv(
      process.env.COMPANY_CONTACT,
      process.env.ADMIN_EMAIL ?? "Contact not configured"
    )
  };
}
