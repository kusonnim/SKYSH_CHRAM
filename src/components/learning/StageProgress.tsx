type StageProgressProps = {
  current: number;
  total: number;
};

export function StageProgress({ current, total }: StageProgressProps) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const percentage = (safeCurrent / safeTotal) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Progress</span>
        <span>
          {safeCurrent} / {safeTotal}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-slate-200">
        <div
          className="h-full rounded bg-slate-950"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

