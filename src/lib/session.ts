import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "license_exam_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1年

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET が設定されていません。");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(): Promise<string> {
  return await new SignJWT({ authorized: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.authorized === true;
  } catch {
    return false;
  }
}
