"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CandleChart } from "@/components/chart";
import { QuestionPanel } from "@/components/QuestionPanel";
import { FeedbackBox } from "@/components/FeedbackBox";
import type { StageSession, AnswerResult } from "@/types";

export default function StagePage() {
  const params = useParams();
  const stageId = params?.stageId;
  const [stageSession, setStageSession] = useState<StageSession | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/stages/${stageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStageSession(data.data);
        } else {
          throw new Error(data.error?.message ?? "Unable to load stage.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load the stage. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [stageId]);

  async function handleSubmit() {
    if (!stageSession || selectedIndex === null) return;

    const question = stageSession.questions[0];
    if (!question.answer) return;

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

      const data = await response.json();
      if (data.success) {
        setFeedback(data.data);
      } else {
        console.error("Failed to submit answer:", data.error);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  }

  async function handleContinue() {
    if (!stageSession) return;
    try {
      const response = await fetch("/api/progress/stage-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId: stageSession.stage.id }),
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to complete stage");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error completing stage:", err);
      router.push("/dashboard");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800 mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">Loading stage content...</p>
        </div>
      </div>
    );
  }

  if (error || !stageSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm text-center">
          <p className="text-sm font-semibold text-red-600">{error ?? "Stage not found."}</p>
          <button
            type="button"
            className="mt-4 rounded bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            onClick={() => router.push("/dashboard")}
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = stageSession.questions[0];

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 px-6 py-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-6 lg:space-y-0">
      <section className="space-y-6">
        <div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← 대시보드로 돌아가기
          </button>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Stage</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">{stageSession.stage.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{stageSession.stage.description}</p>
        </div>

        <CandleChart
          candles={question.candles}
          selectedIndex={selectedIndex}
          onSelectCandle={(index) => {
            setSelectedIndex(index);
            setFeedback(null);
          }}
        />
      </section>

      <aside className="space-y-6">
        <QuestionPanel prompt={question.prompt} selectedIndex={selectedIndex} onSubmit={handleSubmit} />
        <FeedbackBox result={feedback} onContinue={handleContinue} />
      </aside>
    </main>
  );
}

