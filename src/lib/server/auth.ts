import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "sahyog_admin";
const TTL_MS = 12 * 60 * 60 * 1000;

/** Admin password. In development it defaults to "admin"; in production login is disabled until ADMIN_PASSWORD is set. */
function password() {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin");
}

const secret = () => process.env.SESSION_SECRET || `sahyog:${password()}`;
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(input: string) {
  const p = password();
  return Boolean(p) && safeEqual(input, p);
}

export async function startSession() {
  const exp = String(Date.now() + TTL_MS);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v || !password()) return false;
  const [exp, mac] = v.split(".");
  return Boolean(exp && mac) && safeEqual(mac, sign(exp)) && Number(exp) > Date.now();
}
