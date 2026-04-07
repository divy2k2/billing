function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

export function getAdminEmail() {
  return normalizeEmail(process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL);
}

export function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD configuration.");
  }

  return password;
}

export function isAdminEmail(email?: string | null) {
  const adminEmail = getAdminEmail();

  if (!adminEmail) {
    throw new Error("Missing ADMIN_EMAIL configuration.");
  }

  return normalizeEmail(email) === adminEmail;
}
