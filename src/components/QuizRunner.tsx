"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Question } from "@/lib/data";
import { SignIcon, type SignKey } from "@/components/signs/SignIcon";

interface AnsweredEntry {
  question: Question;
  selected: boolean;
  isCorrect: boolean;
}

export function QuizRunner({
  questions,
  passThreshold,
}: {
  questions: Question[];
  passThreshold?: number;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState<AnsweredEntry[]>([]);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const current = questions[index];
  const total = questions.length;

  const correctCount = useMemo(
    () => answered.filter((a) => a.isCorrect).length,
    [answered],
  );

  if (total === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center text-slate-500">
        <p>出題できる問題がありません。</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 underline">
          ホームに戻る
        </Link>
      </div>
    );
  }

  async function handleSelect(choice: boolean) {
    if (selected !== null) return;
    setSelected(choice);
    const isCorrect = choice === current.correct_answer;
    const next = [...answered, { question: current, selected: choice, isCorrect }];
    setAnswered(next);

    if (next.length === total) {
      setSaving(true);
      try {
        const res = await fetch("/api/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: next.map((a) => ({
              question_id: a.question.id,
              is_correct: a.isCorrect,
            })),
          }),
        });
        if (!res.ok) setSaveError(true);
      } catch {
        setSaveError(true);
      } finally {
        setSaving(false);
        setFinished(true);
      }
    }
  }

  function handleNext() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  if (finished) {
    const score = correctCount;
    const passed = passThreshold ? score >= passThreshold : null;
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">結果</p>
          <p className="mt-2 text-5xl font-extrabold text-blue-600">
            {score}
            <span className="text-2xl text-slate-400"> / {total}</span>
          </p>
          {passThreshold !== undefined && (
            <p
              className={`mt-2 text-lg font-bold ${
                passed ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {passed ? "合格ライン突破！" : `不合格（合格ラインは${passThreshold}点）`}
            </p>
          )}
          {saveError && (
            <p className="mt-2 text-xs text-red-500">
              結果の保存に失敗しました。通信状況を確認してください。
            </p>
          )}
          {saving && <p className="mt-2 text-xs text-slate-400">保存中...</p>}
        </div>

        <div className="mt-6 space-y-3">
          {answered
            .filter((a) => !a.isCorrect)
            .map((a, i) => (
              <div
                key={i}
                className="rounded-xl bg-white p-4 text-sm shadow-sm ring-1 ring-red-100"
              >
                <p className="font-medium text-slate-900">
                  {a.question.question_text}
                </p>
                <p className="mt-1 text-red-600">
                  正解: {a.question.correct_answer ? "○" : "×"} / あなたの解答:{" "}
                  {a.selected ? "○" : "×"}
                </p>
                {a.question.explanation && (
                  <p className="mt-1 text-slate-500">{a.question.explanation}</p>
                )}
              </div>
            ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="flex-1 rounded-xl bg-slate-100 py-3 text-center font-semibold text-slate-700"
          >
            ホームに戻る
          </Link>
          <button
            onClick={() => router.refresh()}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-center font-semibold text-white"
          >
            もう一度挑戦
          </button>
        </div>
      </div>
    );
  }

  const isLast = index === total - 1;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>
          {index + 1} / {total} 問
        </span>
        <span>正解 {correctCount}</span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${((index + (selected !== null ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        {current.image_key && (
          <div className="mx-auto mb-4 h-32 w-32">
            <SignIcon signKey={current.image_key as SignKey} />
          </div>
        )}
        <p className="text-base leading-relaxed text-slate-900">
          {current.question_text}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSelect(true)}
          disabled={selected !== null}
          className={`rounded-2xl py-6 text-3xl font-extrabold transition active:scale-95 disabled:opacity-40 ${
            selected !== null && current.correct_answer
              ? "bg-emerald-500 text-white"
              : "bg-white text-blue-600 ring-2 ring-blue-200"
          }`}
        >
          ○
        </button>
        <button
          onClick={() => handleSelect(false)}
          disabled={selected !== null}
          className={`rounded-2xl py-6 text-3xl font-extrabold transition active:scale-95 disabled:opacity-40 ${
            selected !== null && !current.correct_answer
              ? "bg-emerald-500 text-white"
              : "bg-white text-red-600 ring-2 ring-red-200"
          }`}
        >
          ×
        </button>
      </div>

      {selected !== null && (
        <div className="mt-5 rounded-2xl bg-slate-100 p-4">
          <p
            className={`font-bold ${
              selected === current.correct_answer
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {selected === current.correct_answer ? "正解！" : "不正解"}
            （正解: {current.correct_answer ? "○" : "×"}）
          </p>
          {current.explanation && (
            <p className="mt-2 text-sm text-slate-600">{current.explanation}</p>
          )}
          {!isLast ? (
            <button
              onClick={handleNext}
              className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"
            >
              次の問題へ
            </button>
          ) : (
            <p className="mt-4 text-center text-sm text-slate-400">
              {saving ? "結果を保存しています..." : "結果を集計しています..."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
