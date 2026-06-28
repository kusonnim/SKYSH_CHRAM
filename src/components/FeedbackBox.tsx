import type { AnswerResult } from "@/types";

type FeedbackBoxProps = {
  result: AnswerResult | null;
};

export function FeedbackBox({ result }: FeedbackBoxProps) {
  const title = result ? (result.isCorrect ? "Correct" : "Try Again") : "Feedback";
  const badgeClass = result
    ? result.isCorrect
      ? "bg-emerald-100 text-emerald-800"
      : "bg-rose-100 text-rose-800"
    : "bg-slate-100 text-slate-600";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {result ? "Your answer has been evaluated." : "Submit an answer to receive feedback."}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}>
          {result ? `${result.score} pt` : "Pending"}
        </span>
      </div>
      <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {result?.feedback ?? "Feedback will appear after submission."}
      </div>
    </section>
  );
}

