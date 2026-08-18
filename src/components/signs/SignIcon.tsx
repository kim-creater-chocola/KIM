import type { SVGProps } from "react";

/**
 * オリジナル再現の道路標識アイコン集。
 * 道路標識のデザイン（形状・色）は「道路標識、区画線及び道路標示に関する命令」で
 * 規定された公式仕様であり、著作物ではないため、独自SVGとして再現している。
 * 実物写真の複製ではなく、簡略化したオリジナルの図案。
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = 100;

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${base} ${base}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

/** 規制標識: 最高速度 */
export function SignMaxSpeed({ value = 50, ...p }: IconProps & { value?: number }) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#e10000" strokeWidth="8" />
      <text x="50" y="60" textAnchor="middle" fontSize="30" fontWeight="700" fill="#111">
        {value}
      </text>
    </Svg>
  );
}

/** 規制標識: 最低速度 */
export function SignMinSpeed({ value = 30, ...p }: IconProps & { value?: number }) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#0f6ab4" stroke="#fff" strokeWidth="4" />
      <text x="50" y="55" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff">
        {value}
      </text>
      <rect x="28" y="68" width="44" height="6" fill="#fff" />
    </Svg>
  );
}

/** 規制標識: 一時停止（止まれ） */
export function SignStop(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,90 6,90" fill="#fff" stroke="#e10000" strokeWidth="8" />
      <text x="50" y="72" textAnchor="middle" fontSize="26" fontWeight="700" fill="#0f6ab4">
        止まれ
      </text>
    </Svg>
  );
}

/** 規制標識: 徐行 */
export function SignSlow(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,10 92,88 8,88" fill="#fff" stroke="#e10000" strokeWidth="7" />
      <text x="50" y="70" textAnchor="middle" fontSize="24" fontWeight="700" fill="#0f6ab4">
        徐行
      </text>
    </Svg>
  );
}

/** 規制標識: 車両進入禁止 */
export function SignNoEntry(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#e10000" stroke="#fff" strokeWidth="4" />
      <rect x="20" y="42" width="60" height="16" fill="#fff" />
    </Svg>
  );
}

/** 規制標識: 通行止め */
export function SignNoPassage(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#e10000" strokeWidth="8" />
      <line x1="20" y1="20" x2="80" y2="80" stroke="#e10000" strokeWidth="8" />
      <line x1="80" y1="20" x2="20" y2="80" stroke="#e10000" strokeWidth="8" />
    </Svg>
  );
}

/** 規制標識: 駐車禁止 */
export function SignNoParking(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#0f6ab4" stroke="#e10000" strokeWidth="8" />
      <text x="50" y="60" textAnchor="middle" fontSize="34" fontWeight="700" fill="#fff">
        P
      </text>
      <line x1="15" y1="85" x2="85" y2="15" stroke="#e10000" strokeWidth="7" />
    </Svg>
  );
}

/** 規制標識: 駐停車禁止 */
export function SignNoStoppingOrParking(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#0f6ab4" stroke="#e10000" strokeWidth="8" />
      <line x1="12" y1="70" x2="88" y2="30" stroke="#e10000" strokeWidth="6" />
      <line x1="12" y1="30" x2="88" y2="70" stroke="#e10000" strokeWidth="6" />
    </Svg>
  );
}

/** 規制標識: 追越し禁止 */
export function SignNoOvertaking(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#e10000" strokeWidth="8" />
      <ellipse cx="38" cy="58" rx="16" ry="10" fill="#111" />
      <ellipse cx="62" cy="42" rx="16" ry="10" fill="#e10000" />
    </Svg>
  );
}

/** 規制標識: 追越しのための右側部分はみ出し通行禁止 */
export function SignNoCenterLineCrossing(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#e10000" strokeWidth="8" />
      <ellipse cx="38" cy="58" rx="16" ry="10" fill="#111" />
      <ellipse cx="62" cy="42" rx="16" ry="10" fill="#e10000" />
      <line x1="50" y1="20" x2="50" y2="80" stroke="#e10000" strokeWidth="4" strokeDasharray="6 5" />
    </Svg>
  );
}

