"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Question } from "@/lib/data";
import { SignIcon, type SignKey } from "@/components/signs/SignIcon";

type FeedbackMode = "immediate" | "batch";
type Phase = "setup" | "running" | "result";

export function QuizRunner({
  questions,
  passThreshold,
  isPreview,
}: {
  questions: Question[];
  passThreshold?: number;
  isPreview?: boolean;
}) {
  const router = useRouter();
  const total = questions.length;

  const [phase, setPhase] = useState<Phase>("setup");
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("immediate");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    () => Array(total).fill(null),
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const current = questions[index];

  const answeredCount = useMemo(
    () => answers.filter((a) => a !== null).length,
    [answers],
  );
  const correctCount = useMemo(
    () =>
      answers.reduce<number>(
        (acc, a, i) => acc + (a !== null && a === questions[i].correct_answer ? 1 : 0),
        0,
      ),
    [answers, questions],
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

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(total - 1, i)));
  }

  function handleSelect(choice: boolean) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choice;
      return next;
    });
    if (feedbackMode === "batch" && index < total - 1) {
      window.setTimeout(() => goTo(index + 1), 150);
    }
  }

  async function handleFinish() {
    setSaving(true);
    setSaveError(false);
    const payload = questions
      .map((q, i) => ({ q, a: answers[i] }))
      .filter((x): x is { q: Question; a: boolean } => x.a !== null)
      .map(({ q, a }) => ({ question_id: q.id, is_correct: a === q.correct_answer }));

    if (!isPreview && payload.length > 0) {
      try {
        const res = await fetch("/api/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: payload }),
        });
        if (!res.ok) setSaveError(true);
      } catch {
        setSaveError(true);
      }
    }
    setSaving(false);
    setPhase("result");
  }

  // ===== セットアップ画面 =====
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="mb-1 text-sm font-semibold text-slate-700">
            出題形式を選んでください（全{total}問）
          </p>
          <p className="mb-4 text-xs text-slate-400">
            あとから変更はできません。開始後は問題番号をタップして自由に行き来できます。
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setFeedbackMode("immediate")}
              className={`w-full rounded-xl border-2 p-3 text-left transition ${
                feedbackMode === "immediate"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="font-bold text-slate-900">即時採点</p>
              <p className="text-xs text-slate-500">
                1問答えるごとに正解と解説を表示します
              </p>
            </button>
            <button
              onClick={() => setFeedbackMode("batch")}
              className={`w-full rounded-xl border-2 p-3 text-left transition ${
                feedbackMode === "batch"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="font-bold text-slate-900">まとめて採点</p>
              <p className="text-xs text-slate-500">
                全問（または終了した時点まで）解いたあとに結果をまとめて表示します
              </p>
            </button>
          </div>
          <button
            onClick={() => setPhase("running")}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white active:scale-[0.98]"
          >
            開始する
          </button>
        </div>
      </div>
    );
  }

  // ===== 結果画面 =====
  if (phase === "result") {
    const allAnswered = answeredCount === total;
    const passed =
      passThreshold !== undefined && allAnswered ? correctCount >= passThreshold : null;

    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">結果</p>
          <p className="mt-2 text-5xl font-extrabold text-blue-600">
            {correctCount}
            <span className="text-2xl text-slate-400"> / {answeredCount}問回答</span>
          </p>
          {answeredCount < total && (
            <p className="mt-1 text-xs text-slate-400">
              （全{total}問中{total - answeredCount}問は未回答です）
            </p>
          )}
          {passThreshold !== undefined && (
            <p
              className={`mt-2 text-lg font-bold ${
                !allAnswered
                  ? "text-slate-400"
                  : passed
                    ? "text-emerald-600"
                    : "text-red-600"
              }`}
            >
              {!allAnswered
                ? `全問回答すると合否判定されます（合格ライン ${passThreshold}問正解）`
                : passed
                  ? "合格ライン突破！"
                  : `不合格（合格ラインは${passThreshold}問正解）`}
            </p>
          )}
          {isPreview ? (
            <p className="mt-2 text-xs text-amber-600">
              プレビューモードのため、この結果は保存されていません。
            </p>
          ) : (
            <>
              {saveError && (
                <p className="mt-2 text-xs text-red-500">
                  結果の保存に失敗しました。通信状況を確認してください。
                </p>
              )}
              {saving && <p className="mt-2 text-xs text-slate-400">保存中...</p>}
            </>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {questions
            .map((q, i) => ({ q, a: answers[i] }))
            .filter((x) => x.a !== null && x.a !== x.q.correct_answer)
            .map(({ q, a }, i) => (
              <div
                key={i}
                className="rounded-xl bg-white p-4 text-sm shadow-sm ring-1 ring-red-100"
              >
                {q.image_key && (
                  <div className="mx-auto mb-3 h-24 w-24">
                    <SignIcon signKey={q.image_key as SignKey} />
                  </div>
                )}
                <p className="font-medium text-slate-900">{q.question_text}</p>
                <p className="mt-1 text-red-600">
                  正解: {q.correct_answer ? "○" : "×"} / あなたの解答: {a ? "○" : "×"}
                </p>
                {q.explanation && (
                  <p className="mt-1 text-slate-500">{q.explanation}</p>
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

  // ===== 出題画面 =====
  const currentAnswer = answers[index];
  const showFeedback = feedbackMode === "immediate" && currentAnswer !== null;

  function numberButtonClass(i: number): string {
    const isCurrent = i === index;
    const a = answers[i];
    let base = "bg-slate-100 text-slate-500";
    if (a !== null) {
      if (feedbackMode === "immediate") {
        base =
          a === questions[i].correct_answer
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700";
      } else {
        base = "bg-blue-100 text-blue-700";
      }
    }
    return `${base} ${isCurrent ? "ring-2 ring-blue-500" : ""}`;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>
          回答済み {answeredCount} / {total} 問
        </span>
        <button
          onClick={handleFinish}
          disabled={saving}
          className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving ? "採点中..." : "終了して採点する"}
        </button>
      </div>

      <div className="mb-4 grid grid-cols-10 gap-1.5">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`aspect-square rounded-md text-[11px] font-bold transition ${numberButtonClass(i)}`}
          >
            {i + 1}
          </button>
        ))}
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
          className={`rounded-2xl py-6 text-3xl font-extrabold transition active:scale-95 ${
            currentAnswer === true
              ? showFeedback
                ? current.correct_answer
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-blue-500 text-white"
              : "bg-white text-blue-600 ring-2 ring-blue-200"
          }`}
        >
          ○
        </button>
        <button
          onClick={() => handleSelect(false)}
          className={`rounded-2xl py-6 text-3xl font-extrabold transition active:scale-95 ${
            currentAnswer === false
              ? showFeedback
                ? !current.correct_answer
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-blue-500 text-white"
              : "bg-white text-red-600 ring-2 ring-red-200"
          }`}
        >
          ×
        </button>
      </div>

      {showFeedback && (
        <div className="mt-5 rounded-2xl bg-slate-100 p-4">
          <p
            className={`font-bold ${
              currentAnswer === current.correct_answer
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {currentAnswer === current.correct_answer ? "正解！" : "不正解"}
            （正解: {current.correct_answer ? "○" : "×"}）
          </p>
          {current.explanation && (
            <p className="mt-2 text-sm text-slate-600">{current.explanation}</p>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="flex-1 rounded-xl bg-slate-100 py-3 font-semibold text-slate-700 disabled:opacity-40"
        >
          前へ
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white disabled:opacity-40"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
