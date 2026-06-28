"use client";

import { useEffect, useState } from "react";
import { CandleChart } from "@/components/CandleChart";
import { FeedbackBox } from "@/components/FeedbackBox";
import { QuestionPanel } from "@/components/QuestionPanel";
import type { Question, AnswerResult } from "@/types";

export default function DashboardPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch today's question from the backend API
  useEffect(() => {
    fetch("/api/questions/today")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setQuestion(resData.data);
        } else {
          console.error("Failed to load question:", resData.error);
        }
      })
      .catch((err) => console.error("Error fetching question:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Submit the answer to the backend API
  async function handleSubmit() {
    if (selectedIndex === null || !question) return;

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          selectedCandleIndex: selectedIndex,
          correctCandleIndex: question.answer?.correctIndex,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setFeedback(resData.data);
      } else {
        console.error("Failed to submit answer:", resData.error);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800 mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">오늘의 차트 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-red-500">문제를 불러오지 못했습니다. 서버 상태를 확인해 주세요.</p>
      </div>
    );
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
          candles={question.candles}
          selectedIndex={selectedIndex}
          onSelectCandle={(index) => {
            setSelectedIndex(index);
            setFeedback(null); // Reset feedback when selecting a new candle
          }}
        />
      </section>

      <aside className="space-y-6">
        <QuestionPanel
          prompt={question.prompt}
          selectedIndex={selectedIndex}
          onSubmit={handleSubmit}
        />
        <FeedbackBox result={feedback} />
      </aside>
    </main>
  );
}
