import type { AnswerResult } from "@/types";

type FeedbackBoxProps = {
  result: AnswerResult | null;
  onContinue?: () => void;
  continueText?: string;
};

export function FeedbackBox({
  result,
  onContinue,
  continueText,
}: FeedbackBoxProps) {
  const isCorrect = result?.isCorrect;

  return (
    <section
      className={`rounded-xl border p-5 ${
        result
          ? isCorrect
            ? "border-[#7d3500]/20 bg-[#ffdbca]/25"
            : "border-[#ba1a1a]/20 bg-[#ffdad6]/35"
          : "border-[#c4c6d5]/40 bg-[#e8e7f1]"
      }`}
    >
      <h4 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#434653]">
        Feedback
      </h4>
      <p className="text-sm font-medium text-[#434653]">
        {result ? (
          <>
            <span
              className={`mb-1 block font-bold ${
                isCorrect ? "text-[#7d3500]" : "text-[#ba1a1a]"
              }`}
            >
              {isCorrect ? "Correct!" : "Try Again"}
            </span>
            {result.feedback}
          </>
        ) : (
          "Feedback will appear after submission."
        )}
      </p>

      {result?.isCorrect && onContinue && (
        <button
          className="mt-6 w-full rounded-xl bg-[#344e5d] px-4 py-3 font-bold uppercase text-white transition-colors hover:bg-[#4c6676]"
          onClick={onContinue}
          type="button"
        >
          {continueText ?? "Continue"}
        </button>
      )}
    </section>
  );
}

