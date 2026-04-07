function requireNamedEnv(name: string, value?: string) {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Add it to .env or .env.local for local development, or set it in Vercel Project Settings -> Environment Variables for production.`
    );
  }

  return value;
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
