import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { UnitStatCard } from "@/components/ui/UnitStatCard";
import { getOverallStat, getUnitStats, getWrongQuestionIds } from "@/lib/data";
import { getCurrentRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [overall, unitStats, wrongIds, role] = await Promise.all([
    getOverallStat(),
    getUnitStats(),
    getWrongQuestionIds(),
    getCurrentRole(),
  ]);

  return (
    <div className="pb-10">
      <Header title="仮免学科試験対策" isPreview={role === "preview"} />

      <main className="mx-auto max-w-md space-y-6 px-4 py-6">
        <section className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">全体正答率</p>
          <p className="mt-1 text-4xl font-extrabold text-blue-600">
            {overall.accuracy === null ? "―" : `${overall.accuracy}%`}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {overall.total === 0
              ? "まだ問題を解いていません"
              : `${overall.correct} / ${overall.total} 問正解`}
          </p>
        </section>

        <section className="grid grid-cols-1 gap-3">
          <Link
            href="/exam/mock"
            className="rounded-2xl bg-blue-600 p-4 text-center font-bold text-white shadow-sm active:scale-[0.98] transition"
          >
            模擬試験（ランダム50問・90点で合格）
          </Link>
          <Link
            href="/exam/review"
            className={`rounded-2xl p-4 text-center font-bold shadow-sm ring-1 transition active:scale-[0.98] ${
              wrongIds.length > 0
                ? "bg-amber-500 text-white ring-amber-500"
                : "bg-slate-100 text-slate-400 ring-slate-200 pointer-events-none"
            }`}
          >
            間違えた問題を復習する（{wrongIds.length}問）
          </Link>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-500">
            単元別演習（全14項目・各50問）
          </h2>
          <div className="space-y-3">
            {unitStats.map((stat) => (
              <UnitStatCard key={stat.unit.key} stat={stat} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
