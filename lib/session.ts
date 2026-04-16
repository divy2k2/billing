import { cookies } from "next/headers";
import { getAdminEmail, getAdminPassword, isAdminEmail } from "@/lib/admin";

export const SESSION_COOKIE_NAME = "cashflow-admin-session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

type SessionPayload = {
  email: string;
  exp: number;
};

function getSessionSecret() {
  return getAdminPassword();
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function encodeBase64Url(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64url");
}

async function signValue(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return encodeBase64Url(signature);
}

async function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_MAX_AGE * 1000
  };
  const encoded = encodePayload(payload);
  const signature = await signValue(encoded);
  return `${encoded}.${signature}`;
}

export async function parseSessionToken(token?: string) {
  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = await signValue(encoded);
  const validSignature = signature === expectedSignature;

  if (!validSignature) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;

  if (payload.exp < Date.now()) {
    return null;
  }

  if (!isAdminEmail(payload.email)) {
    return null;
  }

  return payload;
}

export async function createAdminSessionResponse() {
  const response = Response.json({ success: true });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${await createSessionToken(getAdminEmail())}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`
  );
  return response;
}

export async function clearAdminSessionResponse() {
  const response = Response.json({ success: true });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
  return response;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return parseSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
