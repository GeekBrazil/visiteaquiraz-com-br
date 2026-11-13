import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const COOKIE_HOST = "__Host-va_admin";
export const COOKIE_DEV = "va_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function getSigningKey(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || process.env.CRON_SECRET || "";
}

export function verifyAdminCredential(candidate: string): boolean {
  if (!candidate) return false;
  const adminSecret = process.env.ADMIN_SECRET || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (adminSecret && safeCompare(candidate, adminSecret)) return true;
  if (adminPassword && safeCompare(candidate, adminPassword)) return true;
  return false;
}

export function createSessionToken(): string {
  const key = getSigningKey();
  if (!key) throw new Error("ADMIN_SECRET não configurado no servidor.");
  const exp = String(Date.now() + SESSION_TTL_MS);
  const sig = createHmac("sha256", key).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

export function verifySessionToken(token?: string | null): boolean {
  if (!token) return false;
  const key = getSigningKey();
  if (!key) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expNum = Number(expStr);
  if (!Number.isFinite(expNum) || Date.now() > expNum) return false;
  const expected = createHmac("sha256", key).update(expStr).digest("hex");
  return safeCompare(sig, expected);
}

export function extractBearer(req: NextRequest): string {
  const auth = req.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return "";
}

export function isAdminRequest(req: NextRequest): boolean {
  const headerSecret = req.headers.get("x-admin-secret") || extractBearer(req);
  if (headerSecret && verifyAdminCredential(headerSecret)) return true;

  const cookieToken =
    req.cookies.get(COOKIE_HOST)?.value || req.cookies.get(COOKIE_DEV)?.value;
  return verifySessionToken(cookieToken);
}

export async function isAdminSessionServer(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_HOST)?.value || store.get(COOKIE_DEV)?.value;
  return verifySessionToken(token);
}

export function verifyCronRequest(req: NextRequest): boolean {
  if (isAdminRequest(req)) return true;
  const cronSecret = process.env.CRON_SECRET || "";
  if (!cronSecret) return false;
  const candidate = req.headers.get("x-cron-secret") || extractBearer(req);
  return Boolean(candidate && safeCompare(candidate, cronSecret));
}
