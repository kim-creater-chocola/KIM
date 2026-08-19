"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header({
  title,
  isPreview,
  referenceUrl,
  referenceLabel,
  showHomeLink,
}: {
  title: string;
  isPreview?: boolean;
  referenceUrl?: string;
  referenceLabel?: string;
  showHomeLink?: boolean;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      {isPreview && (
        <div className="bg-amber-400 px-4 py-1 text-center text-xs font-bold text-amber-950">
          プレビューモード（回答は保存されません）
        </div>
      )}
      {showHomeLink && (
        <div className="border-b border-slate-100 px-4 py-1.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-slate-500 active:text-slate-700"
          >
            ← ホームに戻る
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          {referenceUrl && (
            <a
              href={referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 underline underline-offset-2"
            >
              参考: {referenceLabel ?? "公式資料"} ↗
            </a>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="shrink-0 text-sm text-slate-400 active:text-slate-600"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
