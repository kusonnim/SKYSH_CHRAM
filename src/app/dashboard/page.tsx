"use client";

import { useEffect, useState } from "react";
import type { AnswerResult, ApiResponse, Question } from "@/types";
import { CandleChart } from "@/components/CandleChart";
import { FeedbackBox } from "@/components/FeedbackBox";
import { QuestionPanel } from "@/components/QuestionPanel";

export default function DashboardPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestion() {
      try {
        const response = await fetch("/api/questions/today");
        const payload = (await response.json()) as ApiResponse<Question>;

        if (!payload.success) {
          throw new Error(payload.error?.message ?? "Unable to load question.");
        }

        setQuestion(payload.data);
      } catch (err) {
        setError("Failed to load today's question. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestion();
  }, []);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    setResult(null);
  }

  async function handleSubmit() {
    if (!question || selectedIndex === null || question.answer?.correctIndex === undefined) {
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          selectedCandleIndex: selectedIndex,
          correctCandleIndex: question.answer.correctIndex,
        }),
      });

      const payload = (await response.json()) as ApiResponse<AnswerResult>;

      if (!payload.success) {
        throw new Error(payload.error?.message ?? "Answer submission failed.");
      }

      setResult(payload.data);
    } catch (err) {
      setError("Unable to submit your answer. Please try again.");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 px-6 py-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-6 lg:space-y-0">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Chart lesson
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">Dashboard</h1>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              Step 1 of 1 • BTC daily volume
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Select the candle with the highest trading volume. Use the chart below to explore the last 30 daily bars and submit your answer when you are ready.
          </p>
        </div>

        {loading || !question ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
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
