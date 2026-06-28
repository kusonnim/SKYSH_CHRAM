"use client";

import { useState } from "react";
import { CandleChart } from "@/components/CandleChart";
import { FeedbackBox } from "@/components/FeedbackBox";
import { QuestionPanel } from "@/components/QuestionPanel";
import { mockAnswerResult, mockQuestion } from "@/lib/mock-data";

export default function DashboardPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(mockAnswerResult);

  function handleSubmit() {
    setSubmitted(true);
    setFeedback({
      ...mockAnswerResult,
      feedback:
        selectedIndex === mockQuestion.answer?.correctIndex
          ? "Great job! You correctly identified the highest-volume candle."
          : "That candle is not the highest-volume candle. Compare the volume bars again.",
      isCorrect: selectedIndex === mockQuestion.answer?.correctIndex,
      score: selectedIndex === mockQuestion.answer?.correctIndex ? 1 : 0,
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

        <CandleChart
          candles={mockQuestion.candles}
          selectedIndex={selectedIndex}
          onSelectCandle={setSelectedIndex}
        />
      </section>

      <aside className="space-y-6">
        <QuestionPanel
          prompt={mockQuestion.prompt}
          selectedIndex={selectedIndex}
          onSubmit={handleSubmit}
        />
        <FeedbackBox result={submitted ? feedback : null} />
      </aside>
    </main>
  );
}
