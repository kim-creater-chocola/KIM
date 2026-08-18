"use client";

import { useRouter } from "next/navigation";

export function Header({ title }: { title: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <h1 className="text-lg font-bold text-slate-900">{title}</h1>
      <button
        onClick={handleLogout}
        className="text-sm text-slate-400 active:text-slate-600"
      >
        ログアウト
      </button>
    </header>
  );
}