/** 規制標識: Uターン禁止 */
export function SignNoUTurn(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#0f6ab4" stroke="#e10000" strokeWidth="8" />
      <path
        d="M35 65 V45 a15 15 0 0 1 30 0 v10"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
      />
      <polygon points="55,45 70,45 62,58" fill="#fff" />
      <line x1="15" y1="80" x2="85" y2="20" stroke="#e10000" strokeWidth="7" />
    </Svg>
  );
}

/** 規制標識: 一方通行 */
export function SignOneWay(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="6" y="6" width="88" height="88" fill="#0f6ab4" />
      <polygon points="20,50 55,30 55,42 80,42 80,58 55,58 55,70" fill="#fff" />
    </Svg>
  );
}

/** 規制標識: 步行者専用 */
export function SignPedestrianOnly(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="6" y="6" width="88" height="88" fill="#0f6ab4" />
      <circle cx="50" cy="32" r="8" fill="#fff" />
      <path
        d="M50 42 v22 M40 52 h20 M50 64 l-10 16 M50 64 l10 16"
        stroke="#fff"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** 指示標識: 優先道路 */
export function SignPriorityRoad(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="6" y="6" width="88" height="88" fill="#fff" />
      <polygon points="50,15 85,50 50,85 15,50" fill="#fce300" stroke="#111" strokeWidth="3" />
    </Svg>
  );
}

/** 指示標識: 横断歩道 */
export function SignCrosswalk(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,38 78,94 22,94 6,38" fill="#0f6ab4" />
      <circle cx="50" cy="34" r="7" fill="#fff" />
      <path d="M50 43 v16 M42 52 h16 M50 59 l-8 14 M50 59 l8 14" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="30" y="80" width="6" height="10" fill="#fff" />
      <rect x="42" y="80" width="6" height="10" fill="#fff" />
      <rect x="54" y="80" width="6" height="10" fill="#fff" />
      <rect x="66" y="80" width="6" height="10" fill="#fff" />
    </Svg>
  );
}

/** 警戒標識: 学校・幼稚園・保育所などあり */
export function SignSchoolZone(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,50 50,94 6,50" fill="#fce300" stroke="#111" strokeWidth="3" />
      <circle cx="40" cy="40" r="6" fill="#111" />
      <path d="M40 47 v14 M34 55 h12 M40 61 l-6 10 M40 61 l6 10" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="62" cy="46" r="5" fill="#111" />
      <path d="M62 52 v10 M57 58 h10 M62 62 l-5 8 M62 62 l5 8" stroke="#111" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/** 警戒標識: 踏切あり */
export function SignRailwayCrossing(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,50 50,94 6,50" fill="#fce300" stroke="#111" strokeWidth="3" />
      <line x1="20" y1="70" x2="80" y2="30" stroke="#111" strokeWidth="6" />
      <line x1="20" y1="30" x2="80" y2="70" stroke="#111" strokeWidth="6" />
    </Svg>
  );
}

/** 警戒標識: 信号機あり */
export function SignTrafficLightAhead(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,50 50,94 6,50" fill="#fce300" stroke="#111" strokeWidth="3" />
      <rect x="40" y="28" width="20" height="44" rx="4" fill="#111" />
      <circle cx="50" cy="38" r="5" fill="#e10000" />
      <circle cx="50" cy="50" r="5" fill="#fce300" />
      <circle cx="50" cy="62" r="5" fill="#2e9e3f" />
    </Svg>
  );
}

/** 警戒標識: すべりやすい */
export function SignSlippery(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,50 50,94 6,50" fill="#fce300" stroke="#111" strokeWidth="3" />
      <path
        d="M25 60 C40 40, 60 40, 75 60"
        stroke="#111"
        strokeWidth="5"
        fill="none"
      />
      <polygon points="75,60 65,58 71,50" fill="#111" />
    </Svg>
  );
}

/** 警戒標識: 動物が飛び出すおそれあり */
export function SignAnimalCrossing(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,50 50,94 6,50" fill="#fce300" stroke="#111" strokeWidth="3" />
      <path
        d="M30 65 q5 -25 20 -25 q15 0 20 25 q-10 5 -20 5 q-10 0 -20 -5 Z"
        fill="#111"
      />
      <circle cx="35" cy="35" r="5" fill="#111" />
      <circle cx="65" cy="35" r="5" fill="#111" />
    </Svg>
  );
}

