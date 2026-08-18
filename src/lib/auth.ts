import { createHash, timingSafeEqual } from "crypto";

/**
 * APP_PASSWORD_HASH（sha256の16進文字列）と照合する。
 * 生成方法: node -e "console.log(require('crypto').createHash('sha256').update('合言葉').digest('hex'))"
 */
export function checkPassword(candidate: string): boolean {
  const expectedHash = process.env.APP_PASSWORD_HASH;
  if (!expectedHash) {
    throw new Error("APP_PASSWORD_HASH が設定されていません。");
  }

  const candidateHash = createHash("sha256").update(candidate).digest("hex");
  const a = Buffer.from(candidateHash, "utf8");
  const b = Buffer.from(expectedHash.trim(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
