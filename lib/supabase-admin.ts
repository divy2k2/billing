import { createClient } from "@supabase/supabase-js";
import { getAdminEmail } from "@/lib/admin";
import { getSupabaseEnv, getSupabaseServiceRoleKey } from "@/lib/env";

export function createSupabaseAdminClient() {
  const { url } = getSupabaseEnv();

  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function getAdminAuthUser() {
  const supabase = createSupabaseAdminClient();
  const adminEmail = getAdminEmail();
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });

  if (error) {
    throw error;
  }

  const adminUser = data.users.find((user) => user.email?.toLowerCase() === adminEmail);

  if (!adminUser) {
    throw new Error("Admin user not found in Supabase Authentication.");
  }

  return adminUser;
}
