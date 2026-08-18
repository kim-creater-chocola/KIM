import { createHash, timingSafeEqual } from "crypto";
import type { SessionRole } from "./session";

function matchesHash(candidateHash: string, expectedHash: string | undefined): boolean {
  if (!expectedHash) return false;
  const a = Buffer.from(candidateHash, "utf8");
  const b = Buffer.from(expectedHash.trim(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * パスワードを判定し、対応するロールを返す（一致しなければ null）。
 * - APP_PASSWORD_HASH: 友人用の合言葉。回答が実際に保存される。
 * - PREVIEW_PASSWORD_HASH: 確認用の合言葉。ログインできるが回答は保存されない。
 * ハッシュ生成方法: node -e "console.log(require('crypto').createHash('sha256').update('合言葉').digest('hex'))"
 */
export function checkPassword(candidate: string): SessionRole | null {
  const candidateHash = createHash("sha256").update(candidate).digest("hex");

  if (matchesHash(candidateHash, process.env.APP_PASSWORD_HASH)) return "friend";
  if (matchesHash(candidateHash, process.env.PREVIEW_PASSWORD_HASH)) return "preview";
  return null;
}
