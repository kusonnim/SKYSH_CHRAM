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
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="font-semibold text-slate-950">Today&apos;s Question</h2>
      <p className="mt-3 text-sm text-slate-700">{prompt}</p>
      <p className="mt-4 text-sm text-slate-500">
        Selected candle: {selectedIndex ?? "none"}
      </p>
      <button
        className="mt-4 w-full rounded bg-slate-950 px-4 py-2 font-medium text-white"
        onClick={onSubmit}
        type="button"
      >
        Submit
      </button>
    </section>
  );
}

