import type { Stage } from "@/types";

type StageCompletePanelProps = {
  stage: Stage;
  onContinue: () => void;
};

export function StageCompletePanel({
  stage,
  onContinue,
}: StageCompletePanelProps) {
  return (
    <section className="rounded border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-sm font-semibold uppercase text-emerald-700">
        Stage complete
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">
        {stage.title}
      </h2>
      <p className="mt-2 text-sm text-slate-700">
        Placeholder completion state. Progress persistence can be connected
        later.
      </p>
      <button
        className="mt-4 rounded bg-slate-950 px-4 py-2 font-medium text-white"
        onClick={onContinue}
        type="button"
      >
        Continue
      </button>
    </section>
  );
}

