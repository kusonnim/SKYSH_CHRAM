import type { StageStatus } from "@/types";

type StageStatusBadgeProps = {
  status: StageStatus;
};

const statusClassName: Record<StageStatus, string> = {
  locked: "border-slate-200 bg-slate-100 text-slate-500",
  available: "border-sky-200 bg-sky-50 text-sky-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function StageStatusBadge({ status }: StageStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded border px-2 py-1 text-xs font-semibold uppercase ${statusClassName[status]}`}
    >
      {status}
    </span>
  );
}

