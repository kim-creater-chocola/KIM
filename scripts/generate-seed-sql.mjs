import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const questionsDir = join(projectRoot, "src", "data", "questions");
const outFile = join(projectRoot, "supabase", "seed_questions.sql");

const SIGN_KEYS = new Set([
  "max-speed-30", "max-speed-40", "max-speed-50", "max-speed-60", "min-speed-30",
  "stop", "slow", "no-entry", "no-passage", "no-vehicles", "no-parking",
  "no-stopping-or-parking", "no-overtaking", "no-center-line-crossing", "no-u-turn",
  "one-way", "pedestrian-only", "priority-road", "crosswalk", "school-zone",
  "railway-crossing", "traffic-light-ahead", "slippery", "animal-crossing",
  "t-junction", "crossroads", "merging-traffic", "sound-horn", "no-pedestrian-crossing",
]);

function sqlEscape(str) {
  return str.replace(/'/g, "''");
}

function sqlString(value) {
  return value === null || value === undefined ? "NULL" : `'${sqlEscape(String(value))}'`;
}

const files = readdirSync(questionsDir).filter(
  (f) => f.startsWith("kari-") && f.endsWith(".json"),
);
files.sort();

let totalQuestions = 0;
let totalImageQuestions = 0;
const errors = [];
const rowsSql = [];

for (const file of files) {
  const unitKey = file.replace(/\.json$/, "");
  const raw = readFileSync(join(questionsDir, file), "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    errors.push(`${file}: JSON parse error - ${e.message}`);
    continue;
  }

  if (!Array.isArray(data)) {
    errors.push(`${file}: 配列ではありません`);
    continue;
  }
  if (data.length !== 50) {
    errors.push(`${file}: 要素数が50ではありません (${data.length}件)`);
  }

  const seenText = new Set();
  data.forEach((q, i) => {
    const where = `${file}[${i}]`;
    if (typeof q.question_text !== "string" || q.question_text.trim() === "") {
      errors.push(`${where}: question_text が不正`);
      return;
    }
    if (typeof q.correct_answer !== "boolean") {
      errors.push(`${where}: correct_answer が真偽値ではありません`);
      return;
    }
    if (q.explanation !== null && typeof q.explanation !== "string") {
      errors.push(`${where}: explanation が不正`);
      return;
    }
    if (q.image_key !== null && q.image_key !== undefined && !SIGN_KEYS.has(q.image_key)) {
      errors.push(`${where}: image_key "${q.image_key}" はレジストリに存在しません`);
      return;
    }
    if (seenText.has(q.question_text)) {
      errors.push(`${where}: 質問文が単元内で重複しています`);
    }
    seenText.add(q.question_text);

    totalQuestions += 1;
    if (q.image_key) totalImageQuestions += 1;

    rowsSql.push(
      `  (${sqlString(unitKey)}, 'kari', ${sqlString(q.question_text)}, ${q.correct_answer}, ${sqlString(
        q.explanation ?? null,
      )}, ${sqlString(q.image_key ?? null)})`,
    );
  });
}

if (errors.length > 0) {
  console.error("検証エラーが見つかりました:\n" + errors.join("\n"));
  process.exit(1);
}

const sql = `-- 仮免問題データ 一括投入用シード（自動生成: scripts/generate-seed-sql.mjs）
-- schema.sql / seed_units.sql 実行後に、SQL Editor で実行してください。
-- 既存の同一単元の問題データを一度削除してから再投入します。

delete from questions where exam_type = 'kari';

insert into questions (unit_key, exam_type, question_text, correct_answer, explanation, image_key)
values
${rowsSql.join(",\n")};
`;

writeFileSync(outFile, sql, "utf8");
console.log(`生成完了: ${outFile}`);
console.log(`合計問題数: ${totalQuestions} / 画像問題数: ${totalImageQuestions} (${files.length}ファイル)`);
