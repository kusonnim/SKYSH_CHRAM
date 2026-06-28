"use client";

import { useEffect, useState } from "react";
import type { AnswerResult, Question } from "@/types";
import { gradeSelectCandleAnswer } from "@/domain/grading";
import { CandleChart } from "@/components/CandleChart";
import { FeedbackBox } from "@/components/FeedbackBox";
import { QuestionPanel } from "@/components/QuestionPanel";
import { mockAnswerResult, mockQuestion } from "@/lib/mock-data";

export default function DashboardPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuestion(mockQuestion);
      setLoading(false);
    }, 200);

    return () => window.clearTimeout(timer);
  }, []);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    setResult(null);
  }

  function handleSubmit() {
    if (!question || selectedIndex === null || question.answer?.correctIndex === undefined) {
      return;
    }

    const grading = gradeSelectCandleAnswer(
      selectedIndex,
      question.answer.correctIndex,
    );

    setResult({
      ...mockAnswerResult,
      isCorrect: grading.isCorrect,
      score: grading.score,
      feedback: grading.isCorrect
        ? "Great job! You correctly identified the highest-volume candle."
        : "That candle is not the highest-volume candle. Compare the volume bars again.",
    });
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 px-6 py-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-6 lg:space-y-0">
      <section className="space-y-6">
        <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Select the candle with the highest trading volume and submit your answer.
          </p>
        </div>

        {loading || !question ? (
          <div className="rounded border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
            Loading today&apos;s question...
          </div>
        ) : (
          <CandleChart
            candles={question.candles}
            selectedIndex={selectedIndex}
            onSelectCandle={handleSelect}
          />
        )}
      </section>

      <aside className="space-y-6">
        {loading || !question ? (
          <div className="rounded border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
            Preparing the question panel...
          </div>
        ) : (
          <QuestionPanel
            prompt={question.prompt}
            selectedIndex={selectedIndex}
            onSubmit={handleSubmit}
          />
        )}

        <FeedbackBox result={result} />
      </aside>
    </main>
  );
}
