import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCurrentRole } from "@/lib/session";

interface AnswerPayload {
  question_id: string;
  is_correct: boolean;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const answers: unknown = body?.answers;

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const rows: AnswerPayload[] = [];
  for (const a of answers) {
    if (
      a &&
      typeof a === "object" &&
      typeof (a as AnswerPayload).question_id === "string" &&
      typeof (a as AnswerPayload).is_correct === "boolean"
    ) {
      rows.push({
        question_id: (a as AnswerPayload).question_id,
        is_correct: (a as AnswerPayload).is_correct,
      });
    }
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const role = await getCurrentRole();
  if (role === "preview") {
    // プレビューモード（確認用ログイン）では結果を保存しない
    return NextResponse.json({ ok: true, saved: 0, preview: true });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("answer_logs").insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, saved: rows.length });
}
