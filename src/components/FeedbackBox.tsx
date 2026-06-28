import type { AnswerResult } from "@/types";

type FeedbackBoxProps = {
  result: AnswerResult | null;
  onContinue?: () => void;
};

export function FeedbackBox({ result, onContinue }: FeedbackBoxProps) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="font-semibold text-slate-950">Feedback</h2>
      <p className="mt-3 text-sm text-slate-700">
        {result?.feedback ?? "Feedback will appear after submission."}
      </p>
      {result?.isCorrect && onContinue && (
        <button
          type="button"
          onClick={onContinue}
          className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          계속하기
        </button>
      )}
    </section>
  );
}

