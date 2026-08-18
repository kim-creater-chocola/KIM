-- 運転免許学科試験対策アプリ DBスキーマ
-- Supabase の SQL Editor でそのまま実行してください。

create extension if not exists "pgcrypto";

-- 単元マスタ
create table if not exists units (
  key text primary key,
  exam_type text not null check (exam_type in ('kari', 'hon')),
  order_no integer not null,
  name text not null
);

-- 問題マスタ
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  unit_key text not null references units(key) on delete cascade,
  exam_type text not null check (exam_type in ('kari', 'hon')),
  question_text text not null,
  correct_answer boolean not null,
  explanation text,
  image_key text,
  created_at timestamptz not null default now()
);

create index if not exists questions_unit_key_idx on questions(unit_key);
create index if not exists questions_exam_type_idx on questions(exam_type);

-- 解答履歴（友人1人専用のため user_id は持たない）
create table if not exists answer_logs (
  id bigserial primary key,
  question_id uuid not null references questions(id) on delete cascade,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists answer_logs_question_id_idx on answer_logs(question_id);
create index if not exists answer_logs_answered_at_idx on answer_logs(answered_at);

-- アプリ設定（簡易ログインのパスワードハッシュを保持）
create table if not exists app_config (
  key text primary key,
  value text not null
);

-- RLS: サーバー(service role)からのみアクセスするため、
-- クライアント直アクセスは想定していない。念のため全テーブルでRLSを有効化し、
-- ポリシーを一切定義しない（=service role以外はデフォルト拒否）。
alter table units enable row level security;
alter table questions enable row level security;
alter table answer_logs enable row level security;
alter table app_config enable row level security;
