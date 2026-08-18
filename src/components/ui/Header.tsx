"use client";

import { useRouter } from "next/navigation";

export function Header({
  title,
  isPreview,
}: {
  title: string;
  isPreview?: boolean;
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
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-400 active:text-slate-600"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
