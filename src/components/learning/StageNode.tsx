import type { Stage } from "@/types";

type StageNodeProps = {
  stage: Stage;
  onSelect: (stageId: string) => void;
};

export function StageNode({ stage, onSelect }: StageNodeProps) {
  const isLocked = stage.status === "locked";

  return (
    <button
      className="rounded border border-slate-200 p-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isLocked}
      onClick={() => onSelect(stage.id)}
      type="button"
    >
      <span className="text-xs font-semibold uppercase text-slate-500">
        {stage.status}
      </span>
      <h3 className="mt-2 font-semibold text-slate-950">{stage.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{stage.description}</p>
      <p className="mt-3 text-xs text-slate-500">
        {stage.questionCount} questions
      </p>
    </button>
  );
}

