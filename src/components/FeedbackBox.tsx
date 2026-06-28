import type { AnswerResult } from "@/types";

type FeedbackBoxProps = {
  result: AnswerResult | null;
};

export function FeedbackBox({ result }: FeedbackBoxProps) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="font-semibold text-slate-950">Feedback</h2>
      <p className="mt-3 text-sm text-slate-700">
        {result?.feedback ?? "Feedback will appear after submission."}
      </p>
    </section>
  );
}

