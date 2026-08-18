import Link from "next/link";
import type { UnitStat } from "@/lib/data";
import { AccuracyBar } from "./AccuracyBar";

export function UnitStatCard({ stat }: { stat: UnitStat }) {
  const { unit, total, correct, accuracy } = stat;
  return (
    <Link
      href={`/exam/${unit.key}`}
      className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 active:scale-[0.99] transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-400">項目{unit.order}</p>
          <p className="truncate font-medium text-slate-900">{unit.name}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-slate-900">
            {accuracy === null ? "―" : `${accuracy}%`}
          </p>
          <p className="text-xs text-slate-400">
            {total === 0 ? "未挑戦" : `${correct}/${total}問`}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <AccuracyBar accuracy={accuracy} />
      </div>
    </Link>
  );
}
