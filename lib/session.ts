import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getAdminEmail, getAdminPassword, isAdminEmail } from "@/lib/admin";

const SESSION_COOKIE_NAME = "cashflow-admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

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

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_MAX_AGE * 1000
  };
  const encoded = encodePayload(payload);
  const signature = signValue(encoded);
  return `${encoded}.${signature}`;
}

function parseSessionToken(token?: string) {
  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = signValue(encoded);
  const validSignature =
    signature.length === expectedSignature.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

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
    `${SESSION_COOKIE_NAME}=${createSessionToken(getAdminEmail())}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`
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