/** 警戒標識: T字路 */
export function SignTJunction(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,50 50,94 6,50" fill="#fce300" stroke="#111" strokeWidth="3" />
      <line x1="50" y1="25" x2="50" y2="55" stroke="#111" strokeWidth="6" />
      <line x1="25" y1="55" x2="75" y2="55" stroke="#111" strokeWidth="6" />
    </Svg>
  );
}

/** 警戒標識: 十字路 */
export function SignCrossroads(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,50 50,94 6,50" fill="#fce300" stroke="#111" strokeWidth="3" />
      <line x1="50" y1="25" x2="50" y2="75" stroke="#111" strokeWidth="6" />
      <line x1="25" y1="50" x2="75" y2="50" stroke="#111" strokeWidth="6" />
    </Svg>
  );
}

/** 警戒標識: 合流交通あり */
export function SignMergingTraffic(p: IconProps) {
  return (
    <Svg {...p}>
      <polygon points="50,6 94,50 50,94 6,50" fill="#fce300" stroke="#111" strokeWidth="3" />
      <path d="M30 75 Q30 45 55 40" stroke="#111" strokeWidth="6" fill="none" />
      <path d="M70 25 L55 40 L55 25" fill="#111" />
      <line x1="55" y1="40" x2="55" y2="75" stroke="#111" strokeWidth="6" />
    </Svg>
  );
}

/** 規制標識: 警笛鳴らせ */
export function SignSoundHorn(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#0f6ab4" stroke="#fff" strokeWidth="4" />
      <path
        d="M32 42 h14 l18 -14 v44 l-18 -14 h-14 Z"
        fill="#fff"
      />
      <path d="M68 38 q8 12 0 24" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/** 規制標識: 步行者横断禁止 */
export function SignNoPedestrianCrossing(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#e10000" strokeWidth="8" />
      <circle cx="50" cy="34" r="7" fill="#111" />
      <path d="M50 43 v16 M42 52 h16 M50 59 l-8 14 M50 59 l8 14" stroke="#111" strokeWidth="5" fill="none" strokeLinecap="round" />
      <line x1="15" y1="80" x2="85" y2="20" stroke="#e10000" strokeWidth="7" />
    </Svg>
  );
}

/** 規制標識: 車両通行止め */
export function SignNoVehicles(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#e10000" strokeWidth="8" />
      <rect x="18" y="44" width="64" height="12" fill="#e10000" />
    </Svg>
  );
}

export const SIGN_REGISTRY = {
  "max-speed-30": (p: IconProps) => <SignMaxSpeed value={30} {...p} />,
  "max-speed-40": (p: IconProps) => <SignMaxSpeed value={40} {...p} />,
  "max-speed-50": (p: IconProps) => <SignMaxSpeed value={50} {...p} />,
  "max-speed-60": (p: IconProps) => <SignMaxSpeed value={60} {...p} />,
  "min-speed-30": (p: IconProps) => <SignMinSpeed value={30} {...p} />,
  stop: SignStop,
  slow: SignSlow,
  "no-entry": SignNoEntry,
  "no-passage": SignNoPassage,
  "no-vehicles": SignNoVehicles,
  "no-parking": SignNoParking,
  "no-stopping-or-parking": SignNoStoppingOrParking,
  "no-overtaking": SignNoOvertaking,
  "no-center-line-crossing": SignNoCenterLineCrossing,
  "no-u-turn": SignNoUTurn,
  "one-way": SignOneWay,
  "pedestrian-only": SignPedestrianOnly,
  "priority-road": SignPriorityRoad,
  crosswalk: SignCrosswalk,
  "school-zone": SignSchoolZone,
  "railway-crossing": SignRailwayCrossing,
  "traffic-light-ahead": SignTrafficLightAhead,
  slippery: SignSlippery,
  "animal-crossing": SignAnimalCrossing,
  "t-junction": SignTJunction,
  crossroads: SignCrossroads,
  "merging-traffic": SignMergingTraffic,
  "sound-horn": SignSoundHorn,
  "no-pedestrian-crossing": SignNoPedestrianCrossing,
} satisfies Record<string, (p: IconProps) => React.ReactElement>;

export type SignKey = keyof typeof SIGN_REGISTRY;

export function SignIcon({
  signKey,
  ...props
}: IconProps & { signKey: SignKey }) {
  const Comp = SIGN_REGISTRY[signKey];
  if (!Comp) return null;
  return <Comp {...props} />;
}
