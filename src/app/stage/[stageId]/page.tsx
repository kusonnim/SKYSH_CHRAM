"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CandleChart } from "@/components/chart";
import { FeedbackBox } from "@/components/FeedbackBox";
import { staticLearningMap } from "@/content/curriculum";
import { markStageCompleted } from "@/lib/learning-progress";
import type { AnswerResult, StageCompleteResponse, StageSession } from "@/types";

export default function StagePage() {
  const params = useParams();
  const stageId = params?.stageId;
  const [stageSession, setStageSession] = useState<StageSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [completion, setCompletion] = useState<StageCompleteResponse | null>(
    null,
  );
  const [nextStageId, setNextStageId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!stageId) return;

    setLoading(true);
    setError(null);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setFeedback(null);
    setStageCompleted(false);
    setAdvancing(false);
    setCompletion(null);
    setNextStageId(null);

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

    const question = stageSession.questions[currentIndex];
    if (!question.answer) return;

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.stageId ?? question.id,
          selectedCandleIndex: selectedIndex,
          correctCandleIndex: question.answer.correctIndex,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.data.isCorrect) {
          await handleContinue();
        } else {
          setFeedback(data.data);
        }
      } else {
        setError(data.error?.message ?? "Failed to submit answer.");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer. Please try again.");
    }
  }

  async function handleContinue() {
    if (!stageSession) return;

    if (currentIndex < stageSession.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setFeedback(null);
      return;
    }

    try {
      const response = await fetch("/api/progress/stage-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId: stageSession.stage.id }),
      });
      if (response.ok) {
        const data = await response.json();
        const completionData = data.data as StageCompleteResponse;
        const storedNextStageId = markStageCompleted(
          staticLearningMap,
          stageSession.stage.id,
        );
        const resolvedNextStageId =
          completionData?.nextStageId ?? storedNextStageId;
        setCompletion(completionData);
        if (resolvedNextStageId) {
          setAdvancing(true);
          window.setTimeout(() => {
            router.push(`/stage/${resolvedNextStageId}`);
          }, 900);
          return;
        }

        setNextStageId(null);
        setStageCompleted(true);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error completing stage:", err);
      router.push("/dashboard");
    }
  }

  if (advancing && completion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-6">
        <div className="rounded-xl border border-[#c4c6d5] bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#747685]">
            Stage cleared
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#1a1b22]">
            +{completion.pointsAwarded.toLocaleString()} P earned
          </h2>
          <p className="mt-2 text-sm text-[#434653]">
            Total points: {completion.totalPoints.toLocaleString()} P
          </p>
          {completion.alreadyCompleted && (
            <p className="mt-3 text-xs font-semibold text-[#747685]">
              This stage was already completed, so no extra points were awarded.
            </p>
          )}
          <div className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-4 border-[#c4c6d5] border-t-[#344e5d]" />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#c4c6d5] border-t-[#344e5d]" />
          <p className="mt-4 text-sm text-[#434653]">Loading stage content...</p>
        </div>
      </div>
    );
  }

  if (error || !stageSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-6">
        <div className="rounded-xl border border-[#c4c6d5] bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#ba1a1a]">
            {error ?? "Stage not found."}
          </p>
          <button
            className="mt-4 rounded-lg bg-[#344e5d] px-4 py-2 text-sm font-semibold text-white"
            onClick={() => router.push("/dashboard")}
            type="button"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (stageCompleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-6">
        <div className="rounded-xl border border-[#c4c6d5] bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a1b22]">Stage complete</h2>
          <p className="mt-2 text-[#434653]">
            Great work. You completed every question in this stage.
          </p>
          {completion && (
            <div className="mt-6 rounded-xl bg-[#e8e7f1] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#747685]">
                Points earned
              </p>
              <p className="mt-1 text-3xl font-bold text-[#344e5d]">
                +{completion.pointsAwarded.toLocaleString()} P
              </p>
              <p className="mt-1 text-sm text-[#434653]">
                Total points: {completion.totalPoints.toLocaleString()} P
              </p>
              {completion.alreadyCompleted && (
                <p className="mt-2 text-xs font-semibold text-[#747685]">
                  This stage was already completed, so no extra points were
                  awarded.
                </p>
              )}
            </div>
          )}
          <div className="mt-8 flex justify-center gap-4">
            <button
              className="rounded-lg border border-[#c4c6d5] px-4 py-2 font-medium text-[#434653] hover:bg-[#ededf7]"
              onClick={() => router.push("/dashboard")}
              type="button"
            >
              Back to dashboard
            </button>
            {nextStageId && (
              <button
                className="rounded-lg bg-[#344e5d] px-4 py-2 font-medium text-white hover:bg-[#4c6676]"
                onClick={() => router.push(`/stage/${nextStageId}`)}
                type="button"
              >
                Start next stage
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = stageSession.questions[currentIndex];
  const isLastQuestion = currentIndex === stageSession.questions.length - 1;
  const continueText = isLastQuestion ? "Complete stage" : "Next question";
  const progressText = `${currentIndex + 1}/${stageSession.questions.length}`;

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-40 text-[#1a1b22]">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#c4c6d5]/40 bg-white px-4">
        <div className="flex items-center gap-3">
          <button
            className="-ml-2 rounded-full px-3 py-2 text-sm font-semibold text-[#1a1b22] transition-all active:bg-[#ededf7]"
            onClick={() => router.push("/dashboard")}
            type="button"
          >
            Back
          </button>
          <h1 className="text-lg font-bold uppercase tracking-tight text-[#344e5d]">
            SKYSH CHRAM
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#cbe6f9]/60 bg-[#cbe6f9]/20 px-3 py-1.5 text-[#344e5d]">
          <span className="text-sm font-bold">Q</span>
          <span className="text-xs font-semibold">{progressText}</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 pt-20">
        <header className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#344e5d]">
            Stage {stageSession.stage.order.toString().padStart(2, "0")}
          </p>
          <h2 className="text-2xl font-bold text-[#1a1b22]">
            {stageSession.stage.title}
          </h2>
          <p className="text-sm font-medium text-[#434653]">{question.prompt}</p>
        </header>

        <CandleChart
          candles={question.candles}
          correctIndex={feedback != null ? question.answer?.correctIndex : null}
          isWrong={feedback != null && !feedback.isCorrect}
          onSelectCandle={(index) => {
            setSelectedIndex(index);
            setFeedback(null);
          }}
          selectedIndex={selectedIndex}
        />

        <FeedbackBox
          continueText={continueText}
          onContinue={handleContinue}
          result={feedback}
        />
      </main>

      <footer className="fixed bottom-0 left-0 z-40 flex w-full flex-col items-center gap-4 border-t border-[#c4c6d5]/40 bg-white px-4 py-6">
        <button
          className="w-full max-w-md rounded-xl bg-[#344e5d] py-4 font-bold uppercase text-white shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
          disabled={selectedIndex === null || feedback !== null}
          onClick={handleSubmit}
          type="button"
        >
          Submit
        </button>
        <nav className="flex w-full max-w-sm justify-around pt-2">
          <a className="flex flex-col items-center gap-1 text-[#344e5d]" href="/dashboard">
            <span className="text-lg font-bold">L</span>
            <span className="text-[10px] font-bold uppercase">Learn</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-[#747685]" href="/profile">
            <span className="text-lg font-bold">P</span>
            <span className="text-[10px] font-bold uppercase">Profile</span>
          </a>
        </nav>
      </footer>
    </div>
  );
}
