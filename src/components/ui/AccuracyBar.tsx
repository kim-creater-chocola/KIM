function colorFor(accuracy: number | null): string {
  if (accuracy === null) return "bg-slate-200";
  if (accuracy >= 80) return "bg-emerald-500";
  if (accuracy >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function AccuracyBar({ accuracy }: { accuracy: number | null }) {
  const pct = accuracy ?? 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all ${colorFor(accuracy)}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
