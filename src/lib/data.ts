import { getSupabaseAdmin } from "./supabase";
import { KARI_UNITS, type Unit } from "@/data/units";

export interface Question {
  id: string;
  unit_key: string;
  exam_type: string;
  question_text: string;
  correct_answer: boolean;
  explanation: string | null;
  image_key: string | null;
}

export interface UnitStat {
  unit: Unit;
  total: number;
  correct: number;
  accuracy: number | null; // null = 未挑戦
}

interface AnswerLogRow {
  id: number;
  question_id: string;
  is_correct: boolean;
  answered_at: string;
  questions: { unit_key: string; exam_type: string } | null;
}

const QUESTION_COLUMNS =
  "id, unit_key, exam_type, question_text, correct_answer, explanation, image_key";

async function fetchAnswerLogs(): Promise<AnswerLogRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("answer_logs")
    .select("id, question_id, is_correct, answered_at, questions(unit_key, exam_type)")
    .order("answered_at", { ascending: false })
    // Supabase/PostgREST はデフォルトで1000件までしか返さないため、
    // 明示的に大きめのlimitを指定して取りこぼしを防ぐ。
    .limit(20000);
  if (error) throw error;
  return (data ?? []) as unknown as AnswerLogRow[];
}

export async function getUnitStats(): Promise<UnitStat[]> {
  const logs = await fetchAnswerLogs();
  const totals = new Map<string, { total: number; correct: number }>();
  for (const log of logs) {
    const unitKey = log.questions?.unit_key;
    if (!unitKey) continue;
    const entry = totals.get(unitKey) ?? { total: 0, correct: 0 };
    entry.total += 1;
    if (log.is_correct) entry.correct += 1;
    totals.set(unitKey, entry);
  }
  return KARI_UNITS.map((unit) => {
    const entry = totals.get(unit.key);
    return {
      unit,
      total: entry?.total ?? 0,
      correct: entry?.correct ?? 0,
      accuracy:
        entry && entry.total > 0
          ? Math.round((entry.correct / entry.total) * 100)
          : null,
    };
  });
}

export async function getOverallStat(): Promise<{
  total: number;
  correct: number;
  accuracy: number | null;
}> {
  const logs = await fetchAnswerLogs();
  const total = logs.length;
  const correct = logs.filter((l) => l.is_correct).length;
  return {
    total,
    correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : null,
  };
}

/** 各問題の最新の解答が不正解だったものの question_id 一覧 */
export async function getWrongQuestionIds(): Promise<string[]> {
  const logs = await fetchAnswerLogs(); // answered_at 降順
  const seen = new Set<string>();
  const wrong: string[] = [];
  for (const log of logs) {
    if (seen.has(log.question_id)) continue;
    seen.add(log.question_id);
    if (!log.is_correct) wrong.push(log.question_id);
  }
  return wrong;
}

export async function getUnitQuestions(unitKey: string): Promise<Question[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("questions")
    .select(QUESTION_COLUMNS)
    .eq("unit_key", unitKey);
  if (error) throw error;
  return shuffle((data ?? []) as unknown as Question[]);
}

/**
 * 模擬試験用の出題。特定の単元に偏らないよう、単元ごとに
 * ほぼ均等（50問÷14単元 ≒ 1単元3〜4問）に振り分けてから抽出する。
 * どの単元が4問になるかは毎回ランダムに変わる。
 */
export async function getMockQuestions(
  examType: string,
  count = 50,
): Promise<Question[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("questions")
    .select(QUESTION_COLUMNS)
    .eq("exam_type", examType)
    // Supabase/PostgREST はデフォルトで1000件までしか返さないため、
    // 明示的に大きめのlimitを指定して取りこぼしを防ぐ（以前この上限に
    // 引っかかり、後半の単元が丸ごと欠落して指定数に満たない不具合があった）。
    .limit(20000);
  if (error) throw error;
  const all = (data ?? []) as unknown as Question[];

  const byUnit = new Map<string, Question[]>();
  for (const q of all) {
    const list = byUnit.get(q.unit_key) ?? [];
    list.push(q);
    byUnit.set(q.unit_key, list);
  }

  const unitKeys = shuffle([...byUnit.keys()]);
  const target = Math.min(count, all.length);
  if (unitKeys.length === 0 || target === 0) return [];

  const base = Math.floor(target / unitKeys.length);
  const remainder = target % unitKeys.length;

  const picked: Question[] = [];
  const leftoverPools: Question[][] = [];
  unitKeys.forEach((key, i) => {
    const quota = base + (i < remainder ? 1 : 0);
    const pool = shuffle(byUnit.get(key) ?? []);
    picked.push(...pool.slice(0, quota));
    if (pool.length > quota) leftoverPools.push(pool.slice(quota));
  });

  // 単元によって在庫が偏っていて割り当て数に届かなかった場合、
  // 他の単元の余りから補充して指定数ちょうどになるようにする。
  if (picked.length < target) {
    const leftover = shuffle(leftoverPools.flat());
    picked.push(...leftover.slice(0, target - picked.length));
  }

  return shuffle(picked);
}

export async function getReviewQuestions(): Promise<Question[]> {
  const ids = await getWrongQuestionIds();
  if (ids.length === 0) return [];
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("questions")
    .select(QUESTION_COLUMNS)
    .in("id", ids);
  if (error) throw error;
  return shuffle((data ?? []) as unknown as Question[]);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
