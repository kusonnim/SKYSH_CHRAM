type QuestionPanelProps = {
  prompt: string;
  selectedIndex: number | null;
  onSubmit: () => void;
};

export function QuestionPanel({
  prompt,
  selectedIndex,
  onSubmit,
}: QuestionPanelProps) {
  const hasSelection = selectedIndex !== null;

  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Today&apos;s Question
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Pick the correct candle and submit your answer.
          </p>
        </div>

        <p className="text-sm text-slate-700">{prompt}</p>

        <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {hasSelection
            ? `Selected candle: ${selectedIndex + 1}`
            : "No candle selected yet."}
        </div>

        <button
          className={`mt-2 w-full rounded px-4 py-2 font-medium text-white transition ${
            hasSelection
              ? "bg-slate-950 hover:bg-slate-800"
              : "bg-slate-300 cursor-not-allowed"
          }`}
          onClick={onSubmit}
          type="button"
          disabled={!hasSelection}
        >
          Submit Answer
        </button>
      </div>
    </section>
  );
}

