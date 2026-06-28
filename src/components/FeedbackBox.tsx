import type { AnswerResult } from "@/types";

type FeedbackBoxProps = {
  result: AnswerResult | null;
  onContinue?: () => void;
  continueText?: string;
};

export function FeedbackBox({ result, onContinue, continueText }: FeedbackBoxProps) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="font-semibold text-slate-950">Feedback</h2>
      <p className="mt-3 text-sm text-slate-700">
        {result?.feedback ?? "Feedback will appear after submission."}
      </p>
      
      {result?.isCorrect && onContinue && (
        <button
          onClick={onContinue}
          className="mt-6 w-full rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition-colors"
          type="button"
        >
          {continueText ?? "계속하기 (Continue)"}
        </button>
      )}
    </section>
  );
}

