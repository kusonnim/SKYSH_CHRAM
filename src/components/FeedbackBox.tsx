import type { AnswerResult } from "@/types";

type FeedbackBoxProps = {
  result: AnswerResult | null;
};

export function FeedbackBox({ result }: FeedbackBoxProps) {
  const title = result ? (result.isCorrect ? "Correct Answer" : "Incorrect Answer") : "Feedback";
  const badgeClass = result
    ? result.isCorrect
      ? "bg-emerald-100 text-emerald-800"
      : "bg-rose-100 text-rose-800"
    : "bg-slate-100 text-slate-600";

  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {result ? "Here is your result." : "Submit an answer to receive feedback."}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${badgeClass}`}>
          {result ? `${result.score} point${result.score === 1 ? "" : "s"}` : "Pending"}
        </span>
      </div>
      <p className="mt-4 min-h-[4rem] text-sm text-slate-700">
        {result?.feedback ?? "Feedback will appear after submission."}
      </p>
    </section>
  );
}

