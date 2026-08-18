import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "license_exam_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1年

export type SessionRole = "friend" | "preview";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET が設定されていません。");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(role: SessionRole): Promise<string> {
  return await new SignJWT({ authorized: true, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(getSecretKey());
}

/** トークンが有効かどうかだけを確認する（proxy用） */
export async function verifySessionToken(token: string): Promise<boolean> {
  const session = await decodeSessionToken(token);
  return session !== null;
}

async function decodeSessionToken(
  token: string,
): Promise<{ role: SessionRole } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.authorized !== true) return null;
    const role: SessionRole = payload.role === "preview" ? "preview" : "friend";
    return { role };
  } catch {
    return null;
  }
}

/** サーバーコンポーネント/Route Handlerから現在のセッションのroleを取得する */
export async function getCurrentRole(): Promise<SessionRole | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await decodeSessionToken(token);
  return session?.role ?? null;
}
