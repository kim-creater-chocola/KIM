"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [10, 20, 30, 40, 50];

export function MockExamCountPicker() {
  const router = useRouter();
  const [selected, setSelected] = useState(50);

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="mb-1 text-sm font-semibold text-slate-700">
          模擬試験の出題数を選んでください
        </p>
        <p className="mb-4 text-xs text-slate-400">
          14項目からできるだけ均等に出題されます（本番と同じ50問がおすすめです）
        </p>
        <div className="grid grid-cols-3 gap-3">
          {OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setSelected(n)}
              className={`rounded-xl py-3 font-bold transition ${
                selected === n
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {n}問
            </button>
          ))}
        </div>
        <button
          onClick={() => router.push(`/exam/mock?count=${selected}`)}
          className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white active:scale-[0.98]"
        >
          この問題数で始める
        </button>
      </div>
    </div>
  );
}
