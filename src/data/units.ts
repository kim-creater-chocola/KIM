export type ExamType = "kari" | "hon";

export interface Unit {
  key: string;
  examType: ExamType;
  order: number;
  name: string;
}

// 仮免 = 教習所テキスト第1段階 項目1〜14
export const KARI_UNITS: Unit[] = [
  { key: "kari-01", examType: "kari", order: 1, name: "運転者の心得" },
  { key: "kari-02", examType: "kari", order: 2, name: "信号に従うこと" },
  { key: "kari-03", examType: "kari", order: 3, name: "標識・標示などに従うこと" },
  {
    key: "kari-04",
    examType: "kari",
    order: 4,
    name: "車が通行するところ・車が通行してはいけないところ",
  },
  { key: "kari-05", examType: "kari", order: 5, name: "緊急自動車などの優先" },
  { key: "kari-06", examType: "kari", order: 6, name: "交差点などの通行・踏切" },
  { key: "kari-07", examType: "kari", order: 7, name: "安全な速度と車間距離" },
  { key: "kari-08", examType: "kari", order: 8, name: "歩行者の保護など" },
  {
    key: "kari-09",
    examType: "kari",
    order: 9,
    name: "安全の確認と合図・警音器の使用",
  },
  { key: "kari-10", examType: "kari", order: 10, name: "進路変更など" },
  { key: "kari-11", examType: "kari", order: 11, name: "追い越し" },
  { key: "kari-12", examType: "kari", order: 12, name: "行き違い" },
  {
    key: "kari-13",
    examType: "kari",
    order: 13,
    name: "運転免許制度・交通反則通告制度",
  },
  { key: "kari-14", examType: "kari", order: 14, name: "オートマチック車などの運転" },
];

export const ALL_UNITS: Unit[] = [...KARI_UNITS];

export function getUnitByKey(key: string): Unit | undefined {
  return ALL_UNITS.find((u) => u.key === key);
}

export function getUnitsByExamType(examType: ExamType): Unit[] {
  return ALL_UNITS.filter((u) => u.examType === examType).sort(
    (a, b) => a.order - b.order,
  );
}
