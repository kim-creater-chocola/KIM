# 仮免許学科試験 対策問題データ 作成仕様

このディレクトリには、単元ごとの問題データを **JSONファイル** として置く。
ファイル名は単元キーそのまま。例: `kari-01.json`

## 出力形式（厳守）

各ファイルは、以下の型に沿った **要素数ちょうど50個** のJSON配列のみを出力する。
説明文やMarkdownのコードフェンスは付けず、ファイルの中身は生のJSON配列だけにすること。

```ts
interface QuestionSeed {
  question_text: string; // 問題文（1〜2文程度）
  correct_answer: boolean; // ○=true / ×=false
  explanation: string; // 1〜2文の簡潔な解説
  image_key: string | null; // 標識画像を使う場合のみキーを指定。使わない場合は null
}
```

- 有効なJSONのみ（コメント・末尾カンマ禁止）
- 50問すべて質問文が重複しないこと
- correct_answer は true / false をおおむね半々になるように分布させる（true/falseが連続しすぎたり、単元内で偏りすぎないこと）

## 内容・出典について（重要）

- 実在する教習所テキストや問題集サイトの文章を**そのままコピーしない**こと。
- 日本の道路交通法・運転免許制度に関する一般的な知識をもとに、**オリジナルの文章**として作成すること。
- 内容は事実として正確な一般知識（法定速度、徐行の意味、標識の意味、優先関係など）に基づくこと。架空のルールを作らない。

## 出題スタイル（本番の仮免学科試験に寄せる）

ネット上の仮免学科試験対策情報の調査結果に基づき、以下のスタイルに合わせること。

- 文体は「〜である。」「〜しなければならない。」「〜してもよい。」のような**断定調の一文**（本番の試験問題と同じ体裁）。です・ます調は使わない。
- 50問のうち、半分程度は素直な正誤判定問題、残り半分程度は**ひっかけ問題**にする。ひっかけの作り方の例:
  - 正しい内容に「必ず」「絶対に」「すべて」「どんな場合でも」など**例外を認めない極端な表現**を混ぜて誤りにする
  - 一部分だけ数値や条件を変えて誤りにする（例: 速度、距離、優先順位を入れ替える）
  - 正しい原則文に、こっそり例外条件を省略/追加して誤りにする
  - 逆に、一見厳しそうな記述だが実際には正しい規定（引っかかりそうで実は○）も混ぜる
- 1問1論点。複数の論点を1文に詰め込みすぎない。

## 標識画像問題について

`image_key` には、以下のレジストリに存在するキーのみを指定できる（存在しないキーは使用禁止）。

```
max-speed-30, max-speed-40, max-speed-50, max-speed-60, min-speed-30,
stop, slow, no-entry, no-passage, no-vehicles, no-parking,
no-stopping-or-parking, no-overtaking, no-center-line-crossing, no-u-turn,
one-way, pedestrian-only, priority-road, crosswalk, school-zone,
railway-crossing, traffic-light-ahead, slippery, animal-crossing,
t-junction, crossroads, merging-traffic, sound-horn, no-pedestrian-crossing,
no-cars-except-motorcycles, no-large-trucks, no-large-buses, no-motorcycles,
designated-direction-only, no-vehicle-crossing, weight-limit, height-limit,
max-width, vehicles-only, time-limited-parking, bicycles-side-by-side,
parking-allowed, stopping-allowed, stop-line, bicycle-crossing, safety-zone,
curve-right, lane-reduction, road-narrows, two-way-traffic, steep-grade,
road-work, crosswind, general-danger
```

画像問題の問題文は「この標識がある道路では、時速40キロを超えて運転してはならない。」のように、
**表示されている標識を見た前提で** 正誤を判断させる文にする（標識名をそのまま問題文に書かない）。

- `kari-03`（標識・標示などに従うこと）は、50問中 **35〜40問程度** を画像問題にする（レジストリのキーをバランス良く使い回してよい）。
- それ以外の単元は、文脈上自然な場合のみ数問（0〜5問程度）画像問題を混ぜてよい。無理に入れる必要はない。
- 同じ`image_key`を1ファイル内で複数回使い、数値や状況を変えて別の問題にするのは可（例: `max-speed-50`を使った問題を2問作るなど）。

## 単元名と範囲の目安

問題文はその単元のテーマに沿った内容にすること（単元名・範囲は `src/data/units.ts` を参照）。

## 追加ルール: 本番により近づけるためのリライト方針

既存の問題をより試験本番らしくするための改修時は、以下を意識してリライトすること（意味・単元テーマは変えない）。

- **できるだけ具体的な数値を入れる**: 速度（km/h）、距離（m）、車間・側方間隔、時間（秒）、点数、日数、年齢、金額など。数値が入れられるのに抽象的な書き方のままの問題は、具体的な数値を使った書き方に直す。
- **数値を使ったひっかけを増やす**: 正しい基準値から少しだけずらす（例: 実際は50km/hなのに問題文は60km/hにして誤りにする）、単位を変える、複数の数値条件を組み合わせて一部だけ間違える、など。
- **紛らわしい表現を増やす**: 一見正しそうだが例外条件が抜けている／逆に例外まで正しく含んでいて実は正しい、といった作り。「必ず」「絶対に」「すべて」などの極端表現の使用も引き続き活用する。
- **1問1論点は維持**: 数値を盛り込んでも、論点を複数詰め込みすぎない。
- リライトの際も、50問ちょうど・重複なし・image_keyはレジストリのキーのみ・correct_answerのtrue/false比率が単元内で偏りすぎない、という既存ルールはすべて維持すること。
